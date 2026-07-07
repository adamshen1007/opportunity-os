import { describe, expect, it } from "vitest";
import { sanitizeDashboardApiErrorMessage } from "../api/errors";
import { safeDashboardErrorMessage } from "../components/states/state-copy";
import {
  dashboardEvidenceFixtures,
  dashboardFeedbackFixtures,
  dashboardOpportunityFixtures,
  dashboardRankingFixtures,
  dashboardScanFixture
} from "../testing";

const unsafeTextPattern =
  /api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|credential|authorization|bearer\s+[a-z0-9]|stack trace|internal exception/iu;

function serializeForInspection(value: unknown): string {
  return JSON.stringify(value);
}

describe("Dashboard security contracts", () => {
  it("keeps deterministic fixtures free of unsafe operational details", () => {
    const fixtureOutput = serializeForInspection({
      evidence: dashboardEvidenceFixtures,
      feedback: dashboardFeedbackFixtures,
      opportunities: dashboardOpportunityFixtures,
      rankings: dashboardRankingFixtures,
      scans: dashboardScanFixture
    });

    expect(fixtureOutput).not.toMatch(unsafeTextPattern);
  });

  it("keeps user-facing error copy safe", () => {
    expect(safeDashboardErrorMessage).not.toMatch(unsafeTextPattern);
    expect(sanitizeDashboardApiErrorMessage("access_token=synthetic-token-value")).toBe(
      "The dashboard could not complete the request. Retry or check the API health endpoint."
    );
  });
});
