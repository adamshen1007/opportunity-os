import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const providerRoot = join(packageRoot, "src", "provider");
const liveProviderFiles = new Set([
  "src/provider/live-api-client.ts",
  "src/provider/live-config.ts",
  "src/provider/live-dev-fetch.ts",
  "src/provider/live-execution.ts",
  "src/provider/live-http-transport.ts",
  "src/provider/live-response-mapper.ts",
  "src/provider/oauth-client.ts"
]);
const prohibitedExternalImportFragments = [
  "raw-content",
  "opportunity-generation",
  "api",
  "frontend",
  "scheduler",
  "worker",
  "database",
  "product",
  "business",
  "ai-workflow"
] as const;
const prohibitedSourceTerms = [
  "fetch(",
  "XMLHttpRequest",
  "axios",
  "undici",
  "got",
  "PrismaClient",
  "schedule",
  "queue",
  "WorkerProcess",
  "scoreOpportunity"
] as const;

function listSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) return listSourceFiles(absolutePath);

    return absolutePath.endsWith(".ts") ? [absolutePath] : [];
  });
}

function importSpecifiers(source: string): readonly string[] {
  return [...source.matchAll(/from\s+["']([^"']+)["']/gu)].map((match) => match[1] ?? "");
}

describe("reddit provider dependency boundaries", () => {
  it("has no imports from prohibited product or implementation areas", () => {
    const sourceFiles = listSourceFiles(providerRoot);

    expect(sourceFiles.length).toBeGreaterThan(0);

    for (const sourceFile of sourceFiles) {
      const sourceText = readFileSync(sourceFile, "utf8");
      const relativePath = relative(packageRoot, sourceFile);

      for (const specifier of importSpecifiers(sourceText).filter((value) => !value.startsWith("."))) {
        for (const fragment of prohibitedExternalImportFragments) {
          expect.soft(
            specifier.includes(fragment),
            `${relativePath} imports prohibited implementation area: ${specifier}`
          ).toBe(false);
        }
      }
      if (!liveProviderFiles.has(relativePath)) {
        for (const term of prohibitedSourceTerms) {
          expect.soft(
            sourceText.includes(term),
            `${relativePath} contains prohibited source term: ${term}`
          ).toBe(false);
        }
      }
    }
  });
});
