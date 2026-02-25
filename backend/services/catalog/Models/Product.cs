using System.ComponentModel.DataAnnotations;

namespace Catalog.Models;

// ─────────────────────────────────────────────────────────────────────────────
// Supporting value objects (stored as JSON columns)
// ─────────────────────────────────────────────────────────────────────────────

/// <summary>
/// Defines one variant axis and its available values.
/// Stored as JSON on the Product row.
///
/// Example:
///   { Name: "Color", Values: ["White", "Black", "Navy"] }
///   { Name: "Size",  Values: ["S", "M", "L", "XL"] }
/// </summary>
public record VariantOption
{
    public string Name { get; init; } = string.Empty;
    public string[] Values { get; init; } = Array.Empty<string>();
}

/// <summary>
/// Maps a variant value to one or more display images.
/// Stored as JSON on the Product row.
///
/// Example:
///   { VariantType: "Color", VariantValue: "White", Images: ["url1","url2"] }
/// </summary>
public record VariantImage
{
    public string VariantType { get; init; } = string.Empty;
    public string VariantValue { get; init; } = string.Empty;
    public string[] Images { get; init; } = Array.Empty<string>();
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductSku  — one row per unique combination of variant values
// ─────────────────────────────────────────────────────────────────────────────

/// <summary>
/// A Stock-Keeping Unit: one concrete variant combination of a product.
///
/// Example for "T-Shirt Basic":
///   SKU 1 → Color=White, Size=S  → stock=5,  price override=null  → uses product base price
///   SKU 2 → Color=White, Size=M  → stock=3,  price override=null
///   SKU 3 → Color=Black, Size=S  → stock=4,  price override=null
///   SKU 4 → Color=Black, Size=XL → stock=0,  price override=189000 (size surcharge)
///
/// Stored as a separate DB table (product_skus) so stock can be tracked per SKU.
/// </summary>
public record ProductSku
{
    [Key]
    public string Id { get; init; } = Guid.NewGuid().ToString();

    /// <summary>FK back to the parent product</summary>
    public string ProductId { get; init; } = string.Empty;

    /// <summary>
    /// Human-readable SKU code, e.g. "TSHIRT-WHITE-S".
    /// Optional — generated from variant values if not set.
    /// </summary>
    public string SkuCode { get; init; } = string.Empty;

    /// <summary>
    /// The specific combination of variant values this SKU represents.
    /// Stored as JSON: { "Color": "White", "Size": "S" }
    /// </summary>
    public Dictionary<string, string> VariantValues { get; init; } = new();

    /// <summary>
    /// Stock on hand for this exact variant combination.
    /// This replaces the old single Stock int on Product.
    /// </summary>
    public int Stock { get; init; }

    /// <summary>
    /// Per-SKU price override. If null, the product's base Price is used.
    /// Useful for size surcharges, premium colorways, etc.
    /// </summary>
    public decimal? PriceOverride { get; init; }

    public bool IsActive { get; init; } = true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Product  — the canonical product entity
// ─────────────────────────────────────────────────────────────────────────────

/// <summary>
/// Core product entity.
///
/// Design decisions:
/// • VariantOptions   — JSON column, defines the axes (Color, Size …)
/// • VariantImages    — JSON column, maps color → image URLs
/// • ProductSkus      — separate table rows, one per variant combination
/// • Stock on Product — computed / cached total; authoritative stock lives in SKUs
/// • CompareAtPrice   — original price when on sale (for strikethrough display)
/// </summary>
public record Product
{
    [Key]
    public string Id { get; init; } = Guid.NewGuid().ToString();

    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;

    /// <summary>Base selling price (VND). Individual SKUs may override this.</summary>
    public decimal Price { get; init; }

    /// <summary>
    /// Original price before discount. Non-null → product is on sale.
    /// UI shows this as a strikethrough next to the current Price.
    /// </summary>
    public decimal? CompareAtPrice { get; init; }

    // ── Collection reference ──────────────────────────────────────────────
    public string CollectionId { get; init; } = string.Empty;
    public string CollectionSlug { get; init; } = string.Empty;

    // ── Media ─────────────────────────────────────────────────────────────
    /// <summary>Primary thumbnail shown in grid/listing views</summary>
    public string ThumbnailImage { get; init; } = string.Empty;

    // ── Variant definition (JSON columns) ────────────────────────────────
    /// <summary>
    /// Defines available variant axes.
    /// [ { Name:"Color", Values:["White","Black"] }, { Name:"Size", Values:["S","M","L"] } ]
    /// </summary>
    public VariantOption[] VariantOptions { get; init; } = Array.Empty<VariantOption>();

    /// <summary>
    /// Images per variant value (usually per Color).
    /// [ { VariantType:"Color", VariantValue:"White", Images:["url1","url2"] } ]
    /// </summary>
    public VariantImage[] VariantImages { get; init; } = Array.Empty<VariantImage>();

    // ── Aggregate stock (denormalized for fast listing queries) ───────────
    /// <summary>
    /// Total available stock across all SKUs.
    /// Updated whenever a SKU's stock changes. Used only for listing filters.
    /// </summary>
    public int TotalStock { get; init; }

    public bool IsActive { get; init; } = true;

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
