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

// Seed data on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<IMongoDatabase>();
    await SeedData.SeedProducts(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Catalog API endpoints
app.MapGet("/api/products", async (IMongoDatabase db) =>
{
    var collection = db.GetCollection<Product>("products");
    var products = await collection.Find(_ => true).ToListAsync();
    return Results.Ok(products);
})
.WithName("GetAllProducts")
.WithOpenApi();

app.MapGet("/api/products/{id}", async (string id, IMongoDatabase db) =>
{
    var collection = db.GetCollection<Product>("products");
    var product = await collection.Find(p => p.Id == id).FirstOrDefaultAsync();
    return product is not null ? Results.Ok(product) : Results.NotFound();
})
.WithName("GetProductById")
.WithOpenApi();

app.MapGet("/api/products/category/{category}", async (string category, IMongoDatabase db) =>
{
    var collection = db.GetCollection<Product>("products");
    var products = await collection.Find(p => p.Category == category).ToListAsync();
    return Results.Ok(products);
})
.WithName("GetProductsByCategory")
.WithOpenApi();

app.MapPost("/api/products", async ([FromBody] Product product, IMongoDatabase db) =>
{
    var collection = db.GetCollection<Product>("products");
    await collection.InsertOneAsync(product);
    return Results.Created($"/api/products/{product.Id}", product);
})
.WithName("CreateProduct")
.WithOpenApi();

app.Run();

// Models
public record Product
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string Category { get; init; } = string.Empty;
    public string[] Images { get; init; } = Array.Empty<string>();
    public Dictionary<string, string[]> Variants { get; init; } = new();
    public int Stock { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
