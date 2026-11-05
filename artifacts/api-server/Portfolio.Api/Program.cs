using System.Threading.RateLimiting;
using System.Text.Json;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Api;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole(options => options.SingleLine = true);
builder.Logging.SetMinimumLevel(LogLevel.Warning);
builder.Logging.AddFilter("System.Net.Http.HttpClient", LogLevel.None);
builder.Logging.AddFilter("Microsoft.AspNetCore.Diagnostics", LogLevel.None);
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 8192);

var port = builder.Configuration["PORT"];
if (port is not null)
{
    if (!int.TryParse(port, out var parsedPort) || parsedPort is < 1 or > 65535)
        throw new InvalidOperationException("PORT must be a valid port number.");
    builder.WebHost.UseUrls($"http://0.0.0.0:{parsedPort}");
}

builder.Services.AddSingleton(EvidenceCatalog.Load());
builder.Services.AddHttpClient<IEvidenceSelector, ManagedEvidenceSelector>(client =>
    client.Timeout = Timeout.InfiniteTimeSpan);
builder.Services.AddTransient<AmbassadorService>();
builder.Services.AddSingleton(new SemaphoreSlim(2, 2));
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.Headers.RetryAfter = "600";
        await Results.Problem(statusCode: 429, title: "Guide request limit reached",
            detail: "Too many requests. Please wait and try again, or use the contact links.")
            .ExecuteAsync(context.HttpContext);
    };
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        context.Request.Path == "/api/ambassador" && HttpMethods.IsPost(context.Request.Method)
            ? RateLimitPartition.GetFixedWindowLimiter("guide-global", _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 60,
                Window = TimeSpan.FromHours(1),
                QueueLimit = 0,
                AutoReplenishment = true
            })
            : RateLimitPartition.GetNoLimiter("other-routes"));
    options.AddPolicy("guide", context =>
        // Never trust arbitrary X-Forwarded-For headers. Behind an unconfigured proxy,
        // clients can share this bucket; this conservative restriction is documented.
        RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 12,
            Window = TimeSpan.FromMinutes(10),
            QueueLimit = 0,
            AutoReplenishment = true
        }));
});

var app = builder.Build();
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers.CacheControl = "no-store";
    try { await next(); }
    catch (BadHttpRequestException ex)
    {
        if (!context.Response.HasStarted)
            await Results.Problem(statusCode: ex.StatusCode == 413 ? 413 : 400,
                title: "Invalid request", detail: "Send a JSON message of 1–1200 characters.").ExecuteAsync(context);
    }
    catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested) { }
    catch (Exception)
    {
        // Intentionally do not log the exception/body: upstream messages can contain sensitive input.
        if (!context.Response.HasStarted)
            await Results.Problem(statusCode: 500, title: "Guide unavailable",
                detail: "The guide could not complete this request. Please try again later.").ExecuteAsync(context);
    }
});
app.UseRateLimiter();
app.MapGet("/api/healthz", () => Results.Ok(new { status = "ok" }));
app.MapGet("/api/ambassador/status", (IEvidenceSelector selector) => Results.Ok(
    new AmbassadorStatus(selector.IsConfigured, selector.IsConfigured
        ? "Questions are answered from approved resume evidence. Availability depends on the AI service."
        : "The guide is temporarily unavailable. Please use the contact links.")));
app.MapPost("/api/ambassador", async (HttpContext context, AmbassadorService guide, SemaphoreSlim concurrency) =>
{
    if (!context.Request.HasJsonContentType())
        return Results.Problem(statusCode: 400, title: "Invalid request", detail: "Content-Type must be application/json.");
    AmbassadorInput? input;
    try { input = await context.Request.ReadFromJsonAsync<AmbassadorInput>(context.RequestAborted); }
    catch (JsonException)
    {
        return Results.Problem(statusCode: 400, title: "Invalid request", detail: "Send only a message string.");
    }
    if (input is null || string.IsNullOrWhiteSpace(input.Message) || input.Message.Length > 1200)
        return Results.Problem(statusCode: 400, title: "Invalid message",
            detail: "Enter a question of 1–1200 characters.");
    if (!await concurrency.WaitAsync(0, context.RequestAborted))
        return Results.Problem(statusCode: 429, title: "Guide busy", detail: "The guide is busy. Please try again shortly.");
    try
    {
        return Results.Ok(await guide.AnswerAsync(input.Message.Trim(), context.RequestAborted));
    }
    catch (GuideServiceException ex)
    {
        return Results.Problem(statusCode: ex.StatusCode, title: "Guide unavailable", detail: ex.Message);
    }
    finally { concurrency.Release(); }
}).RequireRateLimiting("guide");

app.MapFallback(() => Results.Problem(statusCode: 404, title: "Not found", detail: "This API route does not exist."));
app.Run();

public partial class Program;
