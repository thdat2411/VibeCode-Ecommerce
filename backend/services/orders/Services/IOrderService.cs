using Orders.Models;

namespace Orders.Services;

public interface IOrderService
{
    /// <summary>
    /// Full pre-order workflow:
    ///   1. Validate request
    ///   2. Recalculate price from catalog (prevent price tampering)
    ///   3. Check inventory (each SKU has enough stock)
    ///   4. Reserve stock (decrement catalog SKU stock atomically)
    ///   5. Persist order
    /// </summary>
    Task<OrderResult> CreateOrderAsync(string userId, CreateOrderRequest request);
}

/// <summary>Discriminated union result — either success with the order, or a failure with a reason.</summary>
public abstract record OrderResult
{
    public record Success(Order Order) : OrderResult;
    public record ValidationError(string Message) : OrderResult;
    public record PriceMismatch(string ProductId, decimal Expected, decimal Actual) : OrderResult;
    public record InsufficientStock(string ProductId, string SkuId, int Available, int Requested) : OrderResult;
    public record ReservationFailed(string ProductId, string SkuId, string Reason) : OrderResult;
}
