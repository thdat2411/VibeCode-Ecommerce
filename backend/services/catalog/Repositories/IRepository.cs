using System.Linq.Expressions;

namespace Catalog.Repositories;

/// <summary>
/// Generic repository interface for data access operations
/// Database-agnostic design allows easy switching between different databases
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Get entity by primary key
    /// </summary>
    Task<T?> GetByIdAsync(string id);

    /// <summary>
    /// Get all entities
    /// </summary>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Find entities matching a predicate
    /// </summary>
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Find single entity matching a predicate
    /// </summary>
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Create new entity
    /// </summary>
    Task<T> CreateAsync(T entity);

    /// <summary>
    /// Update existing entity
    /// </summary>
    Task<bool> UpdateAsync(T entity);

    /// <summary>
    /// Delete entity by id
    /// </summary>
    Task<bool> DeleteAsync(string id);

    /// <summary>
    /// Check if entity exists
    /// </summary>
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Get count of entities matching predicate
    /// </summary>
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
}
