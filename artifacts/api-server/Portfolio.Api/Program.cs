var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole(options => options.SingleLine = true);
builder.Logging.SetMinimumLevel(LogLevel.Warning);
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 8192);

var port = builder.Configuration["PORT"];
if (port is not null)
{
    if (!int.TryParse(port, out var parsedPort) || parsedPort is < 1 or > 65535)
        throw new InvalidOperationException("PORT must be a valid port number.");
    builder.WebHost.UseUrls($"http://0.0.0.0:{parsedPort}");
}

var app = builder.Build();
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers.CacheControl = "no-store";
    await next();
});
app.MapGet("/api/healthz", () => Results.Ok(new { status = "ok" }));

app.MapFallback(() => Results.Problem(statusCode: 404, title: "Not found", detail: "This API route does not exist."));
app.Run();

public partial class Program;
