import { describe, expect, it, vi } from "vitest";
import type { StructuredLogger } from "@opportunity-os/shared";
import {
  CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS,
  type ConnectorRuntimeExecutionPipeline,
  type ConnectorRuntimePipelineFailure,
  type ConnectorRuntimePipelineResult
} from "../index.js";

const logger: StructuredLogger = {
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn(() => logger)
};

const context = {
  correlationId: "correlation-1",
  logger,
  connector: {
    metadata: {
      id: "generic-source",
      name: "Generic Source",
      version: "1.0.0",
      description: "Provider-neutral fixture.",
      provider: "generic-provider",
      category: "source",
      tags: ["fixture"],
      stability: "experimental"
    },
    config: {
      fields: []
    },
    context: {
      correlationId: "correlation-1",
      logger,
      config: {
        fields: []
      },
      execution: {
        connectorId: "generic-source"
      }
    }
  },
  infrastructure: {
    moduleId: "connector-runtime"
  }
} as const;

describe("connector runtime pipeline contracts", () => {
  it("defines stable pipeline stage kinds", () => {
    expect(CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS).toEqual([
      "prepare",
      "validate",
      "process",
      "finalize"
    ]);
  });

  it("models pipeline stages, inputs, outputs, context, and safe failure shapes", () => {
    const pipeline: ConnectorRuntimeExecutionPipeline<
      { readonly cursor?: string },
      readonly string[]
    > = {
      name: "generic-runtime-pipeline",
      stages: [
        {
          kind: "prepare",
          name: "prepare input",
          expectedInputState: "created",
          expectedOutputState: "ready"
        }
      ],
      input: {
        context,
        input: {
          cursor: "cursor-1"
        },
        state: "created"
      },
      result: {
        ok: true,
        value: {
          context,
          output: ["item-1"],
          state: "succeeded",
          transition: {
            kind: "succeed",
            from: "running",
            to: "succeeded"
          }
        }
      }
    };
    const failure: ConnectorRuntimePipelineFailure = {
      ok: false,
      code: "stage-failed",
      safeMessage: "Pipeline stage did not complete.",
      stage: "validate",
      state: "failed"
    };
    const result: ConnectorRuntimePipelineResult = failure;

    expect(pipeline.stages[0]?.kind).toBe("prepare");
    expect(pipeline.result?.ok).toBe(true);
    expect(result.safeMessage).toBe("Pipeline stage did not complete.");
  });
});
