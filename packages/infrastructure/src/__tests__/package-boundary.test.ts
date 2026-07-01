import fs from "node:fs";
import { describe, expect, it } from "vitest";

const packageJsonPath = new URL("../../package.json", import.meta.url);
const packageJson = JSON.parse(
  fs.readFileSync(packageJsonPath, "utf8")
) as {
  readonly dependencies?: Record<string, string>;
  readonly devDependencies?: Record<string, string>;
};

const approvedDependencies = new Set([
  "@opportunity-os/application",
  "@opportunity-os/config",
  "@opportunity-os/container",
  "@opportunity-os/database",
  "@opportunity-os/domain",
  "@opportunity-os/errors",
  "@opportunity-os/events",
  "@opportunity-os/shared",
  "@types/node",
  "vitest"
]);

const prohibitedDependencyPatterns: readonly RegExp[] = [
  /(^|[/@-])apps?($|[/@-])/iu,
  /(^|[/@-])api($|[/@-])/iu,
  /(^|[/@-])controller(s)?($|[/@-])/iu,
  /(^|[/@-])auth($|[/@-])/iu,
  /(^|[/@-])connector(s)?($|[/@-])/iu,
  /(^|[/@-])ai($|[/@-])/iu,
  /(^|[/@-])workflow(s)?($|[/@-])/iu,
  /(^|[/@-])repository-implementation(s)?($|[/@-])/iu,
  /(^|[/@-])frontend($|[/@-])/iu,
  /(^|[/@-])product($|[/@-])/iu,
  /(^|[/@-])business($|[/@-])/iu,
  /(^|[/@-])acquisition($|[/@-])/iu,
  /(^|[/@-])intelligence($|[/@-])/iu
];

describe("infrastructure package boundaries", () => {
  it("depends only on approved foundation packages and deterministic tooling", () => {
    const dependencyNames = [
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {})
    ];

    expect(dependencyNames.sort()).toEqual([
      "@opportunity-os/application",
      "@opportunity-os/config",
      "@opportunity-os/container",
      "@opportunity-os/database",
      "@opportunity-os/domain",
      "@opportunity-os/errors",
      "@opportunity-os/events",
      "@opportunity-os/shared",
      "@types/node",
      "vitest"
    ]);
    expect(dependencyNames.every((name) => approvedDependencies.has(name))).toBe(
      true
    );
  });

  it("does not depend on prohibited implementation packages", () => {
    const dependencyNames = [
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {})
    ];

    for (const dependencyName of dependencyNames) {
      expect(
        prohibitedDependencyPatterns.some((pattern) =>
          pattern.test(dependencyName)
        )
      ).toBe(false);
    }
  });
});
