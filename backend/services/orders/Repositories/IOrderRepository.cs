using Orders.Models;

namespace Orders.Repositories;

public interface IOrderRepository
{
    Task<List<Order>> GetByUserIdAsync(string userId);
    Task<Order?> GetByIdAsync(string id);
    Task<Order> CreateAsync(Order order);
    Task<bool> UpdateStatusAsync(string id, string status);
}
