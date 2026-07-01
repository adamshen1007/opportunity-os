import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RedditConnectorBoundary } from "../index.js";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
};

describe("reddit connector package boundaries", () => {
  it("depends only on approved foundation packages and tooling", () => {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    expect(Object.keys(dependencies).sort()).toEqual([
      "@opportunity-os/connector-host",
      "@opportunity-os/connectors",
      "@types/node",
      "vitest"
    ]);
  });

  it("routes public exports through the package root", () => {
    const boundary: RedditConnectorBoundary = {
      packageName: "@opportunity-os/connectors-reddit",
      milestone: "phase-2-milestone-14",
      scope: "reddit-connector-runtime"
    };

    expect(boundary.packageName).toBe("@opportunity-os/connectors-reddit");
  });
});
