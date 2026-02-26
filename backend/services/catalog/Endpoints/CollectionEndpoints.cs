using Catalog.Models;
using Catalog.Services;
using Catalog.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.DTOs;

namespace Catalog.Endpoints;

public static class CollectionEndpoints
{
    public static void MapCollectionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/collections")
            .WithTags("Collections")
            .WithOpenApi();

        // GET /api/collections - Get all collections with hierarchy
        group.MapGet("/", async (CatalogDbContext db) =>
        {
            var allCollections = await db.Collections
                .AsNoTracking()
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();

            // Build hierarchy: root collections with their sub-collections
            var rootCollections = allCollections.Where(c => c.ParentId == null).ToList();
            var result = rootCollections
                .Select(c => MapCollectionToDtoWithChildren(c, allCollections))
                .ToList();

            return Results.Ok(result);
        })
        .Produces<IEnumerable<CollectionDto>>(200)
        .WithName("GetAllCollections")
        .WithSummary("Get all collections with hierarchy");

        // GET /api/collections/{slug} - Get collection by slug
        group.MapGet("/{slug}", async (string slug, CatalogDbContext db) =>
        {
            var collection = await db.Collections
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);

            if (collection is null)
                return Results.NotFound(new { message = "Collection not found" });

            // If this is a sub-collection, also load parent info
            CollectionDto? parent = null;
            if (!string.IsNullOrEmpty(collection.ParentId))
            {
                var parentCollection = await db.Collections
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == collection.ParentId);
                if (parentCollection != null)
                {
                    parent = new CollectionDto
                    {
                        Id = parentCollection.Id,
                        Name = parentCollection.Name,
                        Slug = parentCollection.Slug,
                        Description = parentCollection.Description,
                        Image = parentCollection.Image,
                        DisplayOrder = parentCollection.DisplayOrder
                    };
                }
            }

            var dto = new CollectionDto
            {
                Id = collection.Id,
                Name = collection.Name,
                Slug = collection.Slug,
                Description = collection.Description,
                Image = collection.Image,
                ParentId = collection.ParentId,
                DisplayOrder = collection.DisplayOrder,
                SubCollections = Array.Empty<CollectionDto>() // Load separately if needed
            };

            return Results.Ok(new { collection = dto, parent });
        })
        .Produces<CollectionDto>(200)
        .Produces(404)
        .WithName("GetCollectionBySlug")
        .WithSummary("Get collection by slug");

        // GET /api/collections/{slug}/products - Get products by collection slug
        group.MapGet("/{slug}/products", async (string slug, CatalogDbContext db) =>
        {
            var collection = await db.Collections
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);

            if (collection == null)
            {
                return Results.NotFound(new { message = "Collection not found" });
            }

            var products = await db.Products
                .AsNoTracking()
                .Where(p => p.CollectionId == collection.Id && p.IsActive)
                .ToListAsync();

            var productDtos = new List<ProductDto>();
            foreach (var product in products)
            {
                productDtos.Add(await MapProductToDtoAsync(product, db));
            }

            return Results.Ok(new
            {
                collection = new CollectionDto
                {
                    Id = collection.Id,
                    Name = collection.Name,
                    Slug = collection.Slug,
                    Description = collection.Description,
                    Image = collection.Image,
                    DisplayOrder = collection.DisplayOrder
                },
                products = productDtos,
                count = productDtos.Count
            });
        })
        .Produces(200)
        .Produces(404)
        .WithName("GetCollectionWithProducts")
        .WithSummary("Get collection with all its products");
    }

    private static CollectionDto MapCollectionToDtoWithChildren(Collection collection, List<Collection> allCollections)
    {
        var children = allCollections
            .Where(c => c.ParentId == collection.Id && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => MapCollectionToDtoWithChildren(c, allCollections))
            .ToArray();

        return new CollectionDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Slug = collection.Slug,
            Description = collection.Description,
            Image = collection.Image,
            ParentId = collection.ParentId,
            DisplayOrder = collection.DisplayOrder,
            SubCollections = children
        };
    }

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
}
