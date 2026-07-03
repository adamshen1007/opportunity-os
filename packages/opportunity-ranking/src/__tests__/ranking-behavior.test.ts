import { describe, expect, it } from "vitest";
import {
  DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
  OPPORTUNITY_RANKING_ERROR_CODES,
  OPPORTUNITY_RANKING_EVENT_NAMES,
  OPPORTUNITY_RANKING_FACTOR_IDS,
  OPPORTUNITY_RANKING_FACTOR_KINDS,
  OPPORTUNITY_RANKING_MODES,
  OPPORTUNITY_RANKING_RESULT_STATUSES,
  OPPORTUNITY_RANKING_SIGNAL_IDS,
  OPPORTUNITY_RANKING_SIGNAL_SOURCES,
  OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES,
  OpportunityRankingError,
  calculateOpportunityRankingScore,
  explainOpportunityRankingTieBreak,
  rankOpportunities,
  validateOpportunityRankingInput
} from "../index.js";
import type {
  OpportunityRankingFactor,
  OpportunityRankingFieldPath,
  OpportunityRankingInput,
  OpportunityRankingRequestId,
  OpportunityRankingRunId,
  OpportunityRankingScoreValue,
  OpportunityRankingSignal,
  OpportunityRankingTimestamp,
  OpportunityRankingUpstreamReference,
  OpportunityRankingVersion
} from "../index.js";

const rankedAt = "2026-07-03T00:00:00.000Z" as OpportunityRankingTimestamp;
const version = "ranking-v1" as OpportunityRankingVersion;

const opportunityA = {
  packageName: "@opportunity-os/opportunity-generation",
  entityKind: "generated-opportunity",
  entityId: "opportunity-a",
  version: "generation-v1"
} satisfies OpportunityRankingUpstreamReference;

const opportunityB = {
  packageName: "@opportunity-os/opportunity-generation",
  entityKind: "generated-opportunity",
  entityId: "opportunity-b",
  version: "generation-v1"
} satisfies OpportunityRankingUpstreamReference;

const confidenceSignal: OpportunityRankingSignal = {
  signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence,
  source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.candidate,
  fieldPath: "candidate.confidence" as OpportunityRankingFieldPath,
  value: 0.9 as OpportunityRankingScoreValue,
  normalizedValue: 0.9 as OpportunityRankingScoreValue,
  explanation: "Explicit candidate confidence."
};

const evidenceSignal: OpportunityRankingSignal = {
  signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.evidenceCompleteness,
  source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.evidence,
  fieldPath: "candidate.evidence" as OpportunityRankingFieldPath,
  value: 0.8 as OpportunityRankingScoreValue,
  normalizedValue: 0.8 as OpportunityRankingScoreValue,
  explanation: "Explicit evidence completeness."
};

const confidenceFactor: OpportunityRankingFactor = {
  factorId: OPPORTUNITY_RANKING_FACTOR_IDS.confidenceStrength,
  kind: OPPORTUNITY_RANKING_FACTOR_KINDS.confidence,
  signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence],
  value: 0.9 as OpportunityRankingScoreValue,
  explanation: "Confidence factor uses only explicit candidate confidence."
};

const evidenceFactor: OpportunityRankingFactor = {
  factorId: OPPORTUNITY_RANKING_FACTOR_IDS.evidenceCompleteness,
  kind: OPPORTUNITY_RANKING_FACTOR_KINDS.evidence,
  signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.evidenceCompleteness],
  value: 0.8 as OpportunityRankingScoreValue,
  explanation: "Evidence factor uses only explicit evidence completeness."
};

const createInput = (overrides: Partial<OpportunityRankingInput> = {}): OpportunityRankingInput => ({
  requestId: "ranking-request-1" as OpportunityRankingRequestId,
  generatedOpportunities: [opportunityB, opportunityA],
  generationOutputs: [
    {
      packageName: "@opportunity-os/opportunity-generation",
      entityKind: "generation-output",
      entityId: "generation-output-1",
      version: "generation-v1"
    }
  ],
  candidates: [
    {
      packageName: "@opportunity-os/opportunity-candidates",
      entityKind: "candidate-opportunity",
      entityId: "candidate-1",
      version: "candidate-v1"
    }
  ],
  signals: {
    signals: [confidenceSignal, evidenceSignal],
    deterministic: true,
    providerIndependent: true,
    explainable: true
  },
  factors: {
    factors: [confidenceFactor, evidenceFactor],
    deterministic: true,
    explainable: true
  },
  weights: DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
  context: {
    requestedAt: rankedAt,
    requestedBy: "test",
    mode: OPPORTUNITY_RANKING_MODES.deterministic,
    version
  },
  ...overrides
});

describe("Opportunity Ranking behavior", () => {
  it("calculates a deterministic weighted score from explicit factors", () => {
    const calculation = calculateOpportunityRankingScore(
      [confidenceFactor, evidenceFactor],
      DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET
    );

    expect(calculation.score).toBe(0.555);
    expect(calculation.contributions).toHaveLength(2);
    expect(calculation.contributions[0]?.explanation).toContain("explicit");
    expect(calculation.explanation).toContain("weighted sum");
  });

  it("ranks ties deterministically by stable upstream references", () => {
    const result = rankOpportunities(createInput(), {
      runId: "ranking-run-1" as OpportunityRankingRunId,
      rankedAt
    });

    expect(result.status).toBe(OPPORTUNITY_RANKING_RESULT_STATUSES.success);
    if (result.status !== OPPORTUNITY_RANKING_RESULT_STATUSES.success) {
      throw new Error("Expected ranking success.");
    }

    expect(result.output.rankedOpportunities.map((entry) => entry.opportunity.entityId)).toEqual([
      "opportunity-a",
      "opportunity-b"
    ]);
    expect(result.output.rankedOpportunities.map((entry) => entry.rank)).toEqual([1, 2]);
    expect(result.output.rankedOpportunities[0]?.safeMetadata?.tieBreak).toBe(
      "entity-id-package-name-version-ascending"
    );
  });

  it("explains the tie-break decision", () => {
    const decision = explainOpportunityRankingTieBreak(opportunityB, opportunityA);

    expect(decision.winnerEntityId).toBe("opportunity-a");
    expect(decision.reason).toBe("entity-id-ascending");
    expect(decision.explanation).toContain("deterministically");
  });

  it("returns safe validation results instead of ranking invalid inputs", () => {
    const result = rankOpportunities(
      createInput({
        generatedOpportunities: [],
        signals: undefined
      }),
      {
        runId: "ranking-run-validation" as OpportunityRankingRunId,
        rankedAt
      }
    );

    expect(result.status).toBe(OPPORTUNITY_RANKING_RESULT_STATUSES.validationFailed);
    if (result.status !== OPPORTUNITY_RANKING_RESULT_STATUSES.validationFailed) {
      throw new Error("Expected validation failure.");
    }

    expect(result.error.code).toBe(OPPORTUNITY_RANKING_ERROR_CODES.validationFailed);
    expect(result.issues.map((issue) => issue.code)).toContain(
      OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingOpportunities
    );
    expect(result.issues.map((issue) => issue.code)).toContain(
      OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingSignals
    );
    expect(result.events[0]?.eventName).toBe(OPPORTUNITY_RANKING_EVENT_NAMES.rankingValidationFailed);
  });

  it("validates factor, signal, and weight explanations", () => {
    const validation = validateOpportunityRankingInput(
      createInput({
        factors: {
          factors: [
            {
              ...confidenceFactor,
              value: 2 as OpportunityRankingScoreValue,
              explanation: ""
            }
          ],
          deterministic: true,
          explainable: true
        }
      })
    );

    expect(validation.valid).toBe(false);
    if (validation.valid) {
      throw new Error("Expected validation issues.");
    }

    expect(validation.issues.map((issue) => issue.code)).toContain(
      OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.invalidFactorValue
    );
    expect(validation.issues.map((issue) => issue.code)).toContain(
      OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingExplanation
    );
  });

  it("serializes ranking errors without unsafe runtime details", () => {
    const error = new OpportunityRankingError({
      code: OPPORTUNITY_RANKING_ERROR_CODES.rankingFailed,
      message: "Ranking failed safely.",
      requestId: "ranking-request-1" as OpportunityRankingRequestId,
      safeMetadata: {
        token: "[redacted]",
        stack: "[redacted]"
      }
    });

    const safe = error.toSafeObject();
    const serialized = JSON.stringify(safe);

    expect(safe.code).toBe(OPPORTUNITY_RANKING_ERROR_CODES.rankingFailed);
    expect(serialized).not.toContain("secret-value");
    expect(serialized).not.toContain("Error:");
  });
});
