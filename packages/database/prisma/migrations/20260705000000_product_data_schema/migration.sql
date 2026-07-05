CREATE TABLE "raw_source_content" (
  "id" TEXT NOT NULL,
  "sourcePlatform" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "title" TEXT,
  "bodyText" TEXT,
  "authorReference" TEXT,
  "communityReference" TEXT,
  "contentHash" TEXT,
  "capturedAt" TIMESTAMP(3) NOT NULL,
  "safeMetadata" JSONB,
  "provenance" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "raw_source_content_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "normalized_content" (
  "id" TEXT NOT NULL,
  "rawSourceContentId" TEXT NOT NULL,
  "canonicalText" TEXT NOT NULL,
  "languageCode" TEXT,
  "contentHash" TEXT,
  "textSegments" JSONB NOT NULL,
  "safeMetadata" JSONB,
  "provenance" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "normalized_content_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "analysis_results" (
  "id" TEXT NOT NULL,
  "normalizedContentId" TEXT NOT NULL,
  "analysisType" TEXT NOT NULL,
  "analysisVersion" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "structuredOutput" JSONB NOT NULL,
  "evidence" JSONB,
  "confidence" JSONB,
  "safeMetadata" JSONB,
  "provenance" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_opportunity_records" (
  "id" TEXT NOT NULL,
  "analysisResultId" TEXT,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "hypothesis" JSONB NOT NULL,
  "evidence" JSONB NOT NULL,
  "confidence" JSONB,
  "lifecycleStatus" TEXT NOT NULL,
  "safeMetadata" JSONB,
  "provenance" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "candidate_opportunity_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "generated_opportunity_records" (
  "id" TEXT NOT NULL,
  "candidateOpportunityId" TEXT,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "hypothesis" JSONB NOT NULL,
  "evidence" JSONB NOT NULL,
  "confidence" JSONB,
  "score" JSONB,
  "generationVersion" TEXT NOT NULL,
  "lifecycleStatus" TEXT NOT NULL,
  "safeMetadata" JSONB,
  "provenance" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "generated_opportunity_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "opportunity_ranking_results" (
  "id" TEXT NOT NULL,
  "rankingVersion" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL,
  "safeMetadata" JSONB,
  "provenance" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "opportunity_ranking_results_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "opportunity_ranking_items" (
  "id" TEXT NOT NULL,
  "rankingResultId" TEXT NOT NULL,
  "generatedOpportunityId" TEXT NOT NULL,
  "rankPosition" INTEGER NOT NULL,
  "score" JSONB NOT NULL,
  "explanation" JSONB NOT NULL,
  "safeMetadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "opportunity_ranking_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "raw_source_content_sourcePlatform_sourceId_key" ON "raw_source_content"("sourcePlatform", "sourceId");
CREATE INDEX "raw_source_content_sourcePlatform_idx" ON "raw_source_content"("sourcePlatform");
CREATE INDEX "raw_source_content_sourceType_idx" ON "raw_source_content"("sourceType");
CREATE INDEX "raw_source_content_contentHash_idx" ON "raw_source_content"("contentHash");

CREATE INDEX "normalized_content_rawSourceContentId_idx" ON "normalized_content"("rawSourceContentId");
CREATE INDEX "normalized_content_languageCode_idx" ON "normalized_content"("languageCode");
CREATE INDEX "normalized_content_contentHash_idx" ON "normalized_content"("contentHash");

CREATE INDEX "analysis_results_normalizedContentId_idx" ON "analysis_results"("normalizedContentId");
CREATE INDEX "analysis_results_analysisType_idx" ON "analysis_results"("analysisType");
CREATE INDEX "analysis_results_status_idx" ON "analysis_results"("status");

CREATE INDEX "candidate_opportunity_records_analysisResultId_idx" ON "candidate_opportunity_records"("analysisResultId");
CREATE INDEX "candidate_opportunity_records_lifecycleStatus_idx" ON "candidate_opportunity_records"("lifecycleStatus");

CREATE INDEX "generated_opportunity_records_candidateOpportunityId_idx" ON "generated_opportunity_records"("candidateOpportunityId");
CREATE INDEX "generated_opportunity_records_generationVersion_idx" ON "generated_opportunity_records"("generationVersion");
CREATE INDEX "generated_opportunity_records_lifecycleStatus_idx" ON "generated_opportunity_records"("lifecycleStatus");

CREATE INDEX "opportunity_ranking_results_rankingVersion_idx" ON "opportunity_ranking_results"("rankingVersion");
CREATE INDEX "opportunity_ranking_results_status_idx" ON "opportunity_ranking_results"("status");

CREATE UNIQUE INDEX "opportunity_ranking_items_rankingResultId_generatedOpportunityId_key"
  ON "opportunity_ranking_items"("rankingResultId", "generatedOpportunityId");
CREATE UNIQUE INDEX "opportunity_ranking_items_rankingResultId_rankPosition_key"
  ON "opportunity_ranking_items"("rankingResultId", "rankPosition");
CREATE INDEX "opportunity_ranking_items_generatedOpportunityId_idx" ON "opportunity_ranking_items"("generatedOpportunityId");

ALTER TABLE "normalized_content"
  ADD CONSTRAINT "normalized_content_rawSourceContentId_fkey"
  FOREIGN KEY ("rawSourceContentId") REFERENCES "raw_source_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "analysis_results"
  ADD CONSTRAINT "analysis_results_normalizedContentId_fkey"
  FOREIGN KEY ("normalizedContentId") REFERENCES "normalized_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "candidate_opportunity_records"
  ADD CONSTRAINT "candidate_opportunity_records_analysisResultId_fkey"
  FOREIGN KEY ("analysisResultId") REFERENCES "analysis_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "generated_opportunity_records"
  ADD CONSTRAINT "generated_opportunity_records_candidateOpportunityId_fkey"
  FOREIGN KEY ("candidateOpportunityId") REFERENCES "candidate_opportunity_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "opportunity_ranking_items"
  ADD CONSTRAINT "opportunity_ranking_items_rankingResultId_fkey"
  FOREIGN KEY ("rankingResultId") REFERENCES "opportunity_ranking_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "opportunity_ranking_items"
  ADD CONSTRAINT "opportunity_ranking_items_generatedOpportunityId_fkey"
  FOREIGN KEY ("generatedOpportunityId") REFERENCES "generated_opportunity_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "private_beta_feedback"
  ADD COLUMN "opportunityRecordId" TEXT;

CREATE INDEX "private_beta_feedback_opportunityRecordId_idx" ON "private_beta_feedback"("opportunityRecordId");

ALTER TABLE "private_beta_feedback"
  ADD CONSTRAINT "private_beta_feedback_opportunityRecordId_fkey"
  FOREIGN KEY ("opportunityRecordId") REFERENCES "generated_opportunity_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;
