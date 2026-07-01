import { describe, expect, expectTypeOf, it } from "vitest";
import {
  INFRASTRUCTURE_PACKAGE_NAMES,
  type InfrastructurePackageName,
  type PackageRegistrationMetadata,
  type PackageRegistrationModule
} from "../index.js";

describe("package registration metadata contracts", () => {
  it("lists only approved foundation package names", () => {
    expect(INFRASTRUCTURE_PACKAGE_NAMES).toEqual([
      "@opportunity-os/config",
      "@opportunity-os/shared",
      "@opportunity-os/events",
      "@opportunity-os/database",
      "@opportunity-os/domain",
      "@opportunity-os/application",
      "@opportunity-os/container"
    ]);
  });

  it("describes package-provided capabilities without creating them", () => {
    const metadata: PackageRegistrationMetadata = {
      packageName: "@opportunity-os/shared",
      moduleId: "logging",
      version: "1.0.0",
      provides: ["structured-logging-contracts"],
      requires: ["configuration"]
    };

    const module: PackageRegistrationModule = {
      id: "logging",
      kind: "logging",
      packageRegistration: metadata
    };

    expect(module.packageRegistration).toEqual(metadata);
  });

  it("exports package names as a literal union", () => {
    expectTypeOf<InfrastructurePackageName>().toEqualTypeOf<
      (typeof INFRASTRUCTURE_PACKAGE_NAMES)[number]
    >();
  });
});
