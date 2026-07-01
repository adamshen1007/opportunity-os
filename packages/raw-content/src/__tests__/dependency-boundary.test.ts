import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const repoRoot = dirname(dirname(packageRoot));
const sourceRoot = join(packageRoot, "src");

const prohibitedDependencyNames = [
  "@prisma/client",
  "prisma",
  "next",
  "react",
  "react-dom",
  "express",
  "fastify",
  "hono",
  "bullmq",
  "agenda",
  "openai",
  "@anthropic-ai/sdk"
] as const;

const prohibitedImportPatterns = [
  /from\s+["'][^"']*@prisma\/client[^"']*["']/iu,
  /from\s+["'][^"']*prisma[^"']*["']/iu,
  /from\s+["'][^"']*(^|\/|@)apps?(\/|$)[^"']*["']/iu,
  /from\s+["'][^"']*(^|\/|@)api(\/|$)[^"']*["']/iu,
  /from\s+["'][^"']*(^|\/|@)frontend(\/|$)[^"']*["']/iu,
  /from\s+["'][^"']*(^|\/|@)scheduler(\/|$)[^"']*["']/iu,
  /from\s+["'][^"']*(^|\/|@)worker(\/|$)[^"']*["']/iu,
  /from\s+["'][^"']*(^|\/|@)ai(\/|$)[^"']*["']/iu,
  /from\s+["'][^"']*(^|\/|@)business(\/|$)[^"']*["']/iu
] as const;

const prohibitedSourceTerms = [
  /\bPrismaClient\b/iu,
  /\bpersistRawContent\b/iu,
  /\bwriteToDatabase\b/iu,
  /\bfetch\s*\(/iu,
  /\bXMLHttpRequest\b/iu,
  /\bOpenAI\b/iu,
  /\bAnthropic\b/iu,
  /\bscoreOpportunity\b/iu
] as const;

function listSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      if (entry === "__tests__") return [];
      return listSourceFiles(absolutePath);
    }

    return absolutePath.endsWith(".ts") ? [absolutePath] : [];
  });
}

describe("raw content dependency boundaries", () => {
  it("depends only on approved foundation packages and deterministic tooling", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as {
      readonly dependencies?: Readonly<Record<string, string>>;
      readonly devDependencies?: Readonly<Record<string, string>>;
      readonly optionalDependencies?: Readonly<Record<string, string>>;
      readonly peerDependencies?: Readonly<Record<string, string>>;
    };

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.optionalDependencies,
      ...packageJson.peerDependencies
    };

    expect(Object.keys(dependencies).sort()).toEqual([
      "@opportunity-os/application",
      "@opportunity-os/connectors-reddit",
      "@opportunity-os/database",
      "@opportunity-os/domain",
      "@opportunity-os/events",
      "@opportunity-os/shared",
      "@types/node",
      "vitest"
    ]);

    for (const dependencyName of Object.keys(dependencies)) {
      expect(prohibitedDependencyNames).not.toContain(dependencyName);
    }
  });

  it("does not import or implement prohibited runtime boundaries", () => {
    for (const file of listSourceFiles(sourceRoot)) {
      const content = readFileSync(file, "utf8");
      const relativePath = relative(repoRoot, file);

      for (const pattern of prohibitedImportPatterns) {
        expect(pattern.test(content), `Unexpected prohibited import in ${relativePath}`).toBe(false);
      }

      for (const pattern of prohibitedSourceTerms) {
        expect(pattern.test(content), `Unexpected prohibited source term in ${relativePath}`).toBe(false);
      }
    }
  });
});
