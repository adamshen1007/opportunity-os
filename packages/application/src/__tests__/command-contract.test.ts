import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  ApplicationCommand,
  ApplicationCommandHandler,
  ApplicationCommandInput
} from "../index.js";

type TestCommand = ApplicationCommand<
  "test.command",
  { readonly value: string }
>;

describe("application command contracts", () => {
  it("define generic command shape", () => {
    const input: ApplicationCommandInput<{ readonly value: string }> = {
      payload: { value: "example" },
      metadata: {
        correlationId: "correlation-id",
        requestId: "request-id"
      }
    };

    const command: TestCommand = {
      name: "test.command",
      ...input
    };

    expect(command).toEqual({
      name: "test.command",
      payload: { value: "example" },
      metadata: {
        correlationId: "correlation-id",
        requestId: "request-id"
      }
    });
  });

  it("defines command handler contracts without runtime dispatch", async () => {
    const handler: ApplicationCommandHandler<TestCommand, string> = {
      commandName: "test.command",
      execute: async (command) => command.payload.value
    };

    await expect(
      handler.execute({
        name: "test.command",
        payload: { value: "handled" },
        metadata: { correlationId: "correlation-id" }
      })
    ).resolves.toBe("handled");

    expectTypeOf(handler.commandName).toEqualTypeOf<"test.command">();
  });
});
