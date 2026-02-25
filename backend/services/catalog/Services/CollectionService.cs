using Catalog.Models;
using Catalog.Repositories;

namespace Catalog.Services;

/// <summary>
/// Collection service - business logic for collections
/// Uses generic repository for data access (database-agnostic)
/// </summary>
public class CollectionService
{
    private readonly IRepository<Collection> _collectionRepository;
    private readonly IRepository<Product> _productRepository;

    public CollectionService(
        IRepository<Collection> collectionRepository,
        IRepository<Product> productRepository)
    {
        _collectionRepository = collectionRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<Collection>> GetAllCollectionsAsync()
    {
        return await _collectionRepository.GetAllAsync();
    }

    public async Task<Collection?> GetCollectionByIdAsync(string id)
    {
        return await _collectionRepository.GetByIdAsync(id);
    }

    public async Task<Collection?> GetCollectionBySlugAsync(string slug)
    {
        return await _collectionRepository.FirstOrDefaultAsync(c => c.Slug == slug);
    }

    public async Task<IEnumerable<Product>> GetProductsByCollectionIdAsync(string collectionId)
    {
        return await _productRepository.FindAsync(p => p.CollectionId == collectionId);
    }

    public async Task<IEnumerable<Product>> GetProductsByCollectionSlugAsync(string slug)
    {
        return await _productRepository.FindAsync(p => p.CollectionSlug == slug);
    }

    public async Task<(Collection? Collection, IEnumerable<Product> Products)> GetCollectionWithProductsAsync(string slug)
    {
        var collection = await GetCollectionBySlugAsync(slug);
        if (collection == null)
        {
            return (null, Enumerable.Empty<Product>());
        }

        var products = await GetProductsByCollectionIdAsync(collection.Id);
        return (collection, products);
    }
}
