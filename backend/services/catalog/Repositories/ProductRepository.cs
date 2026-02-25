using Catalog.Data;
using Catalog.Models;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Repositories;

/// <summary>
/// DEPRECATED: Use Repository{Product} instead via IRepository{Product}
/// This adapter keeps the old interface working with the new generic repository
/// Maintained for backward compatibility during transition
/// </summary>
[Obsolete("Use Repository<Product> from generic repository pattern instead")]
public class ProductRepository : IProductRepository
{
    private readonly IRepository<Product> _genericRepository;

    public ProductRepository(IRepository<Product> genericRepository)
    {
        _genericRepository = genericRepository;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _genericRepository.GetAllAsync();
    }

    public async Task<Product?> GetByIdAsync(string id)
    {
        return await _genericRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Product>> GetByCollectionIdAsync(string collectionId)
    {
        return await _genericRepository.FindAsync(p => p.CollectionId == collectionId);
    }

    public async Task<IEnumerable<Product>> GetByCollectionSlugAsync(string collectionSlug)
    {
        return await _genericRepository.FindAsync(p => p.CollectionSlug == collectionSlug);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        return await _genericRepository.CreateAsync(product);
    }

    public async Task<bool> UpdateAsync(string id, Product product)
    {
        return await _genericRepository.UpdateAsync(product);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _genericRepository.DeleteAsync(id);
    }
}
