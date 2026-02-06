namespace Users.Models;

public record User
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public string Email { get; init; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PasswordHash { get; init; } = string.Empty;
    public string? Phone { get; set; }
    public string? GoogleId { get; set; }
    public Address? ShippingAddress { get; set; }
    public List<AddressData> Addresses { get; set; } = new();
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

public class AddressData
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string Street { get; set; } = string.Empty;
    public string? Ward { get; set; }
    public string District { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
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
}

public record UserResponse
{
    public string Id { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public Address? ShippingAddress { get; init; }
}

public record AuthResponse
{
    public string Token { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
}
