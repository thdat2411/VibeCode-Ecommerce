using Cart.Models;
using Cart.Repositories;
using Shared.Exceptions;

namespace Cart.Services;

/// <summary>
/// Business logic service for cart operations
/// </summary>
public class CartService
{
    private readonly ICartRepository _repository;

    public CartService(ICartRepository repository)
    {
        _repository = repository;
    }

    public async Task<CartResponse> GetCartAsync(string userId)
    {
        ValidateUserId(userId);
        return await _repository.GetCartAsync(userId);
    }

    public async Task<CartResponse> AddToCartAsync(string userId, CartItem item)
    {
        ValidateUserId(userId);
        ValidateCartItem(item);
        return await _repository.AddItemAsync(userId, item);
    }

    public async Task<CartResponse> RemoveFromCartAsync(string userId, string productId)
    {
        ValidateUserId(userId);

        if (string.IsNullOrWhiteSpace(productId))
            throw new ValidationException("Product ID cannot be empty.");

        return await _repository.RemoveItemAsync(userId, productId);
    }

    public async Task<bool> ClearCartAsync(string userId)
    {
        ValidateUserId(userId);
        return await _repository.ClearCartAsync(userId);
    }

    private void ValidateUserId(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedException("User ID is required.");
    }

    private void ValidateCartItem(CartItem item)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(item.ProductId))
            errors["ProductId"] = new[] { "Product ID is required." };

        if (string.IsNullOrWhiteSpace(item.Name))
            errors["Name"] = new[] { "Product name is required." };

        if (item.Price <= 0)
            errors["Price"] = new[] { "Product price must be greater than zero." };

        if (item.Quantity <= 0)
            errors["Quantity"] = new[] { "Quantity must be greater than zero." };

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }
}
