using Cart.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace Cart.Repositories;

/// <summary>
/// Redis implementation of ICartRepository.
/// User carts   → key: cart:user:{userId}   TTL: 30 days
/// Guest carts  → key: cart:guest:{cartId}  TTL: 7 days
/// </summary>
public class CartRepository : ICartRepository
{
    private readonly IConnectionMultiplexer _redis;
    private readonly JsonSerializerOptions _jsonOptions;

    private static readonly TimeSpan UserCartTtl = TimeSpan.FromDays(30);
    private static readonly TimeSpan GuestCartTtl = TimeSpan.FromDays(7);

    public CartRepository(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    // ── Shared helpers ───────────────────────────────────────────────────────

    private static string CompositeKey(string productId, string? size, string? color)
        => $"{productId}|{size ?? ""}|{color ?? ""}";

    private static string ItemKey(CartItem i)
        => CompositeKey(i.ProductId, i.Size, i.Color);

    private static decimal CalcTotal(IEnumerable<CartItem> items)
        => items.Sum(i => i.Price * i.Quantity);

    private async Task<CartResponse> ReadAsync(string redisKey)
    {
        var db = _redis.GetDatabase();
        var json = await db.StringGetAsync(redisKey);
        if (json.IsNullOrEmpty) return new CartResponse();
        return JsonSerializer.Deserialize<CartResponse>(json.ToString(), _jsonOptions)
               ?? new CartResponse();
    }

    private async Task WriteAsync(string redisKey, CartResponse cart, TimeSpan ttl)
    {
        cart = cart with { Total = CalcTotal(cart.Items) };
        var db = _redis.GetDatabase();
        var json = JsonSerializer.Serialize(cart, _jsonOptions);
        await db.StringSetAsync(redisKey, json, ttl);
    }

    private static CartResponse MergeItems(IList<CartItem> current, IList<CartItem> incoming)
    {
        var items = current.ToList();
        foreach (var item in incoming)
        {
            var key = ItemKey(item);
            var existing = items.FirstOrDefault(i => ItemKey(i) == key);
            if (existing != null)
            {
                items.Remove(existing);
                items.Add(existing with { Quantity = existing.Quantity + item.Quantity });
            }
            else
            {
                items.Add(item);
            }
        }
        return new CartResponse { Items = items, Total = CalcTotal(items) };
    }

    // ── User cart ────────────────────────────────────────────────────────────

    private string UserKey(string userId) => $"cart:user:{userId}";

    public Task<CartResponse> GetCartAsync(string userId)
        => ReadAsync(UserKey(userId));

    public async Task<CartResponse> AddItemAsync(string userId, CartItem item)
    {
        var cart = await GetCartAsync(userId);
        var merged = MergeItems(cart.Items, new[] { item });
        await WriteAsync(UserKey(userId), merged, UserCartTtl);
        return merged;
    }

    public async Task<CartResponse> RemoveItemAsync(string userId, string productId, string? size, string? color)
    {
        var cart = await GetCartAsync(userId);
        var key = CompositeKey(productId, size, color);
        var items = cart.Items.Where(i => ItemKey(i) != key).ToList();
        var updated = cart with { Items = items };
        await WriteAsync(UserKey(userId), updated, UserCartTtl);
        return updated;
    }

    public async Task<bool> ClearCartAsync(string userId)
    {
        var db = _redis.GetDatabase();
        return await db.KeyDeleteAsync(UserKey(userId));
    }

    public async Task UpdateCartTotalAsync(string userId, CartResponse cart)
        => await WriteAsync(UserKey(userId), cart, UserCartTtl);

    // ── Guest cart ───────────────────────────────────────────────────────────

    private string GuestKey(string cartId) => $"cart:guest:{cartId}";

    public Task<CartResponse> GetGuestCartAsync(string cartId)
        => ReadAsync(GuestKey(cartId));

    public async Task<CartResponse> AddGuestItemAsync(string cartId, CartItem item)
    {
        var cart = await GetGuestCartAsync(cartId);
        var merged = MergeItems(cart.Items, new[] { item });
        await WriteAsync(GuestKey(cartId), merged, GuestCartTtl);
        return merged;
    }

    public async Task<CartResponse> RemoveGuestItemAsync(string cartId, string productId, string? size, string? color)
    {
        var cart = await GetGuestCartAsync(cartId);
        var key = CompositeKey(productId, size, color);
        var items = cart.Items.Where(i => ItemKey(i) != key).ToList();
        var updated = cart with { Items = items };
        await WriteAsync(GuestKey(cartId), updated, GuestCartTtl);
        return updated;
    }

    public async Task<bool> ClearGuestCartAsync(string cartId)
    {
        var db = _redis.GetDatabase();
        return await db.KeyDeleteAsync(GuestKey(cartId));
    }

    // ── Merge guest → user ───────────────────────────────────────────────────

    public async Task<CartResponse> MergeGuestCartAsync(string cartId, string userId)
    {
        var guestCart = await GetGuestCartAsync(cartId);
        var userCart = await GetCartAsync(userId);

        var merged = MergeItems(userCart.Items, guestCart.Items);
        await WriteAsync(UserKey(userId), merged, UserCartTtl);

        // Delete guest cart
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync(GuestKey(cartId));

        return merged;
    }
}
