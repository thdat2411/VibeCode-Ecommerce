using Catalog.Models;

namespace Catalog.Repositories;

/// <summary>
/// DEPRECATED: Use IRepository{Product} instead
/// This interface is kept for backward compatibility only
/// The generic repository pattern provides better database portability
/// </summary>
[Obsolete("Use IRepository<Product> from generic repository pattern instead")]
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(string id);
    Task<IEnumerable<Product>> GetByCollectionIdAsync(string collectionId);
    Task<IEnumerable<Product>> GetByCollectionSlugAsync(string collectionSlug);
    Task<Product> CreateAsync(Product product);
    Task<bool> UpdateAsync(string id, Product product);
    Task<bool> DeleteAsync(string id);
}
