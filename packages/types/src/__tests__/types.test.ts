import { describe, expectTypeOf, it } from "vitest";

import type { Brand, Failure, MetadataValue, Result, SerializableMetadata, Success } from "../index.js";

describe("shared primitive types", () => {
  it("supports branded primitive assignability", () => {
    type UserId = Brand<string, "UserId">;
    type AccountId = Brand<string, "AccountId">;

    expectTypeOf<UserId>().toExtend<string>();
    expectTypeOf<UserId>().not.toEqualTypeOf<AccountId>();
    expectTypeOf<string>().not.toExtend<UserId>();
  });

  it("models success and failure result branches", () => {
    type ExampleSuccess = Success<number>;
    type ExampleFailure = Failure<"invalid">;
    type ExampleResult = Result<number, "invalid">;

    expectTypeOf<ExampleSuccess>().toExtend<ExampleResult>();
    expectTypeOf<ExampleFailure>().toExtend<ExampleResult>();
    expectTypeOf<ExampleResult>().toEqualTypeOf<ExampleSuccess | ExampleFailure>();
  });

  it("accepts serializable metadata values", () => {
    type ExampleMetadata = {
      readonly name: string;
      readonly count: number;
      readonly enabled: boolean;
      readonly nested: {
        readonly tags: readonly string[];
        readonly empty: null;
      };
    };

    expectTypeOf<ExampleMetadata>().toExtend<SerializableMetadata>();
    expectTypeOf<SerializableMetadata>().toExtend<Record<string, MetadataValue>>();
  });
});
