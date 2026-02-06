using Users.Models;
using Users.Services;
using Microsoft.AspNetCore.Mvc;

namespace Users.Endpoints;

/// <summary>
/// Extension method to register all address endpoints
/// </summary>
public static class AddressEndpoints
{
    public static void MapAddressEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/addresses")
            .WithTags("Addresses");

        group.MapGet("/", GetAddresses)
            .WithName("GetAddresses")
            .WithOpenApi();

        group.MapPost("/", AddAddress)
            .WithName("AddAddress")
            .WithOpenApi();

        group.MapPut("/{id}", UpdateAddress)
            .WithName("UpdateAddress")
            .WithOpenApi();

        group.MapDelete("/{id}", DeleteAddress)
            .WithName("DeleteAddress")
            .WithOpenApi();

        group.MapPut("/{id}/default", SetDefaultAddress)
            .WithName("SetDefaultAddress")
            .WithOpenApi();
    }

    private static async Task<IResult> GetAddresses(HttpContext context, AddressService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var addresses = await service.GetAddressesAsync(userId);
        return Results.Ok(addresses);
    }

    private static async Task<IResult> AddAddress([FromBody] AddressData request, HttpContext context, AddressService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var address = await service.AddAddressAsync(userId, request);
        return Results.Ok(address);
    }

    private static async Task<IResult> UpdateAddress(string id, [FromBody] AddressData request, HttpContext context, AddressService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var address = await service.UpdateAddressAsync(userId, id, request);
        return Results.Ok(address);
    }

    private static async Task<IResult> DeleteAddress(string id, HttpContext context, AddressService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        await service.DeleteAddressAsync(userId, id);
        return Results.Ok();
    }

    private static async Task<IResult> SetDefaultAddress(string id, HttpContext context, AddressService service)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var address = await service.SetDefaultAddressAsync(userId, id);
        return Results.Ok(address);
    }
}
