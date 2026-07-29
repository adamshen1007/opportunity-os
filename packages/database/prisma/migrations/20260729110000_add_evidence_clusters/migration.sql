-- Evidence clusters are append-only to the completed ownership baseline. Every
-- cluster and membership carries the owning scan boundary used by API access.
CREATE TABLE "evidence_clusters" (
  "id" TEXT NOT NULL,
  "scanId" TEXT NOT NULL,
  "ownerPrincipalId" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "ruleId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "definition" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "demandCount" INTEGER NOT NULL,
  "exploratory" BOOLEAN NOT NULL,
  "synthesisProfile" JSONB NOT NULL,
  "safeMetadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "evidence_clusters_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "evidence_cluster_memberships" (
  "id" TEXT NOT NULL,
  "clusterId" TEXT NOT NULL,
  "scanId" TEXT NOT NULL,
  "ownerPrincipalId" TEXT NOT NULL,
  "rawSourceContentId" TEXT NOT NULL,
  "normalizedContentId" TEXT NOT NULL,
  "analysisResultId" TEXT,
  "stance" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "observedAt" TIMESTAMP(3) NOT NULL,
  "connectorId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "evidence_cluster_memberships_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "candidate_opportunity_records" ADD COLUMN "evidenceClusterId" TEXT;

CREATE UNIQUE INDEX "evidence_clusters_scanId_fingerprint_key" ON "evidence_clusters"("scanId", "fingerprint");
CREATE INDEX "evidence_clusters_scanId_idx" ON "evidence_clusters"("scanId");
CREATE INDEX "evidence_clusters_ownerPrincipalId_idx" ON "evidence_clusters"("ownerPrincipalId");
CREATE INDEX "evidence_clusters_ruleId_idx" ON "evidence_clusters"("ruleId");
CREATE INDEX "evidence_clusters_status_idx" ON "evidence_clusters"("status");
CREATE UNIQUE INDEX "evidence_cluster_memberships_clusterId_normalizedContentId_key" ON "evidence_cluster_memberships"("clusterId", "normalizedContentId");
CREATE INDEX "evidence_cluster_memberships_clusterId_idx" ON "evidence_cluster_memberships"("clusterId");
CREATE INDEX "evidence_cluster_memberships_scanId_idx" ON "evidence_cluster_memberships"("scanId");
CREATE INDEX "evidence_cluster_memberships_ownerPrincipalId_idx" ON "evidence_cluster_memberships"("ownerPrincipalId");
CREATE INDEX "evidence_cluster_memberships_rawSourceContentId_idx" ON "evidence_cluster_memberships"("rawSourceContentId");
CREATE INDEX "evidence_cluster_memberships_normalizedContentId_idx" ON "evidence_cluster_memberships"("normalizedContentId");
CREATE INDEX "evidence_cluster_memberships_analysisResultId_idx" ON "evidence_cluster_memberships"("analysisResultId");
CREATE INDEX "evidence_cluster_memberships_stance_idx" ON "evidence_cluster_memberships"("stance");
CREATE INDEX "candidate_opportunity_records_evidenceClusterId_idx" ON "candidate_opportunity_records"("evidenceClusterId");

ALTER TABLE "evidence_clusters" ADD CONSTRAINT "evidence_clusters_scanId_fkey"
  FOREIGN KEY ("scanId") REFERENCES "scan_run_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evidence_cluster_memberships" ADD CONSTRAINT "evidence_cluster_memberships_clusterId_fkey"
  FOREIGN KEY ("clusterId") REFERENCES "evidence_clusters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evidence_cluster_memberships" ADD CONSTRAINT "evidence_cluster_memberships_rawSourceContentId_fkey"
  FOREIGN KEY ("rawSourceContentId") REFERENCES "raw_source_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evidence_cluster_memberships" ADD CONSTRAINT "evidence_cluster_memberships_normalizedContentId_fkey"
  FOREIGN KEY ("normalizedContentId") REFERENCES "normalized_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evidence_cluster_memberships" ADD CONSTRAINT "evidence_cluster_memberships_analysisResultId_fkey"
  FOREIGN KEY ("analysisResultId") REFERENCES "analysis_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "candidate_opportunity_records" ADD CONSTRAINT "candidate_opportunity_records_evidenceClusterId_fkey"
  FOREIGN KEY ("evidenceClusterId") REFERENCES "evidence_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
