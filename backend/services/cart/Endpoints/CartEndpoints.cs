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

        // ── User cart ────────────────────────────────────────────────────
        group.MapGet("/", GetCart).WithName("GetCart").WithOpenApi();
        group.MapPost("/items", AddToCart).WithName("AddToCart").WithOpenApi();
        group.MapDelete("/items/{productId}", RemoveFromCart).WithName("RemoveFromCart").WithOpenApi();
        group.MapPatch("/items/{productId}", UpdateQuantity).WithName("UpdateQuantity").WithOpenApi();
        group.MapDelete("/", ClearCart).WithName("ClearCart").WithOpenApi();

        // ── Guest cart ───────────────────────────────────────────────────
        group.MapPost("/guest", CreateGuestCart).WithName("CreateGuestCart").WithOpenApi();
        group.MapGet("/guest/{cartId}", GetGuestCart).WithName("GetGuestCart").WithOpenApi();
        group.MapPost("/guest/{cartId}/items", AddToGuestCart).WithName("AddToGuestCart").WithOpenApi();
        group.MapDelete("/guest/{cartId}/items/{productId}", RemoveFromGuestCart).WithName("RemoveFromGuestCart").WithOpenApi();
        group.MapDelete("/guest/{cartId}", ClearGuestCart).WithName("ClearGuestCart").WithOpenApi();

        // ── Merge (login) ────────────────────────────────────────────────
        group.MapPost("/merge", MergeCart).WithName("MergeCart").WithOpenApi();
    }

    // ── User cart handlers ───────────────────────────────────────────────────

    private static async Task<IResult> GetCart(HttpContext context, CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";
        var cart = await service.GetCartAsync(userId);
        return Results.Ok(cart);
    }

    private static async Task<IResult> AddToCart([FromBody] AddToCartRequest request, HttpContext context, CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";
        var item = MapItem(request);
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

    // ── Guest cart handlers ──────────────────────────────────────────────────

    private static async Task<IResult> CreateGuestCart([FromBody] AddToCartRequest request, CartService service)
    {
        var item = MapItem(request);
        var (cartId, cart) = await service.CreateGuestCartAsync(item);
        return Results.Ok(new CreateGuestCartResponse { CartId = cartId, Cart = cart });
    }

    private static async Task<IResult> GetGuestCart(string cartId, CartService service)
    {
        var cart = await service.GetGuestCartAsync(cartId);
        return Results.Ok(cart);
    }

    private static async Task<IResult> AddToGuestCart(
        string cartId,
        [FromBody] AddToCartRequest request,
        CartService service)
    {
        var item = MapItem(request);
        var cart = await service.AddToGuestCartAsync(cartId, item);
        return Results.Ok(cart);
    }

    private static async Task<IResult> RemoveFromGuestCart(
        string cartId,
        string productId,
        [FromBody] RemoveFromCartRequest? body,
        CartService service)
    {
        var cart = await service.RemoveFromGuestCartAsync(cartId, productId, body?.Size, body?.Color);
        return Results.Ok(cart);
    }

    private static async Task<IResult> ClearGuestCart(string cartId, CartService service)
    {
        var result = await service.ClearGuestCartAsync(cartId);
        return result ? Results.Ok() : Results.NotFound();
    }

    // ── Merge handler ────────────────────────────────────────────────────────

    private static async Task<IResult> MergeCart(
        [FromBody] MergeCartRequest request,
        HttpContext context,
        CartService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

        var cart = await service.MergeCartAsync(request.CartId, userId);
        return Results.Ok(cart);
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private static CartItem MapItem(AddToCartRequest r) => new()
    {
        ProductId = r.ProductId,
        Name = r.Name,
        Price = r.Price,
        Quantity = r.Quantity,
        Image = r.Image,
        Size = r.Size,
        Color = r.Color,
    };
}
