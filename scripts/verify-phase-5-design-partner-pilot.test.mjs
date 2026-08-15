import assert from "node:assert/strict";
import test from "node:test";

import {
  assertSecretSafeEvidenceText,
  evaluateCohortMetrics,
  evaluatePhase5Gate
} from "./verify-phase-5-design-partner-pilot.mjs";

const checkAreas = {
  "prerequisite.phase-4-5-pilot-gate": "prerequisite",
  "governance.authority-transition": "governance",
  "governance.evidence-contract": "governance",
  "cohort-1.readiness": "cohort-1",
  "cohort-1.execution": "cohort-1",
  "cohort-1.decision": "cohort-1",
  "phase.exit-review": "phase-exit"
};

const check = (id, status, evidenceId = `${id}-evidence`) => ({
  id,
  area: checkAreas[id] ?? "unknown",
  priority: "P0",
  status,
  evidenceId,
  safeSummary: "Safe aggregate evidence only."
});

const manifest = (overrides = {}) => ({
  schemaVersion: "1.0.0",
  phaseId: "P5",
  phaseGateTaskId: "TASK-P5-G03",
  currentTaskId: "TASK-P5-G01",
  recordedAt: "2026-08-15",
  baselineSha: "f738112afcb9fa5d4aa71a49beb700561baa8781",
  status: "candidate",
  decision: "NO-GO",
  productRuntimeImplementationAuthorized: false,
  cohortInvitationsAuthorized: false,
  publishedGovernanceBaseline: {
    mainSha: "9dd3dd6c3e1e71f0a131778ecbc731d7480ceb91",
    canonicalDigest: "fa6f76f97b4fbea15dc47f504287c51357be49407e00671e834e36b67e82d9bb"
  },
  checks: [
    check("prerequisite.phase-4-5-pilot-gate", "pass"),
    check("governance.authority-transition", "pass"),
    check("governance.evidence-contract", "external-required"),
    check("cohort-1.readiness", "manual-required"),
    check("cohort-1.execution", "manual-required"),
    check("cohort-1.decision", "manual-required"),
    check("phase.exit-review", "manual-required")
  ],
  openDecisions: [],
  resolvedDecisions: [{
    id: "cohort-2.exit-requirement",
    ownerTaskId: "TASK-P5-G01",
    status: "resolved",
    resolution: "optional",
    safeSummary: "Cohort 2 is optional."
  }],
  notes: ["Safe aggregate evidence only."],
  ...overrides
});

const cohort = (overrides = {}) => ({
  cohortId: "cohort-1",
  state: "not-started",
  validationRevision: 1,
  releaseSha: null,
  domainId: null,
  datasource: "stack-exchange",
  mode: "live",
  g02Decision: "not-evaluated",
  primaryParticipantCount: 0,
  primarySessionCount: 0,
  initiatedLiveScanAttempts: 0,
  completedLiveScanAttempts: 0,
  primarySessionsWithSavedOpportunity: 0,
  usefulnessRatingCount: 0,
  usefulnessRatingSum: 0,
  evidenceQualityRatingCount: 0,
  evidenceQualityRatingSum: 0,
  rankingQualityRatingCount: 0,
  rankingQualityRatingSum: 0,
  displayedLiveOpportunityCount: 0,
  displayedLiveOpportunityWithEvidenceAndProvenanceCount: 0,
  voluntaryRepeatParticipantCount: 0,
  fixtureSessionCount: 0,
  liveSessionCount: 0,
  criticalSecretExposureCount: 0,
  unauthorizedAccessIncidentCount: 0,
  dataLossIncidentCount: 0,
  criticalReliabilityIncidentCount: 0,
  ...overrides
});

const passingCohort = (overrides = {}) => cohort({
  state: "completed",
  releaseSha: "a".repeat(40),
  domainId: "narrow-domain-v1",
  g02Decision: "GO",
  primaryParticipantCount: 5,
  primarySessionCount: 5,
  initiatedLiveScanAttempts: 5,
  completedLiveScanAttempts: 4,
  primarySessionsWithSavedOpportunity: 2,
  usefulnessRatingCount: 4,
  usefulnessRatingSum: 14,
  evidenceQualityRatingCount: 4,
  evidenceQualityRatingSum: 12,
  rankingQualityRatingCount: 4,
  rankingQualityRatingSum: 12,
  displayedLiveOpportunityCount: 10,
  displayedLiveOpportunityWithEvidenceAndProvenanceCount: 10,
  voluntaryRepeatParticipantCount: 3,
  liveSessionCount: 8,
  ...overrides
});

const evidence = (overrides = {}) => ({
  schemaVersion: "1.0.0",
  contractVersion: "phase-5-pilot-evidence-v1",
  phaseId: "P5",
  currentValidationRevision: 1,
  validationHistory: [],
  cohort1: cohort(),
  cohort2: null,
  ...overrides
});

test("valid empty evidence returns NO-GO", () => {
  const report = evaluatePhase5Gate({ manifest: manifest(), evidence: evidence() });
  assert.equal(report.decision, "NO-GO");
  assert.equal(report.cohort1.metrics.scanCompletion.pass, false);
});

test("rejects malformed schema and contract identities", () => {
  assert.throws(() => evaluatePhase5Gate({ manifest: manifest(), evidence: evidence({ schemaVersion: "0.9.0" }) }), /schema identity/u);
  assert.throws(() => evaluatePhase5Gate({ manifest: manifest(), evidence: evidence({ contractVersion: "other" }) }), /contract identity/u);
});

test("rejects unknown and participant-level evidence fields", () => {
  assert.throws(() => evaluatePhase5Gate({ manifest: manifest(), evidence: evidence({ participantIds: [] }) }), /unknown field/u);
  assert.throws(() => evaluatePhase5Gate({ manifest: manifest(), evidence: evidence({ cohort1: cohort({ participantRefs: [] }) }) }), /unknown field/u);
});

test("rejects negative and fractional counts", () => {
  assert.throws(() => evaluateCohortMetrics(cohort({ primarySessionCount: -1 })), /non-negative integer/u);
  assert.throws(() => evaluateCohortMetrics(cohort({ primarySessionCount: 1.5 })), /non-negative integer/u);
});

test("secret-like values fail without echoing the value", () => {
  const secret = "postgresql://user:pass@example.test/db";
  assert.throws(
    () => assertSecretSafeEvidenceText(JSON.stringify({ note: secret })),
    (error) => error instanceof Error && /secret-safe/u.test(error.message) && !error.message.includes(secret)
  );
});

test("fixture-only activity cannot satisfy live value metrics", () => {
  assert.throws(() => evaluateCohortMetrics(cohort({
    state: "completed",
    releaseSha: "a".repeat(40),
    domainId: "narrow-domain-v1",
    primaryParticipantCount: 5,
    primarySessionCount: 5,
    initiatedLiveScanAttempts: 5,
    fixtureSessionCount: 8,
    usefulnessRatingCount: 5,
    usefulnessRatingSum: 25,
    displayedLiveOpportunityCount: 5,
    displayedLiveOpportunityWithEvidenceAndProvenanceCount: 5,
    voluntaryRepeatParticipantCount: 3
  })), /live sessions/u);
});

test("fixture-only aggregates cannot masquerade as otherwise passing live evidence", () => {
  assert.throws(
    () => evaluateCohortMetrics(passingCohort({ fixtureSessionCount: 8, liveSessionCount: 0 })),
    /live sessions/u
  );
});

test("Reddit cannot satisfy the Stack Exchange v1 contract", () => {
  assert.throws(() => evaluateCohortMetrics(cohort({ datasource: "reddit" })), /datasource/u);
});

test("scan completion uses exact 80 percent arithmetic and retains retries", () => {
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", initiatedLiveScanAttempts: 100, completedLiveScanAttempts: 79 })).scanCompletion.pass, false);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", initiatedLiveScanAttempts: 5, completedLiveScanAttempts: 4 })).scanCompletion.pass, true);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", initiatedLiveScanAttempts: 6, completedLiveScanAttempts: 4 })).scanCompletion.pass, false);
});

test("saved-session rate uses primary sessions and exact rational arithmetic", () => {
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", primarySessionCount: 10, initiatedLiveScanAttempts: 10, completedLiveScanAttempts: 10, liveSessionCount: 10, primarySessionsWithSavedOpportunity: 2 })).savedSessionRate.pass, false);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", primarySessionCount: 10, initiatedLiveScanAttempts: 10, completedLiveScanAttempts: 10, liveSessionCount: 10, primarySessionsWithSavedOpportunity: 3 })).savedSessionRate.pass, true);
  assert.throws(() => evaluateCohortMetrics(cohort({ state: "in-progress", primarySessionCount: 2, primarySessionsWithSavedOpportunity: 3 })), /saved-opportunity sessions/u);
});

test("usefulness requires ratings, exact 3.5 average, and possible sums", () => {
  assert.equal(evaluateCohortMetrics(cohort()).usefulness.pass, false);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", usefulnessRatingCount: 100, usefulnessRatingSum: 349 })).usefulness.pass, false);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", usefulnessRatingCount: 2, usefulnessRatingSum: 7 })).usefulness.pass, true);
  assert.throws(() => evaluateCohortMetrics(cohort({ state: "in-progress", usefulnessRatingCount: 2, usefulnessRatingSum: 11 })), /rating sum/u);
});

test("diagnostic ratings do not create value thresholds", () => {
  const metrics = evaluateCohortMetrics(passingCohort({ evidenceQualityRatingSum: 4, rankingQualityRatingSum: 4 }));
  assert.equal(metrics.valuePass, true);
});

test("evidence and provenance coverage requires a nonzero exact 100 percent denominator", () => {
  assert.equal(evaluateCohortMetrics(cohort()).evidenceCoverage.pass, false);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", displayedLiveOpportunityCount: 100, displayedLiveOpportunityWithEvidenceAndProvenanceCount: 99 })).evidenceCoverage.pass, false);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", displayedLiveOpportunityCount: 10, displayedLiveOpportunityWithEvidenceAndProvenanceCount: 10 })).evidenceCoverage.pass, true);
});

for (const incidentField of [
  "criticalSecretExposureCount",
  "unauthorizedAccessIncidentCount",
  "dataLossIncidentCount",
  "criticalReliabilityIncidentCount"
]) {
  test(`${incidentField} independently forces a safety failure`, () => {
    assert.equal(evaluateCohortMetrics(passingCohort({ [incidentField]: 1 })).safetyPass, false);
  });
}

test("repeat use counts distinct governed participants", () => {
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", primaryParticipantCount: 5, voluntaryRepeatParticipantCount: 2, liveSessionCount: 2 })).repeatUse.pass, false);
  assert.equal(evaluateCohortMetrics(cohort({ state: "in-progress", primaryParticipantCount: 5, voluntaryRepeatParticipantCount: 3, liveSessionCount: 3 })).repeatUse.pass, true);
  assert.throws(() => evaluateCohortMetrics(cohort({ state: "in-progress", primaryParticipantCount: 2, voluntaryRepeatParticipantCount: 3 })), /repeat participant count/u);
});

test("Cohort 1 G02 eligibility requires exactly five participants and sessions", () => {
  assert.equal(evaluateCohortMetrics(passingCohort()).g02Eligible, true);
  assert.equal(evaluateCohortMetrics(passingCohort({ primaryParticipantCount: 4, primarySessionCount: 4, liveSessionCount: 7 })).g02Eligible, false);
  assert.equal(evaluateCohortMetrics(passingCohort({ primaryParticipantCount: 6, primarySessionCount: 6, initiatedLiveScanAttempts: 6, completedLiveScanAttempts: 5, liveSessionCount: 9 })).g02Eligible, false);
});

test("Cohort 1 leaf evidence cannot exceed the five-participant schema ceiling", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({
      cohort1: passingCohort({
        g02Decision: "NO-GO",
        primaryParticipantCount: 6,
        primarySessionCount: 6,
        initiatedLiveScanAttempts: 6,
        completedLiveScanAttempts: 5,
        liveSessionCount: 9
      })
    })
  }), /Cohort 1 is limited to five participants/u);
});

test("Cohort 2 cannot exist before a genuine Cohort 1 G02 GO", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({ cohort2: passingCohort({ cohortId: "cohort-2" }) })
  }), /Cohort 2 requires/u);
});

test("Cohort 2 absence does not block direct G03 eligibility after G02 GO", () => {
  const report = evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({ cohort1: passingCohort(), cohort2: null })
  });
  assert.equal(report.directG03Eligible, true);
});

test("executed Cohort 2 evidence cannot be ignored when it worsens final aggregates", () => {
  const report = evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({
      cohort1: passingCohort(),
      cohort2: passingCohort({
        cohortId: "cohort-2",
        primaryParticipantCount: 5,
        primarySessionCount: 5,
        initiatedLiveScanAttempts: 10,
        completedLiveScanAttempts: 0,
        primarySessionsWithSavedOpportunity: 0,
        g02Decision: "not-evaluated"
      })
    })
  });
  assert.equal(report.aggregate.metrics.scanCompletion.pass, false);
  assert.equal(report.directG03Eligible, false);
});

test("an incomplete Cohort 2 cannot produce final Phase 5 GO", () => {
  const allPassManifest = manifest({
    currentTaskId: "TASK-P5-G03",
    decision: "GO",
    checks: manifest().checks.map((item) => ({ ...item, status: "pass" }))
  });
  assert.throws(() => evaluatePhase5Gate({
    manifest: allPassManifest,
    evidence: evidence({
      cohort1: passingCohort(),
      cohort2: passingCohort({ cohortId: "cohort-2", state: "in-progress", g02Decision: "not-evaluated" })
    })
  }), /completed/u);
});

test("a zero-activity completed Cohort 2 cannot produce final Phase 5 GO", () => {
  const passingChecks = manifest().checks.map((item) => ({ ...item, status: "pass" }));
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ currentTaskId: "TASK-P5-G03", decision: "GO", checks: passingChecks }),
    evidence: evidence({
      cohort1: passingCohort(),
      cohort2: cohort({
        cohortId: "cohort-2",
        state: "completed",
        releaseSha: "b".repeat(40),
        domainId: "narrow-domain-v1"
      })
    })
  }), /participant and one primary session/u);
});

test("Cohort 2 may expand to ten total participants but cannot exceed that ceiling", () => {
  const passingChecks = manifest().checks.map((item) => ({ ...item, status: "pass" }));
  const finalManifest = manifest({ currentTaskId: "TASK-P5-G03", decision: "GO", checks: passingChecks });
  const sizeFiveReport = evaluatePhase5Gate({
    manifest: finalManifest,
    evidence: evidence({
      cohort1: passingCohort(),
      cohort2: passingCohort({ cohortId: "cohort-2", g02Decision: "not-evaluated" })
    })
  });
  assert.equal(sizeFiveReport.decision, "GO");

  assert.throws(() => evaluatePhase5Gate({
    manifest: finalManifest,
    evidence: evidence({
      cohort1: passingCohort(),
      cohort2: passingCohort({
        cohortId: "cohort-2",
        g02Decision: "not-evaluated",
        primaryParticipantCount: 6,
        primarySessionCount: 6,
        initiatedLiveScanAttempts: 6,
        completedLiveScanAttempts: 5,
        liveSessionCount: 9
      })
    })
  }), /five additional participants/u);
});

test("validation history is monotonic and preserves failed revisions", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({
      currentValidationRevision: 1,
      validationHistory: [{ validationRevision: 1, decision: "NO-GO", evidenceId: "revision-1-no-go", evidenceDigest: "b".repeat(64) }]
    })
  }), /every prior revision|greater than historical/u);

  const report = evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({
      currentValidationRevision: 2,
      validationHistory: [{ validationRevision: 1, decision: "NO-GO", evidenceId: "revision-1-no-go", evidenceDigest: "b".repeat(64) }],
      cohort1: cohort({ validationRevision: 2 })
    })
  });
  assert.equal(report.history[0]?.decision, "NO-GO");
});

test("historical decisions require a content digest binding", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({
      currentValidationRevision: 2,
      validationHistory: [{ validationRevision: 1, decision: "NO-GO", evidenceId: "revision-1-no-go" }],
      cohort1: cohort({ validationRevision: 2 })
    })
  }), /digest/u);
});

test("validation history must contain every prior revision without gaps", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({
      currentValidationRevision: 3,
      validationHistory: [],
      cohort1: cohort({ validationRevision: 3 })
    })
  }), /every prior revision/u);

  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({
      currentValidationRevision: 3,
      validationHistory: [{ validationRevision: 2, decision: "NO-GO", evidenceId: "revision-2-no-go", evidenceDigest: "b".repeat(64) }],
      cohort1: cohort({ validationRevision: 3 })
    })
  }), /every prior revision/u);
});

test("validation history evidence identifiers use the bounded safe schema form", () => {
  for (const evidenceId of ["a".repeat(161), "revision 1", "Revision-1", "revision_1"]) {
    assert.throws(() => evaluatePhase5Gate({
      manifest: manifest(),
      evidence: evidence({
        currentValidationRevision: 2,
        validationHistory: [{ validationRevision: 1, decision: "NO-GO", evidenceId, evidenceDigest: "b".repeat(64) }],
        cohort1: cohort({ validationRevision: 2 })
      })
    }), /bounded safe evidence identifier/u);
  }
});

test("cohort positions require their canonical aggregate identifiers", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest(),
    evidence: evidence({ cohort1: cohort({ cohortId: "cohort-2" }) })
  }), /Cohort 1 identifier/u);
});

test("cohort lifecycle rejects impossible not-started and completed states", () => {
  assert.throws(() => evaluateCohortMetrics(cohort({ primaryParticipantCount: 1 })), /not-started/u);
  assert.throws(() => evaluateCohortMetrics(cohort({ state: "completed" })), /completed cohort/u);
});

test("manifest decisions and checks must remain consistent with current evidence", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ decision: "GO" }),
    evidence: evidence()
  }), /manifest decision/u);
});

test("manifest shape and canonical P0 check membership are fail-closed", () => {
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ participantEmail: "person@example.test" }),
    evidence: evidence()
  }), /secret-safe|unknown field/u);

  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ checks: [check("arbitrary.check", "pass")] }),
    evidence: evidence()
  }), /canonical P0 check/u);

  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ checks: manifest().checks.map((item, index) => index === 0 ? { ...item, participantRef: "participant-1" } : item) }),
    evidence: evidence()
  }), /unknown field/u);

  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ notes: ["person@example.test"] }),
    evidence: evidence()
  }), /secret-safe/u);

  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ resolvedDecisions: [{ ...manifest().resolvedDecisions[0], participantRef: "participant-1" }] }),
    evidence: evidence()
  }), /unknown field/u);
});

test("final Phase 5 GO requires G03 plus every canonical P0 check", () => {
  const passingChecks = manifest().checks.map((item) => ({ ...item, status: "pass" }));
  assert.throws(() => evaluatePhase5Gate({
    manifest: manifest({ decision: "GO", checks: passingChecks }),
    evidence: evidence({ cohort1: passingCohort() })
  }), /manifest decision/u);

  const report = evaluatePhase5Gate({
    manifest: manifest({ currentTaskId: "TASK-P5-G03", decision: "GO", checks: passingChecks }),
    evidence: evidence({ cohort1: passingCohort() })
  });
  assert.equal(report.decision, "GO");
});
