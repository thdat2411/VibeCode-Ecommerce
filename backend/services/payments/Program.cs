using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

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

        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            // Handle successful payment - update order status, send confirmation email, etc.
            Console.WriteLine($"Payment successful for order: {session?.Metadata["order_id"]}");
        }
        else if (stripeEvent.Type == EventTypes.CheckoutSessionAsyncPaymentFailed)
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

// ── MoMo Payment ──────────────────────────────────────────────────────────────

app.MapPost("/api/payments/momo/create", async (
    [FromBody] MomoCreateRequest request,
    IConfiguration config,
    IHttpClientFactory httpClientFactory) =>
{
    var partnerCode = config["MoMo:PartnerCode"] ?? "MOMO";
    var accessKey = config["MoMo:AccessKey"] ?? "";
    var secretKey = config["MoMo:SecretKey"] ?? "";
    var apiEndpoint = config["MoMo:ApiEndpoint"] ?? "https://test-payment.momo.vn/v2/gateway/api/create";
    var redirectUrl = config["MoMo:RedirectUrl"] ?? "http://localhost:3000/checkout/result";
    var ipnUrl = config["MoMo:IpnUrl"] ?? "http://localhost:5005/api/payments/momo/ipn";

    var requestId = $"{partnerCode}{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
    var orderId = request.OrderId;
    var orderInfo = "Thanh toán đơn hàng The New Originals";
    var amount = request.Amount.ToString();
    var extraData = "";
    var requestType = "captureWallet";

    // HMAC-SHA256 signature (fields sorted a-z)
    var rawHash = $"accessKey={accessKey}&amount={amount}&extraData={extraData}" +
                  $"&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}" +
                  $"&partnerCode={partnerCode}&redirectUrl={redirectUrl}" +
                  $"&requestId={requestId}&requestType={requestType}";

    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
    var signatureBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawHash));
    var signature = BitConverter.ToString(signatureBytes).Replace("-", "").ToLower();

    var payload = new
    {
        partnerCode,
        accessKey,
        requestId,
        amount = request.Amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang = "vi"
    };

    var client = httpClientFactory.CreateClient();
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

    var jsonContent = new StringContent(
        JsonSerializer.Serialize(payload),
        Encoding.UTF8,
        "application/json"
    );

    var momoResponse = await client.PostAsync(apiEndpoint, jsonContent);
    var momoBody = await momoResponse.Content.ReadAsStringAsync();

    using var doc = JsonDocument.Parse(momoBody);
    var root = doc.RootElement;

    if (root.TryGetProperty("resultCode", out var rc) && rc.GetInt32() == 0)
    {
        var payUrl = root.GetProperty("payUrl").GetString();
        return Results.Ok(new { payUrl, requestId, orderId });
    }

    var errMsg = root.TryGetProperty("message", out var msg) ? msg.GetString() : "MoMo error";
    return Results.BadRequest(new { error = errMsg, raw = momoBody });
})
.WithName("CreateMomoPayment")
.WithOpenApi();

app.MapPost("/api/payments/momo/ipn", async (HttpRequest request) =>
{
    // IPN callback from MoMo — verify signature, update order status
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    Console.WriteLine($"[MoMo IPN] {body}");
    // TODO: verify HMAC signature and update order status in Orders service
    return Results.Ok();
})
.WithName("MomoIpn")
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

public record MomoCreateRequest
{
    public string OrderId { get; init; } = string.Empty;
    public long Amount { get; init; }
}
