import { expect, expectTypeOf, test } from "vitest";
import { createDomainError } from "../errors/index.js";
import { domainFailure, domainSuccess } from "../result/index.js";
import type {
  DomainValidationIssue,
  DomainValidationResult
} from "../validation/index.js";

test("domain result helpers are deterministic generic wrappers", () => {
  const success = domainSuccess({ ok: true });
  const failure = domainFailure(createDomainError({ message: "invalid" }));

  expect(success).toEqual({ success: true, value: { ok: true } });
  expect(failure.success).toBe(false);
  expect(failure.error.toSafeDetails().message).toBe("invalid");
});

test("validation contracts stay generic", () => {
  type ExampleValue = { readonly label: string };
  type ExampleValidation = DomainValidationResult<ExampleValue>;

  expectTypeOf<ExampleValidation>().toMatchTypeOf<
    | { readonly valid: true; readonly value: ExampleValue }
    | {
        readonly valid: false;
        readonly issues: readonly DomainValidationIssue[];
      }
  >();
  expectTypeOf<DomainValidationIssue>().toHaveProperty("path");
  expectTypeOf<DomainValidationIssue>().toHaveProperty("code");
  expectTypeOf<DomainValidationIssue>().toHaveProperty("message");
});
