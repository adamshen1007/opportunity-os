import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { pathToFileURL } from "node:url";
import {
  compareCanonicalStrings,
  createDatasetIdentity,
  loadBenchmark,
  normalizeCanonicalString
} from "./opportunity-quality-benchmark.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const pnpmExecutable = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const comparisonSchemaMarker = '{\n  "schemaVersion": "opportunity-quality-benchmark-comparison-v1"';
const approvedDatasetFingerprint = "247bd42c0f98e68c7f187326b602a8034a6fd702a196989c0b50e62317b821e3";

test("dataset canonical ordering is Unicode-normalized and locale-independent", () => {
  const probeValues = ["z", "ä", "é", "e\u0301", "A", "a"];
  const expectedOrder = ["A", "a", "z", "ä", "é", "é"];
  const benchmarkModuleUrl = pathToFileURL(path.join(repositoryRoot, "scripts/opportunity-quality-benchmark.mjs")).href;
  const probeScript = `
    import {
      compareCanonicalStrings,
      createDatasetIdentity,
      loadBenchmark,
      normalizeCanonicalString
    } from ${JSON.stringify(benchmarkModuleUrl)};
    const values = ${JSON.stringify(probeValues)};
    process.stdout.write(JSON.stringify({
      order: [...values].sort(compareCanonicalStrings).map(normalizeCanonicalString),
      normalizedComposed: normalizeCanonicalString("é"),
      normalizedDecomposed: normalizeCanonicalString("e\\u0301"),
      datasetFingerprint: createDatasetIdentity(loadBenchmark())
    }));
  `;
  const localeEnvironments = [
    { label: "LANG=C", values: { LANG: "C" } },
    { label: "LANG=en_US.UTF-8", values: { LANG: "en_US.UTF-8" } },
    { label: "LANG=sv_SE.UTF-8", values: { LANG: "sv_SE.UTF-8" } },
    { label: "LC_ALL=C", values: { LC_ALL: "C" } }
  ];

  assert.deepEqual([...probeValues].sort(compareCanonicalStrings).map(normalizeCanonicalString), expectedOrder);
  assert.equal(normalizeCanonicalString("é"), normalizeCanonicalString("e\u0301"));
  assert.equal(compareCanonicalStrings("é", "e\u0301"), 0);
  assert.equal(createDatasetIdentity(loadBenchmark()), approvedDatasetFingerprint);

  for (const localeEnvironment of localeEnvironments) {
    const environment = { ...process.env };
    delete environment.LANG;
    delete environment.LC_ALL;
    Object.assign(environment, localeEnvironment.values);
    const probe = spawnSync(process.execPath, ["--input-type=module", "--eval", probeScript], {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: environment
    });
    assert.equal(probe.status, 0, `${localeEnvironment.label} comparator probe failed:\n${probe.stderr.trim()}`);
    const result = JSON.parse(probe.stdout);
    assert.deepEqual(result.order, expectedOrder, `${localeEnvironment.label} changed canonical order`);
    assert.equal(result.normalizedComposed, result.normalizedDecomposed, `${localeEnvironment.label} changed NFC normalization`);
    assert.equal(result.datasetFingerprint, approvedDatasetFingerprint, `${localeEnvironment.label} changed dataset identity`);
  }
});

test("Phase 4.5 frozen benchmark meets clustered quality thresholds", () => {
  const benchmark = spawnSync(pnpmExecutable, ["benchmark:quality:clustered"], {
    cwd: repositoryRoot,
    encoding: "utf8"
  });

  assert.equal(
    benchmark.status,
    0,
    `clustered quality benchmark failed:\n${benchmark.stderr.trim()}`
  );

  const resultStart = benchmark.stdout.indexOf(comparisonSchemaMarker);
  assert.notEqual(resultStart, -1, "clustered quality benchmark did not emit its comparison result");

  const result = JSON.parse(benchmark.stdout.slice(resultStart));

  assert.equal(result.benchmarkVersion, "1.0.0");
  assert.equal(
    result.datasetFingerprint,
    approvedDatasetFingerprint,
    "approved benchmark dataset fingerprint changed"
  );
  assert.equal(
    result.resultFingerprint,
    "8ccbd52ad5412a962d4443c9a1d9d3fe418bd339fd96a0da2cf4f81383452905",
    "approved benchmark result fingerprint changed"
  );
  assert.ok(result.measurements.duplicateOpportunityRate <= 0.1);
  assert.ok(result.measurements.clusteringPrecision >= 0.85);
  assert.ok(result.measurements.clusteringRecall >= 0.75);
  assert.equal(result.measurements.citationCoverage, 1);
  assert.equal(result.measurements.repeatability, 1);
  assert.deepEqual(
    {
      duplicateOpportunityRate: result.thresholdResults.duplicateOpportunityRate,
      citationCoverage: result.thresholdResults.citationCoverage,
      clusteringPrecision: result.thresholdResults.clusteringPrecision,
      clusteringRecall: result.thresholdResults.clusteringRecall,
      repeatability: result.thresholdResults.repeatability
    },
    {
      duplicateOpportunityRate: true,
      citationCoverage: true,
      clusteringPrecision: true,
      clusteringRecall: true,
      repeatability: true
    }
  );
  assert.equal(result.allSliceThresholdsPassed, true);
});
