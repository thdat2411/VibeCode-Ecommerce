using Catalog.Models;

namespace Catalog.Repositories;

public interface ICollectionRepository
{
    Task<IEnumerable<Collection>> GetAllAsync();
    Task<Collection?> GetByIdAsync(string id);
    Task<Collection?> GetBySlugAsync(string slug);
    Task<Collection> CreateAsync(Collection collection);
    Task<bool> UpdateAsync(string id, Collection collection);
    Task<bool> DeleteAsync(string id);
}

/// <summary>
/// DEPRECATED: Use Repository{Collection} instead via IRepository{Collection}
/// This adapter keeps the old interface working with the new generic repository
/// Maintained for backward compatibility during transition
/// </summary>
[Obsolete("Use Repository<Collection> from generic repository pattern instead")]
public class CollectionRepository : ICollectionRepository
{
    private readonly IRepository<Collection> _genericRepository;

    public CollectionRepository(IRepository<Collection> genericRepository)
    {
        _genericRepository = genericRepository;
    }

    public async Task<IEnumerable<Collection>> GetAllAsync()
    {
        return await _genericRepository.GetAllAsync();
    }

    public async Task<Collection?> GetByIdAsync(string id)
    {
        return await _genericRepository.GetByIdAsync(id);
    }

    public async Task<Collection?> GetBySlugAsync(string slug)
    {
        return await _genericRepository.FirstOrDefaultAsync(c => c.Slug == slug);
    }

    public async Task<Collection> CreateAsync(Collection collection)
    {
        return await _genericRepository.CreateAsync(collection);
    }

    public async Task<bool> UpdateAsync(string id, Collection collection)
    {
        return await _genericRepository.UpdateAsync(collection);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _genericRepository.DeleteAsync(id);
    }
}
