using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Portfolio.Api.Tests;

public class HealthTests
{
    [Fact]
    public async Task HealthCheckReportsOk()
    {
        using var factory = new WebApplicationFactory<Program>();
        using var client = factory.CreateClient();
        var health = await client.GetFromJsonAsync<JsonElement>("/api/healthz");
        Assert.Equal("ok", health.GetProperty("status").GetString());
    }

    [Fact]
    public async Task ResponsesAreNotCachedOrSniffed()
    {
        using var factory = new WebApplicationFactory<Program>();
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/api/healthz");
        Assert.True(response.Headers.CacheControl!.NoStore);
        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
    }

    [Fact]
    public async Task UnknownRouteReturnsProblemDetails()
    {
        using var factory = new WebApplicationFactory<Program>();
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/api/not-a-route");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType!.MediaType);
    }

    [Theory]
    [InlineData("GET", "/api/ambassador/status")]
    [InlineData("POST", "/api/ambassador")]
    public async Task AiGuideEndpointsNoLongerExist(string method, string path)
    {
        using var factory = new WebApplicationFactory<Program>();
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(new HttpMethod(method), path);
        if (method == "POST")
            request.Content = new StringContent("{\"message\":\"Hi\"}", Encoding.UTF8, "application/json");
        using var response = await client.SendAsync(request);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
