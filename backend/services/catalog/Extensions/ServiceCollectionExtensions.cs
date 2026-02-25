using Catalog.Data;
using Catalog.Models;
using Catalog.Repositories;
using Catalog.Services;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Catalog.Extensions;

/// <summary>
/// Service collection extensions for catalog services
/// Centralizes all dependency injection configuration in one place
/// This allows easy database switching without changing services or repositories
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Add catalog services with database context configuration
    /// </summary>
    public static IServiceCollection AddCatalogServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Get connection string
        var connectionString = configuration["Supabase:ConnectionString"];
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException(
                "Supabase:ConnectionString is not configured in appsettings.json");
        }

        // Register DbContext - THIS IS THE ONLY PLACE TO CHANGE FOR DATABASE SWITCHING
        // Use NpgsqlDataSourceBuilder to enable IPv6 support (Supabase DNS returns AAAA records)
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<CatalogDbContext>(options =>
        {
            options.UseNpgsql(dataSource);
        });

        // Register generic repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        // Register specialized repositories (can be deprecated if using generic repository)
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICollectionRepository, CollectionRepository>();

        // Register services
        services.AddScoped<ProductService>();
        services.AddScoped<CollectionService>();

        return services;
    }

    /// <summary>
    /// Apply database migrations and seed initial data
    /// Call this in Program.cs after building the app
    /// </summary>
    public static async Task MigrateAndSeedDatabaseAsync(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();

            try
            {
                // Apply pending migrations
                await db.Database.MigrateAsync();
                Console.WriteLine("✓ Database migrations applied successfully");

                // Seed data if tables are empty
                if (!db.Collections.Any())
                {
                    await SeedData.SeedCollections(db);
                }

                if (!db.Products.Any())
                {
                    await SeedData.SeedProducts(db);
                }

                if (!db.ProductSkus.Any())
                {
                    await SeedData.SeedProductSkus(db);
                }
            }
            catch (System.Net.Sockets.SocketException ex)
            {
                Console.WriteLine($"⚠ Database connection failed (network issue): {ex.Message}");
                Console.WriteLine("  The application will start but database operations will fail.");
                Console.WriteLine("  Please check:");
                Console.WriteLine("  1. Network connectivity");
                Console.WriteLine("  2. VPN/Firewall settings");
                Console.WriteLine("  3. Database connection string in appsettings.json");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Error during database setup: {ex.Message}");
                Console.WriteLine($"  {ex.InnerException?.Message}");
            }
        }
    }
}
