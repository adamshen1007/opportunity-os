import type { ApiScanOpportunityDto } from "./scan-pipeline-dto.js";

export interface ApiScanValidationMetricsDto {
  readonly retrievedItems: number;
  readonly generatedOpportunities: number;
  readonly evidenceBackedOpportunities: number;
  readonly evidenceCoverage: number;
  readonly averageConfidence: number;
  readonly reviewStatus: "ready-for-human-review" | "no-results";
}

export function createScanValidationMetrics(input: {
  readonly retrievedItems: number;
  readonly opportunities: readonly ApiScanOpportunityDto[];
}): ApiScanValidationMetricsDto {
  const evidenceBacked = input.opportunities.filter((item) => item.evidence.length > 0).length;
  const averageConfidence = input.opportunities.length
    ? input.opportunities.reduce((total, item) => total + item.confidence, 0) / input.opportunities.length
    : 0;
  return {
    retrievedItems: input.retrievedItems,
    generatedOpportunities: input.opportunities.length,
    evidenceBackedOpportunities: evidenceBacked,
    evidenceCoverage: input.opportunities.length ? evidenceBacked / input.opportunities.length : 0,
    averageConfidence: Number(averageConfidence.toFixed(4)),
    reviewStatus: input.opportunities.length ? "ready-for-human-review" : "no-results"
  };
}
