import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = fileURLToPath(new URL("..", import.meta.url));
const PROHIBITED_IMPORT_SPECIFIERS = [
  "@opportunity-os/database",
  "@opportunity-os/application",
  "@opportunity-os/connectors",
  "@opportunity-os/connectors-reddit",
  "@opportunity-os/connector-runtime",
  "@opportunity-os/connector-host",
  "@opportunity-os/infrastructure",
  "@opportunity-os/container",
  "apps/",
  "apis/",
  "workers/",
  "frontend",
  "database",
  "ai/",
  "opportunities"
] as const;
const PROHIBITED_SOURCE_TERMS = [
  "embedding",
  "embeddings",
  "LLM",
  "OpenAI",
  "Anthropic",
  "PrismaClient",
  "database repository",
  "REST API",
  "scheduler",
  "worker process",
  "business scoring"
] as const;

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      if (entry === "dist" || entry === "node_modules" || entry === "__tests__") {
        return [];
      }

      return listSourceFiles(path);
    }

    return path.endsWith(".ts") ? [path] : [];
  });
}

function importSpecifiers(source: string): readonly string[] {
  return [...source.matchAll(/from\s+["']([^"']+)["']/gu)].map((match) => match[1] ?? "");
}

describe("normalization dependency boundaries", () => {
  it("does not import prohibited implementation packages", () => {
    const files = listSourceFiles(PACKAGE_ROOT);

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const specifier of importSpecifiers(source)) {
        for (const prohibitedSpecifier of PROHIBITED_IMPORT_SPECIFIERS) {
          expect(
            specifier.includes(prohibitedSpecifier),
            `${relative(PACKAGE_ROOT, file)} imports a prohibited implementation package: ${specifier}`
          ).toBe(false);
        }
      }
    }
  });

  it("does not introduce AI, persistence, API, worker, or business scoring terms", () => {
    const files = listSourceFiles(PACKAGE_ROOT).filter(
      (file) => !file.includes("__tests__")
    );

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const term of PROHIBITED_SOURCE_TERMS) {
        expect(
          source.includes(term),
          `${relative(PACKAGE_ROOT, file)} contains prohibited implementation language: ${term}`
        ).toBe(false);
      }
    }
  });
});
