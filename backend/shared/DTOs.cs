namespace Shared.DTOs;

// ─────────────────────────────────────────────────────────────────────────────
// Catalog DTOs
// ─────────────────────────────────────────────────────────────────────────────

public record VariantOptionDto
{
    public string Name { get; init; } = string.Empty;
    public string[] Values { get; init; } = Array.Empty<string>();
}

public record VariantImageDto
{
    public string VariantType { get; init; } = string.Empty;
    public string VariantValue { get; init; } = string.Empty;
    public string[] Images { get; init; } = Array.Empty<string>();
}

/// <summary>
/// One concrete SKU (variant combination) with its own stock and optional price.
/// Example: { VariantValues: {"Color":"White","Size":"S"}, Stock: 5 }
/// </summary>
public record ProductSkuDto
{
    public string Id { get; init; } = string.Empty;
    public string SkuCode { get; init; } = string.Empty;

    /// <summary>e.g. { "Color": "White", "Size": "S" }</summary>
    public Dictionary<string, string> VariantValues { get; init; } = new();

    public int Stock { get; init; }

    /// <summary>null → use the product's base price</summary>
    public decimal? PriceOverride { get; init; }
}

public record ProductDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;

    /// <summary>Base price. Individual SKUs may override this.</summary>
    public decimal Price { get; init; }

    /// <summary>Original price (non-null = on sale). Shown as strikethrough.</summary>
    public decimal? CompareAtPrice { get; init; }

    public string CollectionId { get; init; } = string.Empty;
    public string CollectionSlug { get; init; } = string.Empty;
    public string ThumbnailImage { get; init; } = string.Empty;

    /// <summary>Variant axes: [ {Name:"Color", Values:["White","Black"]}, {Name:"Size", Values:["S","M","L"]} ]</summary>
    public VariantOptionDto[] VariantOptions { get; init; } = Array.Empty<VariantOptionDto>();

    /// <summary>Color → image mapping</summary>
    public VariantImageDto[] VariantImages { get; init; } = Array.Empty<VariantImageDto>();

    /// <summary>All SKUs (one per variant combination) with per-SKU stock</summary>
    public ProductSkuDto[] Skus { get; init; } = Array.Empty<ProductSkuDto>();

    /// <summary>Sum of all active SKU stocks — for quick availability checks</summary>
    public int TotalStock { get; init; }
}

public record CollectionDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Image { get; init; } = string.Empty;

    /// <summary>null = root collection; set = sub-collection</summary>
    public string? ParentId { get; init; }

    public int DisplayOrder { get; init; }
    public CollectionDto[] SubCollections { get; init; } = Array.Empty<CollectionDto>();
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart DTOs
// ─────────────────────────────────────────────────────────────────────────────

public record CartItemDto
{
    public string ProductId { get; init; } = string.Empty;
    public string SkuId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
    public string Image { get; init; } = string.Empty;

    /// <summary>e.g. { "Color": "White", "Size": "S" }</summary>
    public Dictionary<string, string> VariantValues { get; init; } = new();
}

// ─────────────────────────────────────────────────────────────────────────────
// Order DTOs
// ─────────────────────────────────────────────────────────────────────────────

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
    public string SkuId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
    public Dictionary<string, string> VariantValues { get; init; } = new();
}

// ─────────────────────────────────────────────────────────────────────────────
// User / Auth DTOs
// ─────────────────────────────────────────────────────────────────────────────

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
