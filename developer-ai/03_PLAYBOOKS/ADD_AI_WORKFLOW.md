# .ai/03_PLAYBOOKS/ADD_AI_WORKFLOW.md


Version: 2.0.0

# Purpose

This playbook defines the workflow for introducing a new AI capability.

Examples:

- Pain Point Extraction

- Competition Analysis

- Opportunity Hypothesis

- Feature Request Extraction

# Prerequisites

Read:

- 03-004_AI_WORKFLOW_SPEC.md

- 03-005_PROMPT_LIBRARY_SPEC.md

- AI_WORKFLOW_PATTERN.md

# Implementation Steps

## Step 1 — Define Workflow

Assign:

- workflow identifier

- workflow version

- input schema

- output schema

## Step 2 — Create Prompt

Add a versioned prompt to:

prompts/

Never embed prompts in source code.

## Step 3 — Implement Workflow

Create:

workflow.ts

validator.ts

post-processor.ts

prompt.ts

Follow the standard workflow lifecycle.

## Step 4 — Register Workflow

Expose the workflow through the Workflow Registry.

Do not instantiate workflows directly from application services.

## Step 5 — Validation

Validate:

- JSON schema

- required fields

- confidence thresholds

Reject invalid outputs.

## Step 6 — Provenance

Record:

- provider

- model

- prompt version

- workflow version

- latency

- token usage

## Step 7 — Testing

Include:

- mock provider tests

- schema tests

- regression fixtures

- retry tests

- provenance verification

# Completion Checklist

- Workflow registered

- Prompt versioned

- Output validated

- Provenance recorded

- Tests passing
