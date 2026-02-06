using Users.Models;
using Users.Services;
using Users.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Users.Endpoints;

/// <summary>
/// Extension method to register all auth endpoints
/// </summary>
public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app, IConfiguration configuration, HttpClient httpClient)
    {
        var group = app.MapGroup("/api/auth")
            .WithTags("Authentication");

        group.MapPost("/register", Register)
            .WithName("Register")
            .WithOpenApi();

        group.MapPost("/login", Login)
            .WithName("Login")
            .WithOpenApi();

        group.MapPost("/google", GoogleSignIn)
            .WithName("GoogleSignIn")
            .WithOpenApi();
    }

    private static async Task<IResult> Register(
        [FromBody] RegisterRequest request,
        UserService service,
        IConfiguration configuration)
    {
        var user = await service.RegisterAsync(request);
        var token = JwtTokenGenerator.GenerateToken(user, configuration);

        var response = new AuthResponse
        {
            Token = token,
            UserId = user.Id
        };

        return Results.Ok(response);
    }

    private static async Task<IResult> Login(
        [FromBody] LoginRequest request,
        UserService service,
        IConfiguration configuration)
    {
        var user = await service.LoginAsync(request);
        var token = JwtTokenGenerator.GenerateToken(user, configuration);

        var response = new AuthResponse
        {
            Token = token,
            UserId = user.Id
        };

        return Results.Ok(response);
    }

    private static async Task<IResult> GoogleSignIn(
        [FromBody] GoogleSignInRequest request,
        UserService service,
        GoogleOAuthHelper googleOAuthHelper,
        IConfiguration configuration)
    {
        try
        {
            var userInfo = await googleOAuthHelper.ValidateTokenAndGetUserInfo(request.IdToken);

            if (userInfo is null || string.IsNullOrEmpty(userInfo.Email))
                return Results.BadRequest(new { message = "Invalid Google token" });

            var user = await service.CreateOrUpdateFromGoogleAsync(
                userInfo.Email,
                userInfo.Name ?? userInfo.Email,
                request.IdToken);

            var token = JwtTokenGenerator.GenerateToken(user, configuration);

            var response = new AuthResponse
            {
                Token = token,
                UserId = user.Id
            };

            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { message = "Invalid Google token", error = ex.Message });
        }
    }
}

