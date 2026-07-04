import { describe, expect, it } from "vitest";
import webPackageJson from "../../package.json" with { type: "json" };

const expectedDependencies = ["@opportunity-os/api", "next", "react", "react-dom"] as const;
const expectedDevDependencies = [
  "@playwright/test",
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "typescript",
  "vitest"
] as const;

describe("Dashboard dependency boundary", () => {
  it("depends only on the approved REST API contract and frontend tooling", () => {
    expect(Object.keys(webPackageJson.dependencies).sort()).toEqual([...expectedDependencies].sort());
    expect(Object.keys(webPackageJson.devDependencies).sort()).toEqual([...expectedDevDependencies].sort());
  });

  it("keeps scripts deterministic and local", () => {
    expect(webPackageJson.scripts.test).toBe("vitest run src --passWithNoTests");
    expect(webPackageJson.scripts["test:e2e"]).toBe("playwright test");
    expect(webPackageJson.scripts.build).toBe("next build");
  });
});
