import { describe, expect, it } from "vitest";
import {
  DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
  OPPORTUNITY_RANKING_FACTOR_IDS,
  OPPORTUNITY_RANKING_FACTOR_KINDS,
  OPPORTUNITY_RANKING_MODES,
  OPPORTUNITY_RANKING_OUTPUT_STATUSES,
  OPPORTUNITY_RANKING_SIGNAL_IDS,
  OPPORTUNITY_RANKING_SIGNAL_SOURCES,
  OPPORTUNITY_RANKING_STAGES
} from "../index.js";
import type {
  OpportunityRankPosition,
  OpportunityRankingFactor,
  OpportunityRankingFieldPath,
  OpportunityRankingInput,
  OpportunityRankingInputContract,
  OpportunityRankingOutput,
  OpportunityRankingOutputContract,
  OpportunityRankingRequestId,
  OpportunityRankingRunId,
  OpportunityRankingScoreValue,
  OpportunityRankingSignal,
  OpportunityRankingTimestamp,
  OpportunityRankingUpstreamReference,
  OpportunityRankingVersion,
  RankedOpportunityId
} from "../index.js";

const rankedAt = "2026-07-03T00:00:00.000Z" as OpportunityRankingTimestamp;
const version = "ranking-v1" as OpportunityRankingVersion;
const candidate = {
  packageName: "@opportunity-os/opportunity-candidates",
  entityKind: "candidate-opportunity",
  entityId: "candidate-1",
  version: "candidate-v1"
} satisfies OpportunityRankingUpstreamReference;
const generatedOpportunity = {
  packageName: "@opportunity-os/opportunity-generation",
  entityKind: "generated-opportunity",
  entityId: "opportunity-1",
  version: "generation-v1"
} satisfies OpportunityRankingUpstreamReference;
const generationOutput = {
  packageName: "@opportunity-os/opportunity-generation",
  entityKind: "generation-output",
  entityId: "generation-output-1",
  version: "generation-v1"
} satisfies OpportunityRankingUpstreamReference;

const confidenceSignal: OpportunityRankingSignal = {
  signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence,
  source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.candidate,
  fieldPath: "candidate.confidence" as OpportunityRankingFieldPath,
  value: 0.82 as OpportunityRankingScoreValue,
  normalizedValue: 0.82 as OpportunityRankingScoreValue,
  explanation: "Uses an explicit upstream candidate confidence value."
};

const evidenceSignal: OpportunityRankingSignal = {
  signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.evidenceCompleteness,
  source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.evidence,
  fieldPath: "candidate.evidence" as OpportunityRankingFieldPath,
  value: 0.75 as OpportunityRankingScoreValue,
  normalizedValue: 0.75 as OpportunityRankingScoreValue,
  explanation: "Uses explicit evidence completeness metadata."
};

const confidenceFactor: OpportunityRankingFactor = {
  factorId: OPPORTUNITY_RANKING_FACTOR_IDS.confidenceStrength,
  kind: OPPORTUNITY_RANKING_FACTOR_KINDS.confidence,
  signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence],
  value: 0.82 as OpportunityRankingScoreValue,
  explanation: "Confidence strength is derived from an explicit signal."
};

describe("Opportunity Ranking model contracts", () => {
  it("defines stable deterministic vocabularies", () => {
    expect(OPPORTUNITY_RANKING_MODES.deterministic).toBe("deterministic");
    expect(OPPORTUNITY_RANKING_STAGES.signalsPrepared).toBe("signals-prepared");
    expect(OPPORTUNITY_RANKING_OUTPUT_STATUSES.ranked).toBe("ranked");
    expect(OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence).toBe("candidate-confidence");
    expect(OPPORTUNITY_RANKING_FACTOR_IDS.confidenceStrength).toBe("confidence-strength");
  });

  it("models explicit provider-independent ranking input", () => {
    const input: OpportunityRankingInput = {
      requestId: "ranking-request-1" as OpportunityRankingRequestId,
      generatedOpportunities: [generatedOpportunity],
      generationOutputs: [generationOutput],
      candidates: [candidate],
      signals: {
        signals: [confidenceSignal, evidenceSignal],
        deterministic: true,
        providerIndependent: true,
        explainable: true
      },
      factors: {
        factors: [confidenceFactor],
        deterministic: true,
        explainable: true
      },
      weights: DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
      context: {
        requestedAt: rankedAt,
        requestedBy: "test",
        mode: OPPORTUNITY_RANKING_MODES.deterministic,
        version,
        safeMetadata: {
          fixture: true
        }
      }
    };

    const contract: OpportunityRankingInputContract = {
      input,
      deterministic: true,
      explicitInputsOnly: true,
      providerIndependent: true,
      explainable: true
    };

    expect(contract.input.generatedOpportunities).toHaveLength(1);
    expect(contract.input.signals?.explainable).toBe(true);
    expect(contract.explicitInputsOnly).toBe(true);
  });

  it("models explainable ranked output without computing a ranking", () => {
    const output: OpportunityRankingOutput = {
      runId: "ranking-run-1" as OpportunityRankingRunId,
      status: OPPORTUNITY_RANKING_OUTPUT_STATUSES.ranked,
      rankedOpportunities: [
        {
          rankedOpportunityId: "ranked-opportunity-1" as RankedOpportunityId,
          opportunity: generatedOpportunity,
          rank: 1 as OpportunityRankPosition,
          score: 0.8 as OpportunityRankingScoreValue,
          signals: [confidenceSignal, evidenceSignal],
          factors: [confidenceFactor],
          explanation: {
            summary: "Ranking is represented through explicit signals, factors, and weights.",
            signalCount: 2,
            factorCount: 1,
            weightSetId: DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET.weightSetId
          }
        }
      ],
      completedStages: [
        OPPORTUNITY_RANKING_STAGES.inputPrepared,
        OPPORTUNITY_RANKING_STAGES.signalsPrepared,
        OPPORTUNITY_RANKING_STAGES.factorsPrepared,
        OPPORTUNITY_RANKING_STAGES.weightsPrepared,
        OPPORTUNITY_RANKING_STAGES.outputPrepared
      ],
      rankedAt
    };

    const contract: OpportunityRankingOutputContract = {
      output,
      deterministic: true,
      providerIndependent: true,
      explainable: true
    };

    expect(contract.output.rankedOpportunities[0]?.explanation.signalCount).toBe(2);
    expect(contract.output.rankedOpportunities[0]?.factors[0]?.signalIds).toContain(
      OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence
    );
    expect(contract.explainable).toBe(true);
  });

  it("keeps signals and factors explicit and traceable", () => {
    expect(confidenceSignal.explanation).toContain("explicit");
    expect(confidenceFactor.signalIds).toEqual([OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence]);
    expect(confidenceFactor.explanation).toContain("explicit signal");
  });

  it("defines an explainable deterministic weight set", () => {
    const totalWeight = DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET.weights.reduce(
      (sum, entry) => sum + entry.weight,
      0
    );

    expect(DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET.deterministic).toBe(true);
    expect(DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET.explainable).toBe(true);
    expect(totalWeight).toBeCloseTo(1);
    expect(DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET.weights.every((entry) => entry.explanation.length > 0)).toBe(true);
  });
});
