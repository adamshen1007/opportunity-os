import { describe, expect, it } from "vitest";
import {
  PRODUCT_DATA_MODEL_NAMES,
  PRODUCT_DATA_SCHEMA_BOUNDARY,
  PRODUCT_DATA_TABLE_NAMES
} from "../product-data-schema.js";

describe("product data schema contracts", () => {
  it("publishes stable MVP product data model names", () => {
    expect(PRODUCT_DATA_MODEL_NAMES).toEqual([
      "ScanRunRecord",
      "RawSourceContent",
      "NormalizedContent",
      "AnalysisResult",
      "EvidenceCluster",
      "EvidenceClusterMembership",
      "CandidateOpportunityRecord",
      "GeneratedOpportunityRecord",
      "OpportunityRankingResult",
      "OpportunityRankingItem"
    ]);
  });

  it("publishes stable MVP product data table names", () => {
    expect(PRODUCT_DATA_TABLE_NAMES).toEqual([
      "scan_run_records",
      "raw_source_content",
      "normalized_content",
      "analysis_results",
      "evidence_clusters",
      "evidence_cluster_memberships",
      "candidate_opportunity_records",
      "generated_opportunity_records",
      "opportunity_ranking_results",
      "opportunity_ranking_items"
    ]);
  });

  it("documents the schema boundary without claiming runtime ingestion or repositories", () => {
    expect(PRODUCT_DATA_SCHEMA_BOUNDARY).toEqual({
      ownsDurableMvpWorkflowRecords: true,
      implementsProviderIngestion: false,
      implementsAiWorkflowExecution: false,
      implementsBusinessScoring: false,
      implementsRepositoryPersistence: false
    });
  });
});
