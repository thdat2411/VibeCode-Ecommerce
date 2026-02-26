using Catalog.Models;
using Catalog.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Catalog.Data;
using Shared.DTOs;

namespace Catalog.Endpoints;

/// <summary>
/// Extension method to register all catalog endpoints
/// </summary>
public static class CatalogEndpoints
{
    public static void MapCatalogEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/products")
            .WithTags("Catalog");

        group.MapGet("/", GetAllProducts)
            .WithName("GetAllProducts")
            .WithOpenApi();

        group.MapGet("/{id}", GetProductById)
            .WithName("GetProductById")
            .WithOpenApi();

        group.MapGet("/category/{category}", GetProductsByCategory)
            .WithName("GetProductsByCategory")
            .WithOpenApi();

        group.MapPost("/", CreateProduct)
            .WithName("CreateProduct")
            .WithOpenApi();
    }

    private static async Task<IResult> GetAllProducts(CatalogDbContext db)
    {
        var products = await db.Products
            .AsNoTracking()
            .ToListAsync();

        var dtos = products.Select(p => MapProductToDto(p, db)).ToList();
        return Results.Ok(dtos);
    }

    private static async Task<IResult> GetProductById(string id, CatalogDbContext db)
    {
        var product = await db.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
            return Results.NotFound(new { message = "Product not found" });

        var dto = await MapProductToDtoAsync(product, db);
        return Results.Ok(dto);
    }

    private static async Task<IResult> GetProductsByCategory(string category, CatalogDbContext db)
    {
        // Redirect to CollectionId endpoint for backward compatibility
        var products = await db.Products
            .AsNoTracking()
            .Where(p => p.CollectionSlug == category)
            .ToListAsync();

        var dtos = new List<ProductDto>();
        foreach (var product in products)
        {
            dtos.Add(await MapProductToDtoAsync(product, db));
        }

        return Results.Ok(dtos);
    }

    private static async Task<IResult> CreateProduct([FromBody] Product product, ProductService service)
    {
        var createdProduct = await service.CreateProductAsync(product);
        return Results.Created($"/api/products/{createdProduct.Id}", createdProduct);
    }

    /// <summary>
    /// Map Product model to ProductDto, loading SKUs from database
    /// </summary>
    private static async Task<ProductDto> MapProductToDtoAsync(Product product, CatalogDbContext db)
    {
        var skus = (await db.ProductSkus
            .AsNoTracking()
            .Where(s => s.ProductId == product.Id && s.IsActive)
            .ToListAsync())
            .OrderBy(s => string.Join(",", s.VariantValues.Values))
            .ToList();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            CompareAtPrice = product.CompareAtPrice,
            CollectionId = product.CollectionId,
            CollectionSlug = product.CollectionSlug,
            ThumbnailImage = product.ThumbnailImage,
            VariantOptions = product.VariantOptions
                .Select(vo => new VariantOptionDto { Name = vo.Name, Values = vo.Values })
                .ToArray(),
            VariantImages = product.VariantImages
                .Select(vi => new VariantImageDto
                {
                    VariantType = vi.VariantType,
                    VariantValue = vi.VariantValue,
                    Images = vi.Images
                })
                .ToArray(),
            Skus = skus
                .Select(s => new ProductSkuDto
                {
                    Id = s.Id,
                    SkuCode = s.SkuCode,
                    VariantValues = s.VariantValues,
                    Stock = s.Stock,
                    PriceOverride = s.PriceOverride
                })
                .ToArray(),
            TotalStock = product.TotalStock
        };
    }

    /// <summary>
    /// Synchronous version for use in list operations (skus loaded separately)
    /// </summary>
    private static ProductDto MapProductToDto(Product product, CatalogDbContext db)
    {
        // For synchronous context, just map without SKUs
        // (SKUs should be loaded asynchronously in GetAllProducts if needed)
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            CompareAtPrice = product.CompareAtPrice,
            CollectionId = product.CollectionId,
            CollectionSlug = product.CollectionSlug,
            ThumbnailImage = product.ThumbnailImage,
            VariantOptions = product.VariantOptions
                .Select(vo => new VariantOptionDto { Name = vo.Name, Values = vo.Values })
                .ToArray(),
            VariantImages = product.VariantImages
                .Select(vi => new VariantImageDto
                {
                    VariantType = vi.VariantType,
                    VariantValue = vi.VariantValue,
                    Images = vi.Images
                })
                .ToArray(),
            Skus = Array.Empty<ProductSkuDto>(), // Load separately if needed
            TotalStock = product.TotalStock
        };
    }
}
