using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

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

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"] ?? ""))
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Google:ClientId"] ?? "";
        options.ClientSecret = builder.Configuration["Google:ClientSecret"] ?? "";
    });

builder.Services.AddAuthorization();

// Add HttpClient
builder.Services.AddHttpClient();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

// Users API endpoints
app.MapGet("/api/users/me", async (HttpContext context, IMongoDatabase db) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var collection = db.GetCollection<User>("users");
    var user = await collection.Find(u => u.Id == userId).FirstOrDefaultAsync();
    return user is not null ? Results.Ok(user) : Results.NotFound();
})
.RequireAuthorization()
.WithName("GetCurrentUser")
.WithOpenApi();

app.MapPost("/api/auth/register", async ([FromBody] RegisterRequest request, IMongoDatabase db) =>
{
    var user = new User
    {
        Email = request.Email,
        Name = request.Name,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        CreatedAt = DateTime.UtcNow
    };

    var collection = db.GetCollection<User>("users");
    await collection.InsertOneAsync(user);

    var token = GenerateJwtToken(user, builder.Configuration);
    return Results.Ok(new { Token = token, User = user });
})
.WithName("Register")
.WithOpenApi();

app.MapPost("/api/auth/login", async ([FromBody] LoginRequest request, IMongoDatabase db) =>
{
    var collection = db.GetCollection<User>("users");
    var user = await collection.Find(u => u.Email == request.Email).FirstOrDefaultAsync();

    if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        return Results.Unauthorized();

    var token = GenerateJwtToken(user, builder.Configuration);
    return Results.Ok(new { Token = token, UserId = user.Id });
})
.WithName("Login")
.WithOpenApi();

app.MapPost("/api/auth/google", async ([FromBody] GoogleSignInRequest request, IMongoDatabase db, HttpClient httpClient) =>
{
    try
    {
        // Verify Google token
        var response = await httpClient.GetStringAsync($"https://www.googleapis.com/oauth2/v1/tokeninfo?id_token={request.IdToken}");
        using JsonDocument doc = JsonDocument.Parse(response);
        var root = doc.RootElement;

        var email = root.GetProperty("email").GetString();
        var name = root.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : email?.Split('@')[0];

        if (string.IsNullOrEmpty(email))
            return Results.BadRequest("Invalid Google token");

        var collection = db.GetCollection<User>("users");

        // Check if user exists
        var existingUser = await collection.Find(u => u.Email == email).FirstOrDefaultAsync();

        if (existingUser is null)
        {
            // Create new user from Google credentials
            var newUser = new User
            {
                Email = email,
                Name = name ?? email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random password for OAuth users
                CreatedAt = DateTime.UtcNow,
                GoogleId = request.IdToken
            };
            await collection.InsertOneAsync(newUser);
            existingUser = newUser;
        }

        var token = GenerateJwtToken(existingUser, builder.Configuration);
        return Results.Ok(new { Token = token, UserId = existingUser.Id });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { message = "Invalid Google token", error = ex.Message });
    }
})
.WithName("GoogleSignIn")
.WithOpenApi();

app.MapPut("/api/users/me", async ([FromBody] UpdateUserRequest request, HttpContext context, IMongoDatabase db) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var collection = db.GetCollection<User>("users");
    var update = Builders<User>.Update
        .Set(u => u.Name, request.Name)
        .Set(u => u.Phone, request.Phone)
        .Set(u => u.ShippingAddress, request.ShippingAddress);

    var result = await collection.UpdateOneAsync(u => u.Id == userId, update);
    return result.ModifiedCount > 0 ? Results.Ok() : Results.NotFound();
})
.RequireAuthorization()
.WithName("UpdateUser")
.WithOpenApi();

app.Run();

static string GenerateJwtToken(User user, IConfiguration configuration)
{
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"] ?? ""));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.Name)
    };

    var token = new JwtSecurityToken(
        issuer: configuration["Jwt:Issuer"],
        audience: configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddDays(7),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// Models
public record User
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public string Email { get; init; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PasswordHash { get; init; } = string.Empty;
    public string? Phone { get; set; }
    public string? GoogleId { get; set; }
    public Address? ShippingAddress { get; set; }
    public DateTime CreatedAt { get; init; }
}

public record Address
{
    public string Street { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string State { get; init; } = string.Empty;
    public string ZipCode { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
}

public record RegisterRequest
{
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public record LoginRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
public record UpdateUserRequest
{
    public string Name { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public Address? ShippingAddress { get; init; }
}

public record GoogleSignInRequest
{
    public string IdToken { get; init; } = string.Empty;
}   public Address? ShippingAddress { get; init; }
}
