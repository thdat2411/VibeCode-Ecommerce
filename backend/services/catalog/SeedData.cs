using Catalog.Data;
using Catalog.Models;

public static class SeedData
{
    // Collection definitions
    private static readonly Dictionary<string, Collection> Collections = new()
    {
        ["relaxed-fit"] = new Collection
        {
            Id = "col_relaxed_fit",
            Name = "Áo Thun Relaxed Fit",
            Slug = "relaxed-fit",
            Description = "Dòng áo thun relaxed fit với thiết kế rộng vừa phải, thoải mái khi vận động. Phù hợp cho cả nam và nữ.",
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow
        },
        ["long-sleeve"] = new Collection
        {
            Id = "col_long_sleeve",
            Name = "Áo Thun Dài Tay",
            Slug = "long-sleeve",
            Description = "Áo thun dài tay basic với thiết kế tối giản, chất liệu cotton mềm mại.",
            DisplayOrder = 2,
            CreatedAt = DateTime.UtcNow
        },
        ["ringer"] = new Collection
        {
            Id = "col_ringer",
            Name = "Áo Thun Ringer",
            Slug = "ringer",
            Description = "Áo thun Ringer phong cách retro với viền cổ và tay áo tương phản.",
            DisplayOrder = 3,
            CreatedAt = DateTime.UtcNow
        },
        ["hoodie"] = new Collection
        {
            Id = "col_hoodie",
            Name = "Áo Hoodie",
            Slug = "hoodie",
            Description = "Áo hoodie cao cấp với chất liệu nỉ dày dặn, ấm áp.",
            DisplayOrder = 4,
            CreatedAt = DateTime.UtcNow
        },
        ["sweater"] = new Collection
        {
            Id = "col_sweater",
            Name = "Áo Sweater",
            Slug = "sweater",
            Description = "Áo sweater với thiết kế đa dạng, phù hợp mọi phong cách.",
            DisplayOrder = 5,
            CreatedAt = DateTime.UtcNow
        },
        ["jogger"] = new Collection
        {
            Id = "col_jogger",
            Name = "Quần Jogger & Ống Suông",
            Slug = "jogger",
            Description = "Quần jogger và ống suông thoải mái cho mọi hoạt động.",
            DisplayOrder = 6,
            CreatedAt = DateTime.UtcNow
        },
        ["soft-routine"] = new Collection
        {
            Id = "col_soft_routine",
            Name = "Soft Routine",
            Slug = "soft-routine",
            Description = "Bộ đồ thoải mái cho những phút giây thư giãn tại nhà.",
            DisplayOrder = 7,
            CreatedAt = DateTime.UtcNow
        }
    };

    public static async Task SeedCollections(CatalogDbContext context)
    {
        // Check if already seeded
        if (context.Collections.Any())
        {
            Console.WriteLine("Database already contains collections. Skipping seed.");
            return;
        }

        context.Collections.AddRange(Collections.Values);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {Collections.Count} collections successfully!");
    }

    public static async Task SeedProducts(CatalogDbContext context)
    {
        // Check if already seeded
        if (context.Products.Any())
        {
            Console.WriteLine("Database already contains products. Skipping seed.");
            return;
        }

        var products = new List<Product>
        {
            // Relaxed Fit T-Shirts
            new Product
            {
                Name = "Áo Thun Relaxed Fit Summer Vibes Sea Life",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt, hạn chế bai nhão qua nhiều lần giặt. Hình in công nghệ digital sắc nét.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_e7c5307f-2bf8-4eae-a0bd-b0f77eef8627.png?v=1745290002&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Đen", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_e7c5307f-2bf8-4eae-a0bd-b0f77eef8627.png?v=1745290002&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_2cc8d228-048c-4a3e-8f31-9e943047ae8a.png?v=1745290002&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_4c892e57-cce5-488d-9f53-f5c304caa9e1.png?v=1745290002&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_a64900a0-6633-44ac-af3b-fcd1382c529d.png?v=1745290002&width=800"
                        }
                    }
                },
                TotalStock = 200,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Lady Cat",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt. Hình in công nghệ digital sắc nét.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/dentr_c_fb8b458d-f7f5-47e8-8be5-0cf5823929ce.png?v=1744098451&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen", "Trắng", "Kem", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_fb8b458d-f7f5-47e8-8be5-0cf5823929ce.png?v=1744098451&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_1db7056a-7ca9-489c-b63d-8d08e8a6d127.png?v=1744098451&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_0e56ce6a-9195-4848-acd6-4651f06e0b09.png?v=1744098451&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_7a2e125e-daac-4490-aa17-17ff4fcea739.png?v=1744098451&width=800"
                        }
                    }
                },
                TotalStock = 180,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Muse Cat",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động. Cổ áo bo dày dặn, giữ phom tốt. Hình in công nghệ digital sắc nét.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/dentr_c_fb8b458d-f7f5-47e8-8be5-0cf5823929ce.png?v=1744098451&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen", "Trắng", "Kem", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_fb8b458d-f7f5-47e8-8be5-0cf5823929ce.png?v=1744098451&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_1db7056a-7ca9-489c-b63d-8d08e8a6d127.png?v=1744098451&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_0e56ce6a-9195-4848-acd6-4651f06e0b09.png?v=1744098451&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_7a2e125e-daac-4490-aa17-17ff4fcea739.png?v=1744098451&width=800"
                        }
                    }
                },
                TotalStock = 220,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Le Croissant",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động. Cổ áo bo dày dặn, giữ phom tốt. Hình in công nghệ digital sắc nét. Đường may tinh gọn, hoàn thiện kỹ lưỡng.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_e9a3e4b9-ddb7-47ea-b8ea-c556aefed87f.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Navy", "Đen" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_e9a3e4b9-ddb7-47ea-b8ea-c556aefed87f.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_258b7c4b-bf27-48bc-8dc3-6051dc217bf0.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_7db63c51-b06e-4a22-9ac6-aa12255e4b41.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_dd91470d-147c-4088-8885-4e0d7488ebd2.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 190,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Summer Lemon Cello",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt, hạn chế bai nhão qua nhiều lần giặt. Hình in công nghệ digital sắc nét. Đường may tinh gọn, hoàn thiện kỹ lưỡng.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngsau_42339254-c989-46c8-bb0a-4b70ad8e0306.png?v=1744789641&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Đen", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngsau_42339254-c989-46c8-bb0a-4b70ad8e0306.png?v=1744789641&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemsau_81fbfc90-d084-40a3-aa6c-52f10c3f79d0.png?v=1744789536&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/densau_c237391d-67fb-4401-a94b-f9bc394efa45.png?v=1744789641&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navysau_b073a174-a28b-4e65-a4d4-314f44edaa67.png?v=1744789641&width=800"
                        }
                    }
                },
                TotalStock = 200,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Leopard Dachshund",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt, hạn chế bai nhão qua nhiều lần giặt. Hình in công nghệ digital sắc nét. Đường may tinh gọn, hoàn thiện kỹ lưỡng.",
                Price = 159000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_1d844fe3-dde0-441b-b366-9e684d1e4967.png?v=1745832992&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Đen", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_1d844fe3-dde0-441b-b366-9e684d1e4967.png?v=1745832992&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_b3c39ac1-abaa-44e3-b293-450419bc9f29.png?v=1745832992&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_6d2e518a-928a-49b5-a151-1ea457fcdcef.png?v=1745832992&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_ffd843cb-4206-4565-927b-fde1df133708.png?v=1745832992&width=800"
                        }
                    }
                },
                TotalStock = 210,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit No Time For A Break",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt, hạn chế bai nhão qua nhiều lần giặt. Hình in công nghệ digital sắc nét. Đường may tinh gọn, hoàn thiện kỹ lưỡng.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngsau_b50bb887-e686-48fc-ad84-2b35d6834a52.png?v=1744447518&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Đen", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngsau_b50bb887-e686-48fc-ad84-2b35d6834a52.png?v=1744447518&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemsau_b4231fb7-d351-40a3-ba42-7e28ad800708.png?v=1744447518&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/densau_a3e2e8c8-6f9a-482e-b46c-6b149cb4fedc.png?v=1744169422&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navysau_13183d15-dfbd-487b-b8fd-1ef0c822442f.png?v=1744447518&width=800"
                        }
                    }
                },
                TotalStock = 205,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Vitamin Meow",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt, hạn chế bai nhão qua nhiều lần giặt. Hình in công nghệ digital sắc nét. Đường may tinh gọn, hoàn thiện kỹ lưỡng.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_22e0d286-ec58-46d0-ab48-b516bc0e07ac.png?v=1745294215&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Đen", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_22e0d286-ec58-46d0-ab48-b516bc0e07ac.png?v=1745294215&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_bf43da55-6549-4984-87f8-441733ef5474.png?v=1745294215&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_a5116526-380c-4569-8e1c-9691fd529311.png?v=1745294215&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_cbd84088-76fd-41e6-a3a5-7991365fb5e0.png?v=1745294215&width=800"
                        }
                    }
                },
                TotalStock = 210,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit SAINT LATENT",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt, hạn chế bai nhão qua nhiều lần giặt. Hình in công nghệ digital sắc nét. Đường may tinh gọn, hoàn thiện kỹ lưỡng.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_9ceddfd4-ca1c-4dc1-b641-194c1b0698a9.png?v=1764411606&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Đen", "Kem", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_9ceddfd4-ca1c-4dc1-b641-194c1b0698a9.png?v=1764411606&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_86025100-e5cf-4fd8-a1c7-ce70b6da5e3a.png?v=1764412698&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_46b70c08-66ef-4e92-b971-39b96c5e7628.png?v=1764412698&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_1be05b8c-5c84-4aef-b420-efdd2c1cf88f.png?v=1764412698&width=800"
                        }
                    }
                },
                TotalStock = 200,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Dream",
                Description = "Form Relaxed Fit với thiết kế rộng vừa phải, thoải mái khi vận động, phù hợp cho cả nam và nữ. Cổ áo bo dày dặn, giữ phom tốt, hạn chế bai nhão qua nhiều lần giặt. Hình in công nghệ digital sắc nét. Đường may tinh gọn, hoàn thiện kỹ lưỡng.",
                Price = 318000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_f4e4631d-9e26-459b-b7aa-98ca89e41a4a.png?v=1744442438&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Đen", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_f4e4631d-9e26-459b-b7aa-98ca89e41a4a.png?v=1744442438&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_4ade0e86-8fc2-49de-81c0-0c662fe75b99.png?v=1744442438&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_a12ba44f-12b5-4254-b873-e3dc89386ad3.png?v=1744442438&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/navytr_c_bc263562-3f46-4003-a6b7-021a3f22d641.png?v=1744442438&width=800"
                        }
                    }
                },
                TotalStock = 205,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Basic White",
                Description = "Form Relaxed Fit màu trắng tinh khôi. Thiết kế đơn giản, mặc với bất kỳ bộ đồ nào. Chất liệu cotton 100% mềm mại.",
                Price = 159000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_basic_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/tr_ngtr_c_basic_white.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 250,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Relaxed Fit Basic Black",
                Description = "Form Relaxed Fit màu đen kinh điển. Thiết kế đơn giản, dễ kết hợp với nhiều phong cách. Chất liệu cotton 100%.",
                Price = 159000m,
                CollectionId = Collections["relaxed-fit"].Id,
                CollectionSlug = Collections["relaxed-fit"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/dentr_c_basic_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_basic_black.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 240,
                CreatedAt = DateTime.UtcNow
            },

            // Long Sleeve T-Shirts
            new Product
            {
                Name = "Áo Thun Dài Tay Basic White",
                Description = "Áo thun dài tay basic màu trắng. Thiết kế đơn giản, phù hợp cho mọi mùa. Chất liệu cotton 100% mềm mại.",
                Price = 298000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/longsleeve_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/longsleeve_white.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 150,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Basic Black",
                Description = "Áo thun dài tay basic màu đen. Thiết kế tối giản, dễ kết hợp. Chất liệu cotton thoáng khí.",
                Price = 298000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/longsleeve_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/longsleeve_black.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 140,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Luxury Dachshund",
                Description = "Áo thun dài tay với thiết kế luxury dachshund độc đáo. Chất liệu cotton cao cấp, in công nghệ digital sắc nét.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/kemtr_c_a4fa833b-056c-48e5-bc8b-16d271e09ff7.png?v=1766043538&width=100",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Kem", "Trắng", "Đen", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/kemtr_c_a4fa833b-056c-48e5-bc8b-16d271e09ff7.png?v=1766043538&width=800",
                            "https://theneworiginals.co/cdn/shop/files/kemtay_e0157d17-0ed6-41e1-8ce3-5d5bc26a2f51.png?v=1766043538&width=800",
                            "https://theneworiginals.co/cdn/shop/files/kemc_n1_f4b2f189-1027-42b7-9771-0c7f06c762c4.png?v=1766043538&width=800",
                            "https://theneworiginals.co/cdn/shop/files/kemsau_7e91bf78-98c7-4afa-93c7-0d5b85057ec0.png?v=1766043538&width=800"

                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dauchshund_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dentr_c_32b3cd30-10de-4041-bf70-6e35eed69726.png?v=1766043538&width=800",
                            "https://theneworiginals.co/cdn/shop/files/dentay_845575fa-10eb-4bdb-9a1c-d9a1ff60a8d2.png?v=1766043538&width=800",
                            "https://theneworiginals.co/cdn/shop/files/denc_n1_4ae04801-7aa7-4f47-a0a4-c131c912f00a.png?v=1766043538&width=800",
                            "https://theneworiginals.co/cdn/shop/files/densau_5de5139d-ea13-4427-bf67-3e6b7c2dadea.png?v=1766043538&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dauchshund_navy.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 180,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Saint Latent",
                Description = "Áo thun dài tay với thiết kế Saint Latent sang trọng. Chất liệu cotton premium, in sắc nét.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/saint_latent_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Đen", "Kem", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/saint_latent_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/saint_latent_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/saint_latent_cream.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/saint_latent_navy.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 160,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Ranch Prestige",
                Description = "Áo thun dài tay với thiết kế Ranch Prestige. Chất liệu cotton cao cấp, kiểu dáng trẻ trung.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/ranch_prestige_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen", "Navy", "Kem", "Trắng" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/ranch_prestige_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/ranch_prestige_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/ranch_prestige_cream.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/ranch_prestige_white.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 175,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Cat Line Up",
                Description = "Áo thun dài tay với thiết kế Cat Line Up vui nhộn. Chất liệu cotton mềm mại, in công nghệ digital.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/cat_lineup_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Navy", "Kem" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/cat_lineup_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/cat_lineup_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/cat_lineup_cream.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 150,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Cute Three Cat Vitamin Meow",
                Description = "Áo thun dài tay với thiết kế Cute Three Cat Vitamin Meow dễ thương. Chất liệu cotton mềm mại, in sắc nét.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/cute_cat_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen", "Trắng", "Navy", "Kem" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/cute_cat_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/cute_cat_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/cute_cat_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/cute_cat_cream.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 170,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Under the Wave off Kanagawa",
                Description = "Áo thun dài tay với thiết kế Under the Wave off Kanagawa inspirational. Chất liệu cotton cao cấp, in công nghệ digital.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/wave_kanagawa_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem", "Navy", "Đen" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/wave_kanagawa_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/wave_kanagawa_cream.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/wave_kanagawa_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/wave_kanagawa_black.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 155,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Sweet Pastry Coffee Time",
                Description = "Áo thun dài tay với thiết kế Sweet Pastry Coffee Time thư giãn. Chất liệu cotton mềm mại.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/sweet_pastry_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Kem" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweet_pastry_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweet_pastry_cream.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 140,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Don't Touch Me",
                Description = "Áo thun dài tay với thiết kế Don't Touch Me độc lập. Chất liệu cotton cao cấp, in sắc nét.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/dont_touch_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen", "Trắng", "Navy", "Kem" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dont_touch_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dont_touch_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dont_touch_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/dont_touch_cream.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 165,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Sweet Like A Lady",
                Description = "Áo thun dài tay với thiết kế Sweet Like A Lady nữ tính. Chất liệu cotton mềm mại, in công nghệ digital.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/sweet_lady_cream.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Kem", "Trắng", "Navy", "Đen" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweet_lady_cream.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweet_lady_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweet_lady_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweet_lady_black.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 160,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Original Milk",
                Description = "Áo thun dài tay với thiết kế Original Milk tinh tế. Chất liệu cotton cao cấp, in sắc nét.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/original_milk_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng", "Đen", "Kem", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/original_milk_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/original_milk_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/original_milk_cream.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/original_milk_navy.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 175,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay More Espresso",
                Description = "Áo thun dài tay với thiết kế More Espresso năng động. Chất liệu cotton mềm mại, in công nghệ digital.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/more_espresso_navy.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Navy", "Đen", "Kem", "Trắng" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/more_espresso_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/more_espresso_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/more_espresso_cream.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/more_espresso_white.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 168,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Áo Thun Dài Tay Animal Barbie Puppy",
                Description = "Áo thun dài tay với thiết kế Animal Barbie Puppy vui tươi. Chất liệu cotton cao cấp, in sắc nét.",
                Price = 189000m,
                CollectionId = Collections["long-sleeve"].Id,
                CollectionSlug = Collections["long-sleeve"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/animal_barbie_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen", "Kem", "Navy", "Trắng" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/animal_barbie_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Kem",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/animal_barbie_cream.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/animal_barbie_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/animal_barbie_white.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 170,
                CreatedAt = DateTime.UtcNow
            },

            // Ringer T-Shirts
            new Product
            {
                Name = "Áo Thun Ringer Classic",
                Description = "Áo thun Ringer phong cách retro với viền cổ và tay áo tương phản. Thiết kế cổ điển, dễ mặc.",
                Price = 278000m,
                CollectionId = Collections["ringer"].Id,
                CollectionSlug = Collections["ringer"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/ringer_classic.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Trắng/Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng/Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/ringer_classic.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 120,
                CreatedAt = DateTime.UtcNow
            },

            // Hoodies
            new Product
            {
                Name = "Áo Hoodie Classic",
                Description = "Áo hoodie cao cấp với chất liệu nỉ dày dặn, ấm áp. Thiết kế đơn giản, phù hợp mọi phong cách.",
                Price = 598000m,
                CollectionId = Collections["hoodie"].Id,
                CollectionSlug = Collections["hoodie"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/hoodie_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Đen", "Trắng", "Navy" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Đen",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/hoodie_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Trắng",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/hoodie_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/hoodie_navy.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 80,
                CreatedAt = DateTime.UtcNow
            },

            // Sweaters
            new Product
            {
                Name = "Áo Sweater Knit",
                Description = "Áo sweater dệt với thiết kế tối giản. Chất liệu cotton pha acrylic ấm áp, phù hợp cho mùa lạnh.",
                Price = 498000m,
                CollectionId = Collections["sweater"].Id,
                CollectionSlug = Collections["sweater"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/sweater_navy.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Navy", "Black" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Navy",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweater_navy.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Black",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/sweater_black.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 90,
                CreatedAt = DateTime.UtcNow
            },

            // Joggers
            new Product
            {
                Name = "Quần Jogger Comfort",
                Description = "Quần jogger thoải mái với thiết kế co giãn. Phù hợp cho hoạt động thể thao hoặc mặc hàng ngày.",
                Price = 448000m,
                CollectionId = Collections["jogger"].Id,
                CollectionSlug = Collections["jogger"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/jogger_black.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "Black", "Grey" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Black",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/jogger_black.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Grey",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/jogger_grey.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 110,
                CreatedAt = DateTime.UtcNow
            },

            // Soft Routine
            new Product
            {
                Name = "Bộ Soft Routine Tee & Short",
                Description = "Bộ đồ thoải mái gồm áo thun và short. Chất liệu mềm mại, phù hợp để thư giãn tại nhà.",
                Price = 698000m,
                CollectionId = Collections["soft-routine"].Id,
                CollectionSlug = Collections["soft-routine"].Slug,
                ThumbnailImage = "https://theneworiginals.co/cdn/shop/files/soft_routine_white.png?v=1754881727&width=800",
                VariantOptions = new[]
                {
                    new VariantOption { Name = "Size", Values = new[] { "XS", "S", "M", "L", "XL", "XXL" } },
                    new VariantOption { Name = "Color", Values = new[] { "White", "Grey" } }
                },
                VariantImages = new[]
                {
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "White",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/soft_routine_white.png?v=1754881727&width=800"
                        }
                    },
                    new VariantImage
                    {
                        VariantType = "Color",
                        VariantValue = "Grey",
                        Images = new[]
                        {
                            "https://theneworiginals.co/cdn/shop/files/soft_routine_grey.png?v=1754881727&width=800"
                        }
                    }
                },
                TotalStock = 65,
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {products.Count} products successfully!");
    }

    public static async Task SeedProductSkus(CatalogDbContext context)
    {
        // Check if already seeded
        if (context.ProductSkus.Any())
        {
            Console.WriteLine("Database already contains product SKUs. Skipping seed.");
            return;
        }

        var skus = new List<ProductSku>();

        // Get all products that were just seeded
        var products = context.Products.ToList();

        foreach (var product in products)
        {
            // Generate all variant combinations (Cartesian product)
            var variantCombinations = GenerateVariantCombinations(product.VariantOptions);

            // Distribute TotalStock evenly across all SKUs
            var skuCount = variantCombinations.Count;
            var baseStock = product.TotalStock / skuCount;
            var remainder = product.TotalStock % skuCount;

            for (int i = 0; i < variantCombinations.Count; i++)
            {
                var variantValues = variantCombinations[i];
                var stock = baseStock + (i < remainder ? 1 : 0); // Distribute remainder

                var sku = new ProductSku
                {
                    Id = Guid.NewGuid().ToString(),
                    ProductId = product.Id,
                    SkuCode = GenerateSkuCode(product.Name, variantValues),
                    VariantValues = variantValues,
                    Stock = stock,
                    IsActive = product.IsActive,
                    PriceOverride = null // All SKUs use product base price unless overridden
                };

                skus.Add(sku);
            }
        }

        context.ProductSkus.AddRange(skus);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {skus.Count} product SKUs successfully!");
    }

    /// <summary>
    /// Generate all possible variant combinations (Cartesian product of all variant values).
    /// </summary>
    private static List<Dictionary<string, string>> GenerateVariantCombinations(VariantOption[] variantOptions)
    {
        if (variantOptions == null || variantOptions.Length == 0)
            return new List<Dictionary<string, string>> { new() };

        var combinations = new List<Dictionary<string, string>>();

        // Start with all possible values for the first option
        var currentCombos = variantOptions[0].Values
            .Select(v => new Dictionary<string, string> { { variantOptions[0].Name, v } })
            .ToList();

        // For each remaining option, create Cartesian product
        for (int i = 1; i < variantOptions.Length; i++)
        {
            var newCombos = new List<Dictionary<string, string>>();
            var optionName = variantOptions[i].Name;
            var optionValues = variantOptions[i].Values;

            foreach (var combo in currentCombos)
            {
                foreach (var value in optionValues)
                {
                    var newCombo = new Dictionary<string, string>(combo)
                    {
                        { optionName, value }
                    };
                    newCombos.Add(newCombo);
                }
            }

            currentCombos = newCombos;
        }

        return currentCombos;
    }

    /// <summary>
    /// Generate a human-readable SKU code from product name and variant values.
    /// Example: "Classic White M" from "Classic T-Shirt" + {Color: White, Size: M}
    /// </summary>
    private static string GenerateSkuCode(string productName, Dictionary<string, string> variantValues)
    {
        // Extract first few letters from product name
        var namePrefix = string.Concat(productName.Split().Take(2)).ToUpper().Substring(0, Math.Min(3, productName.Length));

        // Combine variant values in order (Color, Size, etc.)
        var variantParts = variantValues.OrderBy(kv => kv.Key).Select(kv => kv.Value.Substring(0, 1).ToUpper()).ToList();

        return $"{namePrefix}-{string.Join("-", variantParts)}";
    }
}
