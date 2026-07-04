CREATE TABLE "private_beta_feedback" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT,
  "opportunityId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "reasonCategories" JSONB NOT NULL,
  "ratings" JSONB NOT NULL,
  "safeMetadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "private_beta_feedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "private_beta_bug_reports" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT,
  "title" TEXT NOT NULL,
  "safeDescription" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "safeMetadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "private_beta_bug_reports_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "private_beta_feedback_sessionId_idx" ON "private_beta_feedback"("sessionId");
CREATE INDEX "private_beta_feedback_opportunityId_idx" ON "private_beta_feedback"("opportunityId");
CREATE INDEX "private_beta_bug_reports_sessionId_idx" ON "private_beta_bug_reports"("sessionId");

ALTER TABLE "private_beta_feedback"
  ADD CONSTRAINT "private_beta_feedback_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "private_beta_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "private_beta_bug_reports"
  ADD CONSTRAINT "private_beta_bug_reports_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "private_beta_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
