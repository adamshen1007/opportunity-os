import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const packageRoot = resolve(import.meta.dirname, "../..");
const srcRoot = resolve(packageRoot, "src");

const allowedDependencies = new Set([
  "@opportunity-os/errors",
  "@opportunity-os/events",
  "@opportunity-os/types",
  "@opportunity-os/utils",
  "@types/node",
  "vitest"
]);

const prohibitedDependencyPatterns = [
  /@opportunity-os\/(acquisition|ai|application|database|intelligence|ui)\b/u,
  /@opportunity-os\/.*(api|connector|frontend|workflow|business).*/iu,
  /\b(prisma|@prisma\/client|sequelize|typeorm|mongoose)\b/iu
];

function listSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".ts") ? [entryPath] : [];
  });
}

describe("domain package boundary", () => {
  test("package dependencies are limited to approved shared infrastructure and tooling", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(packageRoot, "package.json"), "utf8")
    ) as Record<string, Record<string, string> | undefined>;

    for (const dependencyField of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies"
    ]) {
      const dependencies = packageJson[dependencyField] ?? {};
      for (const dependencyName of Object.keys(dependencies)) {
        expect(allowedDependencies.has(dependencyName)).toBe(true);
        expect(
          prohibitedDependencyPatterns.some((pattern) =>
            pattern.test(dependencyName)
          )
        ).toBe(false);
      }
    }
  });

  test("runtime source does not import prohibited implementation packages", () => {
    const sourceFiles = listSourceFiles(srcRoot).filter(
      (file) => !file.includes("/__tests__/")
    );

    for (const sourceFile of sourceFiles) {
      const source = readFileSync(sourceFile, "utf8");
      expect(source).not.toMatch(
        /from\s+["'](@opportunity-os\/(acquisition|ai|application|database|intelligence|ui)|[^"']*(api|connector|frontend|workflow|business|prisma|sql)[^"']*)["']/iu
      );
    }
  });
});
