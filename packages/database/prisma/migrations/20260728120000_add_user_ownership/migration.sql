-- Existing records predate authenticated ownership. They remain available only
-- through the explicit administrator override and are not assigned to users.
ALTER TABLE "scan_run_records" ADD COLUMN "ownerPrincipalId" TEXT;
UPDATE "scan_run_records" SET "ownerPrincipalId" = '__legacy_unowned__';
ALTER TABLE "scan_run_records" ALTER COLUMN "ownerPrincipalId" SET NOT NULL;
CREATE INDEX "scan_run_records_ownerPrincipalId_idx" ON "scan_run_records"("ownerPrincipalId");

INSERT INTO "scan_run_records" (
  "id", "ownerPrincipalId", "mode", "status", "source", "stages",
  "safeMetadata", "result", "startedAt", "completedAt", "createdAt", "updatedAt"
)
SELECT
  '__legacy_unowned_scan__', '__legacy_unowned__', 'legacy', 'completed',
  '{"provider":"legacy"}'::jsonb, '[]'::jsonb,
  '{"legacyUnowned":true}'::jsonb, NULL, NOW(), NOW(), NOW(), NOW()
WHERE (EXISTS (SELECT 1 FROM "raw_source_content") OR EXISTS (SELECT 1 FROM "opportunity_ranking_results"))
  AND NOT EXISTS (SELECT 1 FROM "scan_run_records" WHERE "id" = '__legacy_unowned_scan__');

ALTER TABLE "raw_source_content" ADD COLUMN "scanId" TEXT;
UPDATE "raw_source_content" AS raw
SET "scanId" = scan."id"
FROM "scan_run_records" AS scan
WHERE scan."id" = COALESCE(raw."safeMetadata"->>'scanId', raw."provenance"->>'scanId');
UPDATE "raw_source_content" SET "scanId" = '__legacy_unowned_scan__' WHERE "scanId" IS NULL;
ALTER TABLE "raw_source_content" ALTER COLUMN "scanId" SET NOT NULL;
ALTER TABLE "raw_source_content" DROP CONSTRAINT IF EXISTS "raw_source_content_sourcePlatform_sourceId_key";
ALTER TABLE "raw_source_content"
  ADD CONSTRAINT "raw_source_content_scanId_fkey"
  FOREIGN KEY ("scanId") REFERENCES "scan_run_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE UNIQUE INDEX "raw_source_content_scanId_sourcePlatform_sourceId_key"
  ON "raw_source_content"("scanId", "sourcePlatform", "sourceId");
CREATE INDEX "raw_source_content_scanId_idx" ON "raw_source_content"("scanId");

ALTER TABLE "opportunity_ranking_results" ADD COLUMN "scanId" TEXT;
UPDATE "opportunity_ranking_results" AS ranking
SET "scanId" = scan."id"
FROM "scan_run_records" AS scan
WHERE scan."id" = COALESCE(ranking."safeMetadata"->>'scanId', ranking."provenance"->>'scanId');
UPDATE "opportunity_ranking_results" SET "scanId" = '__legacy_unowned_scan__' WHERE "scanId" IS NULL;
ALTER TABLE "opportunity_ranking_results" ALTER COLUMN "scanId" SET NOT NULL;
ALTER TABLE "opportunity_ranking_results"
  ADD CONSTRAINT "opportunity_ranking_results_scanId_fkey"
  FOREIGN KEY ("scanId") REFERENCES "scan_run_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "opportunity_ranking_results_scanId_idx" ON "opportunity_ranking_results"("scanId");

ALTER TABLE "private_beta_feedback" ADD COLUMN "ownerPrincipalId" TEXT;
UPDATE "private_beta_feedback" AS feedback
SET "ownerPrincipalId" = scan."ownerPrincipalId"
FROM "generated_opportunity_records" AS generated
JOIN "candidate_opportunity_records" AS candidate ON candidate."id" = generated."candidateOpportunityId"
JOIN "analysis_results" AS analysis ON analysis."id" = candidate."analysisResultId"
JOIN "normalized_content" AS normalized ON normalized."id" = analysis."normalizedContentId"
JOIN "raw_source_content" AS raw ON raw."id" = normalized."rawSourceContentId"
JOIN "scan_run_records" AS scan ON scan."id" = raw."scanId"
WHERE feedback."opportunityRecordId" = generated."id";
UPDATE "private_beta_feedback" AS feedback
SET "ownerPrincipalId" = session."principalId"
FROM "private_beta_sessions" AS session
WHERE feedback."ownerPrincipalId" IS NULL AND feedback."sessionId" = session."id";
UPDATE "private_beta_feedback" SET "ownerPrincipalId" = '__legacy_unowned__' WHERE "ownerPrincipalId" IS NULL;
ALTER TABLE "private_beta_feedback" ALTER COLUMN "ownerPrincipalId" SET NOT NULL;
CREATE INDEX "private_beta_feedback_ownerPrincipalId_idx" ON "private_beta_feedback"("ownerPrincipalId");
