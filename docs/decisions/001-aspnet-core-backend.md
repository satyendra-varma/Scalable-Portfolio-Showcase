# Decision: ASP.NET Core backend

Status: accepted technology choice; implementation compatibility checks pending.

## Context

The portfolio targets Full Stack .NET Software Engineer roles and includes a grounded AI ambassador in its first release. That requires a server-side boundary for credentials, validation, and abuse controls.

The owner reviewed TypeScript/Express and ASP.NET Core, then explicitly selected “ASP.NET Core API.”

## Decision

Use React + TypeScript for the public website and ASP.NET Core for the API. Use a typed server-side HttpClient integration for managed AI if the compatibility check passes. Use xUnit and ASP.NET Core integration tests for the API.

Do not add an Express AI bridge, database, account system, or additional services by default. The existing Express scaffold is not the final backend choice.

## Consequences

- The actual implementation aligns with the owner's target role.
- The project has separate frontend and .NET build/test toolchains.
- Managed AI access from .NET must be verified, not inferred from a Node SDK example.
- No claim is made that .NET is needed for this portfolio's traffic volume.
- Resume claims remain unchanged even if the portfolio targets a newer framework version.

## Verification gate

Before significant backend implementation, verify the runtime, managed port/routing, and a small authenticated AI request from .NET without exposing secrets. If a limitation changes this architecture, explain it to the owner before adopting another backend or introducing a bridge.

## Alternatives retained for context

TypeScript/Express was simpler for the existing foundation but was not selected. A static-only site cannot safely supply the approved AI feature without another server-side service.
