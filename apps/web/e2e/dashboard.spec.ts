import { expect, test } from "@playwright/test";

test("dashboard loads with navigation and state coverage", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 2, name: "Opportunity dashboard" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Validation Session" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Private Beta Access" })).toBeVisible();
  await expect(page.getByText("Invite only")).toBeVisible();
  await expect(page.getByText("Invite accepted", { exact: true })).toBeVisible();
  await expect(page.getByText("Review ranked opportunities")).toBeVisible();
  await expect(page.getByText("Share validation feedback")).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 3, name: "Bug Reporting" })).toBeVisible();
  await expect(page.getByText("Synthetic demo state for design-partner review.")).toBeVisible();
  const navigation = page.getByRole("navigation", { name: "Dashboard navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Opportunities/u })).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Rankings/u })).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Evidence/u })).toBeVisible();

  await expect(page.getByText("Loading opportunities")).toBeVisible();
  await expect(page.getByText("No matching opportunities")).toBeVisible();
  await expect(page.getByText("Unable to load view")).toBeVisible();
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
