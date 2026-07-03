import type { OpportunityRankingFactor } from "../factors/index.js";
import type { OpportunityRankingSignal } from "../signals/index.js";
import type { OpportunityRankingWeightSet } from "../weights/index.js";
import type {
  OpportunityRankingFieldPath,
  OpportunityRankingSafeMetadata
} from "./primitives.js";
import type { OpportunityRankingInput } from "./ranking-input.js";

export const OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES = {
  missingOpportunities: "missing-opportunities",
  missingSignals: "missing-signals",
  missingFactors: "missing-factors",
  missingWeights: "missing-weights",
  invalidFactorValue: "invalid-factor-value",
  invalidSignalValue: "invalid-signal-value",
  invalidWeightValue: "invalid-weight-value",
  missingFactorWeight: "missing-factor-weight",
  missingExplanation: "missing-explanation"
} as const;

export type OpportunityRankingValidationIssueCode =
  (typeof OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES)[keyof typeof OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES];

export type OpportunityRankingValidationIssue = {
  readonly code: OpportunityRankingValidationIssueCode;
  readonly fieldPath: OpportunityRankingFieldPath;
  readonly message: string;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export type OpportunityRankingValidationResult =
  | {
      readonly valid: true;
      readonly issues: readonly [];
    }
  | {
      readonly valid: false;
      readonly issues: readonly OpportunityRankingValidationIssue[];
    };

const isUnitScore = (value: number): boolean => Number.isFinite(value) && value >= 0 && value <= 1;

const hasExplanation = (value: string): boolean => value.trim().length > 0;

const validateSignals = (signals: readonly OpportunityRankingSignal[]): OpportunityRankingValidationIssue[] =>
  signals.flatMap((signal, index) => {
    const issues: OpportunityRankingValidationIssue[] = [];

    if (!isUnitScore(signal.normalizedValue)) {
      issues.push({
        code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.invalidSignalValue,
        fieldPath: `signals.${index}.normalizedValue` as OpportunityRankingFieldPath,
        message: "Ranking signal normalizedValue must be between 0 and 1."
      });
    }

    if (!hasExplanation(signal.explanation)) {
      issues.push({
        code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingExplanation,
        fieldPath: `signals.${index}.explanation` as OpportunityRankingFieldPath,
        message: "Ranking signal must include an explanation."
      });
    }

    return issues;
  });

const validateFactors = (
  factors: readonly OpportunityRankingFactor[],
  weightSet: OpportunityRankingWeightSet
): OpportunityRankingValidationIssue[] =>
  factors.flatMap((factor, index) => {
    const issues: OpportunityRankingValidationIssue[] = [];
    const hasWeight = weightSet.weights.some((weight) => weight.factorId === factor.factorId);

    if (!isUnitScore(factor.value)) {
      issues.push({
        code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.invalidFactorValue,
        fieldPath: `factors.${index}.value` as OpportunityRankingFieldPath,
        message: "Ranking factor value must be between 0 and 1."
      });
    }

    if (!hasWeight) {
      issues.push({
        code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingFactorWeight,
        fieldPath: `factors.${index}.factorId` as OpportunityRankingFieldPath,
        message: "Ranking factor must have a matching weight."
      });
    }

    if (!hasExplanation(factor.explanation)) {
      issues.push({
        code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingExplanation,
        fieldPath: `factors.${index}.explanation` as OpportunityRankingFieldPath,
        message: "Ranking factor must include an explanation."
      });
    }

    return issues;
  });

const validateWeights = (weightSet: OpportunityRankingWeightSet): OpportunityRankingValidationIssue[] =>
  weightSet.weights.flatMap((weight, index) => {
    const issues: OpportunityRankingValidationIssue[] = [];

    if (!isUnitScore(weight.weight)) {
      issues.push({
        code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.invalidWeightValue,
        fieldPath: `weights.${index}.weight` as OpportunityRankingFieldPath,
        message: "Ranking weight must be between 0 and 1."
      });
    }

    if (!hasExplanation(weight.explanation)) {
      issues.push({
        code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingExplanation,
        fieldPath: `weights.${index}.explanation` as OpportunityRankingFieldPath,
        message: "Ranking weight must include an explanation."
      });
    }

    return issues;
  });

export const validateOpportunityRankingInput = (
  input: OpportunityRankingInput
): OpportunityRankingValidationResult => {
  const issues: OpportunityRankingValidationIssue[] = [];

  if (input.generatedOpportunities.length === 0) {
    issues.push({
      code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingOpportunities,
      fieldPath: "generatedOpportunities" as OpportunityRankingFieldPath,
      message: "Ranking requires at least one generated opportunity."
    });
  }

  if (!input.signals || input.signals.signals.length === 0) {
    issues.push({
      code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingSignals,
      fieldPath: "signals" as OpportunityRankingFieldPath,
      message: "Ranking requires explicit signals."
    });
  }

  if (!input.factors || input.factors.factors.length === 0) {
    issues.push({
      code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingFactors,
      fieldPath: "factors" as OpportunityRankingFieldPath,
      message: "Ranking requires explicit factors."
    });
  }

  if (!input.weights || input.weights.weights.length === 0) {
    issues.push({
      code: OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingWeights,
      fieldPath: "weights" as OpportunityRankingFieldPath,
      message: "Ranking requires explicit weights."
    });
  }

  if (input.signals) {
    issues.push(...validateSignals(input.signals.signals));
  }

  if (input.weights) {
    issues.push(...validateWeights(input.weights));
  }

  if (input.factors && input.weights) {
    issues.push(...validateFactors(input.factors.factors, input.weights));
  }

  if (issues.length > 0) {
    return {
      valid: false,
      issues
    };
  }

  return {
    valid: true,
    issues: []
  };
};
