import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const repoRoot = dirname(dirname(packageRoot));
const sourceRoot = join(packageRoot, "src");

function listSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      if (entry === "__tests__") return [];
      return listSourceFiles(absolutePath);
    }

    return absolutePath.endsWith(".ts") ? [absolutePath] : [];
  });
}

describe("connector host dependency boundaries", () => {
  it("does not import prohibited package areas from host source", () => {
    const prohibitedImportPatterns = [
      /from\s+["']@opportunity-os\/apps/u,
      /from\s+["']@opportunity-os\/api/u,
      /from\s+["']@opportunity-os\/auth/u,
      /from\s+["']@opportunity-os\/frontend/u,
      /from\s+["']@opportunity-os\/business/u,
      /from\s+["']@opportunity-os\/product/u,
      /from\s+["']@opportunity-os\/workflows/u,
      /from\s+["']@opportunity-os\/reddit/u,
      /from\s+["']@opportunity-os\/youtube/u
    ];

    for (const file of listSourceFiles(sourceRoot)) {
      const content = readFileSync(file, "utf8");
      for (const pattern of prohibitedImportPatterns) {
        expect(
          pattern.test(content),
          `Unexpected prohibited import in ${relative(repoRoot, file)}`
        ).toBe(false);
      }
    }
  });
});
