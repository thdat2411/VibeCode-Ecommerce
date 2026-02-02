using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Redis configuration
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = builder.Configuration["Redis:ConnectionString"];
    return ConnectionMultiplexer.Connect(configuration ?? "localhost:6379");
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Cart API endpoints
app.MapGet("/api/cart", async (IConnectionMultiplexer redis, HttpContext context) =>
{
    var userId = context.Request.Headers["X-User-Id"].ToString() ?? "anonymous";
    var db = redis.GetDatabase();
    var cartJson = await db.StringGetAsync($"cart:{userId}");
    
    if (cartJson.IsNullOrEmpty)
        return Results.Ok(new CartResponse { Items = Array.Empty<CartItem>(), Total = 0 });
    
    var cart = JsonSerializer.Deserialize<CartResponse>(cartJson!);
    return Results.Ok(cart);
})
.WithName("GetCart")
.WithOpenApi();

app.MapPost("/api/cart/items", async ([FromBody] AddToCartRequest request, IConnectionMultiplexer redis, HttpContext context) =>
{
    var userId = context.Request.Headers["X-User-Id"].ToString() ?? "anonymous";
    var db = redis.GetDatabase();
    var cartJson = await db.StringGetAsync($"cart:{userId}");
    
    var cart = cartJson.IsNullOrEmpty 
        ? new CartResponse { Items = new List<CartItem>(), Total = 0 }
        : JsonSerializer.Deserialize<CartResponse>(cartJson!) ?? new CartResponse { Items = new List<CartItem>(), Total = 0 };
    
    var items = cart.Items.ToList();
    var existingItem = items.FirstOrDefault(i => i.ProductId == request.ProductId);
    
    if (existingItem is not null)
    {
        existingItem.Quantity += request.Quantity;
    }
    else
    {
        items.Add(new CartItem
        {
            ProductId = request.ProductId,
            Name = request.Name,
            Price = request.Price,
            Quantity = request.Quantity,
            Image = request.Image
        });
    }
    
    cart.Items = items;
    cart.Total = items.Sum(i => i.Price * i.Quantity);
    
    await db.StringSetAsync($"cart:{userId}", JsonSerializer.Serialize(cart), TimeSpan.FromDays(7));
    return Results.Ok(cart);
})
.WithName("AddToCart")
.WithOpenApi();

app.MapDelete("/api/cart/items/{productId}", async (string productId, IConnectionMultiplexer redis, HttpContext context) =>
{
    var userId = context.Request.Headers["X-User-Id"].ToString() ?? "anonymous";
    var db = redis.GetDatabase();
    var cartJson = await db.StringGetAsync($"cart:{userId}");
    
    if (cartJson.IsNullOrEmpty)
        return Results.NotFound();
    
    var cart = JsonSerializer.Deserialize<CartResponse>(cartJson!);
    if (cart is null)
        return Results.NotFound();
    
    var items = cart.Items.Where(i => i.ProductId != productId).ToList();
    cart.Items = items;
    cart.Total = items.Sum(i => i.Price * i.Quantity);
    
    await db.StringSetAsync($"cart:{userId}", JsonSerializer.Serialize(cart), TimeSpan.FromDays(7));
    return Results.Ok(cart);
})
.WithName("RemoveFromCart")
.WithOpenApi();

app.Run();

// Models
public record CartResponse
{
    public IEnumerable<CartItem> Items { get; set; } = Array.Empty<CartItem>();
    public decimal Total { get; set; }
}

public record CartItem
{
    public string ProductId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string Image { get; set; } = string.Empty;
}

public record AddToCartRequest
{
    public string ProductId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
    public string Image { get; init; } = string.Empty;
}
