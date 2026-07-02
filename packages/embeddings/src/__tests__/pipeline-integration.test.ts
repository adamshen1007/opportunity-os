import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = fileURLToPath(new URL("../..", import.meta.url));

describe("embedding package pipeline integration", () => {
  it("exposes package-level lint, build, and test scripts for the root pipeline", () => {
    const packageJson = JSON.parse(
      readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8")
    ) as {
      scripts?: Record<string, string>;
      name?: string;
    };

    expect(packageJson.name).toBe("@opportunity-os/embeddings");
    expect(packageJson.scripts).toMatchObject({
      build: "tsc -b tsconfig.json",
      lint: "tsc --noEmit -p tsconfig.json",
      test: "vitest run src --passWithNoTests"
    });
  });
});
