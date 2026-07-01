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
  readonly peerDependencies?: Readonly<Record<string, string>>;
  readonly optionalDependencies?: Readonly<Record<string, string>>;
};

const prohibitedDependencyPattern =
  /(^|[/@-])(apps?|api|auth|oauth|http|scrap(e|ing|er)|scheduler|queue|worker|database|ai|workflow|frontend|product|business)($|[/@-])/iu;

describe("reddit connector dependency boundaries", () => {
  it("depends only on approved foundation packages and deterministic tooling", () => {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
      ...packageJson.optionalDependencies
    };

    expect(Object.keys(dependencies).sort()).toEqual([
      "@opportunity-os/connector-host",
      "@opportunity-os/connectors",
      "@types/node",
      "vitest"
    ]);

    for (const dependencyName of Object.keys(dependencies)) {
      expect(dependencyName).not.toMatch(prohibitedDependencyPattern);
    }
  });
});
