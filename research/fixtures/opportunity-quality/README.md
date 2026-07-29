# Opportunity Quality Benchmark

The `v1` directory contains the Phase 4.5 opportunity-quality benchmark draft.

- Corpus: 32 synthetic source records.
- Expected labels: eight drafted pain-point clusters.
- Ranking judgments: 16 drafted pairwise comparisons.
- Baseline behavior: one source record creates one opportunity; predicted clusters are singletons; fixed ranking ties use stable opportunity IDs.
- Current status: Adam approved all labels, memberships, and ranking comparisons on 2026-07-29; benchmark `1.0.0` is frozen.

Run:

```bash
pnpm benchmark:quality:validate
pnpm benchmark:quality
```

The approval record is stored in `v1/approval.json`. Future quality changes must compare against this frozen version rather than editing it silently.
