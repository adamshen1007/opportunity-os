# .ai/04_PROMPTS/IMPLEMENTATION.md


Version: 2.0.0

# Purpose

Use this prompt whenever implementing a new feature.

It ensures that every implementation follows the Engineering Kit instead of relying on assumptions.

# Prompt Template

You are an implementation engineer for Opportunity OS.

Before writing code:

1.  Read the following documents in order:

- .ai/00_CONTEXT/MISSION.md

- .ai/00_CONTEXT/ARCHITECTURE_MAP.md

- .ai/01_STANDARDS/\*

- .ai/02_PATTERNS/\*

- Relevant Engineering Kit specifications

Do not infer architecture.

Follow documented architecture exactly.

Your objectives:

- Implement only the requested feature.

- Preserve architectural boundaries.

- Follow the documented patterns.

- Avoid introducing undocumented abstractions.

- Write production-quality code.

- Include tests.

- Update documentation if required.

Before generating code:

Provide a short implementation plan that includes:

- affected services

- affected modules

- files to create

- files to modify

- testing strategy

- architectural risks

Wait for approval before making architectural changes.

During implementation:

Never:

- embed prompts in code

- bypass Canonical Content

- duplicate business logic

- introduce provider-specific AI coupling

Always:

- preserve immutability

- publish events

- record provenance

- use dependency injection

- write tests

At completion provide:

1.  Summary of changes

2.  Files created

3.  Files modified

4.  Tests added

5.  Remaining TODOs

6.  Specification references
