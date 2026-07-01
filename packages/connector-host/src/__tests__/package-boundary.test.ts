import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConnectorHostBoundary } from "../index.js";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
};

describe("connector host package boundaries", () => {
  it("depends only on approved foundation packages and tooling", () => {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    expect(Object.keys(dependencies).sort()).toEqual([
      "@opportunity-os/application",
      "@opportunity-os/config",
      "@opportunity-os/connector-runtime",
      "@opportunity-os/connectors",
      "@opportunity-os/container",
      "@opportunity-os/errors",
      "@opportunity-os/events",
      "@opportunity-os/infrastructure",
      "@opportunity-os/shared",
      "@types/node",
      "vitest"
    ]);
  });

  it("routes public exports through the package root", () => {
    const boundary: ConnectorHostBoundary = {
      packageName: "@opportunity-os/connector-host",
      milestone: "phase-2-milestone-12"
    };

    expect(boundary.packageName).toBe("@opportunity-os/connector-host");
  });
});
