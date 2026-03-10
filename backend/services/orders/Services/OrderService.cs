using Orders.Models;
using Orders.Repositories;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Orders.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repo;
    private readonly HttpClient _catalogClient;
    private static readonly JsonSerializerOptions _json = new() { PropertyNameCaseInsensitive = true };

    public OrderService(IOrderRepository repo, IHttpClientFactory httpClientFactory)
    {
        _repo = repo;
        _catalogClient = httpClientFactory.CreateClient("catalog");
    }

    public async Task<OrderResult> CreateOrderAsync(string userId, CreateOrderRequest request)
    {
        // ── Step 1: Validate request ─────────────────────────────────────────
        if (request.Items is null || request.Items.Count == 0)
            return new OrderResult.ValidationError("Order must contain at least one item.");

        if (request.ShippingAddress is null ||
            string.IsNullOrWhiteSpace(request.ShippingAddress.Street) ||
            string.IsNullOrWhiteSpace(request.ShippingAddress.City))
            return new OrderResult.ValidationError("Shipping address with street and city is required.");

        foreach (var item in request.Items)
        {
            if (string.IsNullOrWhiteSpace(item.ProductId))
                return new OrderResult.ValidationError("Each item must have a ProductId.");
            if (item.Quantity <= 0)
                return new OrderResult.ValidationError($"Item '{item.Name}' must have quantity > 0.");
            if (item.Price <= 0)
                return new OrderResult.ValidationError($"Item '{item.Name}' has invalid price.");
        }

        // ── Step 2: Recalculate price from catalog ───────────────────────────
        // Fetch each unique product once, verify the price the client sent
        // matches what catalog says. Prevents client-side price tampering.
        decimal recalculatedTotal = 0;
        var uniqueProductIds = request.Items.Select(i => i.ProductId).Distinct();

        foreach (var productId in uniqueProductIds)
        {
            var catalogResponse = await _catalogClient.GetAsync($"/api/products/{productId}");
            if (!catalogResponse.IsSuccessStatusCode)
                return new OrderResult.ValidationError($"Product '{productId}' not found in catalog.");

            var catalogJson = await catalogResponse.Content.ReadAsStringAsync();
            var catalogProduct = JsonSerializer.Deserialize<CatalogProductDto>(catalogJson, _json);
            if (catalogProduct is null)
                return new OrderResult.ValidationError($"Failed to read catalog data for product '{productId}'.");

            // For each item of this product, verify price matches the SKU price (or base price)
            var itemsForProduct = request.Items.Where(i => i.ProductId == productId);
            foreach (var item in itemsForProduct)
            {
                // Find the SKU to get price override if any (null SkuId → fall back to base price)
                var sku = string.IsNullOrWhiteSpace(item.SkuId)
                    ? null
                    : catalogProduct.Skus?.FirstOrDefault(s => s.Id == item.SkuId);
                var expectedPrice = sku?.PriceOverride ?? catalogProduct.Price;

                // Allow 1 VND tolerance for floating point
                if (Math.Abs(item.Price - expectedPrice) > 1)
                    return new OrderResult.PriceMismatch(productId, expectedPrice, item.Price);

                recalculatedTotal += expectedPrice * item.Quantity;
            }
        }

        // ── Step 3: Check inventory ──────────────────────────────────────────
        // Verify each SKU has enough stock before reserving anything.
        // Items without a SkuId (no variant selected) skip this step.
        var itemsWithSku = request.Items.Where(i => !string.IsNullOrWhiteSpace(i.SkuId)).ToList();

        foreach (var item in itemsWithSku)
        {
            var stockResponse = await _catalogClient.GetAsync($"/api/catalog/skus/{item.SkuId}");
            if (!stockResponse.IsSuccessStatusCode)
                return new OrderResult.ValidationError($"SKU '{item.SkuId}' not found.");

            var stockJson = await stockResponse.Content.ReadAsStringAsync();
            var sku = JsonSerializer.Deserialize<CatalogSkuDto>(stockJson, _json);
            if (sku is null)
                return new OrderResult.ValidationError($"Failed to read SKU data for '{item.SkuId}'.");

            if (sku.Stock < item.Quantity)
                return new OrderResult.InsufficientStock(item.ProductId, item.SkuId!, sku.Stock, item.Quantity);
        }

        // ── Step 4: Reserve stock ────────────────────────────────────────────
        // Atomically decrement stock in catalog for each SKU.
        // If any reservation fails, we return early — previously reserved items
        // will be rolled back via compensating calls.
        // Items without a SkuId are skipped.
        var reserved = new List<(string SkuId, int Quantity)>();
        foreach (var item in itemsWithSku)
        {
            var reservePayload = JsonSerializer.Serialize(new { skuId = item.SkuId, quantity = item.Quantity });
            var reserveContent = new StringContent(reservePayload, System.Text.Encoding.UTF8, "application/json");
            var reserveResponse = await _catalogClient.PostAsync("/api/catalog/reserve-stock", reserveContent);

            if (!reserveResponse.IsSuccessStatusCode)
            {
                // Compensate: release all already-reserved items
                foreach (var (skuId, qty) in reserved)
                {
                    var releasePayload = JsonSerializer.Serialize(new { skuId, quantity = qty });
                    var releaseContent = new StringContent(releasePayload, System.Text.Encoding.UTF8, "application/json");
                    await _catalogClient.PostAsync("/api/catalog/release-stock", releaseContent);
                }

                var reason = await reserveResponse.Content.ReadAsStringAsync();
                return new OrderResult.ReservationFailed(item.ProductId, item.SkuId!, reason);
            }

            reserved.Add((item.SkuId!, item.Quantity));
        }

        // ── Step 5: Persist order ────────────────────────────────────────────
        var order = new Order
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Total = recalculatedTotal,   // use server-recalculated total, not client's
            Status = "pending",
            Street = request.ShippingAddress!.Street,
            City = request.ShippingAddress.City,
            State = request.ShippingAddress.State ?? string.Empty,
            PostalCode = request.ShippingAddress.PostalCode ?? string.Empty,
            Country = request.ShippingAddress.Country ?? string.Empty,
            CreatedAt = DateTime.UtcNow,
            Items = request.Items.Select(i => new OrderItem
            {
                Id = Guid.NewGuid().ToString(),
                ProductId = i.ProductId,
                Name = i.Name,
                Price = i.Price,
                Quantity = i.Quantity,
            }).ToList()
        };
        foreach (var item in order.Items) item.OrderId = order.Id;

        var created = await _repo.CreateAsync(order);
        return new OrderResult.Success(created);
    }
}

// ── Internal DTOs for catalog API responses ──────────────────────────────────

internal record CatalogProductDto
{
    [JsonPropertyName("id")]
    public string Id { get; init; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; init; }

    [JsonPropertyName("skus")]
    public List<CatalogSkuDto>? Skus { get; init; }
}

internal record CatalogSkuDto
{
    [JsonPropertyName("id")]
    public string Id { get; init; } = string.Empty;

    [JsonPropertyName("stock")]
    public int Stock { get; init; }

    [JsonPropertyName("priceOverride")]
    public decimal? PriceOverride { get; init; }
}
