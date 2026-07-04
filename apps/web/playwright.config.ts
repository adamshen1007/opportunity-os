import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chrome-desktop",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: {
          width: 1440,
          height: 960
        }
      }
    },
    {
      name: "chrome-mobile",
      use: {
        ...devices["Pixel 7"],
        channel: "chrome"
      }
    }
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
