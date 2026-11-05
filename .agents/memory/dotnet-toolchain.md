---
name: .NET toolchain verification
description: Managed AI compatibility and bounded CLI concurrency in this environment.
---

The managed OpenAI-compatible service can be called directly from .NET HttpClient using server-injected configuration; a Node bridge is not required.

**Why:** An authenticated .NET request was successfully exercised before implementing the API.

**How to apply:** Keep model access in the selected ASP.NET Core service. Preserve credential secrecy and never print upstream bodies or authorization headers during diagnostics.

Use bounded .NET CLI concurrency when restoring/running the test project here.

**Why:** Unbounded test restores ended before producing a useful result; setting DOTNET_PROCESSOR_COUNT=2 and serial restore completed successfully.

**How to apply:** If a restore exits without a completed restore/test report, prefer the bounded test command already configured in the API package rather than repeatedly retrying the same unconstrained command.

Use the MSBuild Publish target for production packaging in this installed SDK.

**Why:** The SDK's `dotnet publish` command forwarded the output property as a positional argument and failed with MSB1008, with both the output option and explicit property forms. Direct `dotnet msbuild -t:Publish` correctly packaged the application.

**How to apply:** Preserve the validated artifact build command unless the toolchain changes; verify any replacement packaging command before changing deployment settings.

Managed service commands must not assume the workspace root is their working directory.

**Why:** A root-prefixed project path worked from an interactive shell but failed in the managed artifact workflow. Package-filtered scripts correctly establish the artifact working directory.

**How to apply:** Invoke the API package's development/build/start scripts through the workspace package filter; keep their .NET project paths relative to the API artifact.
