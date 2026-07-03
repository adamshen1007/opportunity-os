import type { OpportunityRankingFactor } from "../factors/index.js";
import type { OpportunityRankingSignal } from "../signals/index.js";
import type { OpportunityRankingWeightSet } from "../weights/index.js";
import type { OpportunityRankingExplanationSummary } from "./ranking-output.js";
import type { OpportunityRankingScoreCalculation } from "./score-calculation.js";

export const createOpportunityRankingExplanation = (
  signals: readonly OpportunityRankingSignal[],
  factors: readonly OpportunityRankingFactor[],
  weightSet: OpportunityRankingWeightSet,
  calculation: OpportunityRankingScoreCalculation
): OpportunityRankingExplanationSummary => ({
  summary: `${calculation.explanation} Signals: ${signals.length}. Factors: ${factors.length}.`,
  signalCount: signals.length,
  factorCount: factors.length,
  weightSetId: weightSet.weightSetId
});
