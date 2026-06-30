import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const packageJsonPath = path.join(import.meta.dirname, "../../package.json");
const sourceRoot = path.join(import.meta.dirname, "..");

const prohibitedWorkspaceDependencies = [
  "@opportunity-os/acquisition",
  "@opportunity-os/ai",
  "@opportunity-os/application",
  "@opportunity-os/domain",
  "@opportunity-os/intelligence",
  "@opportunity-os/ui"
];

describe("database package boundary", () => {
  it("does not depend on application, domain, connector, AI workflow, or frontend packages", () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const dependencyName of prohibitedWorkspaceDependencies) {
      expect(dependencies).not.toHaveProperty(dependencyName);
    }
  });

  it("does not import application, connector, AI workflow, frontend, or domain modules", () => {
    const sourceFiles = listSourceFiles(sourceRoot);

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(sourceFile, "utf8");
      expect(source).not.toMatch(/@opportunity-os\/(?:acquisition|ai|application|domain|intelligence|ui)/u);
      expect(source).not.toMatch(/(?:apps|connectors|workflows|frontend)\//u);
    }
  });
});

function listSourceFiles(directory: string): readonly string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.name === "__tests__") {
      return [];
    }

    if (entry.isDirectory()) {
      return listSourceFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(".ts") ? [entryPath] : [];
  });
}
