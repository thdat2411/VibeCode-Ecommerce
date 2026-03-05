using Orders.Models;
using Orders.Repositories;
using Orders.Services;

namespace Orders.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        // GET /api/orders
        app.MapGet("/api/orders", async (HttpContext context, IOrderRepository repo) =>
        {
            var userId = context.Request.Headers["X-User-Id"].ToString();
            if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
            var orders = await repo.GetByUserIdAsync(userId);
            return Results.Ok(orders);
        })
        .WithName("GetOrders")
        .WithOpenApi();

        // GET /api/orders/{id}
        app.MapGet("/api/orders/{id}", async (string id, IOrderRepository repo) =>
        {
            var order = await repo.GetByIdAsync(id);
            return order is not null ? Results.Ok(order) : Results.NotFound();
        })
        .WithName("GetOrderById")
        .WithOpenApi();

        // POST /api/orders — full pre-order workflow
        app.MapPost("/api/orders", async (HttpRequest httpRequest, HttpContext context, IOrderService orderService) =>
        {
            var userId = context.Request.Headers["X-User-Id"].ToString();
            if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

            CreateOrderRequest? req = null;
            try
            {
                req = await System.Text.Json.JsonSerializer.DeserializeAsync<CreateOrderRequest>(
                    httpRequest.Body,
                    new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );
            }
            catch { }

            if (req is null)
                return Results.BadRequest(new { error = "Invalid or missing request body" });

            var result = await orderService.CreateOrderAsync(userId, req);

            return result switch
            {
                OrderResult.Success s               => Results.Created($"/api/orders/{s.Order.Id}", s.Order),
                OrderResult.ValidationError e       => Results.BadRequest(new { error = e.Message }),
                OrderResult.PriceMismatch p         => Results.BadRequest(new { error = $"Price mismatch for product {p.ProductId}: expected {p.Expected}, got {p.Actual}" }),
                OrderResult.InsufficientStock i     => Results.BadRequest(new { error = $"Insufficient stock for SKU {i.SkuId}: available {i.Available}, requested {i.Requested}" }),
                OrderResult.ReservationFailed r     => Results.BadRequest(new { error = $"Stock reservation failed for SKU {r.SkuId}: {r.Reason}" }),
                _                                   => Results.StatusCode(500)
            };
        })
        .WithName("CreateOrder")
        .WithOpenApi();

        // PATCH /api/orders/{id}/status
        app.MapPatch("/api/orders/{id}/status", async (string id, HttpRequest httpRequest, IOrderRepository repo) =>
        {
            UpdateStatusRequest? req = null;
            try
            {
                req = await System.Text.Json.JsonSerializer.DeserializeAsync<UpdateStatusRequest>(
                    httpRequest.Body,
                    new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );
            }
            catch { }

            if (req is null || string.IsNullOrEmpty(req.Status))
                return Results.BadRequest(new { error = "Status is required" });

            var updated = await repo.UpdateStatusAsync(id, req.Status);
            return updated ? Results.Ok() : Results.NotFound();
        })
        .WithName("UpdateOrderStatus")
        .WithOpenApi();
    }
}
