using System.Text.Json;

namespace Portfolio.Api;

public sealed class EvidenceCatalog
{
    public IReadOnlyList<EvidenceFact> Facts { get; }

    public EvidenceCatalog(IEnumerable<EvidenceFact> facts)
    {
        Facts = facts.ToArray();
        if (Facts.Count == 0 || Facts.Select(f => f.Id).Distinct().Count() != Facts.Count ||
            Facts.Any(f => string.IsNullOrWhiteSpace(f.Text) || !f.Href.StartsWith('#')))
            throw new InvalidOperationException("Public evidence catalog is invalid.");
    }

    public static EvidenceCatalog Load()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "Data", "public-facts.json");
        return new EvidenceCatalog(JsonSerializer.Deserialize<EvidenceFact[]>(
            File.ReadAllText(path), new JsonSerializerOptions(JsonSerializerDefaults.Web)) ?? []);
    }
}
