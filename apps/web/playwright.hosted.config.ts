import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.OPPORTUNITY_OS_WEB_URL;
if (!baseURL) throw new Error("Set OPPORTUNITY_OS_WEB_URL before running the hosted fixture journey.");

export default defineConfig({
  testDir: "./e2e-hosted",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  projects: [{ name: "hosted-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }]
});
