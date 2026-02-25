using Catalog.Data;
using Catalog.Endpoints;
using Catalog.Extensions;
using Shared.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JSON serialization to use camelCase for API responses
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.SerializerOptions.WriteIndented = false;
});

// Also configure the default Json serializer for consistency
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.SerializerOptions.WriteIndented = false;
});

// Add catalog services (includes DbContext and repositories)
builder.Services.AddCatalogServices(builder.Configuration);

var app = builder.Build();

// Apply migrations and seed database
await app.MigrateAndSeedDatabaseAsync();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use global exception handler
app.UseGlobalExceptionHandler();

// Map endpoints
app.MapCatalogEndpoints();
app.MapCollectionEndpoints();

app.Run();
