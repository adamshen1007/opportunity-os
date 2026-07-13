import { expect, test } from "@playwright/test";

test("dashboard loads with navigation and state coverage", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { exact: true, level: 2, name: "Opportunity dashboard" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Run a new scan" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Top opportunities" })).toBeVisible();
  await expect(page.getByRole("button", { name: "About confidence scores" })).toBeVisible();
  await expect(page.getByLabel("Datasource")).toBeVisible();
  await expect(page.getByLabel("Stack Exchange site")).toBeVisible();
  await expect(page.getByLabel("Query")).toBeVisible();
  await expect(page.getByRole("button", { name: "Run scan" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Prioritize repeated manual review workflows" })).toBeVisible();
  await expect(page.getByText("Beta session and support tools")).toBeVisible();
  const navigation = page.getByRole("navigation", { name: "Dashboard navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Opportunities/u })).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Rankings/u })).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Evidence/u })).toBeVisible();

});

test("dashboard scan workbench shows safe fallback results", async ({ page }) => {
  await page.route("**/scans", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error: {
          code: "api.unavailable",
          statusCode: 503,
          message: "Service unavailable",
          correlationId: "e2e-scan"
        },
        meta: {
          correlationId: "e2e-scan"
        }
      })
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Run scan" }).click();

  await expect(page.getByText("Showing deterministic fixture results instead.")).toBeVisible();
  await expect(page.getByText(/Source attribution: Stack Exchange/u)).toBeVisible();
  await expect(page.getByText(/Source attribution: Reddit/u)).toHaveCount(0);
  await page.getByText("View pipeline details and generated results").click();
  await expect(page.getByLabel("Scan results").getByRole("heading", { name: "Prioritize repeated manual review workflows" })).toBeVisible();
  await expect(page.getByLabel("Scan results").getByText("Open source context").first()).toBeVisible();
  await expect(page.getByLabel("Scan results").getByText("analysis-fixture-001")).toBeVisible();
});

test("live scan failures never masquerade as fixture results", async ({ page }) => {
  await page.route("**/scans", async (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, error: { code: "api.unavailable", statusCode: 503, message: "Service unavailable", correlationId: "live-failure" }, meta: { correlationId: "live-failure" } }) }));
  await page.goto("/");
  await page.locator('select[name="mode"]').selectOption("live");
  await page.getByRole("button", { name: "Run scan" }).click();
  await expect(page.getByText("No demo results were substituted.").first()).toBeVisible();
  await expect(page.getByLabel("Scan results")).toHaveCount(0);
  await page.getByRole("button", { name: "Try demo data" }).click();
  await expect(page.getByText("Showing explicit demo data.")).toBeVisible();
  await expect(page.getByLabel("Scan results")).toBeVisible();
});

test("live scan results replace synthetic top opportunities", async ({ page }) => {
  const liveOpportunityTitle = "Reduce repeated deployment rollback diagnosis";
  const liveResult = {
    scanId: "scan-live-stack-exchange-e2e",
    mode: "live",
    status: "completed",
    source: {
      provider: "stack-exchange",
      community: "stackoverflow",
      site: "stackoverflow",
      query: "deployment rollback diagnosis",
      attribution: "Stack Exchange",
      itemCount: 1,
      quota: { remaining: 291, maximum: 300, hasMore: false }
    },
    stages: [
      { name: "source", status: "completed", safeMessage: "Retrieved public Stack Exchange evidence." },
      { name: "raw-content", status: "completed", safeMessage: "Mapped source content." },
      { name: "normalization", status: "completed", safeMessage: "Normalized source content." },
      { name: "llm-analysis", status: "completed", safeMessage: "Analyzed normalized content." },
      { name: "candidate-generation", status: "completed", safeMessage: "Created a candidate." },
      { name: "opportunity-generation", status: "completed", safeMessage: "Generated an opportunity." },
      { name: "ranking", status: "completed", safeMessage: "Ranked the opportunity." }
    ],
    opportunities: [{
      opportunityId: "live-opportunity-e2e",
      title: liveOpportunityTitle,
      summary: "Teams repeatedly reconstruct deployment failures across disconnected logs and runbooks.",
      confidence: 0.86,
      rank: { position: 1, score: 89, explanation: "Repeated evidence and high operational urgency." },
      evidence: [{
        evidenceId: "live-evidence-e2e",
        sourceType: "stack-exchange",
        summary: "A public question describes repeated manual rollback diagnosis.",
        permalink: "https://stackoverflow.com/questions/12345678/deployment-rollback-diagnosis",
        confidence: 0.88,
        provenance: {
          sourcePlatform: "stack-exchange",
          sourceId: "question-12345678",
          sourceUrl: "https://stackoverflow.com/questions/12345678/deployment-rollback-diagnosis",
          normalizedContentId: "normalized-live-e2e",
          analysisRequestId: "analysis-live-e2e"
        }
      }],
      provenance: {
        scanId: "scan-live-stack-exchange-e2e",
        sourceItemId: "question-12345678",
        rawContentId: "raw-live-e2e",
        normalizedContentId: "normalized-live-e2e",
        analysisRequestId: "analysis-live-e2e",
        candidateId: "candidate-live-e2e",
        generationOutputId: "generation-live-e2e",
        rankingRunId: "ranking-live-e2e"
      }
    }],
    validationMetrics: {
      retrievedItems: 1,
      generatedOpportunities: 1,
      evidenceBackedOpportunities: 1,
      evidenceCoverage: 1,
      averageConfidence: 0.86,
      reviewStatus: "ready-for-human-review"
    },
    safeMetadata: { deterministic: false, liveEnabled: true, rawProviderPayloadStored: false }
  };

  await page.route("**/scans*", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, data: liveResult, meta: { correlationId: "e2e-live-result" } })
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, data: { scans: [] }, meta: { correlationId: "e2e-live-history" } })
    });
  });

  await page.goto("/");
  await page.locator('select[name="mode"]').selectOption("live");
  await page.getByRole("button", { name: "Run scan" }).click();

  const topOpportunities = page.getByRole("region", { name: "Top opportunities" });
  await expect(topOpportunities.getByRole("link", { name: liveOpportunityTitle })).toBeVisible();
  await expect(topOpportunities.getByText("Showing live results from Stack Exchange.")).toBeVisible();
  await expect(topOpportunities.getByText("Stack Exchange live scan")).toHaveCount(1);
  await expect(topOpportunities.getByText("Prioritize repeated manual review workflows")).toHaveCount(0);
  await expect(topOpportunities.getByText("Repeated evidence and high operational urgency.")).toHaveCount(1);

  await topOpportunities.getByRole("link", { name: liveOpportunityTitle }).click();
  await expect(page).toHaveURL(/#scan-opportunity-live-opportunity-e2e$/u);
  await expect(page.getByText("A public question describes repeated manual rollback diagnosis.")).toBeVisible();
});

test("opportunity list supports search filters pagination and detail navigation", async ({ page }) => {
  await page.goto("/opportunities");

  await expect(page.getByRole("heading", { name: "Opportunities" })).toBeVisible();
  await expect(page.getByPlaceholder("Search opportunities, evidence, or feedback")).toBeVisible();
  await expect(page.getByLabel("Status")).toBeVisible();
  await expect(page.getByLabel("Source")).toBeVisible();
  await expect(page.getByLabel("Validation")).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
  await expect(page.getByRole("link", { name: "First" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Previous" })).toBeVisible();
  await expect(page.getByText("Page 1 of 1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Next" })).toBeVisible();

  await page.getByRole("link", { name: "Prioritize repeated manual review workflows" }).click();
  await expect(page).toHaveURL(/\/opportunities\/synthetic-opportunity-001$/u);
  await expect(page.getByRole("heading", { exact: true, level: 2, name: "Opportunity detail" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Opportunity Detail" })).toBeVisible();
  await expect(page.getByText("Explanation", { exact: true })).toBeVisible();
  await expect(page.getByText("Explainable MVP")).toBeVisible();
  await expect(page.getByText("Confirm demand, source quality, and feasibility")).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Validation Feedback" })).toBeVisible();
  await expect(page.getByText("Current validation status")).toBeVisible();
  await expect(page.getByText("Evidence View")).toBeVisible();
  await expect(page.getByText("Source").first()).toBeVisible();
});

test("validation workflow supports save dismiss ratings and reasons", async ({ page }) => {
  await page.goto("/opportunities/synthetic-opportunity-001");

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Feedback captured: saved.")).toBeVisible();

  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(page.getByText("Feedback captured: dismissed.")).toBeVisible();

  await page.getByRole("group", { name: "Usefulness" }).getByRole("button", { name: "5" }).click();
  await page.getByRole("group", { name: "Evidence quality" }).getByRole("button", { name: "4" }).click();
  await page.getByRole("group", { name: "Ranking quality" }).getByRole("button", { name: "3" }).click();
  await page.getByLabel("Poor ranking").check();
  await page.getByRole("button", { name: "Submit feedback" }).click();

  await expect(page.getByText("Feedback captured: reason-provided.")).toBeVisible();
  await expect(page.getByText("Reason Provided")).toBeVisible();
});

test("private beta flow covers protected access onboarding feedback and bug reporting", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Beta session and support tools").click();

  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Private Beta Access" })).toBeVisible();
  await expect(page.getByText("Invite only")).toBeVisible();
  await expect(page.getByText("Invite accepted", { exact: true })).toBeVisible();
  await expect(page.getByText("Review ranked opportunities")).toBeVisible();
  await expect(page.getByText("Share validation feedback")).toBeVisible();

  await page.goto("/opportunities/synthetic-opportunity-001");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Feedback captured: saved.")).toBeVisible();
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(page.getByText("Feedback captured: dismissed.")).toBeVisible();
  await page.getByRole("group", { name: "Usefulness" }).getByRole("button", { name: "5" }).click();
  await page.getByRole("group", { name: "Evidence quality" }).getByRole("button", { name: "4" }).click();
  await page.getByRole("group", { name: "Ranking quality" }).getByRole("button", { name: "3" }).click();
  await page.getByRole("button", { name: "Submit feedback" }).click();
  await expect(page.getByText("Feedback captured: rated.")).toBeVisible();

  await page.goto("/");
  await page.getByText("Beta session and support tools").click();
  await page.getByRole("button", { name: "Send bug report" }).click();
  await expect(page.getByText("Bug report captured: open.")).toBeVisible();
});

test("ranking and evidence views expose safe fixture content", async ({ page }) => {
  await page.goto("/rankings");

  await expect(page.getByRole("heading", { exact: true, level: 2, name: "Ranking View" })).toBeVisible();
  await expect(page.getByText("synthetic-ranking-001")).toBeVisible();
  await expect(page.getByText("Score 87")).toBeVisible();
  await expect(page.getByText("Confidence 81%")).toBeVisible();

  await page.goto("/evidence");
  await expect(page.getByRole("heading", { exact: true, level: 2, name: "Evidence View" })).toBeVisible();
  await expect(page.getByText("Synthetic Reddit contract fixture")).toBeVisible();
  await expect(page.getByText("Collected").first()).toBeVisible();
  await expect(page.getByText("Prepared").first()).toBeVisible();
});
