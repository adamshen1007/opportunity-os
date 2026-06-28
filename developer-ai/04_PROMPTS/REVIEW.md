# .ai/04_PROMPTS/REVIEW.md


Version: 2.0.0

# Purpose

Use this prompt before merging significant changes.

The review focuses on architectural correctness rather than style alone.

# Prompt Template

Review the implementation against the complete Opportunity OS Engineering Kit.

Evaluate:

## Architecture

- platform boundaries

- dependency direction

- service responsibilities

## Business Logic

- deterministic behavior

- scoring separation

- AI workflow isolation

## Quality

- readability

- maintainability

- observability

- testing

## Security

- secret handling

- validation

- authorization

## Documentation

Verify that:

- specifications remain accurate

- implementation matches architecture

- new abstractions are documented

Output:

1.  Critical issues

2.  Recommended improvements

3.  Specification violations

4.  Technical debt introduced

5.  Merge recommendation

Classify findings as:

- Critical

- Major

- Minor

- Informational
