import type { OpportunityRankingFactor } from "../factors/index.js";
import type { OpportunityRankingWeightSet } from "../weights/index.js";
import type { OpportunityRankingScoreValue } from "./primitives.js";

export type OpportunityRankingScoreContribution = {
  readonly factorId: OpportunityRankingFactor["factorId"];
  readonly factorValue: OpportunityRankingScoreValue;
  readonly weight: number;
  readonly contribution: OpportunityRankingScoreValue;
  readonly explanation: string;
};

export type OpportunityRankingScoreCalculation = {
  readonly score: OpportunityRankingScoreValue;
  readonly contributions: readonly OpportunityRankingScoreContribution[];
  readonly explanation: string;
};

const roundScore = (value: number): OpportunityRankingScoreValue =>
  Number(value.toFixed(6)) as OpportunityRankingScoreValue;

export const calculateOpportunityRankingScore = (
  factors: readonly OpportunityRankingFactor[],
  weightSet: OpportunityRankingWeightSet
): OpportunityRankingScoreCalculation => {
  const contributions = factors.map((factor): OpportunityRankingScoreContribution => {
    const weight = weightSet.weights.find((entry) => entry.factorId === factor.factorId);
    const weightValue = weight?.weight ?? 0;
    const contribution = roundScore(factor.value * weightValue);

    return {
      factorId: factor.factorId,
      factorValue: factor.value,
      weight: weightValue,
      contribution,
      explanation: `${factor.explanation} Weight: ${weight?.explanation ?? "No matching weight."}`
    };
  });

  const score = roundScore(contributions.reduce((sum, contribution) => sum + contribution.contribution, 0));

  return {
    score,
    contributions,
    explanation: "Score is the deterministic weighted sum of explicit ranking factors."
  };
};
