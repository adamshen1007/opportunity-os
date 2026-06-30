import { describe, expect, it, vi } from "vitest";
import { createTransactionBoundary, type TransactionOptions, type TransactionRunner } from "../transaction.js";

describe("transaction boundary contracts", () => {
  it("runs work through an injected transaction runner", async () => {
    const transaction = { id: "tx-1" };
    let capturedOptions: TransactionOptions | undefined;
    const runnerMock = vi.fn();
    const runner: TransactionRunner<typeof transaction> = async (handler, options) => {
      capturedOptions = options;
      runnerMock();
      return handler(transaction);
    };
    const boundary = createTransactionBoundary(runner);

    await expect(boundary.runInTransaction(async (value) => value.id, { isolationLevel: "serializable" })).resolves.toBe(
      "tx-1"
    );
    expect(runnerMock).toHaveBeenCalledOnce();
    expect(capturedOptions).toEqual({ isolationLevel: "serializable" });
  });
});
