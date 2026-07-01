import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
};

function listSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stat = statSync(absolutePath);

    if (stat.isDirectory()) {
      if (entry === "__tests__" || entry === "dist" || entry === "node_modules") {
        return [];
      }

      return listSourceFiles(absolutePath);
    }

    return absolutePath.endsWith(".ts") ? [absolutePath] : [];
  });
}

describe("connector SDK package boundaries", () => {
  it("depends only on approved foundation packages and tooling", () => {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    expect(Object.keys(dependencies).sort()).toEqual([
      "@opportunity-os/errors",
      "@opportunity-os/shared",
      "@types/node",
      "vitest"
    ]);
  });

  it("does not reference prohibited implementation areas from source contracts", () => {
    const source = listSourceFiles(join(packageRoot, "src"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    const prohibitedPatterns = [
      /\bapps?\b/iu,
      /\bapi route\b|\broute handler\b/iu,
      /\bcontroller\b/iu,
      /\bauthentication implementation\b|\bauthorization implementation\b/iu,
      /\bConcreteConnector\b|\bProviderConnector\b/iu,
      /\bAIWorkflow\b|\bworkflow runner\b/iu,
      /\bfrontend\b|\btsx\b/iu,
      /\bproduct workflow\b/iu,
      /\bscoreOpportunity\b|\bscoring engine\b/iu
    ];

    for (const pattern of prohibitedPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });
});
