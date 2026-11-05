using System.Text.RegularExpressions;

namespace Portfolio.Api;

public sealed partial class AmbassadorService(EvidenceCatalog catalog, IEvidenceSelector selector)
{
    public const string Refusal = "I don’t have verified information about that.";

    public async Task<AmbassadorAnswer> AnswerAsync(string message, CancellationToken cancellationToken)
    {
        // Fail closed for common private/injection categories without sending them to the model.
        if (UnsupportedPattern().IsMatch(message))
            return new AmbassadorAnswer(Refusal, "unsupported", []);

        var ids = await selector.SelectAsync(message, catalog.Facts, cancellationToken);
        if (ids.Length == 0)
            return new AmbassadorAnswer(Refusal, "unsupported", []);

        // Validate again at the application boundary; never publish model-written career prose.
        if (ids.Length > 3 || ids.Distinct().Count() != ids.Length ||
            ids.Any(id => !catalog.Facts.Any(f => f.Id == id)))
            throw new GuideServiceException(502, "The guide returned unverified evidence. Please try again.");

        var facts = ids.Select(id => catalog.Facts.Single(f => f.Id == id)).ToArray();
        return new AmbassadorAnswer(
            string.Join("\n\n", facts.Select(f => f.Text)),
            "supported",
            facts.Select(f => new EvidenceSource(f.Id, f.Title, f.Href)).ToArray());
    }

    [GeneratedRegex(@"\b(salary|compensation|pay\s+expectations|relocat\w*|visa|immigration|work\s+authorization|available\s+to\s+(start|work)|availability|phone|mobile\s+number|street\s+address|home\s+address|system\s+prompt|developer\s+message|ignore\s+.{0,40}(instructions|rules)|api[\s_-]*key|secret|password)\b",
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant, 100)]
    private static partial Regex UnsupportedPattern();
}
