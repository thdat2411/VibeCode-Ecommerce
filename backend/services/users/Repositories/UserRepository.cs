using MongoDB.Driver;
using Users.Models;

namespace Users.Repositories;

/// <summary>
/// MongoDB implementation of IUserRepository
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly IMongoDatabase _database;
    private readonly IMongoCollection<User> _collection;

    public UserRepository(IMongoDatabase database)
    {
        _database = database;
        _collection = database.GetCollection<User>("users");
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _collection.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        await _collection.InsertOneAsync(user);
        return user;
    }

    public async Task<bool> UpdateAsync(string id, User user)
    {
        var result = await _collection.ReplaceOneAsync(u => u.Id == id, user);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _collection.DeleteOneAsync(u => u.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _collection.Find(u => u.GoogleId == googleId).FirstOrDefaultAsync();
    }
}
