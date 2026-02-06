using Catalog.Models;

namespace Catalog.Repositories;

/// <summary>
/// Repository interface for Product data access.
/// Abstracts the underlying storage mechanism (MongoDB, SQL, etc.)
/// </summary>
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(string id);
    Task<IEnumerable<Product>> GetByCategoryAsync(string category);
    Task<Product> CreateAsync(Product product);
    Task<bool> UpdateAsync(string id, Product product);
    Task<bool> DeleteAsync(string id);
}
