using Cart.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace Cart.Repositories;

/// <summary>
/// Redis implementation of ICartRepository
/// </summary>
public class CartRepository : ICartRepository
{
    private readonly IConnectionMultiplexer _redis;
    private readonly JsonSerializerOptions _jsonOptions;

    public CartRepository(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    public async Task<CartResponse> GetCartAsync(string userId)
    {
        var db = _redis.GetDatabase();
        var cartJson = await db.StringGetAsync($"cart:{userId}");

        if (cartJson.IsNullOrEmpty)
            return new CartResponse { Items = new List<CartItem>(), Total = 0 };

        var cart = JsonSerializer.Deserialize<CartResponse>(cartJson.ToString(), _jsonOptions);
        return cart ?? new CartResponse { Items = new List<CartItem>(), Total = 0 };
    }

    private static string CompositeKey(string productId, string? size, string? color)
        => $"{productId}|{size ?? ""}|{color ?? ""}";

    private static string ItemKey(CartItem i)
        => CompositeKey(i.ProductId, i.Size, i.Color);

    public async Task<CartResponse> AddItemAsync(string userId, CartItem item)
    {
        var cart = await GetCartAsync(userId);
        var items = cart.Items.ToList();
        var key = ItemKey(item);

        var existingItem = items.FirstOrDefault(i => ItemKey(i) == key);
        if (existingItem != null)
        {
            // Remove old item and add updated one
            items.Remove(existingItem);
            items.Add(existingItem with { Quantity = existingItem.Quantity + item.Quantity });
        }
        else
        {
            items.Add(item);
        }

        cart = cart with { Items = items };
        await UpdateCartTotalAsync(userId, cart);
        return cart;
    }

    public async Task<CartResponse> RemoveItemAsync(string userId, string productId, string? size, string? color)
    {
        var cart = await GetCartAsync(userId);
        var key = CompositeKey(productId, size, color);
        var items = cart.Items.Where(i => ItemKey(i) != key).ToList();

        cart = cart with { Items = items };
        await UpdateCartTotalAsync(userId, cart);
        return cart;
    }

    public async Task<bool> ClearCartAsync(string userId)
    {
        var db = _redis.GetDatabase();
        var result = await db.KeyDeleteAsync($"cart:{userId}");
        return result;
    }

    public async Task UpdateCartTotalAsync(string userId, CartResponse cart)
    {
        cart = cart with
        {
            Total = cart.Items.Sum(i => i.Price * i.Quantity)
        };

        var db = _redis.GetDatabase();
        var json = JsonSerializer.Serialize(cart, _jsonOptions);
        await db.StringSetAsync($"cart:{userId}", json, TimeSpan.FromDays(7));
    }
}
