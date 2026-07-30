# 04-035_PHASE_4_5_STANDALONE_TEST_WORKFLOW_CLOSURE.md

## Scope

This closure slice investigates GitHub Actions `test` run `30449791751` for audited commit `7489189ec9afa2600a1d05cd428388c362f357ae`. It changes no product behavior, benchmark fixtures, quality thresholds, approval records, ranking results, provider configuration, or pilot-gate evidence.

External GitHub verification status: PENDING. The local correction cannot be called closed until an authorized later commit produces a successful standalone `test` workflow run for the exact candidate SHA and again for the final `main` SHA.

Local remediation status: **VERIFIED — INDEPENDENT RE-REVIEW REQUIRED**.

Overall Phase 4.5 pilot-gate status: NO-GO.

## Correction History

### Original Defect

The repository-level quality benchmark requires compiled exports from:

- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-generation`
- `@opportunity-os/opportunity-ranking`

The standalone workflow installs the frozen lockfile and runs `pnpm test` without running a full workspace build first. In GitHub run `30449791751`, the required compiled generation export did not exist. An isolated archive of the audited commit with no `dist` directories reproduced the same failure using `pnpm install --frozen-lockfile` followed directly by `pnpm test`.

The deployment workflow passed because it runs a build before `pnpm test`, creating the ignored `dist` output. A hydrated developer checkout can mask the same defect when ignored output from an earlier build remains on disk.

### Root Cause

Turbo defines package `test` tasks with `dependsOn: ["^build"]`. That dependency correctly builds the declared upstream dependencies of each tested package, but it does not guarantee every package's own build or unrelated downstream builds.

The clustered quality benchmark is a repository-level integration check across pipeline, generation, and ranking. Locating it inside the upstream pipeline package gave that package an undeclared runtime requirement on its downstream consumers. Adding generation or ranking as pipeline dependencies would reverse the approved dependency direction and create cycles. The package test therefore relied on artifacts that its task graph could not validly guarantee.

### First Proposed Correction

The first root-level correction moved the benchmark to the repository boundary and attempted to build pipeline, generation, and ranking directly. That correction remained incomplete.

In a strict clean checkout, pipeline compilation also requires declaration outputs from its complete upstream graph, including packages such as:

- `@opportunity-os/database`
- `@opportunity-os/raw-content`
- `@opportunity-os/normalization`
- `@opportunity-os/analysis`
- `@opportunity-os/opportunity-engine`

Building only the three directly imported packages did not construct those transitive dependencies. The first correction therefore passed only in an already hydrated repository or after a preceding full build. It did not satisfy the self-contained clean-checkout `pnpm test` contract.

### Alternatives Considered

1. **Add `pnpm build` only to `.github/workflows/test.yml`.** Rejected because local `pnpm test` would retain the hidden prerequisite and stale output could continue masking the defect.
2. **Prebuild the entire workspace in the root test script.** Rejected as broader and slower than the benchmark actually requires.
3. **Make every Turbo package test depend on its own build.** Insufficient because the pipeline test still cannot validly require downstream generation and ranking builds.
4. **Declare generation and ranking as pipeline dependencies.** Rejected because it reverses dependency direction and introduces a circular architecture.
5. **Load TypeScript source directly.** Rejected because the repository runtime contract publishes package-root JavaScript from `dist`, and adding a source execution layer would broaden this closure slice.
6. **Move the clustered benchmark assertion to the repository test boundary.** Selected because the benchmark is cross-package by design and the root can own one explicit dependency-aware build command without reversing package dependencies.

### Final Correction

The clustered benchmark assertion moves from the pipeline package to a root Node test. The root `pnpm test` command runs that mandatory test before Turbo package tests. The incomplete direct-build command was replaced by:

```bash
turbo run build --filter=@opportunity-os/opportunity-ranking...
```

For the repository's installed Turbo version, the trailing dependency ellipsis selects ranking and its complete transitive dependency closure. The current graph contains 26 library build tasks, including generation, pipeline, database, raw content, normalization, analysis, and opportunity engine, while excluding the unrelated API and web applications. This is not a full workspace build. It keeps package dependency direction valid, makes `pnpm test` self-contained from a clean checkout, preserves the compiled package-root runtime contract, and leaves the standalone workflow meaningful without adding a workflow-only prebuild.

## Benchmark Identity Guards

The evaluator now emits two separate SHA-256 identities:

- `datasetFingerprint` identifies the approved frozen inputs: the manifest, source records and citations, expected clusters and memberships, ranking comparisons, rubric and thresholds, baseline, and approval content. Canonical serialization sorts object keys and logically unordered ID collections, normalizes strings to Unicode NFC and LF line endings, and excludes non-evaluative manifest creation and approval timestamps.
- `resultFingerprint` identifies the aggregate evaluated behavior, measurements, and threshold outcomes.

Approved dataset fingerprint: `247bd42c0f98e68c7f187326b602a8034a6fd702a196989c0b50e62317b821e3`.

Approved result fingerprint: `8ccbd52ad5412a962d4443c9a1d9d3fe418bd339fd96a0da2cf4f81383452905`.

The mandatory root test asserts the benchmark version and both fingerprints independently before checking quality thresholds.

## Independent Re-Review Locale-Ordering Remediation

The first independent whole-patch re-review returned `CHANGES REQUIRED` because dataset record, cluster, and comparison IDs were ordered with `String.prototype.localeCompare`. That API consults the runtime's default `Intl` locale: the same `ä` and `z` values order differently under English and Swedish settings. The approved identifiers are currently ASCII, but locale-sensitive ordering did not satisfy the benchmark's macOS/Linux and environment-independent identity contract for valid future Unicode identifiers.

The corrected implementation uses one `compareCanonicalStrings` comparator for every unordered collection that contributes to dataset identity: recursive object keys, source-record IDs, expected-cluster IDs, cluster memberships, ranking-comparison IDs, and approval scope. Each input is first normalized to Unicode NFC with CRLF and CR line endings converted to LF. The comparator then performs lexicographic ordinal comparison of Unicode code points and never calls `localeCompare`, `Intl.Collator`, locale-sensitive case conversion, or locale-aware sorting. Logically ordered arrays continue to retain their approved order.

The root repository test imports the actual comparator through a direct-execution-safe benchmark module and permanently probes `z`, `ä`, `é`, decomposed `e\u0301`, `A`, and `a`. The normalized expected order is `A`, `a`, `z`, `ä`, `é`, `é`; composed and decomposed `é` compare equal after NFC normalization. Child probes run with `LANG=C`, `LANG=en_US.UTF-8`, `LANG=sv_SE.UTF-8`, and `LC_ALL=C` without requiring those operating-system locales to be installed. Every environment must produce the same order and approved dataset fingerprint.

The old and corrected canonical identity objects are byte-for-byte identical for the approved ASCII fixtures. The approved dataset fingerprint therefore remains `247bd42c0f98e68c7f187326b602a8034a6fd702a196989c0b50e62317b821e3`; the result fingerprint remains `8ccbd52ad5412a962d4443c9a1d9d3fe418bd339fd96a0da2cf4f81383452905`; and benchmark measurements remain unchanged. The expected constants remain independently defined in the root test.

Post-remediation strict clean-copy verification ran `corepack enable`, `pnpm install --frozen-lockfile`, and `pnpm test` without a preceding build or any compiled output. Installation and the root test exited successfully; the canonical-order regression and clustered benchmark each executed exactly once; all ten root Node tests passed; the benchmark produced the 26-package dependency closure; and the workspace graph completed 55 uncached Turbo tasks. No provider credential or live network access was required after installation. External GitHub verification remains **PENDING**, and the overall Phase 4.5 pilot-gate status remains **NO-GO**.

## Regression Risk

- The root test becomes longer because it compiles the ranking package's 26-package dependency closure before Turbo tests.
- Turbo may rebuild or reuse those outputs later in the same run; this affects duration, not behavior.
- A future change that removes the root benchmark test or its explicit build command could reintroduce the defect. Fresh-checkout verification is therefore part of this closure acceptance evidence.

## Verified Local Evidence

The remediation was copied into an isolated directory without `.git`, `node_modules`, `dist`, `.next`, `.turbo`, `.cache`, build output, TypeScript build metadata, actual environment files, local databases, or test/browser output. `.env.example` remained present because it is tracked documentation, not a credential file.

In that clean copy:

- `corepack enable` exited successfully.
- `pnpm install --frozen-lockfile` exited successfully.
- no build output existed before the test.
- `pnpm test` exited successfully without a preceding `pnpm build`.
- the mandatory root clustered-benchmark test ran exactly once.
- the full workspace test graph completed with 55 successful Turbo tasks.

A second fresh copy ran only:

```bash
pnpm exec turbo run build --filter='@opportunity-os/opportunity-ranking...'
```

Turbo reported 26 successful build tasks and zero cached tasks. Normal package builds created declarations for database, raw content, normalization, analysis, opportunity engine, opportunity pipeline, opportunity generation, and opportunity ranking.

Three fingerprint negative controls were performed only in isolated temporary copies. Every mutation was discarded afterward. These controls are separate from the locale-environment probes described above.

1. **Approved logical input mutation.** Punctuation only was changed in the approved `approvalStatement`; no executable code changed. Root testing exited 1 specifically because the approved dataset identity changed. The actual dataset fingerprint became `9b0321f436da935ae8dc905e4faf7a2435264cfdfd1e52cb723613e472e9d48f`, while the approved dataset fingerprint remained `247bd42c0f98e68c7f187326b602a8034a6fd702a196989c0b50e62317b821e3`. The result fingerprint remained `8ccbd52ad5412a962d4443c9a1d9d3fe418bd339fd96a0da2cf4f81383452905`, and all quality measurements remained unchanged.
2. **Expected dataset-fingerprint constant mutation.** Only the independently declared expected dataset fingerprint was changed from the approved value to the deliberately incorrect `047bd42c0f98e68c7f187326b602a8034a6fd702a196989c0b50e62317b821e3`. Root testing exited 1 and explicitly displayed the mismatch between the actual dataset fingerprint, `247bd42c0f98e68c7f187326b602a8034a6fd702a196989c0b50e62317b821e3`, and the mutated expected value. This proves the expected dataset constant is independently enforced and is not derived from evaluator output.
3. **Expected result-fingerprint constant mutation.** Only the independently declared expected result fingerprint was changed from the approved value to the deliberately incorrect `0ccbd52ad5412a962d4443c9a1d9d3fe418bd339fd96a0da2cf4f81383452905`. Root testing exited 1 and explicitly displayed the mismatch between the actual result fingerprint, `8ccbd52ad5412a962d4443c9a1d9d3fe418bd339fd96a0da2cf4f81383452905`, and the mutated expected value. The locale comparator regression continued to pass. This proves the expected result constant is independently enforced.

The primary-repository verification sequence is recorded in the remediation report. It does not replace the isolated clean-copy evidence above because its required `pnpm build` occurs before `pnpm test`.

## External Evidence Still Required

After an authorized commit and push, capture the standalone `test` workflow name, event, branch, candidate commit SHA, run ID and URL, start/completion timestamps, conclusion, and the successful install and `pnpm test` step names. Repeat the evidence capture for the final `main` commit. Until then, external status remains **PENDING** and the Phase 4.5 pilot gate remains governed by its existing fail-closed evidence manifest.
