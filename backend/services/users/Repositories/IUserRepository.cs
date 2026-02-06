using Users.Models;

namespace Users.Repositories;

/// <summary>
/// Repository interface for User data access.
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<User> CreateAsync(User user);
    Task<bool> UpdateAsync(string id, User user);
    Task<bool> DeleteAsync(string id);
    Task<User?> GetByGoogleIdAsync(string googleId);
}
