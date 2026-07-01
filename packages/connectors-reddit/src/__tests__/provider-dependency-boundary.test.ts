import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const providerRoot = join(packageRoot, "src", "provider");
const prohibitedExternalImportPattern =
  /from\s+["'](?!\.)([^"']*(raw[-/]content|opportunity[-/]generation|apis?|frontend|scheduler|worker|database|product|business|ai[-/]workflow)[^"']*)["']/iu;
const prohibitedSourcePattern =
  /\b(fetch\s*\(|XMLHttpRequest|axios|undici|got|PrismaClient|schedule|queue|WorkerProcess|scoreOpportunity)\b/iu;

function listSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) return listSourceFiles(absolutePath);

    return absolutePath.endsWith(".ts") ? [absolutePath] : [];
  });
}

describe("reddit provider dependency boundaries", () => {
  it("has no imports from prohibited product or implementation areas", () => {
    const sourceFiles = listSourceFiles(providerRoot);

    expect(sourceFiles.length).toBeGreaterThan(0);

    for (const sourceFile of sourceFiles) {
      const sourceText = readFileSync(sourceFile, "utf8");
      const relativePath = relative(packageRoot, sourceFile);

      expect.soft(sourceText, relativePath).not.toMatch(prohibitedExternalImportPattern);
      expect.soft(sourceText, relativePath).not.toMatch(prohibitedSourcePattern);
    }
  });
});
