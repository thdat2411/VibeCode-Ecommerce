using MongoDB.Driver;

public static class SeedData
{
    public static async Task SeedProducts(IMongoDatabase database)
    {
        var collection = database.GetCollection<Product>("products");
        
        // Check if already seeded
        var count = await collection.CountDocumentsAsync(_ => true);
        if (count > 0)
        {
            Console.WriteLine("Database already contains products. Skipping seed.");
            return;
        }

        var products = new List<Product>
        {
            new Product
            {
                Name = "Classic Crewneck Sweatshirt",
                Description = "Premium heavyweight cotton sweatshirt with embroidered logo. Perfect for everyday wear.",
                Price = 89.99m,
                Category = "Sweaters",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
                    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL", "XXL" } },
                    { "Color", new[] { "Black", "White", "Navy", "Grey" } }
                },
                Stock = 150
            },
            new Product
            {
                Name = "Oversized Hoodie",
                Description = "Relaxed fit hoodie with kangaroo pocket and adjustable drawstring hood.",
                Price = 119.99m,
                Category = "Hoodies",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
                    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL", "XXL" } },
                    { "Color", new[] { "Black", "Cream", "Forest Green", "Charcoal" } }
                },
                Stock = 200
            },
            new Product
            {
                Name = "Slim Fit Denim Jeans",
                Description = "Japanese selvedge denim with subtle fade. Modern slim fit.",
                Price = 149.99m,
                Category = "Bottoms",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
                    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "28", "30", "32", "34", "36", "38" } },
                    { "Color", new[] { "Indigo", "Black", "Light Wash" } }
                },
                Stock = 120
            },
            new Product
            {
                Name = "Graphic Print T-Shirt",
                Description = "Soft cotton tee with exclusive artist collaboration print.",
                Price = 49.99m,
                Category = "T-Shirts",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
                    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL" } },
                    { "Color", new[] { "White", "Black", "Sand" } }
                },
                Stock = 300
            },
            new Product
            {
                Name = "Track Pants",
                Description = "Comfortable track pants with tapered fit and elastic waistband.",
                Price = 79.99m,
                Category = "Bottoms",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
                    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL" } },
                    { "Color", new[] { "Black", "Navy", "Olive" } }
                },
                Stock = 180
            },
            new Product
            {
                Name = "Bomber Jacket",
                Description = "Classic bomber jacket with ribbed cuffs and hem. Lightweight and versatile.",
                Price = 199.99m,
                Category = "Jackets",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
                    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL" } },
                    { "Color", new[] { "Black", "Sage", "Tan" } }
                },
                Stock = 90
            },
            new Product
            {
                Name = "Cargo Shorts",
                Description = "Functional cargo shorts with multiple pockets. Perfect for summer.",
                Price = 69.99m,
                Category = "Bottoms",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800",
                    "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL" } },
                    { "Color", new[] { "Khaki", "Black", "Olive" } }
                },
                Stock = 160
            },
            new Product
            {
                Name = "Long Sleeve Henley",
                Description = "Classic henley with button placket. Comfortable and stylish.",
                Price = 59.99m,
                Category = "T-Shirts",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
                    "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL" } },
                    { "Color", new[] { "White", "Grey", "Navy" } }
                },
                Stock = 220
            },
            new Product
            {
                Name = "Windbreaker",
                Description = "Lightweight water-resistant windbreaker. Packable design.",
                Price = 129.99m,
                Category = "Jackets",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
                    "https://images.unsplash.com/photo-1525450824786-227cbef70703?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL" } },
                    { "Color", new[] { "Black", "Navy", "Red" } }
                },
                Stock = 140
            },
            new Product
            {
                Name = "Chino Pants",
                Description = "Tailored chino pants with a modern fit. Versatile and comfortable.",
                Price = 89.99m,
                Category = "Bottoms",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
                    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "28", "30", "32", "34", "36" } },
                    { "Color", new[] { "Khaki", "Navy", "Black", "Olive" } }
                },
                Stock = 170
            },
            new Product
            {
                Name = "Zip-Up Hoodie",
                Description = "Full zip hoodie with side pockets. Perfect layering piece.",
                Price = 109.99m,
                Category = "Hoodies",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL", "XXL" } },
                    { "Color", new[] { "Grey", "Black", "Navy" } }
                },
                Stock = 190
            },
            new Product
            {
                Name = "Striped Long Sleeve Tee",
                Description = "Classic striped long sleeve with ribbed cuffs.",
                Price = 54.99m,
                Category = "T-Shirts",
                Images = new[]
                {
                    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
                    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"
                },
                Variants = new Dictionary<string, string[]>
                {
                    { "Size", new[] { "S", "M", "L", "XL" } },
                    { "Color", new[] { "Navy/White", "Black/Grey" } }
                },
                Stock = 210
            }
        };

        await collection.InsertManyAsync(products);
        Console.WriteLine($"Seeded {products.Count} products successfully!");
    }
}
