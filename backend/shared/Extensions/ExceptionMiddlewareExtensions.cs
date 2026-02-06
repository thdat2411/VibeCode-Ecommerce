using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Shared.Exceptions;
using System.Text.Json;
using ApplicationException = Shared.Exceptions.ApplicationException;

namespace Shared.Extensions;

/// <summary>
/// Extension methods for error handling middleware
/// </summary>
public static class ExceptionMiddlewareExtensions
{
    public static void UseGlobalExceptionHandler(this WebApplication app)
    {
        app.UseExceptionHandler(exceptionHandlerApp =>
        {
            exceptionHandlerApp.Run(async context =>
            {
                context.Response.ContentType = "application/json";

                var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                var exception = exceptionHandlerPathFeature?.Error;

                var response = new ErrorResponse
                {
                    Message = exception?.Message ?? "An unexpected error occurred.",
                    Code = "INTERNAL_SERVER_ERROR",
                    Timestamp = DateTime.UtcNow
                };

                int statusCode = StatusCodes.Status500InternalServerError;

                if (exception is ApplicationException appEx)
                {
                    response.Code = appEx.Code;
                    statusCode = appEx.StatusCode;

                    if (exception is ValidationException validationEx && validationEx.Errors.Count > 0)
                    {
                        response.Errors = validationEx.Errors;
                    }
                }

                context.Response.StatusCode = statusCode;
                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            });
        });
    }
}

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public Dictionary<string, string[]>? Errors { get; set; }
}
