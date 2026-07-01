import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
};

describe("connector runtime package boundaries", () => {
  it("depends only on approved foundation packages and tooling", () => {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    expect(Object.keys(dependencies).sort()).toEqual([
      "@opportunity-os/application",
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
});
