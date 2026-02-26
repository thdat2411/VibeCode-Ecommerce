using Cart.Models;
using Cart.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cart.Endpoints;

/// <summary>
/// Extension method to register all cart endpoints
/// </summary>
public static class CartEndpoints
{
    public static void MapCartEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/cart")
            .WithTags("Cart");

        group.MapGet("/", GetCart)
            .WithName("GetCart")
            .WithOpenApi();

        group.MapPost("/items", AddToCart)
            .WithName("AddToCart")
            .WithOpenApi();

        group.MapDelete("/items/{productId}", RemoveFromCart)
            .WithName("RemoveFromCart")
            .WithOpenApi();

        group.MapPatch("/items/{productId}", UpdateQuantity)
            .WithName("UpdateQuantity")
            .WithOpenApi();

        group.MapDelete("/", ClearCart)
            .WithName("ClearCart")
            .WithOpenApi();
    }

    private static async Task<IResult> GetCart(HttpContext context, CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";
        var cart = await service.GetCartAsync(userId);
        return Results.Ok(cart);
    }

    private static async Task<IResult> AddToCart([FromBody] AddToCartRequest request, HttpContext context, CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";
        var item = new CartItem
        {
            ProductId = request.ProductId,
            Name = request.Name,
            Price = request.Price,
            Quantity = request.Quantity,
            Image = request.Image,
            Size = request.Size,
            Color = request.Color
        };
        var cart = await service.AddToCartAsync(userId, item);
        return Results.Ok(cart);
    }

    private static async Task<IResult> RemoveFromCart(
        string productId,
        [FromBody] RemoveFromCartRequest? body,
        HttpContext context,
        CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";
        var cart = await service.RemoveFromCartAsync(userId, productId, body?.Size, body?.Color);
        return Results.Ok(cart);
    }

    private static async Task<IResult> UpdateQuantity(
        string productId,
        [FromBody] UpdateQuantityRequest request,
        HttpContext context,
        CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";
        var cart = await service.UpdateQuantityAsync(userId, productId, request.Size, request.Color, request.Quantity);
        return Results.Ok(cart);
    }

    private static async Task<IResult> ClearCart(HttpContext context, CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";
        var result = await service.ClearCartAsync(userId);
        return result ? Results.Ok() : Results.NotFound();
    }
}
