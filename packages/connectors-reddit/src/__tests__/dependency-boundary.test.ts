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

const prohibitedImportFragments = [
  "apps",
  "api",
  "auth",
  "oauth",
  "http",
  "scrape",
  "scraping",
  "scheduler",
  "queue",
  "worker",
  "database",
  "ai",
  "workflow",
  "frontend",
  "product",
  "business"
] as const;

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

function importSpecifiers(source: string): readonly string[] {
  return [...source.matchAll(/from\s+["']([^"']+)["']/gu)].map((match) => match[1] ?? "");
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
  });

  it("keeps runtime source imports inside approved foundation boundaries", () => {
    const runtimeFiles = listSourceFiles(join(packageRoot, "src", "runtime"));

    expect(runtimeFiles.length).toBeGreaterThan(0);

    for (const sourceFile of runtimeFiles) {
      const sourceText = readFileSync(sourceFile, "utf8");

      for (const specifier of importSpecifiers(sourceText).filter((value) => !value.startsWith("."))) {
        for (const fragment of prohibitedImportFragments) {
          expect(specifier.includes(fragment)).toBe(false);
        }
      }
      expect(sourceText).not.toContain("fetch(");
      expect(sourceText).not.toContain("XMLHttpRequest");
    }
  });
});
