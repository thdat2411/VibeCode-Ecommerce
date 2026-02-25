using System.ComponentModel.DataAnnotations;

namespace Catalog.Models;

/// <summary>
/// Collection domain model.
/// Supports a 2-level hierarchy: root collections (ParentId = null) and
/// sub-collections (ParentId = parent collection's Id).
///
/// Example tree:
///   Áo (root)
///   ├── Áo Thun Relaxed Fit  (sub)
///   ├── Áo Thun Dài Tay      (sub)
///   └── Áo Hoodie            (sub)
///   Quần (root)
///   └── Quần Jogger          (sub)
/// </summary>
public record Collection
{
    [Key]
    public string Id { get; init; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Display name, e.g. "Áo Thun Relaxed Fit"
    /// </summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>
    /// URL-friendly slug, e.g. "relaxed-fit"
    /// </summary>
    public string Slug { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    /// <summary>
    /// Cover image URL shown in collection listings
    /// </summary>
    public string Image { get; init; } = string.Empty;

    /// <summary>
    /// null  → this is a root/top-level collection (e.g. "Áo", "Quần")
    /// set   → this is a sub-collection under the parent
    /// </summary>
    public string? ParentId { get; init; }

    /// <summary>
    /// Controls navbar / listing order within the same parent level
    /// </summary>
    public int DisplayOrder { get; init; }

    public bool IsActive { get; init; } = true;

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
