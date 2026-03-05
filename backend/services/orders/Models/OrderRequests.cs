namespace Orders.Models;

public record CreateOrderRequest
{
    public List<OrderItemRequest> Items { get; init; } = new();
    public decimal Total { get; init; }
    public ShippingAddressRequest? ShippingAddress { get; init; }
}

public record OrderItemRequest
{
    public string ProductId { get; init; } = string.Empty;
    /// <summary>SKU id for exact variant (Color+Size). Required for stock check.</summary>
    public string SkuId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
}

public record ShippingAddressRequest
{
    public string Street { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string State { get; init; } = string.Empty;
    public string PostalCode { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
}

public record UpdateStatusRequest
{
    public string Status { get; init; } = string.Empty;
}
