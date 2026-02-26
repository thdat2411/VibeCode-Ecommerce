using System.Text.Json.Serialization;

namespace Cart.Models;

public record CartResponse
{
    [JsonPropertyName("items")]
    public IList<CartItem> Items { get; set; } = new List<CartItem>();

    [JsonPropertyName("total")]
    public decimal Total { get; set; }
}

public record CartItem
{
    [JsonPropertyName("productId")]
    public string ProductId { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }

    [JsonPropertyName("image")]
    public string Image { get; set; } = string.Empty;

    [JsonPropertyName("size")]
    public string? Size { get; set; }

    [JsonPropertyName("color")]
    public string? Color { get; set; }
}

public record AddToCartRequest
{
    public string ProductId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; } = 1;
    public string Image { get; init; } = string.Empty;
    public string? Size { get; init; }
    public string? Color { get; init; }
}

public record RemoveFromCartRequest
{
    public string? Size { get; init; }
    public string? Color { get; init; }
}

public record UpdateQuantityRequest
{
    public int Quantity { get; init; }
    public string? Size { get; init; }
    public string? Color { get; init; }
}
