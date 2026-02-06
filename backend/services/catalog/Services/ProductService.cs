using Catalog.Models;
using Catalog.Repositories;
using Shared.Exceptions;

namespace Catalog.Services;

/// <summary>
/// Business logic service for product operations
/// </summary>
public class ProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Product> GetProductByIdAsync(string id)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product is null)
            throw new NotFoundException("Product", id);

        return product;
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
    {
        if (string.IsNullOrWhiteSpace(category))
            throw new ValidationException("Category cannot be empty.");

        return await _repository.GetByCategoryAsync(category);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        ValidateProduct(product);
        return await _repository.CreateAsync(product);
    }

    public async Task<Product> UpdateProductAsync(string id, Product product)
    {
        ValidateProduct(product);

        var existingProduct = await _repository.GetByIdAsync(id);
        if (existingProduct is null)
            throw new NotFoundException("Product", id);

        var updatedProduct = product with { Id = id };
        await _repository.UpdateAsync(id, updatedProduct);
        return updatedProduct;
    }

    public async Task<bool> DeleteProductAsync(string id)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product is null)
            throw new NotFoundException("Product", id);

        return await _repository.DeleteAsync(id);
    }

    private void ValidateProduct(Product product)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(product.Name))
            errors["Name"] = new[] { "Product name is required." };

        if (product.Price <= 0)
            errors["Price"] = new[] { "Product price must be greater than zero." };

        if (string.IsNullOrWhiteSpace(product.Category))
            errors["Category"] = new[] { "Product category is required." };

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }
}
