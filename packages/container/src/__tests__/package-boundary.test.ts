import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(currentDirectory, "../..");
const workspaceRoot = path.resolve(packageRoot, "../..");

function listSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "dist" || entry.name === "node_modules") return [];
      return listSourceFiles(absolutePath);
    }
    return entry.isFile() && entry.name.endsWith(".ts") ? [absolutePath] : [];
  });
}

describe("container package boundaries", () => {
  it("depends only on approved foundation packages and test tooling", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")
    ) as {
      readonly dependencies?: Record<string, string>;
      readonly devDependencies?: Record<string, string>;
    };

    expect(Object.keys(packageJson.dependencies ?? {}).sort()).toEqual([
      "@opportunity-os/config",
      "@opportunity-os/errors",
      "@opportunity-os/shared"
    ]);
    expect(Object.keys(packageJson.devDependencies ?? {}).sort()).toEqual([
      "@types/node",
      "vitest"
    ]);
  });

  it("does not import prohibited implementation layers", () => {
    const prohibitedPatterns = [
      /@opportunity-os\/(?:acquisition|ai|application|database|domain|intelligence|ui)\b/u,
      /(?:^|[/"'])apps\//u,
      /\bPrismaClient\b/u,
      /\bSQL\b|\bsql\b/u,
      /\bcontroller\b/iu,
      /\broute handler\b/iu,
      /\bauth middleware\b/iu,
      /\bexecuteConnector\b/u,
      /\bworkflow runner\b/iu,
      /\bscoreOpportunity\b/u,
      /\bproduct workflow\b/iu,
      /\bbusiness logic\b/iu
    ];

    const sourceFiles = listSourceFiles(path.join(packageRoot, "src"))
      .filter((file) => !file.includes(`${path.sep}__tests__${path.sep}`));

    for (const file of sourceFiles) {
      const relativePath = path.relative(workspaceRoot, file);
      const content = fs.readFileSync(file, "utf8");
      for (const pattern of prohibitedPatterns) {
        expect(content, `${relativePath} violates ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
