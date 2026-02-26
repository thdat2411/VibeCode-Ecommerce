using Cart.Models;

namespace Cart.Repositories;

/// <summary>
/// Repository interface for Cart data access.
/// Abstracts the underlying storage mechanism (Redis, Database, etc.)
/// </summary>
public interface ICartRepository
{
    Task<CartResponse> GetCartAsync(string userId);
    Task<CartResponse> AddItemAsync(string userId, CartItem item);
    Task<CartResponse> RemoveItemAsync(string userId, string productId, string? size, string? color);
    Task<bool> ClearCartAsync(string userId);
    Task UpdateCartTotalAsync(string userId, CartResponse cart);
}
