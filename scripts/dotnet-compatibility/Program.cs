using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

var baseUrl = Environment.GetEnvironmentVariable("AI_INTEGRATIONS_OPENAI_BASE_URL");
var key = Environment.GetEnvironmentVariable("AI_INTEGRATIONS_OPENAI_API_KEY");
if (string.IsNullOrWhiteSpace(baseUrl) || string.IsNullOrWhiteSpace(key))
{
    Console.Error.WriteLine("Managed AI configuration is not available.");
    return 1;
}

try
{
    using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(45) };
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);
    using var response = await client.PostAsJsonAsync(
        baseUrl.TrimEnd('/') + "/chat/completions",
        new
        {
            model = "gpt-5.4-mini",
            messages = new[] { new { role = "user", content = "Reply with exactly OK." } },
            max_completion_tokens = 150
        });
    // Never print response bodies, request headers, URLs, or credentials.
    if (!response.IsSuccessStatusCode)
    {
        Console.Error.WriteLine($"Managed AI HTTP status: {(int)response.StatusCode}.");
        return 1;
    }
    using var payload = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    var reply = payload.RootElement.GetProperty("choices")[0].GetProperty("message")
        .GetProperty("content").GetString();
    if (string.IsNullOrWhiteSpace(reply))
    {
        Console.Error.WriteLine("Managed AI returned an empty completion.");
        return 1;
    }
    Console.WriteLine(".NET HttpClient -> managed AI: authenticated request succeeded.");
    return 0;
}
catch (Exception exception) when (exception is HttpRequestException or TaskCanceledException or JsonException)
{
    Console.Error.WriteLine($"Managed AI compatibility check failed: {exception.GetType().Name}.");
    return 1;
}
