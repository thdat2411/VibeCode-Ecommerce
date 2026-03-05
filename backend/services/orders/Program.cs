using Microsoft.EntityFrameworkCore;
using Npgsql;
using Orders.Data;
using Orders.Endpoints;
using Orders.Repositories;
using Orders.Services;
using Shared.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// PostgreSQL / Supabase
var connectionString = builder.Configuration["Supabase:ConnectionString"]
    ?? throw new InvalidOperationException("Supabase:ConnectionString is not configured.");

var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<OrdersDbContext>(options =>
{
    options.UseNpgsql(dataSource);
});

builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// HttpClient for calling the catalog service
builder.Services.AddHttpClient("catalog", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:CatalogUrl"]
        ?? "http://localhost:5001");
});

builder.Services.AddScoped<IOrderService, OrderService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseGlobalExceptionHandler();

// Map endpoints
app.MapOrderEndpoints();

// Apply EF Core migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
    await db.Database.MigrateAsync();
}

app.Run();
