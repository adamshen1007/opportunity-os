import fs from "node:fs";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("../../package.json", import.meta.url), "utf8")
) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

describe("dependency boundaries", () => {
  it("depends only on approved foundation packages and deterministic tooling", () => {
    expect(Object.keys(packageJson.dependencies ?? {}).sort()).toEqual([
      "@opportunity-os/embeddings",
      "@opportunity-os/events",
      "@opportunity-os/normalization",
      "@opportunity-os/raw-content",
      "@opportunity-os/shared"
    ]);
    expect(Object.keys(packageJson.devDependencies ?? {}).sort()).toEqual([
      "@types/node",
      "vitest"
    ]);
  });

  it("does not introduce provider, network, app, persistence, or product dependencies", () => {
    const dependencies = Object.keys({
      ...(packageJson.dependencies ?? {}),
      ...(packageJson.devDependencies ?? {})
    }).join("\n");

    const prohibitedDependencies = [
      "openai",
      "anthropic",
      "gemini",
      "generative-ai",
      "axios",
      "fetch",
      "undici",
      "got",
      "superagent",
      "express",
      "fastify",
      "hono",
      "next",
      "react",
      "vite",
      "prisma",
      "typeorm",
      "sequelize",
      "mongoose",
      "bullmq",
      "agenda",
      "queue",
      "worker",
      "scheduler"
    ];

    for (const dependency of prohibitedDependencies) {
      expect(dependencies.split("\n")).not.toContain(dependency);
    }
  });
});
