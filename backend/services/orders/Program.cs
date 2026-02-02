using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// MongoDB configuration
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = builder.Configuration["MongoDB:ConnectionString"];
    return new MongoClient(connectionString);
});

builder.Services.AddScoped(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var databaseName = builder.Configuration["MongoDB:DatabaseName"];
    return client.GetDatabase(databaseName);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Orders API endpoints
app.MapGet("/api/orders", async (IMongoDatabase db, HttpContext context) =>
{
    var userId = context.Request.Headers["X-User-Id"].ToString();
    var collection = db.GetCollection<Order>("orders");
    var orders = await collection.Find(o => o.UserId == userId).ToListAsync();
    return Results.Ok(orders);
})
.WithName("GetOrders")
.WithOpenApi();

app.MapGet("/api/orders/{id}", async (string id, IMongoDatabase db) =>
{
    var collection = db.GetCollection<Order>("orders");
    var order = await collection.Find(o => o.Id == id).FirstOrDefaultAsync();
    return order is not null ? Results.Ok(order) : Results.NotFound();
})
.WithName("GetOrderById")
.WithOpenApi();

app.MapPost("/api/orders", async ([FromBody] CreateOrderRequest request, IMongoDatabase db, HttpContext context) =>
{
    var userId = context.Request.Headers["X-User-Id"].ToString();
    var order = new Order
    {
        UserId = userId,
        Items = request.Items,
        Total = request.Total,
        Status = "pending",
        ShippingAddress = request.ShippingAddress,
        CreatedAt = DateTime.UtcNow
    };
    
    var collection = db.GetCollection<Order>("orders");
    await collection.InsertOneAsync(order);
    return Results.Created($"/api/orders/{order.Id}", order);
})
.WithName("CreateOrder")
.WithOpenApi();

app.MapPatch("/api/orders/{id}/status", async (string id, [FromBody] UpdateOrderStatusRequest request, IMongoDatabase db) =>
{
    var collection = db.GetCollection<Order>("orders");
    var update = Builders<Order>.Update.Set(o => o.Status, request.Status);
    var result = await collection.UpdateOneAsync(o => o.Id == id, update);
    return result.ModifiedCount > 0 ? Results.Ok() : Results.NotFound();
})
.WithName("UpdateOrderStatus")
.WithOpenApi();

app.Run();

// Models
public record Order
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public string UserId { get; init; } = string.Empty;
    public OrderItem[] Items { get; init; } = Array.Empty<OrderItem>();
    public decimal Total { get; init; }
    public string Status { get; set; } = "pending"; // pending, processing, shipped, delivered, cancelled
    public Address ShippingAddress { get; init; } = new();
    public DateTime CreatedAt { get; init; }
}

public record OrderItem
{
    public string ProductId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
}

public record Address
{
    public string Street { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string State { get; init; } = string.Empty;
    public string ZipCode { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
}

public record CreateOrderRequest
{
    public OrderItem[] Items { get; init; } = Array.Empty<OrderItem>();
    public decimal Total { get; init; }
    public Address ShippingAddress { get; init; } = new();
}

public record UpdateOrderStatusRequest
{
    public string Status { get; init; } = string.Empty;
}
