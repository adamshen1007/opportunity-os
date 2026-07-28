import { expect, test } from "@playwright/test";

test("canonical hosted dashboard completes a fixture-mode scan", async ({ page }) => {
  const inviteCode = process.env.HOSTED_FIXTURE_INVITE_CODE;
  if (inviteCode) {
    await page.goto("/access");
    await page.getByLabel("Display name").fill("Hosted release verifier");
    await page.getByLabel("Invite code").fill(inviteCode);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForURL("**/");
  } else {
    await page.goto("/");
  }

  await expect(page.getByRole("heading", { level: 2, name: "Opportunity dashboard" })).toBeVisible();
  await page.locator('select[name="mode"]').selectOption("fixture");
  await expect(page.locator('select[name="mode"]')).toHaveValue("fixture");
  await page.getByRole("button", { name: "Run scan" }).click();
  await expect(page.getByLabel("Scan results")).toBeVisible();
  await expect(page.getByText(/Source attribution: Stack Exchange/u)).toBeVisible();
  await expect(page.getByLabel("Scan results").getByText("Fixture fallback")).toBeVisible();
});
