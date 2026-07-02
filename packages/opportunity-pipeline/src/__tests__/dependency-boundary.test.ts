import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageJsonPath = resolve(fileURLToPath(new URL("../../package.json", import.meta.url)));

const prohibitedDependencyPatterns = [
  /(^express$|^fastify$|^hono$|^@nestjs)/iu,
  /(^react$|^react-dom$|^next$|^vite$)/iu,
  /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu,
  /(^bullmq$|^agenda$|scheduler|worker|queue)/iu,
  /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu,
  /(ranker|ranking-engine|recommendation-engine|scoring-engine)/iu
];

const allowedWorkspaceDependencies = new Set([
  "@opportunity-os/analysis",
  "@opportunity-os/embeddings",
  "@opportunity-os/events",
  "@opportunity-os/llm-analysis",
  "@opportunity-os/normalization",
  "@opportunity-os/opportunity-engine",
  "@opportunity-os/raw-content"
]);

describe("Opportunity Pipeline dependency boundaries", () => {
  it("depends only on approved upstream foundation packages and test tooling", () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(Object.keys(packageJson.dependencies ?? {}).sort()).toEqual(
      [...allowedWorkspaceDependencies].sort()
    );

    for (const dependencyName of [
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {})
    ]) {
      for (const pattern of prohibitedDependencyPatterns) {
        expect(dependencyName).not.toMatch(pattern);
      }
    }
  });
});
