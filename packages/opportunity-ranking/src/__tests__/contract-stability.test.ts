import { describe, expect, it } from "vitest";
import {
  DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
  OPPORTUNITY_RANKING_ERROR_CODES,
  OPPORTUNITY_RANKING_EVENT_NAMES,
  OPPORTUNITY_RANKING_FACTOR_IDS,
  OPPORTUNITY_RANKING_FACTOR_KINDS,
  OPPORTUNITY_RANKING_MODES,
  OPPORTUNITY_RANKING_OUTPUT_STATUSES,
  OPPORTUNITY_RANKING_RESULT_STATUSES,
  OPPORTUNITY_RANKING_SIGNAL_IDS,
  OPPORTUNITY_RANKING_SIGNAL_SOURCES,
  OPPORTUNITY_RANKING_STAGES,
  OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES
} from "../index.js";

describe("Opportunity Ranking contract stability", () => {
  it("locks stable ranking vocabulary values", () => {
    expect(OPPORTUNITY_RANKING_MODES).toEqual({
      deterministic: "deterministic",
      dryRun: "dry-run"
    });
    expect(OPPORTUNITY_RANKING_STAGES).toEqual({
      accepted: "accepted",
      inputPrepared: "input-prepared",
      signalsPrepared: "signals-prepared",
      factorsPrepared: "factors-prepared",
      weightsPrepared: "weights-prepared",
      outputPrepared: "output-prepared"
    });
    expect(OPPORTUNITY_RANKING_OUTPUT_STATUSES).toEqual({
      ranked: "ranked",
      validationFailed: "validation-failed",
      insufficientSignals: "insufficient-signals",
      failed: "failed"
    });
  });

  it("locks signal, factor, result, event, and error vocabularies", () => {
    expect(OPPORTUNITY_RANKING_SIGNAL_IDS).toEqual({
      candidateConfidence: "candidate-confidence",
      evidenceCompleteness: "evidence-completeness",
      sourceDiversity: "source-diversity",
      generationReadiness: "generation-readiness"
    });
    expect(OPPORTUNITY_RANKING_SIGNAL_SOURCES).toEqual({
      candidate: "candidate",
      evidence: "evidence",
      generation: "generation",
      analysis: "analysis"
    });
    expect(OPPORTUNITY_RANKING_FACTOR_IDS).toEqual({
      confidenceStrength: "confidence-strength",
      evidenceCompleteness: "evidence-completeness",
      sourceCoverage: "source-coverage",
      generationQuality: "generation-quality"
    });
    expect(OPPORTUNITY_RANKING_FACTOR_KINDS).toEqual({
      confidence: "confidence",
      evidence: "evidence",
      source: "source",
      generation: "generation"
    });
    expect(OPPORTUNITY_RANKING_RESULT_STATUSES).toEqual({
      success: "success",
      validationFailed: "validation-failed",
      failed: "failed"
    });
    expect(OPPORTUNITY_RANKING_EVENT_NAMES).toEqual({
      rankingValidationFailed: "opportunity-ranking.validation-failed",
      rankingCompleted: "opportunity-ranking.completed"
    });
    expect(OPPORTUNITY_RANKING_ERROR_CODES).toEqual({
      validationFailed: "opportunity-ranking.validation-failed",
      rankingFailed: "opportunity-ranking.failed"
    });
  });

  it("locks validation issue codes and default weights", () => {
    expect(OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES).toEqual({
      missingOpportunities: "missing-opportunities",
      missingSignals: "missing-signals",
      missingFactors: "missing-factors",
      missingWeights: "missing-weights",
      invalidFactorValue: "invalid-factor-value",
      invalidSignalValue: "invalid-signal-value",
      invalidWeightValue: "invalid-weight-value",
      missingFactorWeight: "missing-factor-weight",
      missingExplanation: "missing-explanation"
    });
    expect(DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET.weights.map((entry) => entry.factorId)).toEqual([
      OPPORTUNITY_RANKING_FACTOR_IDS.confidenceStrength,
      OPPORTUNITY_RANKING_FACTOR_IDS.evidenceCompleteness,
      OPPORTUNITY_RANKING_FACTOR_IDS.sourceCoverage,
      OPPORTUNITY_RANKING_FACTOR_IDS.generationQuality
    ]);
  });
});
