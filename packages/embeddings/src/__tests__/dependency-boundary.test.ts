import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const ALLOWED_WORKSPACE_DEPENDENCIES = new Set([
  "@opportunity-os/events",
  "@opportunity-os/normalization",
  "@opportunity-os/raw-content",
  "@opportunity-os/shared"
]);
const PROHIBITED_DEPENDENCY_PATTERN =
  /(^openai$|^@openai|^@google\/generative-ai$|^@google-genai|gemini|voyage|pinecone|weaviate|qdrant|milvus|chroma|pgvector|^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose|^express$|^fastify$|^hono$|^react$|^react-dom$|^next$|scheduler|worker|queue)/iu;
const PROHIBITED_SOURCE_PATTERN =
  /\b(openai\.(embeddings|responses|chat)|api\.openai\.com|generateContent|voyageai|Pinecone|Weaviate|Qdrant|Milvus|Chroma|pgvector|PrismaClient|persistEmbedding|executePrompt|generateOpportunity|REST API|route handler|WorkerProcess)\b/iu;

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

describe("embedding dependency boundaries", () => {
  it("depends only on approved foundation packages and test/build tooling", () => {
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
        `${dependencyName} is not an approved embedding foundation dependency`
      ).toBe(true);
      expect(dependencyName).not.toMatch(PROHIBITED_DEPENDENCY_PATTERN);
    }

    expect(devDependencyNames.sort()).toEqual(["@types/node", "vitest"]);
  });

  it("does not introduce provider SDKs, vector DBs, persistence, APIs, workers, or product execution", () => {
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
