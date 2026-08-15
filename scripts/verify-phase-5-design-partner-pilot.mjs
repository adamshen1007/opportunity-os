import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DEFAULT_PHASE_MANIFEST_URL = new URL(
  "../docs/04_IMPLEMENTATION/evidence/phase-5-design-partner-pilot.json",
  import.meta.url
);
const DEFAULT_COHORT_EVIDENCE_URL = new URL(
  "../docs/04_IMPLEMENTATION/evidence/phase-5-cohort-evidence.json",
  import.meta.url
);

const CONTRACT_VERSION = "phase-5-pilot-evidence-v1";
const ALLOWED_CHECK_STATUSES = new Set(["pass", "fail", "manual-required", "conditional", "external-required"]);
const ALLOWED_COHORT_STATES = new Set(["not-started", "ready", "in-progress", "completed", "invalidated"]);
const ALLOWED_G02_DECISIONS = new Set(["not-evaluated", "GO", "NO-GO"]);
const ALLOWED_HISTORY_DECISIONS = new Set(["GO", "NO-GO"]);
const ALLOWED_MANIFEST_STATUSES = new Set(["candidate", "closure-candidate", "published"]);
const ALLOWED_PHASE_TASKS = new Set([
  "TASK-P5-G01",
  "TASK-P5-A01",
  "TASK-P5-A02",
  "TASK-P5-G02",
  "TASK-P5-B01",
  "TASK-P5-A03",
  "TASK-P5-G03"
]);

const REQUIRED_CHECK_AREAS = new Map([
  ["prerequisite.phase-4-5-pilot-gate", "prerequisite"],
  ["governance.authority-transition", "governance"],
  ["governance.evidence-contract", "governance"],
  ["cohort-1.readiness", "cohort-1"],
  ["cohort-1.execution", "cohort-1"],
  ["cohort-1.decision", "cohort-1"],
  ["phase.exit-review", "phase-exit"]
]);

const COUNT_FIELDS = [
  "primaryParticipantCount",
  "primarySessionCount",
  "initiatedLiveScanAttempts",
  "completedLiveScanAttempts",
  "primarySessionsWithSavedOpportunity",
  "usefulnessRatingCount",
  "usefulnessRatingSum",
  "evidenceQualityRatingCount",
  "evidenceQualityRatingSum",
  "rankingQualityRatingCount",
  "rankingQualityRatingSum",
  "displayedLiveOpportunityCount",
  "displayedLiveOpportunityWithEvidenceAndProvenanceCount",
  "voluntaryRepeatParticipantCount",
  "fixtureSessionCount",
  "liveSessionCount",
  "criticalSecretExposureCount",
  "unauthorizedAccessIncidentCount",
  "dataLossIncidentCount",
  "criticalReliabilityIncidentCount"
];

const COHORT_FIELDS = new Set([
  "cohortId",
  "state",
  "validationRevision",
  "releaseSha",
  "domainId",
  "datasource",
  "mode",
  "g02Decision",
  ...COUNT_FIELDS
]);

const EVIDENCE_FIELDS = new Set([
  "schemaVersion",
  "contractVersion",
  "phaseId",
  "currentValidationRevision",
  "validationHistory",
  "cohort1",
  "cohort2"
]);

const MANIFEST_FIELDS = new Set([
  "schemaVersion",
  "phaseId",
  "phaseGateTaskId",
  "currentTaskId",
  "recordedAt",
  "baselineSha",
  "status",
  "decision",
  "productRuntimeImplementationAuthorized",
  "cohortInvitationsAuthorized",
  "publishedGovernanceBaseline",
  "checks",
  "openDecisions",
  "resolvedDecisions",
  "notes"
]);

const CHECK_FIELDS = new Set(["id", "area", "priority", "status", "evidenceId", "safeSummary"]);
const PUBLISHED_BASELINE_FIELDS = new Set(["mainSha", "canonicalDigest"]);
const RESOLVED_DECISION_FIELDS = new Set([
  "id",
  "ownerTaskId",
  "status",
  "resolution",
  "safeSummary"
]);

export function assertSecretSafeEvidenceText(text) {
  const prohibited = [
    /postgres(?:ql)?:\/\//iu,
    /https?:\/\//iu,
    /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/iu,
    /(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|authorization|database[_-]?url)\s*[:=]/iu,
    /bearer\s+[a-z0-9._-]+/iu,
    /\bsk-[a-z0-9_-]{16,}\b/iu,
    /(?:invite|session)[_-]?(?:code|token)\s*[:=]/iu
  ];
  if (prohibited.some((pattern) => pattern.test(text))) {
    throw new Error("Phase 5 repository evidence must remain secret-safe.");
  }
}

export function evaluateCohortMetrics(input) {
  assertPlainObject(input, "cohort evidence");
  assertOnlyFields(input, COHORT_FIELDS, "cohort evidence");
  if (typeof input.cohortId !== "string" || !/^cohort-[12]$/u.test(input.cohortId)) {
    throw new Error("Cohort evidence contains an invalid cohort identifier.");
  }
  if (!ALLOWED_COHORT_STATES.has(input.state)) {
    throw new Error("Cohort evidence contains an unknown state.");
  }
  if (!Number.isInteger(input.validationRevision) || input.validationRevision < 1) {
    throw new Error("Cohort evidence requires a positive validation revision.");
  }
  if (input.releaseSha !== null && (typeof input.releaseSha !== "string" || !/^[a-f0-9]{40}$/u.test(input.releaseSha))) {
    throw new Error("Cohort evidence contains an invalid release SHA.");
  }
  if (input.domainId !== null && (typeof input.domainId !== "string" || !/^[a-z0-9][a-z0-9-]{0,63}$/u.test(input.domainId))) {
    throw new Error("Cohort evidence contains an invalid safe domain identifier.");
  }
  if (input.datasource !== "stack-exchange") {
    throw new Error("Phase 5 v1 cohort evidence must use the approved Stack Exchange datasource.");
  }
  if (input.mode !== "live") {
    throw new Error("Phase 5 v1 qualifying cohort evidence must use live mode.");
  }
  if (!ALLOWED_G02_DECISIONS.has(input.g02Decision)) {
    throw new Error("Cohort evidence contains an unknown G02 decision.");
  }
  for (const field of COUNT_FIELDS) assertNonNegativeInteger(input[field], field);

  if (
    input.state === "not-started" &&
    (input.releaseSha !== null ||
      input.domainId !== null ||
      input.g02Decision !== "not-evaluated" ||
      COUNT_FIELDS.some((field) => input[field] !== 0))
  ) {
    throw new Error("A not-started cohort cannot contain execution evidence.");
  }
  if (input.state === "completed" && (input.releaseSha === null || input.domainId === null)) {
    throw new Error("A completed cohort requires a matched release and frozen domain.");
  }
  if (
    input.state === "completed" &&
    (input.primaryParticipantCount < 1 ||
      input.primarySessionCount < 1 ||
      input.primaryParticipantCount !== input.primarySessionCount)
  ) {
    throw new Error("A completed cohort requires at least one participant and one primary session per participant.");
  }

  if (input.completedLiveScanAttempts > input.initiatedLiveScanAttempts) {
    throw new Error("Completed live scan attempts cannot exceed initiated attempts.");
  }
  if (input.primarySessionsWithSavedOpportunity > input.primarySessionCount) {
    throw new Error("saved-opportunity sessions cannot exceed primary sessions.");
  }
  if (input.primarySessionsWithSavedOpportunity > input.completedLiveScanAttempts) {
    throw new Error("saved-opportunity sessions require completed live scan attempts.");
  }
  if (input.primarySessionCount > input.initiatedLiveScanAttempts) {
    throw new Error("Every governed primary session requires an initiated live scan attempt.");
  }
  if (input.voluntaryRepeatParticipantCount > input.primaryParticipantCount) {
    throw new Error("The repeat participant count cannot exceed governed primary participants.");
  }
  if (input.liveSessionCount < input.primarySessionCount + input.voluntaryRepeatParticipantCount) {
    throw new Error("Qualifying primary and repeat evidence requires sufficient live sessions.");
  }
  if (
    input.displayedLiveOpportunityWithEvidenceAndProvenanceCount >
    input.displayedLiveOpportunityCount
  ) {
    throw new Error("Evidence-complete displayed opportunities cannot exceed displayed opportunities.");
  }
  assertRatingRange(input.usefulnessRatingCount, input.usefulnessRatingSum, "usefulness");
  assertRatingRange(input.evidenceQualityRatingCount, input.evidenceQualityRatingSum, "evidence-quality");
  assertRatingRange(input.rankingQualityRatingCount, input.rankingQualityRatingSum, "ranking-quality");

  const scanCompletion = {
    numerator: input.completedLiveScanAttempts,
    denominator: input.initiatedLiveScanAttempts,
    pass:
      input.initiatedLiveScanAttempts > 0 &&
      input.completedLiveScanAttempts * 100 >= input.initiatedLiveScanAttempts * 80
  };
  const savedSessionRate = {
    numerator: input.primarySessionsWithSavedOpportunity,
    denominator: input.primarySessionCount,
    pass:
      input.primarySessionCount > 0 &&
      input.primarySessionsWithSavedOpportunity * 100 >= input.primarySessionCount * 30
  };
  const usefulness = {
    sum: input.usefulnessRatingSum,
    count: input.usefulnessRatingCount,
    pass:
      input.usefulnessRatingCount > 0 &&
      input.usefulnessRatingSum * 10 >= input.usefulnessRatingCount * 35
  };
  const evidenceCoverage = {
    numerator: input.displayedLiveOpportunityWithEvidenceAndProvenanceCount,
    denominator: input.displayedLiveOpportunityCount,
    pass:
      input.displayedLiveOpportunityCount > 0 &&
      input.displayedLiveOpportunityWithEvidenceAndProvenanceCount === input.displayedLiveOpportunityCount
  };
  const repeatUse = {
    distinctParticipants: input.voluntaryRepeatParticipantCount,
    pass: input.voluntaryRepeatParticipantCount >= 3
  };
  const safetyPass =
    input.criticalSecretExposureCount === 0 &&
    input.unauthorizedAccessIncidentCount === 0 &&
    input.dataLossIncidentCount === 0 &&
    input.criticalReliabilityIncidentCount === 0;
  const valuePass =
    scanCompletion.pass &&
    savedSessionRate.pass &&
    usefulness.pass &&
    evidenceCoverage.pass &&
    repeatUse.pass;
  const g02Eligible =
    input.state === "completed" &&
    input.primaryParticipantCount === 5 &&
    input.primarySessionCount === 5 &&
    safetyPass &&
    valuePass;

  return {
    scanCompletion,
    savedSessionRate,
    usefulness,
    evidenceCoverage,
    repeatUse,
    diagnostics: {
      evidenceQualityRatingCount: input.evidenceQualityRatingCount,
      evidenceQualityRatingSum: input.evidenceQualityRatingSum,
      rankingQualityRatingCount: input.rankingQualityRatingCount,
      rankingQualityRatingSum: input.rankingQualityRatingSum
    },
    safetyPass,
    valuePass,
    g02Eligible
  };
}

export function evaluatePhase5Gate({ manifest, evidence }) {
  assertPlainObject(manifest, "Phase 5 manifest");
  assertPlainObject(evidence, "Phase 5 cohort evidence");
  assertSecretSafeEvidenceText(JSON.stringify({ manifest, evidence }));
  validateManifestShape(manifest);

  if (manifest.schemaVersion !== "1.0.0" || manifest.phaseId !== "P5" || manifest.phaseGateTaskId !== "TASK-P5-G03") {
    throw new Error("Phase 5 manifest does not match the approved schema identity.");
  }
  if (evidence.schemaVersion !== "1.0.0" || evidence.phaseId !== "P5") {
    throw new Error("Phase 5 cohort evidence does not match the approved schema identity.");
  }
  if (evidence.contractVersion !== CONTRACT_VERSION) {
    throw new Error("Phase 5 cohort evidence does not match the approved contract identity.");
  }
  assertOnlyFields(evidence, EVIDENCE_FIELDS, "Phase 5 cohort evidence");
  assertNonNegativeInteger(evidence.currentValidationRevision, "currentValidationRevision");
  if (evidence.currentValidationRevision < 1) {
    throw new Error("Current validation revision must be positive.");
  }
  if (!Array.isArray(evidence.validationHistory)) {
    throw new Error("Phase 5 validation history must be an array.");
  }

  const history = validateHistory(evidence.validationHistory, evidence.currentValidationRevision);
  if (evidence.cohort1?.cohortId !== "cohort-1") {
    throw new Error("The Cohort 1 identifier must be cohort-1.");
  }
  if (evidence.cohort1?.validationRevision !== evidence.currentValidationRevision) {
    throw new Error("Cohort 1 evidence must use the current validation revision.");
  }
  if (evidence.cohort1.primaryParticipantCount > 5 || evidence.cohort1.primarySessionCount > 5) {
    throw new Error("Cohort 1 is limited to five participants and primary sessions.");
  }
  const cohort1Metrics = evaluateCohortMetrics(evidence.cohort1);
  if (evidence.cohort1.g02Decision === "GO" && !cohort1Metrics.g02Eligible) {
    throw new Error("A Cohort 1 G02 GO is inconsistent with the aggregate evidence.");
  }

  let cohort2Metrics = null;
  let aggregateInput = evidence.cohort1;
  if (evidence.cohort2 !== null) {
    if (evidence.cohort1.g02Decision !== "GO" || !cohort1Metrics.g02Eligible) {
      throw new Error("Cohort 2 requires a genuine Cohort 1 G02 GO.");
    }
    if (evidence.cohort2?.validationRevision !== evidence.currentValidationRevision) {
      throw new Error("Cohort 2 evidence must use the current validation revision.");
    }
    if (evidence.cohort2?.cohortId !== "cohort-2") {
      throw new Error("The Cohort 2 identifier must be cohort-2.");
    }
    if (evidence.cohort2.state !== "completed") {
      throw new Error("Executed Cohort 2 evidence must be completed before final evaluation.");
    }
    if (evidence.cohort2.g02Decision !== "not-evaluated") {
      throw new Error("Cohort 2 does not carry a separate G02 decision.");
    }
    if (evidence.cohort2.primaryParticipantCount > 5 || evidence.cohort2.primarySessionCount > 5) {
      throw new Error("Cohort 2 is limited to five additional participants and primary sessions.");
    }
    cohort2Metrics = evaluateCohortMetrics(evidence.cohort2);
    aggregateInput = aggregateCohorts(evidence.cohort1, evidence.cohort2);
    if (aggregateInput.primaryParticipantCount > 10 || aggregateInput.primarySessionCount > 10) {
      throw new Error("Phase 5 is limited to ten total participants and primary sessions.");
    }
  }
  const aggregateMetrics = evaluateCohortMetrics(aggregateInput);

  const checks = validateManifestChecks(manifest.checks);
  const unresolved = checks.filter((item) => item.status !== "pass").map(({ id, area, status }) => ({ id, area, status }));
  const allChecksPass = unresolved.length === 0;
  const executedEvidencePass = evidence.cohort2 === null
    ? evidence.cohort1.g02Decision === "GO" && cohort1Metrics.g02Eligible
    : aggregateMetrics.safetyPass && aggregateMetrics.valuePass;
  const computedDecision =
    manifest.currentTaskId === "TASK-P5-G03" && allChecksPass && executedEvidencePass ? "GO" : "NO-GO";
  if (manifest.decision !== computedDecision) {
    throw new Error("Phase 5 manifest decision is inconsistent with evaluated evidence and checks.");
  }

  return {
    taskId: manifest.currentTaskId,
    phaseId: manifest.phaseId,
    decision: computedDecision,
    cohort1: { metrics: cohort1Metrics, g02Decision: evidence.cohort1.g02Decision },
    cohort2: cohort2Metrics === null ? null : { metrics: cohort2Metrics },
    aggregate: { metrics: aggregateMetrics },
    directG03Eligible:
      evidence.cohort2 === null &&
      evidence.cohort1.g02Decision === "GO" &&
      cohort1Metrics.g02Eligible,
    history,
    unresolved
  };
}

function validateManifestChecks(checks) {
  if (!Array.isArray(checks) || checks.length !== REQUIRED_CHECK_AREAS.size) {
    throw new Error("Phase 5 manifest must contain every canonical P0 check exactly once.");
  }
  const ids = new Set();
  const evidenceIds = new Set();
  return checks.map((item) => {
    assertPlainObject(item, "Phase 5 manifest check");
    assertOnlyFields(item, CHECK_FIELDS, "Phase 5 manifest check");
    if (
      typeof item?.id !== "string" ||
      typeof item?.area !== "string" ||
      item.priority !== "P0" ||
      !ALLOWED_CHECK_STATUSES.has(item.status) ||
      typeof item.evidenceId !== "string" ||
      !/^[a-z0-9][a-z0-9.-]{0,159}$/u.test(item.evidenceId) ||
      typeof item.safeSummary !== "string" ||
      item.safeSummary.length === 0 ||
      item.safeSummary.length > 500
    ) {
      throw new Error("Phase 5 manifest contains an invalid P0 check.");
    }
    if (ids.has(item.id) || evidenceIds.has(item.evidenceId)) {
      throw new Error("Phase 5 manifest check and evidence identifiers must be unique.");
    }
    ids.add(item.id);
    evidenceIds.add(item.evidenceId);
    if (REQUIRED_CHECK_AREAS.get(item.id) !== item.area) {
      throw new Error("Phase 5 manifest must contain every canonical P0 check exactly once.");
    }
    return item;
  });
}

function validateHistory(items, currentRevision) {
  if (items.length !== currentRevision - 1) {
    throw new Error("Validation history must retain every prior revision.");
  }
  let previousRevision = 0;
  const evidenceIds = new Set();
  return items.map((item, index) => {
    assertPlainObject(item, "validation history entry");
    assertOnlyFields(item, new Set(["validationRevision", "decision", "evidenceId", "evidenceDigest"]), "validation history entry");
    if (
      !Number.isInteger(item.validationRevision) ||
      item.validationRevision !== index + 1 ||
      item.validationRevision <= previousRevision
    ) {
      throw new Error("Validation history must retain every prior revision in strict order.");
    }
    if (item.validationRevision >= currentRevision) {
      throw new Error("The current validation revision must be greater than historical revisions.");
    }
    if (!ALLOWED_HISTORY_DECISIONS.has(item.decision)) {
      throw new Error("Validation history contains an unknown decision.");
    }
    if (
      typeof item.evidenceId !== "string" ||
      !/^[a-z0-9][a-z0-9.-]{0,159}$/u.test(item.evidenceId) ||
      evidenceIds.has(item.evidenceId)
    ) {
      throw new Error("Validation history requires a bounded safe evidence identifier that is unique.");
    }
    if (typeof item.evidenceDigest !== "string" || !/^[a-f0-9]{64}$/u.test(item.evidenceDigest)) {
      throw new Error("Validation history requires a lowercase SHA-256 evidence digest.");
    }
    previousRevision = item.validationRevision;
    evidenceIds.add(item.evidenceId);
    return { ...item };
  });
}

function validateManifestShape(manifest) {
  assertOnlyFields(manifest, MANIFEST_FIELDS, "Phase 5 manifest");
  if (
    manifest.schemaVersion !== "1.0.0" ||
    manifest.phaseId !== "P5" ||
    manifest.phaseGateTaskId !== "TASK-P5-G03"
  ) {
    throw new Error("Phase 5 manifest does not match the approved schema identity.");
  }
  if (!ALLOWED_PHASE_TASKS.has(manifest.currentTaskId)) {
    throw new Error("Phase 5 manifest contains an unknown current task.");
  }
  if (typeof manifest.recordedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(manifest.recordedAt)) {
    throw new Error("Phase 5 manifest contains an invalid recorded date.");
  }
  if (typeof manifest.baselineSha !== "string" || !/^[a-f0-9]{40}$/u.test(manifest.baselineSha)) {
    throw new Error("Phase 5 manifest contains an invalid baseline SHA.");
  }
  if (!ALLOWED_MANIFEST_STATUSES.has(manifest.status)) {
    throw new Error("Phase 5 manifest contains an unknown status.");
  }
  if (!new Set(["GO", "NO-GO"]).has(manifest.decision)) {
    throw new Error("Phase 5 manifest contains an unknown decision.");
  }
  if (
    typeof manifest.productRuntimeImplementationAuthorized !== "boolean" ||
    typeof manifest.cohortInvitationsAuthorized !== "boolean"
  ) {
    throw new Error("Phase 5 manifest authorization flags must be boolean.");
  }

  assertPlainObject(manifest.publishedGovernanceBaseline, "published governance baseline");
  assertOnlyFields(
    manifest.publishedGovernanceBaseline,
    PUBLISHED_BASELINE_FIELDS,
    "published governance baseline"
  );
  if (
    typeof manifest.publishedGovernanceBaseline.mainSha !== "string" ||
    !/^[a-f0-9]{40}$/u.test(manifest.publishedGovernanceBaseline.mainSha) ||
    typeof manifest.publishedGovernanceBaseline.canonicalDigest !== "string" ||
    !/^[a-f0-9]{64}$/u.test(manifest.publishedGovernanceBaseline.canonicalDigest)
  ) {
    throw new Error("Published governance evidence must use safe SHA identifiers.");
  }

  if (!Array.isArray(manifest.openDecisions) || manifest.openDecisions.length !== 0) {
    throw new Error("The G01 contract cannot retain unresolved bootstrap decisions.");
  }
  if (!Array.isArray(manifest.resolvedDecisions) || manifest.resolvedDecisions.length !== 1) {
    throw new Error("The G01 contract must contain the resolved Cohort 2 decision.");
  }
  const [decision] = manifest.resolvedDecisions;
  assertPlainObject(decision, "resolved decision");
  assertOnlyFields(decision, RESOLVED_DECISION_FIELDS, "resolved decision");
  if (
    decision.id !== "cohort-2.exit-requirement" ||
    decision.ownerTaskId !== "TASK-P5-G01" ||
    decision.status !== "resolved" ||
    decision.resolution !== "optional" ||
    typeof decision.safeSummary !== "string" ||
    decision.safeSummary.length === 0 ||
    decision.safeSummary.length > 500
  ) {
    throw new Error("The Phase 5 manifest contains an invalid resolved decision.");
  }
  if (
    !Array.isArray(manifest.notes) ||
    manifest.notes.some((note) => typeof note !== "string" || note.length === 0 || note.length > 500)
  ) {
    throw new Error("Phase 5 manifest notes must be bounded safe text.");
  }
}

function aggregateCohorts(first, second) {
  const aggregate = {
    ...first,
    cohortId: "cohort-1",
    state: first.state === "completed" && second.state === "completed" ? "completed" : "in-progress",
    g02Decision: first.g02Decision,
    releaseSha: first.releaseSha,
    domainId: first.domainId
  };
  for (const field of COUNT_FIELDS) aggregate[field] = first[field] + second[field];
  return aggregate;
}

function assertRatingRange(count, sum, label) {
  if (sum < count || sum > count * 5) {
    throw new Error(`${label} rating sum is outside the valid 1-5 range.`);
  }
}

function assertNonNegativeInteger(value, field) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative integer.`);
  }
}

function assertOnlyFields(value, allowed, label) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw new Error(`${label} contains an unknown field.`);
  }
}

function assertPlainObject(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

async function main() {
  try {
    const manifestUrl = process.env.PHASE_5_MANIFEST_FILE
      ? new URL(`file://${process.env.PHASE_5_MANIFEST_FILE}`)
      : DEFAULT_PHASE_MANIFEST_URL;
    const evidenceUrl = process.env.PHASE_5_COHORT_EVIDENCE_FILE
      ? new URL(`file://${process.env.PHASE_5_COHORT_EVIDENCE_FILE}`)
      : DEFAULT_COHORT_EVIDENCE_URL;
    const [manifestText, evidenceText] = await Promise.all([
      readFile(manifestUrl, "utf8"),
      readFile(evidenceUrl, "utf8")
    ]);
    assertSecretSafeEvidenceText(manifestText);
    assertSecretSafeEvidenceText(evidenceText);
    const report = evaluatePhase5Gate({
      manifest: JSON.parse(manifestText),
      evidence: JSON.parse(evidenceText)
    });
    console.log(JSON.stringify(report, null, 2));
    if (report.decision !== "GO") process.exitCode = 1;
  } catch (error) {
    console.error(
      `Phase 5 gate verification failed safely: ${error instanceof Error ? error.message : "Unknown safe failure."}`
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
