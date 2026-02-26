var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add HttpClient for downstream services with timeouts
builder.Services.AddHttpClient("CatalogService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:Catalog"] ?? "http://localhost:5001");
    client.Timeout = TimeSpan.FromSeconds(5);
});
builder.Services.AddHttpClient("CartService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:Cart"] ?? "http://localhost:5002");
    client.Timeout = TimeSpan.FromSeconds(5);
});
builder.Services.AddHttpClient("OrdersService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:Orders"] ?? "http://localhost:5003");
    client.Timeout = TimeSpan.FromSeconds(5);
});
builder.Services.AddHttpClient("UsersService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:Users"] ?? "http://localhost:5004");
    client.Timeout = TimeSpan.FromSeconds(5);
});
builder.Services.AddHttpClient("PaymentsService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:Payments"] ?? "http://localhost:5005");
    client.Timeout = TimeSpan.FromSeconds(5);
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// BFF API Routes - Aggregate and orchestrate calls to microservices

app.MapGet("/api/catalog/products", async (IHttpClientFactory clientFactory) =>
{
    try
    {
        var client = clientFactory.CreateClient("CatalogService");
        var response = await client.GetAsync("/api/products");
        if (!response.IsSuccessStatusCode)
        {
            return Results.StatusCode((int)response.StatusCode);
        }
        var stream = await response.Content.ReadAsStreamAsync();
        return Results.Stream(stream, "application/json");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error fetching products: {ex.Message}");
    }
})
.WithName("GetProducts")
.WithOpenApi();

app.MapGet("/api/catalog/products/{id}", async (string id, IHttpClientFactory clientFactory) =>
{
    try
    {
        var client = clientFactory.CreateClient("CatalogService");
        var response = await client.GetAsync($"/api/products/{id}");
        if (!response.IsSuccessStatusCode)
        {
            return Results.StatusCode((int)response.StatusCode);
        }
        var stream = await response.Content.ReadAsStreamAsync();
        return Results.Stream(stream, "application/json");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error fetching product: {ex.Message}");
    }
})
.WithName("GetProduct")
.WithOpenApi();

app.MapGet("/api/catalog/collections", async (IHttpClientFactory clientFactory) =>
{
    try
    {
        var client = clientFactory.CreateClient("CatalogService");
        var response = await client.GetAsync("/api/collections");
        if (!response.IsSuccessStatusCode)
        {
            return Results.StatusCode((int)response.StatusCode);
        }
        var jsonContent = await response.Content.ReadAsStringAsync();
        return Results.Content(jsonContent, "application/json");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error fetching collections: {ex.Message}");
    }
})
.WithName("GetCollections")
.WithOpenApi();

app.MapGet("/api/catalog/collections/{slug}", async (string slug, IHttpClientFactory clientFactory) =>
{
    try
    {
        var client = clientFactory.CreateClient("CatalogService");
        var response = await client.GetAsync($"/api/collections/{slug}");
        if (!response.IsSuccessStatusCode)
        {
            return Results.StatusCode((int)response.StatusCode);
        }
        var jsonContent = await response.Content.ReadAsStringAsync();
        return Results.Content(jsonContent, "application/json");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error fetching collection: {ex.Message}");
    }
})
.WithName("GetCollection")
.WithOpenApi();

app.MapGet("/api/catalog/collections/{slug}/products", async (string slug, IHttpClientFactory clientFactory) =>
{
    try
    {
        var client = clientFactory.CreateClient("CatalogService");
        var response = await client.GetAsync($"/api/collections/{slug}/products");
        if (!response.IsSuccessStatusCode)
        {
            return Results.StatusCode((int)response.StatusCode);
        }
        var jsonContent = await response.Content.ReadAsStringAsync();
        return Results.Content(jsonContent, "application/json");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error fetching collection products: {ex.Message}");
    }
})
.WithName("GetCollectionProducts")
.WithOpenApi();

app.MapGet("/api/cart", async (HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
    var client = clientFactory.CreateClient("CartService");
    var request = new HttpRequestMessage(HttpMethod.Get, "/api/cart");
    request.Headers.Add("X-User-Id", userId);
    var response = await client.SendAsync(request);
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json", statusCode: (int)response.StatusCode);
})
.WithName("GetCart")
.WithOpenApi();

app.MapPost("/api/cart/items", async (HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
    var body = await ReadBodyAsync(context.Request);
    var client = clientFactory.CreateClient("CartService");
    var request = new HttpRequestMessage(HttpMethod.Post, "/api/cart/items");
    request.Headers.Add("X-User-Id", userId);
    request.Content = new StringContent(body, System.Text.Encoding.UTF8, "application/json");
    var response = await client.SendAsync(request);
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json", statusCode: (int)response.StatusCode);
})
.WithName("AddToCart")
.WithOpenApi();

app.MapDelete("/api/cart/items/{productId}", async (string productId, HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
    var body = await ReadBodyAsync(context.Request);
    var client = clientFactory.CreateClient("CartService");
    var request = new HttpRequestMessage(HttpMethod.Delete, $"/api/cart/items/{productId}");
    request.Headers.Add("X-User-Id", userId);
    if (!string.IsNullOrWhiteSpace(body))
        request.Content = new StringContent(body, System.Text.Encoding.UTF8, "application/json");
    var response = await client.SendAsync(request);
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json", statusCode: (int)response.StatusCode);
})
.WithName("RemoveFromCart")
.WithOpenApi();

app.MapPatch("/api/cart/items/{productId}", async (string productId, HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
    var body = await ReadBodyAsync(context.Request);
    var client = clientFactory.CreateClient("CartService");
    var request = new HttpRequestMessage(HttpMethod.Patch, $"/api/cart/items/{productId}");
    request.Headers.Add("X-User-Id", userId);
    request.Content = new StringContent(body, System.Text.Encoding.UTF8, "application/json");
    var response = await client.SendAsync(request);
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json", statusCode: (int)response.StatusCode);
})
.WithName("UpdateCartItemQuantity")
.WithOpenApi();

app.MapDelete("/api/cart", async (HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
    var client = clientFactory.CreateClient("CartService");
    var request = new HttpRequestMessage(HttpMethod.Delete, "/api/cart");
    request.Headers.Add("X-User-Id", userId);
    var response = await client.SendAsync(request);
    return response.IsSuccessStatusCode ? Results.Ok() : Results.Problem("Failed to clear cart.");
})
.WithName("ClearCart")
.WithOpenApi();

app.MapGet("/api/orders", async (IHttpClientFactory clientFactory) =>
{
    var client = clientFactory.CreateClient("OrdersService");
    var response = await client.GetAsync("/api/orders");
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("GetOrders")
.WithOpenApi();

app.MapPost("/api/orders", async (IHttpClientFactory clientFactory) =>
{
    var client = clientFactory.CreateClient("OrdersService");
    var response = await client.PostAsync("/api/orders", null);
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("CreateOrder")
.WithOpenApi();

app.MapGet("/api/users/me", async (IHttpClientFactory clientFactory) =>
{
    var client = clientFactory.CreateClient("UsersService");
    var response = await client.GetAsync("/api/users/me");
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("GetCurrentUser")
.WithOpenApi();

app.MapPost("/api/payments/checkout", async (IHttpClientFactory clientFactory) =>
{
    var client = clientFactory.CreateClient("PaymentsService");
    var response = await client.PostAsync("/api/payments/checkout", null);
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("CreateCheckoutSession")
.WithOpenApi();

app.MapPost("/api/auth/login", async (HttpRequest request, IHttpClientFactory clientFactory) =>
{
    var client = clientFactory.CreateClient("UsersService");
    var body = await ReadBodyAsync(request);
    var content = new StringContent(body, System.Text.Encoding.UTF8, new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"));
    var response = await client.PostAsync("/api/auth/login", content);
    var jsonResponse = await response.Content.ReadFromJsonAsync<object>();
    return Results.Ok(jsonResponse);
})
.WithName("Login")
.WithOpenApi();

app.MapPost("/api/auth/register", async (HttpRequest request, IHttpClientFactory clientFactory) =>
{
    var client = clientFactory.CreateClient("UsersService");
    var body = await ReadBodyAsync(request);
    var content = new StringContent(body, System.Text.Encoding.UTF8, new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"));
    var response = await client.PostAsync("/api/auth/register", content);
    var jsonResponse = await response.Content.ReadFromJsonAsync<object>();
    return Results.Ok(jsonResponse);
})
.WithName("Register")
.WithOpenApi();

app.MapPost("/api/auth/google", async (HttpRequest request, IHttpClientFactory clientFactory) =>
{
    var client = clientFactory.CreateClient("UsersService");
    var body = await ReadBodyAsync(request);
    var content = new StringContent(body, System.Text.Encoding.UTF8, new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"));
    var response = await client.PostAsync("/api/auth/google", content);
    var jsonResponse = await response.Content.ReadFromJsonAsync<object>();
    return Results.Ok(jsonResponse);
})
.WithName("GoogleSignIn")
.WithOpenApi();

// Address Management Endpoints

app.MapGet("/api/addresses", async (HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var client = clientFactory.CreateClient("UsersService");
    var request = new HttpRequestMessage(HttpMethod.Get, "/api/addresses");
    request.Headers.Add("X-User-Id", userId);

    var response = await client.SendAsync(request);
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("GetAddresses")
.WithOpenApi();

app.MapPost("/api/addresses", async (HttpRequest request, HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var client = clientFactory.CreateClient("UsersService");
    var body = await ReadBodyAsync(request);
    var content = new StringContent(body, System.Text.Encoding.UTF8, new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"));

    var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/api/addresses") { Content = content };
    httpRequest.Headers.Add("X-User-Id", userId);

    var response = await client.SendAsync(httpRequest);
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("AddAddress")
.WithOpenApi();

app.MapPut("/api/addresses/{id}", async (string id, HttpRequest request, HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var client = clientFactory.CreateClient("UsersService");
    var body = await ReadBodyAsync(request);
    var content = new StringContent(body, System.Text.Encoding.UTF8, new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"));

    var httpRequest = new HttpRequestMessage(HttpMethod.Put, $"/api/addresses/{id}") { Content = content };
    httpRequest.Headers.Add("X-User-Id", userId);

    var response = await client.SendAsync(httpRequest);
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("UpdateAddress")
.WithOpenApi();

app.MapDelete("/api/addresses/{id}", async (string id, HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var client = clientFactory.CreateClient("UsersService");
    var httpRequest = new HttpRequestMessage(HttpMethod.Delete, $"/api/addresses/{id}");
    httpRequest.Headers.Add("X-User-Id", userId);

    var response = await client.SendAsync(httpRequest);
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("DeleteAddress")
.WithOpenApi();

app.MapPut("/api/addresses/{id}/default", async (string id, HttpContext context, IHttpClientFactory clientFactory) =>
{
    var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var client = clientFactory.CreateClient("UsersService");
    var httpRequest = new HttpRequestMessage(HttpMethod.Put, $"/api/addresses/{id}/default");
    httpRequest.Headers.Add("X-User-Id", userId);

    var response = await client.SendAsync(httpRequest);
    return Results.Ok(await response.Content.ReadAsStringAsync());
})
.WithName("SetDefaultAddress")
.WithOpenApi();

app.Run();

static async Task<string> ReadBodyAsync(HttpRequest request)
{
    request.EnableBuffering();
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    request.Body.Position = 0;
    return body;
}
