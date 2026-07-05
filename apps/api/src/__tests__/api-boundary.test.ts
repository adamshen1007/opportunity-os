import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoot = path.resolve(packageRoot, "src");

const allowedWorkspaceDependencies = new Set([
  "@opportunity-os/opportunity-candidates",
  "@opportunity-os/opportunity-engine",
  "@opportunity-os/opportunity-generation",
  "@opportunity-os/opportunity-pipeline",
  "@opportunity-os/opportunity-ranking"
]);

function listSourceFiles(directory: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "dist" || entry.name === "node_modules") {
        return [];
      }

      return listSourceFiles(fullPath);
    }

    return fullPath.endsWith(".ts") ? [fullPath] : [];
  });
}

describe("API dependency boundaries", () => {
  it("keeps workspace dependencies limited to approved upstream packages", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")) as {
      readonly dependencies?: Record<string, string>;
      readonly devDependencies?: Record<string, string>;
    };
    const workspaceDependencies = Object.keys(manifest.dependencies ?? {}).filter((name) =>
      name.startsWith("@opportunity-os/")
    );

    expect(workspaceDependencies.sort()).toEqual([...allowedWorkspaceDependencies].sort());
    expect(Object.keys(manifest.devDependencies ?? {}).sort()).toEqual(["@types/node", "vitest"]);
  });

  it("keeps source imports inside the API app and approved upstream packages", () => {
    const imports = listSourceFiles(sourceRoot)
      .flatMap((file) => {
        const content = fs.readFileSync(file, "utf8");
        return [...content.matchAll(/from "([^"]+)"/gu)].map((match) => match[1] ?? "");
      });
    const disallowedImports = imports.filter((importPath) => {
      if (importPath.startsWith(".")) return false;
      if (allowedWorkspaceDependencies.has(importPath)) return false;
      if (importPath === "vitest") return false;
      if (importPath.startsWith("node:")) return false;
      return true;
    });

    expect(disallowedImports).toEqual([]);
  });
});
