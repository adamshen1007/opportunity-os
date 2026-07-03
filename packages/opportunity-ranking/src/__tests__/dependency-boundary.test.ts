import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageJsonPath = fileURLToPath(new URL("../../package.json", import.meta.url));
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
  readonly dependencies?: Record<string, string>;
};

describe("Opportunity Ranking dependency boundaries", () => {
  it("depends only on approved upstream foundation packages", () => {
    expect(Object.keys(packageJson.dependencies ?? {}).sort()).toEqual([
      "@opportunity-os/analysis",
      "@opportunity-os/events",
      "@opportunity-os/opportunity-candidates",
      "@opportunity-os/opportunity-engine",
      "@opportunity-os/opportunity-generation",
      "@opportunity-os/opportunity-pipeline",
      "@opportunity-os/shared"
    ]);
  });

  it("does not introduce runtime provider, API, persistence, scheduler, or account dependencies", () => {
    const serialized = JSON.stringify(packageJson.dependencies ?? {});

    expect(serialized).not.toContain("openai");
    expect(serialized).not.toContain("anthropic");
    expect(serialized).not.toContain("prisma");
    expect(serialized).not.toContain("express");
    expect(serialized).not.toContain("next");
    expect(serialized).not.toContain("stripe");
    expect(serialized).not.toContain("bull");
  });
});
