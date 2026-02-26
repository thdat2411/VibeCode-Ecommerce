using Users.Models;
using Users.Repositories;
using Users.Utils;
using Shared.Exceptions;

namespace Users.Services;

/// <summary>
/// Business logic service for user operations
/// </summary>
public class UserService
{
    private readonly IUserRepository _repository;
    private readonly IConfiguration _configuration;
    private readonly GoogleOAuthHelper _googleOAuthHelper;

    public UserService(
        IUserRepository repository,
        IConfiguration configuration,
        GoogleOAuthHelper googleOAuthHelper)
    {
        _repository = repository;
        _configuration = configuration;
        _googleOAuthHelper = googleOAuthHelper;
    }

    public async Task<User> GetUserByIdAsync(string id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user is null)
            throw new NotFoundException("User", id);

        return user;
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        ValidateEmail(email);
        var user = await _repository.GetByEmailAsync(email);
        if (user is null)
            throw new NotFoundException("User with email", email);

        return user;
    }

    public async Task<User> RegisterAsync(RegisterRequest request)
    {
        ValidateRegisterRequest(request);

        // Check if user already exists
        var existingUser = await _repository.GetByEmailAsync(request.Email);
        if (existingUser is not null)
            throw new ConflictException("User", "email", request.Email);

        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        return await _repository.CreateAsync(user);
    }

    public async Task<User> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ValidationException("Email and password are required.");

        var user = await _repository.GetByEmailAsync(request.Email);
        if (user is null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid email or password.");

        return user;
    }

    public async Task<User> GoogleSignInAsync(string idToken)
    {
        if (string.IsNullOrWhiteSpace(idToken))
            throw new ValidationException("ID token is required.");

        var user = await _repository.GetByGoogleIdAsync(idToken);
        return user ?? throw new NotFoundException("User with Google ID", idToken);
    }

    public async Task<User> CreateOrUpdateFromGoogleAsync(string email, string name, string idToken)
    {
        ValidateEmail(email);

        if (string.IsNullOrWhiteSpace(name))
            name = email.Split('@')[0];

        var existingUser = await _repository.GetByEmailAsync(email);

        if (existingUser is null)
        {
            var newUser = new User
            {
                Email = email,
                Name = name,
                PasswordHash = PasswordHasher.HashPassword(Guid.NewGuid().ToString()),
                GoogleId = idToken,
                CreatedAt = DateTime.UtcNow
            };
            return await _repository.CreateAsync(newUser);
        }

        if (existingUser.GoogleId != idToken)
        {
            existingUser.GoogleId = idToken;
            await _repository.UpdateAsync(existingUser.Id, existingUser);
            return existingUser;
        }

        return existingUser;
    }

    public async Task<User> UpdateUserAsync(string id, UpdateUserRequest request)
    {
        var user = await GetUserByIdAsync(id);

        user.Name = request.Name ?? user.Name;
        user.Phone = request.Phone ?? user.Phone;
        user.ShippingAddress = request.ShippingAddress ?? user.ShippingAddress;

        await _repository.UpdateAsync(id, user);
        return user;
    }

    private void ValidateRegisterRequest(RegisterRequest request)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Email))
            errors["Email"] = new[] { "Email is required." };
        else if (!request.Email.Contains("@"))
            errors["Email"] = new[] { "Invalid email format." };

        if (string.IsNullOrWhiteSpace(request.Name))
            errors["Name"] = new[] { "Name is required." };

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            errors["Password"] = new[] { "Password must be at least 6 characters." };

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }

    private void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
            throw new ValidationException("Invalid email format.");
    }
}
