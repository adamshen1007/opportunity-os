import type { OpportunityRankingFactor } from "../factors/index.js";
import type { OpportunityRankingSignal } from "../signals/index.js";
import type {
  OpportunityRankPosition,
  OpportunityRankingRunId,
  OpportunityRankingScoreValue,
  OpportunityRankingTimestamp,
  RankedOpportunityId
} from "./primitives.js";
import type { OpportunityRankingInput } from "./ranking-input.js";
import { DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET } from "../weights/index.js";
import { createOpportunityRankingExplanation } from "./explanation.js";
import {
  OPPORTUNITY_RANKING_ERROR_CODES,
  OpportunityRankingError
} from "./ranking-error.js";
import {
  OPPORTUNITY_RANKING_EVENT_NAMES,
  type OpportunityRankingEvent
} from "./ranking-event.js";
import {
  OPPORTUNITY_RANKING_RESULT_STATUSES,
  type OpportunityRankingResult
} from "./ranking-result.js";
import { OPPORTUNITY_RANKING_OUTPUT_STATUSES, OPPORTUNITY_RANKING_STAGES } from "./primitives.js";
import { type RankedOpportunity } from "./ranking-output.js";
import { validateOpportunityRankingInput } from "./ranking-validation.js";
import { calculateOpportunityRankingScore } from "./score-calculation.js";
import { compareOpportunityRankingReferences } from "./tie-breaker.js";

export type OpportunityRankingPipelineOptions = {
  readonly runId: OpportunityRankingRunId;
  readonly rankedAt: OpportunityRankingTimestamp;
};

const createRankedOpportunityId = (entityId: string): RankedOpportunityId =>
  `ranked-${entityId}` as RankedOpportunityId;

const getSignals = (input: OpportunityRankingInput): readonly OpportunityRankingSignal[] =>
  input.signals?.signals ?? [];

const getFactors = (input: OpportunityRankingInput): readonly OpportunityRankingFactor[] =>
  input.factors?.factors ?? [];

export const rankOpportunities = (
  input: OpportunityRankingInput,
  options: OpportunityRankingPipelineOptions
): OpportunityRankingResult => {
  const validation = validateOpportunityRankingInput(input);

  if (!validation.valid) {
    const error = new OpportunityRankingError({
      code: OPPORTUNITY_RANKING_ERROR_CODES.validationFailed,
      message: "Opportunity ranking input validation failed.",
      requestId: input.requestId,
      issues: validation.issues
    });
    const event: OpportunityRankingEvent = {
      eventName: OPPORTUNITY_RANKING_EVENT_NAMES.rankingValidationFailed,
      occurredAt: options.rankedAt,
      requestId: input.requestId,
      runId: options.runId,
      safeMetadata: {
        issueCount: validation.issues.length
      }
    };

    return {
      status: OPPORTUNITY_RANKING_RESULT_STATUSES.validationFailed,
      issues: validation.issues,
      error: error.toSafeObject(),
      events: [event]
    };
  }

  const signals = getSignals(input);
  const factors = getFactors(input);
  const weightSet = input.weights ?? DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET;
  const scoreCalculation = calculateOpportunityRankingScore(factors, weightSet);

  const rankedOpportunities: readonly RankedOpportunity[] = [...input.generatedOpportunities]
    .sort(compareOpportunityRankingReferences)
    .map((opportunity, index): RankedOpportunity => ({
      rankedOpportunityId: createRankedOpportunityId(opportunity.entityId),
      opportunity,
      rank: (index + 1) as OpportunityRankPosition,
      score: scoreCalculation.score as OpportunityRankingScoreValue,
      signals,
      factors,
      explanation: createOpportunityRankingExplanation(signals, factors, weightSet, scoreCalculation),
      safeMetadata: {
        tieBreak: "entity-id-package-name-version-ascending",
        scoreExplanation: scoreCalculation.explanation
      }
    }));

  const event: OpportunityRankingEvent = {
    eventName: OPPORTUNITY_RANKING_EVENT_NAMES.rankingCompleted,
    occurredAt: options.rankedAt,
    requestId: input.requestId,
    runId: options.runId,
    safeMetadata: {
      rankedOpportunityCount: rankedOpportunities.length,
      score: scoreCalculation.score
    }
  };

  return {
    status: OPPORTUNITY_RANKING_RESULT_STATUSES.success,
    output: {
      runId: options.runId,
      status: OPPORTUNITY_RANKING_OUTPUT_STATUSES.ranked,
      rankedOpportunities,
      completedStages: [
        OPPORTUNITY_RANKING_STAGES.inputPrepared,
        OPPORTUNITY_RANKING_STAGES.signalsPrepared,
        OPPORTUNITY_RANKING_STAGES.factorsPrepared,
        OPPORTUNITY_RANKING_STAGES.weightsPrepared,
        OPPORTUNITY_RANKING_STAGES.outputPrepared
      ],
      rankedAt: options.rankedAt
    },
    events: [event]
  };
};
