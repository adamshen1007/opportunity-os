export const PRODUCT_DATA_MODEL_NAMES = [
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
] as const;

export type ProductDataModelName = (typeof PRODUCT_DATA_MODEL_NAMES)[number];

export const PRODUCT_DATA_TABLE_NAMES = [
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
] as const;

export type ProductDataTableName = (typeof PRODUCT_DATA_TABLE_NAMES)[number];

export const PRODUCT_DATA_SCHEMA_BOUNDARY = {
  ownsDurableMvpWorkflowRecords: true,
  implementsProviderIngestion: false,
  implementsAiWorkflowExecution: false,
  implementsBusinessScoring: false,
  implementsRepositoryPersistence: false
} as const;
