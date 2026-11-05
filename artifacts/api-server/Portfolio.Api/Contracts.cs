using System.Text.Json.Serialization;

namespace Portfolio.Api;

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record AmbassadorInput(string? Message);
public sealed record EvidenceFact(string Id, string Title, string Href, string Text);
public sealed record EvidenceSource(string Id, string Title, string Href);
public sealed record AmbassadorAnswer(string Answer, string Status, EvidenceSource[] Sources);
public sealed record AmbassadorStatus(bool Available, string Message);

public sealed class GuideServiceException(int statusCode, string safeMessage) : Exception(safeMessage)
{
    public int StatusCode { get; } = statusCode;
}
