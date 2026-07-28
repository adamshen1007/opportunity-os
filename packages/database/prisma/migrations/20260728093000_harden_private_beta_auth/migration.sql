-- Phase 4.5 A2 separates public session tokens from internal session IDs.
-- Existing sessions are revoked because their previously exposed IDs cannot be
-- converted into the new keyed token hash safely.
ALTER TABLE "private_beta_sessions" ADD COLUMN "tokenHash" TEXT;

UPDATE "private_beta_sessions"
SET
  "tokenHash" = 'legacy-revoked:' || "id",
  "status" = 'revoked',
  "revokedAt" = COALESCE("revokedAt", CURRENT_TIMESTAMP);

ALTER TABLE "private_beta_sessions" ALTER COLUMN "tokenHash" SET NOT NULL;

CREATE UNIQUE INDEX "private_beta_sessions_tokenHash_key"
ON "private_beta_sessions"("tokenHash");
