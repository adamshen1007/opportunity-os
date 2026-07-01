import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
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

const prohibitedSourceImportPattern =
  /from\s+["'][^"']*(apps?|apis?|auth|oauth|http|scrap(e|ing|er)|scheduler|queues?|workers?|database|ai|workflow|frontend|product|business)[^"']*["']/iu;

function listSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return listSourceFiles(absolutePath);
    }

    return absolutePath.endsWith(".ts") ? [absolutePath] : [];
  });
}

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
      "@opportunity-os/connector-runtime",
      "@opportunity-os/connectors",
      "@opportunity-os/container",
      "@opportunity-os/events",
      "@opportunity-os/shared",
      "@types/node",
      "vitest"
    ]);

    for (const dependencyName of Object.keys(dependencies)) {
      expect(dependencyName).not.toMatch(prohibitedDependencyPattern);
    }
  });

  it("keeps runtime source imports inside approved foundation boundaries", () => {
    const runtimeFiles = listSourceFiles(join(packageRoot, "src", "runtime"));

    expect(runtimeFiles.length).toBeGreaterThan(0);

    for (const sourceFile of runtimeFiles) {
      const sourceText = readFileSync(sourceFile, "utf8");

      expect(sourceText).not.toMatch(prohibitedSourceImportPattern);
      expect(sourceText).not.toContain("fetch(");
      expect(sourceText).not.toContain("XMLHttpRequest");
    }
  });
});
