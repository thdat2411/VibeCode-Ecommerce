namespace Shared.DTOs;

public record ProductDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string Category { get; init; } = string.Empty;
    public string[] Images { get; init; } = Array.Empty<string>();
    public Dictionary<string, string[]> Variants { get; init; } = new();
    public int Stock { get; init; }
}

public record CartItemDto
{
    public string ProductId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
    public string Image { get; init; } = string.Empty;
}

public record OrderDto
{
    public string Id { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public OrderItemDto[] Items { get; init; } = Array.Empty<OrderItemDto>();
    public decimal Total { get; init; }
    public string Status { get; init; } = string.Empty;
    public AddressDto ShippingAddress { get; init; } = new();
    public DateTime CreatedAt { get; init; }
}

public record OrderItemDto
{
    public string ProductId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
}

public record UserDto
{
    public string Id { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public AddressDto? ShippingAddress { get; init; }
}

public record AddressDto
{
    public string Street { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string State { get; init; } = string.Empty;
    public string ZipCode { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
}
