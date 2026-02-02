using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Stripe configuration
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Payments API endpoints
app.MapPost("/api/payments/checkout", async ([FromBody] CreateCheckoutRequest request) =>
{
    var options = new SessionCreateOptions
    {
        PaymentMethodTypes = new List<string> { "card" },
        LineItems = request.Items.Select(item => new SessionLineItemOptions
        {
            PriceData = new SessionLineItemPriceDataOptions
            {
                Currency = "usd",
                ProductData = new SessionLineItemPriceDataProductDataOptions
                {
                    Name = item.Name,
                },
                UnitAmount = (long)(item.Price * 100),
            },
            Quantity = item.Quantity,
        }).ToList(),
        Mode = "payment",
        SuccessUrl = request.SuccessUrl,
        CancelUrl = request.CancelUrl,
        Metadata = new Dictionary<string, string>
        {
            { "order_id", request.OrderId }
        }
    };
    
    var service = new SessionService();
    var session = await service.CreateAsync(options);
    
    return Results.Ok(new { SessionId = session.Id, Url = session.Url });
})
.WithName("CreateCheckoutSession")
.WithOpenApi();

app.MapPost("/api/payments/webhook", async (HttpRequest request) =>
{
    var json = await new StreamReader(request.Body).ReadToEndAsync();
    
    try
    {
        var stripeEvent = EventUtility.ConstructEvent(
            json,
            request.Headers["Stripe-Signature"],
            builder.Configuration["Stripe:WebhookSecret"]
        );
        
        if (stripeEvent.Type == Events.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            // Handle successful payment - update order status, send confirmation email, etc.
            Console.WriteLine($"Payment successful for order: {session?.Metadata["order_id"]}");
        }
        else if (stripeEvent.Type == Events.CheckoutSessionAsyncPaymentFailed)
        {
            var session = stripeEvent.Data.Object as Session;
            // Handle failed payment
            Console.WriteLine($"Payment failed for order: {session?.Metadata["order_id"]}");
        }
        
        return Results.Ok();
    }
    catch (StripeException)
    {
        return Results.BadRequest();
    }
})
.WithName("StripeWebhook")
.WithOpenApi();

app.MapGet("/api/payments/session/{sessionId}", async (string sessionId) =>
{
    var service = new SessionService();
    var session = await service.GetAsync(sessionId);
    return Results.Ok(session);
})
.WithName("GetCheckoutSession")
.WithOpenApi();

app.Run();

// Models
public record CreateCheckoutRequest
{
    public string OrderId { get; init; } = string.Empty;
    public CheckoutItem[] Items { get; init; } = Array.Empty<CheckoutItem>();
    public string SuccessUrl { get; init; } = string.Empty;
    public string CancelUrl { get; init; } = string.Empty;
}

public record CheckoutItem
{
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
}
