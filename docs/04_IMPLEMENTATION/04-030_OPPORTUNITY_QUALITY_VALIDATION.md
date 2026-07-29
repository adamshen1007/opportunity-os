# 04-030_OPPORTUNITY_QUALITY_VALIDATION.md

## Purpose

This document records `TASK-P45-B01`, the measurement boundary that must be approved before Opportunity OS changes evidence clustering, opportunity generation, or ranking behavior.

## Versioned Benchmark

The draft benchmark lives in `research/fixtures/opportunity-quality/v1` and includes:

- 32 safe synthetic source records;
- eight drafted pain-point clusters with four records each;
- 16 drafted pairwise opportunity-ranking comparisons;
- a versioned metric rubric;
- a deterministic baseline for current one-record/one-opportunity behavior;
- a beginner review sheet for Adam.

Adam approved every source membership, cluster label, and pairwise comparison exactly as drafted on 2026-07-29. Version `1.0.0` is frozen, every judgment is marked `APPROVED`, and the explicit approval is recorded in `research/fixtures/opportunity-quality/v1/approval.json`.

## Baseline Measurement Boundary

The baseline models current behavior without modifying it:

1. Every source record becomes one opportunity.
2. No evidence aggregation is performed, so every predicted cluster is a singleton.
3. Every generated opportunity preserves one source citation.
4. Fixed equal ranking signals fall back to stable opportunity-ID ordering.

The deterministic evaluator measures duplicate opportunity rate, citation coverage, pairwise clustering precision and recall, ranking agreement, and repeatability. The checked-in baseline must exactly match evaluator output.

## Commands

```bash
pnpm benchmark:quality:validate
pnpm benchmark:quality
```

Validation fails if fixture counts, versions, memberships, review states, safety rules, or baseline measurements drift.

## Freeze Gate

The benchmark can become frozen only after:

1. Adam reviews all eight cluster labels and 32 memberships.
2. Adam chooses a preferred opportunity for all 16 pairwise comparisons.
3. Corrections are applied.
4. All judgment statuses are changed to `APPROVED`.
5. The full benchmark and repository verification pass.
6. `manifest.json` and `baseline.json` are changed to frozen state in the same reviewed change.

These conditions are met for version `1.0.0`. The benchmark freeze gate is `GO`; `TASK-P45-B02` may begin in a separate slice without modifying the frozen corpus or its approved judgments.
