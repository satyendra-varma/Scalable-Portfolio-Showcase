# Architecture proposal

Status: ASP.NET Core selected by the owner. Detailed implementation is proposed; no application code has been written.

Decision record: [ASP.NET Core backend](decisions/001-aspnet-core-backend.md).

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

Historical recommendation for the simplest delivery was TypeScript. The owner chose ASP.NET Core after reviewing the alternatives. Proceed with .NET, not Express or a hidden Node AI bridge. Both options easily support this site; no traffic estimate justifies microservices.

Read-only feasibility checks: dotnet is not currently installed in the environment. The runtime catalog offers .NET 8, 9, and 10. Replit documentation indicates ASP.NET Core and managed AI access are supported; actual SDK installation, an authenticated .NET-to-AI request, managed service routing, build, and publishing compatibility must still be verified during implementation. No runtime, provider, or workflow changes have been made. An available runtime is not a successful end-to-end compatibility test.

Do not add a separate Node AI bridge to .NET by default: two backend services would undermine the simplicity goal. If .NET cannot use managed AI directly, return to the owner with the tradeoff.

## Request path

Browser -> public-safe content and project routes.
Browser -> same-origin POST /api/ambassador -> validated approved facts -> managed AI -> validated answer and source references.

Use a version-controlled OpenAPI contract as the frontend/backend boundary, with generated React Query hooks and schemas. Implement the contract in ASP.NET Core and test that implementation against it. Define the contract and run codegen before frontend integration. Do not maintain two competing hand-written API definitions.

Proposed request: bounded message plus bounded in-memory conversation history.
Proposed response: answer, validated source IDs, and supported/unsupported status.
Service failures: explicit non-success response with safe retry guidance, never a fabricated answer.

## Selected backend structure

Use a small ASP.NET Core project with a separate xUnit test project, rather than artificial microservices or a large DDD solution for a single endpoint.

- API boundary: routing, request/response DTOs, validation, Problem Details errors, and health checks.
- Application service: assemble approved evidence, coordinate answer generation, and validate source references.
- Infrastructure boundary: typed HttpClient for managed AI, explicit cancellation/timeouts, and validated server-side configuration.
- Content boundary: curated public-safe facts and validated links, shared through a content schema/build step rather than scraping rendered pages.
- Tests: deterministic application tests and WebApplicationFactory integration tests; substitute the provider client rather than call the live model in every run.

Proposed endpoints:

| Endpoint | Purpose | Expected states |
| --- | --- | --- |
| GET /api/healthz | Process liveness without a paid model call | 200 |
| POST /api/ambassador | Evidence-grounded answer and source IDs | 200 supported or unsupported; 400 invalid body; 413 oversized body; 429 throttled; 502 invalid/provider failure; 503 unconfigured/unavailable; 504 timeout |

Keep public content static initially; do not add content CRUD merely to create more API code. The API binds to the configured PORT and handles its full /api prefix. Use same-origin browser calls and existing managed routing, not localhost URLs or a duplicate manually configured workflow.

Runtime proposal: .NET 10 if its available toolchain and publishing path pass the compatibility gate. The portfolio may use a newer runtime without changing the resume's factual .NET 8 experience. Verify runtime support lifecycle before finalizing the target.

The existing API artifact is an unmodified Express scaffold. Implementation will change its managed service commands through the validated artifact configuration flow after the .NET build is ready, preserving its /api routing. No existing product API or user data needs migration based on the currently inspected scaffold.

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
