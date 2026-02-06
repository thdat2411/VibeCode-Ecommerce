using Users.Models;
using Users.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Users.Endpoints;

/// <summary>
/// Extension method to register all user endpoints
/// </summary>
public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users");

        group.MapGet("/me", GetCurrentUser)
            .RequireAuthorization()
            .WithName("GetCurrentUser")
            .WithOpenApi();

        group.MapPut("/me", UpdateUser)
            .RequireAuthorization()
            .WithName("UpdateUser")
            .WithOpenApi();
    }

    private static async Task<IResult> GetCurrentUser(HttpContext context, UserService service)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var user = await service.GetUserByIdAsync(userId);
        return Results.Ok(user);
    }

    private static async Task<IResult> UpdateUser([FromBody] UpdateUserRequest request, HttpContext context, UserService service)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var user = await service.UpdateUserAsync(userId, request);
        return Results.Ok(user);
    }
}
