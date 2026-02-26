using Microsoft.EntityFrameworkCore;
using Users.Data;
using Users.Models;

namespace Users.Repositories;

/// <summary>
/// EF Core / PostgreSQL (Supabase) implementation of IUserRepository
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly UsersDbContext _db;

    public UserRepository(UsersDbContext db)
    {
        _db = db;
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _db.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _db.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User> CreateAsync(User user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<bool> UpdateAsync(string id, User user)
    {
        var existing = await _db.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (existing is null) return false;

        existing.Name = user.Name;
        existing.Phone = user.Phone;
        existing.ShippingAddress = user.ShippingAddress;

        // Sync addresses: remove deleted, update existing, add new
        var incomingIds = user.Addresses.Select(a => a.Id).ToHashSet();
        var toRemove = existing.Addresses.Where(a => !incomingIds.Contains(a.Id)).ToList();
        foreach (var addr in toRemove)
            existing.Addresses.Remove(addr);

        foreach (var incoming in user.Addresses)
        {
            var existingAddr = existing.Addresses.FirstOrDefault(a => a.Id == incoming.Id);
            if (existingAddr is null)
            {
                incoming.UserId = id;
                existing.Addresses.Add(incoming);
            }
            else
            {
                existingAddr.FirstName = incoming.FirstName;
                existingAddr.LastName = incoming.LastName;
                existingAddr.Company = incoming.Company;
                existingAddr.Street = incoming.Street;
                existingAddr.Ward = incoming.Ward;
                existingAddr.District = incoming.District;
                existingAddr.City = incoming.City;
                existingAddr.Country = incoming.Country;
                existingAddr.PostalCode = incoming.PostalCode;
                existingAddr.Phone = incoming.Phone;
                existingAddr.IsDefault = incoming.IsDefault;
            }
        }

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null) return false;

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _db.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.GoogleId == googleId);
    }
}
