using Catalog.Models;
using Catalog.Services;
using Microsoft.AspNetCore.Mvc;

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

    private static async Task<IResult> GetAllProducts(ProductService service)
    {
        var products = await service.GetAllProductsAsync();
        return Results.Ok(products);
    }

    private static async Task<IResult> GetProductById(string id, ProductService service)
    {
        var product = await service.GetProductByIdAsync(id);
        return Results.Ok(product);
    }

    private static async Task<IResult> GetProductsByCategory(string category, ProductService service)
    {
        var products = await service.GetProductsByCategoryAsync(category);
        return Results.Ok(products);
    }

    private static async Task<IResult> CreateProduct([FromBody] Product product, ProductService service)
    {
        var createdProduct = await service.CreateProductAsync(product);
        return Results.Created($"/api/products/{createdProduct.Id}", createdProduct);
    }
}
