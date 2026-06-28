# developer-ai/02_PATTERNS/AI_WORKFLOW_PATTERN.md


Version: 2.0.0

# Purpose

This document defines the implementation pattern for AI workflows.

AI workflows are orchestrated, versioned pipelines.

They are not direct LLM calls.

# Standard Structure

workflows/

└── pain-point-extraction/

├── workflow.ts

├── input.ts

├── output.ts

├── validator.ts

├── post-processor.ts

├── prompt.ts

└── __tests__/

# Workflow Lifecycle

1.  Receive Canonical Content

2.  Resolve prompt

3.  Resolve provider

4.  Execute model

5.  Validate structured output

6.  Apply deterministic post-processing

7.  Persist result

8.  Publish event

9.  Record provenance

Every workflow follows this lifecycle.

# Provider Abstraction

Workflow code must never depend on:

- OpenAI

- Anthropic

- Gemini

- DeepSeek

- local inference engines

Provider-specific behavior belongs in provider adapters.

# Prompt Resolution

Prompts are resolved from the Prompt Library.

Never embed prompts directly in workflow code.

Prompt versions are recorded in provenance.

# Output Validation

Every workflow output is validated against its schema.

Invalid outputs:

- are not persisted

- trigger retry or failure handling according to workflow policy

# Provenance

Record:

- workflow version

- prompt version

- provider

- model

- latency

- token usage

- execution cost

- timestamp

This metadata accompanies every persisted AI result.

# Testing

Each workflow requires:

- mock provider tests

- schema validation tests

- post-processing tests

- retry tests

- provenance verification

- regression fixtures

AI behavior is validated through structured outputs rather than exact natural-language responses.
