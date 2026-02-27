using Cart.Models;

namespace Cart.Repositories;

/// <summary>
/// Repository interface for Cart data access.
/// Abstracts the underlying storage mechanism (Redis, Database, etc.)
/// </summary>
public interface ICartRepository
{
    // ── User cart (key: cart:user:{userId}) ──────────────────────────────
    Task<CartResponse> GetCartAsync(string userId);
    Task<CartResponse> AddItemAsync(string userId, CartItem item);
    Task<CartResponse> RemoveItemAsync(string userId, string productId, string? size, string? color);
    Task<bool> ClearCartAsync(string userId);
    Task UpdateCartTotalAsync(string userId, CartResponse cart);

    // ── Guest cart (key: cart:guest:{cartId}) ────────────────────────────
    Task<CartResponse> GetGuestCartAsync(string cartId);
    Task<CartResponse> AddGuestItemAsync(string cartId, CartItem item);
    Task<CartResponse> RemoveGuestItemAsync(string cartId, string productId, string? size, string? color);
    Task<bool> ClearGuestCartAsync(string cartId);

    // ── Merge guest → user ───────────────────────────────────────────────
    Task<CartResponse> MergeGuestCartAsync(string cartId, string userId);
}
