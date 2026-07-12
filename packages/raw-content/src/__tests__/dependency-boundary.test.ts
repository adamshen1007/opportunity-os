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

const prohibitedImportFragments = [
  "@prisma/client",
  "prisma",
  "apps/",
  "app/",
  "api/",
  "frontend",
  "scheduler",
  "worker",
  "ai/",
  "business"
] as const;

const prohibitedSourceTerms = [
  "PrismaClient",
  "persistRawContent",
  "writeToDatabase",
  "fetch(",
  "XMLHttpRequest",
  "OpenAI",
  "Anthropic",
  "scoreOpportunity"
] as const;

function importSpecifiers(content: string): readonly string[] {
  return [...content.matchAll(/from\s+["']([^"']+)["']/gu)].map((match) => match[1] ?? "");
}

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
      "@opportunity-os/connectors-stack-exchange",
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
    const violations: string[] = [];

    for (const file of listSourceFiles(sourceRoot)) {
      const content = readFileSync(file, "utf8");
      const relativePath = relative(repoRoot, file);

      for (const specifier of importSpecifiers(content)) {
        for (const fragment of prohibitedImportFragments) {
          if (specifier.includes(fragment)) {
            violations.push(`Unexpected prohibited import in ${relativePath}: ${specifier}`);
          }
        }
      }

      for (const term of prohibitedSourceTerms) {
        if (content.includes(term)) {
          violations.push(`Unexpected prohibited source term in ${relativePath}: ${term}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
