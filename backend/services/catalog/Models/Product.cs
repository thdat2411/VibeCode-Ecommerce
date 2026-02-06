using MongoDB.Driver;

namespace Catalog.Models;

/// <summary>
/// Product domain model
/// </summary>
public record Product
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string Category { get; init; } = string.Empty;
    public string[] Images { get; init; } = Array.Empty<string>();
    public Dictionary<string, string[]> Variants { get; init; } = new();
    public int Stock { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
