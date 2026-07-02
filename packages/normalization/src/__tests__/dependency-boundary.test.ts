import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = fileURLToPath(new URL("..", import.meta.url));
const PROHIBITED_IMPORT_PATTERN =
  /from\s+["'](?:@opportunity-os\/(?:database|application|connectors|connectors-reddit|connector-runtime|connector-host|infrastructure|container)|(?:\.\.\/){2,}(?:apps|apis|workers|frontend|database|ai|opportunities))/u;
const PROHIBITED_SOURCE_PATTERN =
  /\b(embedding|embeddings|LLM|OpenAI|Anthropic|PrismaClient|database repository|REST API|scheduler|worker process|business scoring)\b/iu;

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      if (entry === "dist" || entry === "node_modules") {
        return [];
      }

      return listSourceFiles(path);
    }

    return path.endsWith(".ts") ? [path] : [];
  });
}

describe("normalization dependency boundaries", () => {
  it("does not import prohibited implementation packages", () => {
    const files = listSourceFiles(PACKAGE_ROOT);

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(
        source,
        `${relative(PACKAGE_ROOT, file)} imports a prohibited implementation package`
      ).not.toMatch(PROHIBITED_IMPORT_PATTERN);
    }
  });

  it("does not introduce AI, persistence, API, worker, or business scoring terms", () => {
    const files = listSourceFiles(PACKAGE_ROOT).filter(
      (file) => !file.includes("__tests__")
    );

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(
        source,
        `${relative(PACKAGE_ROOT, file)} contains prohibited implementation language`
      ).not.toMatch(PROHIBITED_SOURCE_PATTERN);
    }
  });
});
