import { expectTypeOf, test } from "vitest";
import type {
  DomainId,
  DomainTimestamp,
  DomainVersion
} from "../primitives/index.js";

test("domain primitive contracts are branded generic values", () => {
  type ExampleId = DomainId<"Example">;

  expectTypeOf<ExampleId>().toExtend<string>();
  expectTypeOf<DomainTimestamp>().toExtend<string>();
  expectTypeOf<DomainVersion>().toExtend<number>();
  expectTypeOf<string>().not.toExtend<ExampleId>();
  expectTypeOf<number>().not.toExtend<DomainVersion>();
});
