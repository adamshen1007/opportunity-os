import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const ALLOWED_WORKSPACE_DEPENDENCIES = new Set([
  "@opportunity-os/analysis",
  "@opportunity-os/embeddings",
  "@opportunity-os/llm-analysis",
  "@opportunity-os/opportunity-engine",
  "@opportunity-os/opportunity-pipeline"
]);
const PROHIBITED_DEPENDENCY_PATTERN =
  /(^express$|^fastify$|^hono$|^react$|^react-dom$|^next$|^@prisma\/client$|^prisma$|scheduler|worker|queue|stripe|auth|openai|anthropic|gemini|recommendation|ranker|scoring-engine)/iu;
const PROHIBITED_SOURCE_PATTERN =
  /\b(REST API|route handler|PrismaClient|persistCandidate|scheduleCandidate|WorkerProcess|live AI call|callLlm|callLLM|invokeModel|generateText|runPrompt|executePrompt|renderPrompt|billing|Stripe|UserAccount|authentication|authorization|scoreCandidate|rankCandidate|recommendCandidate|workflow engine|executeWorkflow)\b/iu;

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      if (entry === "dist" || entry === "node_modules" || entry === ".turbo") {
        return [];
      }

      return listSourceFiles(path);
    }

    return path.endsWith(".ts") ? [path] : [];
  });
}

describe("candidate opportunity dependency boundaries", () => {
  it("depends only on approved upstream contract packages and test/build tooling", () => {
    const packageJson = JSON.parse(
      readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8")
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const dependencyNames = Object.keys(packageJson.dependencies ?? {});
    const devDependencyNames = Object.keys(packageJson.devDependencies ?? {});

    for (const dependencyName of dependencyNames) {
      expect(
        ALLOWED_WORKSPACE_DEPENDENCIES.has(dependencyName),
        `${dependencyName} is not an approved candidate opportunity dependency`
      ).toBe(true);
      expect(dependencyName).not.toMatch(PROHIBITED_DEPENDENCY_PATTERN);
    }

    expect(devDependencyNames.sort()).toEqual(["@types/node", "vitest"]);
  });

  it("does not introduce prohibited product or runtime implementation", () => {
    const files = listSourceFiles(join(PACKAGE_ROOT, "src")).filter(
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
