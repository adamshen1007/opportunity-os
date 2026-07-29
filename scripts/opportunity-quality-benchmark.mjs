import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const fixtureRoot = path.resolve(import.meta.dirname, "../research/fixtures/opportunity-quality/v1");

const readJson = (fileName) => JSON.parse(fs.readFileSync(path.join(fixtureRoot, fileName), "utf8"));

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const unique = (values) => new Set(values).size === values.length;

const round = (value) => Number(value.toFixed(6));

const loadBenchmark = () => ({
  manifest: readJson("manifest.json"),
  sourceRecords: readJson("source-records.json"),
  expectedClusters: readJson("expected-clusters.json"),
  rankingComparisons: readJson("ranking-comparisons.json"),
  rubric: readJson("rubric.json"),
  baseline: readJson("baseline.json"),
  approval: readJson("approval.json")
});

const validateFixtureSafety = (records) => {
  const serialized = JSON.stringify(records);
  const forbiddenPatterns = [
    /api[_-]?key/iu,
    /access[_-]?token/iu,
    /refresh[_-]?token/iu,
    /client[_-]?secret/iu,
    /authorization/iu,
    /bearer\s/iu,
    /password/iu,
    /database[_-]?url/iu,
    /raw[_-]?provider/iu,
    /provider[_-]?payload/iu,
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}/iu,
    /https?:\/\//iu
  ];

  for (const pattern of forbiddenPatterns) {
    assert(!pattern.test(serialized), `Fixture safety validation failed for ${pattern}.`);
  }

  for (const record of records) {
    assert(record.sourceKind === "synthetic-public-forum", `Record ${record.id} is not explicitly synthetic.`);
    assert(Object.keys(record).sort().join(",") === "body,citationId,expectedClusterId,id,judgmentStatus,observedAt,sourceKind,title", `Record ${record.id} has an unsupported field.`);
  }
};

const validateBenchmark = (benchmark) => {
  const { manifest, sourceRecords, expectedClusters, rankingComparisons, rubric, baseline, approval } = benchmark;
  const version = manifest.benchmarkVersion;
  const versionedArtifacts = [sourceRecords, expectedClusters, rankingComparisons, rubric, baseline, approval];

  assert(versionedArtifacts.every((artifact) => artifact.benchmarkVersion === version), "Benchmark artifact versions do not match.");
  assert(sourceRecords.records.length >= 30, "Benchmark requires at least 30 source records.");
  assert(expectedClusters.clusters.length >= 8, "Benchmark requires at least eight expected clusters.");
  assert(rankingComparisons.comparisons.length >= 15, "Benchmark requires at least 15 ranking comparisons.");
  assert(sourceRecords.records.length === manifest.recordCount, "Manifest record count does not match corpus.");
  assert(expectedClusters.clusters.length === manifest.expectedClusterCount, "Manifest cluster count does not match labels.");
  assert(rankingComparisons.comparisons.length === manifest.rankingComparisonCount, "Manifest comparison count does not match judgments.");
  assert(unique(sourceRecords.records.map((record) => record.id)), "Source record IDs must be unique.");
  assert(unique(expectedClusters.clusters.map((cluster) => cluster.id)), "Expected cluster IDs must be unique.");
  assert(unique(expectedClusters.clusters.map((cluster) => cluster.opportunityId)), "Expected opportunity IDs must be unique.");
  assert(unique(rankingComparisons.comparisons.map((comparison) => comparison.id)), "Ranking comparison IDs must be unique.");

  const sourceIds = new Set(sourceRecords.records.map((record) => record.id));
  const clusterIds = new Set(expectedClusters.clusters.map((cluster) => cluster.id));
  const opportunityIds = new Set(expectedClusters.clusters.map((cluster) => cluster.opportunityId));
  const memberships = [];

  for (const cluster of expectedClusters.clusters) {
    assert(["REVIEW_REQUIRED", "APPROVED"].includes(cluster.reviewStatus), `Cluster ${cluster.id} has an invalid review status.`);
    for (const sourceId of cluster.memberSourceIds) {
      assert(sourceIds.has(sourceId), `Cluster ${cluster.id} references unknown source ${sourceId}.`);
      memberships.push(sourceId);
    }
  }

  assert(memberships.length === sourceRecords.records.length, "Every source record must have exactly one expected membership.");
  assert(unique(memberships), "Expected cluster memberships must not overlap.");

  for (const record of sourceRecords.records) {
    assert(clusterIds.has(record.expectedClusterId), `Record ${record.id} references an unknown expected cluster.`);
    assert(["REVIEW_REQUIRED", "APPROVED"].includes(record.judgmentStatus), `Record ${record.id} has an invalid judgment status.`);
    const expectedCluster = expectedClusters.clusters.find((cluster) => cluster.id === record.expectedClusterId);
    assert(expectedCluster?.memberSourceIds.includes(record.id), `Record ${record.id} and expected membership disagree.`);
  }

  for (const comparison of rankingComparisons.comparisons) {
    assert(opportunityIds.has(comparison.leftOpportunityId), `Comparison ${comparison.id} has an unknown left opportunity.`);
    assert(opportunityIds.has(comparison.rightOpportunityId), `Comparison ${comparison.id} has an unknown right opportunity.`);
    assert(
      [comparison.leftOpportunityId, comparison.rightOpportunityId].includes(comparison.preferredOpportunityId),
      `Comparison ${comparison.id} preference must select one compared opportunity.`
    );
    assert(["REVIEW_REQUIRED", "APPROVED"].includes(comparison.reviewStatus), `Comparison ${comparison.id} has an invalid review status.`);
  }

  validateFixtureSafety(sourceRecords.records);

  const judgments = [
    ...sourceRecords.records.map((record) => record.judgmentStatus),
    ...expectedClusters.clusters.map((cluster) => cluster.reviewStatus),
    ...rankingComparisons.comparisons.map((comparison) => comparison.reviewStatus)
  ];
  const allApproved = judgments.every((status) => status === "APPROVED");
  const approvalComplete =
    approval.status === "APPROVED" &&
    approval.approvedBy === "Adam" &&
    approval.approvalScope.length === 3;
  assert(
    !manifest.frozen || (allApproved && approvalComplete && manifest.status === "APPROVED" && baseline.frozen),
    "A benchmark cannot be frozen before every judgment is approved."
  );

  return {
    valid: true,
    benchmarkVersion: version,
    sourceRecordCount: sourceRecords.records.length,
    expectedClusterCount: expectedClusters.clusters.length,
    rankingComparisonCount: rankingComparisons.comparisons.length,
    reviewRequiredCount: judgments.filter((status) => status === "REVIEW_REQUIRED").length,
    freezeEligible: allApproved && approvalComplete,
    frozen: manifest.frozen
  };
};

const countPairs = (records, clusterForRecord) => {
  const pairs = new Set();
  for (let leftIndex = 0; leftIndex < records.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < records.length; rightIndex += 1) {
      const left = records[leftIndex];
      const right = records[rightIndex];
      if (clusterForRecord(left) === clusterForRecord(right)) {
        pairs.add(`${left.id}:${right.id}`);
      }
    }
  }
  return pairs;
};

const measureBenchmark = (benchmark) => {
  const validation = validateBenchmark(benchmark);
  const records = benchmark.sourceRecords.records;
  const comparisons = benchmark.rankingComparisons.comparisons;
  const expectedPairs = countPairs(records, (record) => record.expectedClusterId);
  const predictedPairs = countPairs(records, (record) => record.id);
  const truePositiveCount = [...predictedPairs].filter((pair) => expectedPairs.has(pair)).length;
  const clusteringPrecision = predictedPairs.size === 0 ? 0 : truePositiveCount / predictedPairs.size;
  const clusteringRecall = expectedPairs.size === 0 ? 0 : truePositiveCount / expectedPairs.size;
  const rankingMatchCount = comparisons.filter((comparison) => {
    const currentWinner = [comparison.leftOpportunityId, comparison.rightOpportunityId].sort()[0];
    return currentWinner === comparison.preferredOpportunityId;
  }).length;
  const expectedOpportunityCount = new Set(records.map((record) => record.expectedClusterId)).size;
  const generatedOpportunityCount = records.length;
  const measurementCore = {
    sourceRecordCount: records.length,
    generatedOpportunityCount,
    expectedOpportunityCount,
    duplicateOpportunityRate: round(1 - expectedOpportunityCount / generatedOpportunityCount),
    citationCoverage: round(records.filter((record) => Boolean(record.citationId)).length / generatedOpportunityCount),
    predictedClusterCount: records.length,
    clusteringPrecision: round(clusteringPrecision),
    clusteringRecall: round(clusteringRecall),
    rankingComparisonCount: comparisons.length,
    rankingAgreement: round(rankingMatchCount / comparisons.length),
    repeatability: 1
  };
  const fingerprint = createHash("sha256").update(JSON.stringify(measurementCore)).digest("hex");

  assert(JSON.stringify(measurementCore) === JSON.stringify(benchmark.baseline.measurements), "Measured baseline differs from the versioned baseline artifact.");

  return {
    schemaVersion: "opportunity-quality-benchmark-result-v1",
    benchmarkVersion: benchmark.manifest.benchmarkVersion,
    behaviorVersion: benchmark.baseline.behaviorVersion,
    status: validation.freezeEligible ? "APPROVAL_COMPLETE" : "REVIEW_REQUIRED",
    frozen: benchmark.manifest.frozen,
    measurements: measurementCore,
    resultFingerprint: fingerprint,
    reviewRequiredCount: validation.reviewRequiredCount,
    freezeEligible: validation.freezeEligible
  };
};

const measureClusteredBehavior = async (benchmark) => {
  const validation = validateBenchmark(benchmark);
  assert(validation.frozen, "The clustered benchmark requires a frozen approved corpus.");
  const [{ clusterEvidence }, { synthesizeEvidenceClusters }, { rankEvidenceDerivedOpportunities }] = await Promise.all([
    import("../packages/opportunity-pipeline/dist/index.js"),
    import("../packages/opportunity-generation/dist/index.js"),
    import("../packages/opportunity-ranking/dist/index.js")
  ]);
  const records = benchmark.sourceRecords.records;
  const clusteringInputs = records.map((record) => ({
    evidenceId: record.citationId,
    title: record.title,
    text: record.body,
    sourceType: record.sourceKind,
    sourceId: record.id,
    observedAt: record.observedAt,
    connectorId: "benchmark-fixture",
    rawContentId: `raw-${record.id}`,
    normalizedContentId: `normalized-${record.id}`,
    analysisRequestId: `analysis-${record.id}`,
    provenance: { sourceId: record.id, synthetic: true }
  }));
  const firstClusters = clusterEvidence(clusteringInputs);
  const repeatedClusters = clusterEvidence([...clusteringInputs].reverse());
  const synthesis = synthesizeEvidenceClusters(firstClusters);
  const opportunities = synthesis.flatMap((result) => result.status === "synthesized" ? [result.opportunity] : []);
  const expectedOpportunityByCluster = new Map(benchmark.expectedClusters.clusters.map((cluster) => [cluster.id, cluster.opportunityId]));
  const expectedClusterBySource = new Map(records.map((record) => [record.id, record.expectedClusterId]));
  const rankingInputs = opportunities.map((opportunity) => {
    const cluster = firstClusters.find((item) => item.clusterId === opportunity.clusterId);
    const expectedClusterId = cluster?.supportingEvidence.map((item) => expectedClusterBySource.get(item.sourceId)).find(Boolean);
    const opportunityId = expectedClusterId ? expectedOpportunityByCluster.get(expectedClusterId) : undefined;
    assert(cluster && opportunityId, `Unable to map synthesized cluster ${opportunity.clusterId} to an approved opportunity.`);
    return {
      opportunityId,
      title: opportunity.title,
      evidence: [...cluster.supportingEvidence, ...cluster.contradictoryEvidence, ...cluster.excludedEvidence].map((member) => ({
        evidenceId: member.evidenceId,
        text: `${member.title}\n${member.text}`,
        sourceType: member.sourceType,
        connectorId: member.connectorId,
        observedAt: member.observedAt,
        stance: member.stance
      }))
    };
  });
  const ranking = rankEvidenceDerivedOpportunities(rankingInputs);
  const rankByOpportunity = new Map(ranking.rankedOpportunities.map((item) => [item.opportunityId, item.position]));
  const rankingMatchCount = benchmark.rankingComparisons.comparisons.filter((comparison) => {
    const leftRank = rankByOpportunity.get(comparison.leftOpportunityId);
    const rightRank = rankByOpportunity.get(comparison.rightOpportunityId);
    assert(leftRank && rightRank, `Missing ranked benchmark opportunity for ${comparison.id}.`);
    const winner = leftRank < rightRank ? comparison.leftOpportunityId : comparison.rightOpportunityId;
    return winner === comparison.preferredOpportunityId;
  }).length;
  const predictedClusterBySource = new Map();
  for (const cluster of firstClusters) {
    for (const member of [...cluster.supportingEvidence, ...cluster.contradictoryEvidence, ...cluster.excludedEvidence]) {
      predictedClusterBySource.set(member.sourceId, cluster.clusterId);
    }
  }
  const expectedPairs = countPairs(records, (record) => record.expectedClusterId);
  const predictedPairs = countPairs(records, (record) => predictedClusterBySource.get(record.id) ?? record.id);
  const truePositiveCount = [...predictedPairs].filter((pair) => expectedPairs.has(pair)).length;
  const factualClaims = opportunities.flatMap((opportunity) => [
    opportunity.targetUser,
    opportunity.pain,
    opportunity.context,
    opportunity.currentWorkaround,
    opportunity.desiredOutcome
  ]);
  const expectedOpportunityCount = benchmark.expectedClusters.clusters.length;
  const generatedOpportunityCount = opportunities.length;
  const measurements = {
    sourceRecordCount: records.length,
    generatedOpportunityCount,
    expectedOpportunityCount,
    duplicateOpportunityRate: generatedOpportunityCount === 0 ? 0 : round(Math.max(0, (generatedOpportunityCount - expectedOpportunityCount) / generatedOpportunityCount)),
    citationCoverage: factualClaims.length === 0 ? 0 : round(factualClaims.filter((claim) => claim.citationIds.length > 0).length / factualClaims.length),
    predictedClusterCount: firstClusters.length,
    clusteringPrecision: predictedPairs.size === 0 ? 0 : round(truePositiveCount / predictedPairs.size),
    clusteringRecall: expectedPairs.size === 0 ? 0 : round(truePositiveCount / expectedPairs.size),
    rankingComparisonCount: benchmark.rankingComparisons.comparisons.length,
    rankingAgreement: round(rankingMatchCount / benchmark.rankingComparisons.comparisons.length),
    repeatability: JSON.stringify(firstClusters) === JSON.stringify(repeatedClusters) ? 1 : 0
  };
  const targets = benchmark.rubric.draftTargetsForLaterSlices;
  const thresholdResults = {
    duplicateOpportunityRate: measurements.duplicateOpportunityRate <= targets.duplicateOpportunityRateMaximum,
    citationCoverage: measurements.citationCoverage >= targets.citationCoverageMinimum,
    clusteringPrecision: measurements.clusteringPrecision >= targets.clusteringPrecisionMinimum,
    clusteringRecall: measurements.clusteringRecall >= targets.clusteringRecallMinimum,
    rankingAgreement: measurements.rankingAgreement >= targets.rankingAgreementMinimum && measurements.rankingAgreement - benchmark.baseline.measurements.rankingAgreement >= 0.15,
    repeatability: measurements.repeatability >= targets.repeatabilityMinimum
  };
  const resultCore = {
    schemaVersion: "opportunity-quality-benchmark-comparison-v1",
    benchmarkVersion: benchmark.manifest.benchmarkVersion,
    behaviorVersion: "evidence-ranking-formula-v1",
    baseline: benchmark.baseline.measurements,
    measurements,
    thresholdResults,
    allSliceThresholdsPassed: Object.values(thresholdResults).every(Boolean)
  };
  return {
    ...resultCore,
    resultFingerprint: createHash("sha256").update(JSON.stringify(resultCore)).digest("hex")
  };
};

const command = process.argv[2] ?? "evaluate";

try {
  const benchmark = loadBenchmark();
  const output = command === "validate"
    ? validateBenchmark(benchmark)
    : command === "evaluate"
      ? measureBenchmark(benchmark)
      : command === "evaluate-clustered"
        ? await measureClusteredBehavior(benchmark)
        : null;
  assert(output, `Unsupported benchmark command: ${command}`);
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Benchmark validation failed.";
  process.stderr.write(`Opportunity quality benchmark failed: ${message}\n`);
  process.exitCode = 1;
}
