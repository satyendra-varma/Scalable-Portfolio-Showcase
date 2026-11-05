# Architecture proposal

Status: proposal, not an approved implementation.

## Shared frontend

React + TypeScript + Vite, responsive routes, structured resume-derived content, and focused components. The landing experience supports a short scan; case-study routes support deeper reading and direct links.

Content originates in reviewed version-controlled files, not a database. The public content contract is shared by the website and the ambassador. Optional URLs are validated from docs/project-links.json, with absent values omitted.

## Backend alternatives

| Consideration | Lightweight TypeScript/Express API | ASP.NET Core API |
| --- | --- | --- |
| Purpose | A small server boundary for the ambassador | Same boundary plus a C# code sample reflecting the owner's expertise |
| Fit | Existing server foundation and documented managed AI client integration | Stronger alignment with target-role implementation skills |
| Complexity | One language across site/API; fewer runtime changes | Separate C# runtime, build/test pipeline, and cross-language contract |
| Tests | Vitest plus HTTP integration tests | xUnit plus WebApplicationFactory integration tests |
| Managed AI | Documented Node/TypeScript integration available | Verify authenticated proxy compatibility from .NET before committing; do not assume all SDKs work unchanged |
| Maintenance | Lower for this feature set | Higher, potentially worthwhile as a deliberate showcase |

Recommendation for a fast, focused portfolio: TypeScript API. Choose .NET if the actual portfolio backend is intended as an inspectable engineering sample. This is not an assessment of either language's scalability. Both easily support this site; no traffic estimate justifies microservices.

Replit documentation indicates ASP.NET Core can run with the required runtime and service configuration. Actual SDK, proxy integration, managed service routing, build, and publishing compatibility must be verified during implementation. No runtime or workflow changes have been made.

Do not add a separate Node AI bridge to .NET by default: two backend services would undermine the simplicity goal. If .NET cannot use managed AI directly, return to the owner with the tradeoff.

## Request path

Browser -> public-safe content and project routes.
Browser -> same-origin POST /api/ambassador -> validated approved facts -> managed AI -> validated answer and source references.

The precise endpoint namespace is provisional until the backend is chosen. For TypeScript, define OpenAPI and generated client contracts before frontend integration. For .NET, agree the equivalent OpenAPI-to-TypeScript contract workflow.

Proposed request: bounded message plus bounded in-memory conversation history.
Proposed response: answer, validated source IDs, and supported/unsupported status.
Service failures: explicit non-success response with safe retry guidance, never a fabricated answer.

## Grounding and security

- Do not give the ambassador browsing, file access, code execution, or write tools.
- Only curated public facts reach the AI; prompt injection cannot expose a phone number it never receives.
- Use instructions plus structured output validation and evidence-ID checks. These do not prove semantic truth; answer evaluation and conservative refusal are also required.
- Consider selecting approved evidence and composing constrained answers rather than unrestricted prose where factual accuracy is most important.
- Reject invalid bodies; bound message/history sizes, total context, output tokens, request duration, and concurrent calls.
- Apply per-client and global throttles. Initial single-instance limits may be in memory; multi-instance publishing requires a shared limiter or platform-level equivalent. Never claim restart-persistent enforcement from an in-memory map.
- Disable application body/transcript logging and sanitize exception logs; record only non-content operational metadata if needed.
- Treat user text and model text as untrusted; render safe text, not executable HTML.
- Explain provider processing separately from the application's no-storage policy. Provider retention remains a release verification item.
- No account/auth flow or database is needed for the approved release.

## AI provider proposal

Use Replit AI Integrations for OpenAI access. No personal API key is required; usage is billed to the owner's Replit credits. Provisioning is deferred until the architecture is agreed. No vector database or embeddings are needed for a resume-sized knowledge set.

## Contact and downloadable assets

Use mailto and the approved LinkedIn link initially; no email-sending integration is required. Host only a reviewed public-safe resume PDF. Do not expose attached_assets as a static directory.

## Design and operational constraints

Explore two visual directions before committing. Favor useful project exploration and explainable technical evidence over arbitrary animation. Reduced-motion and touch/keyboard behavior are first-class.

Keep components, content, routes, API, and tests separated. Do not introduce Kubernetes, Redis, extra databases, or Docker execution just because they appear in the resume. Any future AWS/container deployment pipeline is separate from Replit publishing and needs an explicit decision.

Canonical URLs and social metadata must use the real production URL when available, never a guessed domain.
