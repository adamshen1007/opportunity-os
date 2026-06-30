import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import {
  DomainError,
  createDomainError,
  domainFailure,
  domainSuccess
} from "../index.js";

const packageRoot = resolve(import.meta.dirname, "../..");

const expectedPublicExports = [
  "AggregateIdentity",
  "AggregateRoot",
  "CreatedMetadata",
  "DomainError",
  "DomainErrorCategory",
  "DomainErrorCode",
  "DomainErrorOptions",
  "DomainEventCollection",
  "DomainEventCollectionSnapshot",
  "DomainEventMetadata",
  "DomainEventName",
  "DomainEventPayload",
  "DomainEventReference",
  "DomainEventVersion",
  "DomainFailure",
  "DomainId",
  "DomainMetadata",
  "DomainRepositoryContext",
  "DomainRepositoryContract",
  "DomainResult",
  "DomainSuccess",
  "DomainTimestamp",
  "DomainValidationFailure",
  "DomainValidationIssue",
  "DomainValidationResult",
  "DomainValidationSuccess",
  "DomainVersion",
  "Entity",
  "EntityIdentity",
  "SafeDomainErrorDetails",
  "UpdatedMetadata",
  "ValueObject",
  "ValueObjectEquality",
  "ValueObjectProperties",
  "VersionMetadata",
  "createDomainError",
  "domainFailure",
  "domainSuccess"
] as const;

describe("domain public exports", () => {
  test("runtime exports are routed through src/index.ts", () => {
    expect(createDomainError({ message: "safe" })).toBeInstanceOf(DomainError);
    expect(domainSuccess("ok")).toEqual({ success: true, value: "ok" });
    expect(domainFailure("not-ok")).toEqual({
      success: false,
      error: "not-ok"
    });
  });

  test("type and runtime export names stay stable", () => {
    const indexSource = readFileSync(resolve(packageRoot, "src/index.ts"), "utf8");

    for (const exportName of expectedPublicExports) {
      expect(indexSource).toContain(exportName);
    }
  });

  test("package exports expose only the public package boundary", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(packageRoot, "package.json"), "utf8")
    ) as { exports: Record<string, unknown> };

    expect(Object.keys(packageJson.exports)).toEqual(["."]);
  });
});
