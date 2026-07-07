CREATE TABLE "scan_run_records" (
    "id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "source" JSONB NOT NULL,
    "stages" JSONB NOT NULL,
    "safeMetadata" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scan_run_records_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "scan_run_records_mode_idx" ON "scan_run_records"("mode");
CREATE INDEX "scan_run_records_status_idx" ON "scan_run_records"("status");
CREATE INDEX "scan_run_records_startedAt_idx" ON "scan_run_records"("startedAt");
