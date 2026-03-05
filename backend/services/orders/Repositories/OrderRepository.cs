using Microsoft.EntityFrameworkCore;
using Orders.Data;
using Orders.Models;

namespace Orders.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly OrdersDbContext _db;

    public OrderRepository(OrdersDbContext db)
    {
        _db = db;
    }

    public async Task<List<Order>> GetByUserIdAsync(string userId)
    {
        return await _db.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(string id)
    {
        return await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Order> CreateAsync(Order order)
    {
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<bool> UpdateStatusAsync(string id, string status)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is null) return false;
        order.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }
}
