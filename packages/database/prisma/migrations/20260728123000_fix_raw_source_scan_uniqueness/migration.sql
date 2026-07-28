-- Complete the ownership boundary by removing the pre-ownership global source
-- uniqueness index. Raw source IDs may repeat across independently owned scans.
DROP INDEX IF EXISTS "raw_source_content_sourcePlatform_sourceId_key";

CREATE UNIQUE INDEX IF NOT EXISTS "raw_source_content_scanId_sourcePlatform_sourceId_key"
  ON "raw_source_content"("scanId", "sourcePlatform", "sourceId");
