import type { ConnectorRuntimeContext } from "../context/index.js";
import type {
  ConnectorRuntimeExecutionState,
  ConnectorRuntimeStateTransition
} from "../state/index.js";

export const CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS = [
  "prepare",
  "validate",
  "process",
  "finalize"
] as const;

export type ConnectorRuntimePipelineStageKind =
  (typeof CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS)[number];

export type ConnectorRuntimePipelineInput<TInput = unknown> = {
  readonly context: ConnectorRuntimeContext;
  readonly input?: TInput;
  readonly state: ConnectorRuntimeExecutionState;
};

export type ConnectorRuntimePipelineOutput<TOutput = unknown> = {
  readonly context: ConnectorRuntimeContext;
  readonly output?: TOutput;
  readonly state: ConnectorRuntimeExecutionState;
  readonly transition?: ConnectorRuntimeStateTransition;
};

export type ConnectorRuntimePipelineFailure = {
  readonly ok: false;
  readonly code: string;
  readonly safeMessage: string;
  readonly stage?: ConnectorRuntimePipelineStageKind;
  readonly state: ConnectorRuntimeExecutionState;
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
};

export type ConnectorRuntimePipelineSuccess<TOutput = unknown> = {
  readonly ok: true;
  readonly value: ConnectorRuntimePipelineOutput<TOutput>;
};

export type ConnectorRuntimePipelineResult<TOutput = unknown> =
  | ConnectorRuntimePipelineSuccess<TOutput>
  | ConnectorRuntimePipelineFailure;

export type ConnectorRuntimePipelineStage = {
  readonly kind: ConnectorRuntimePipelineStageKind;
  readonly name: string;
  readonly description?: string;
  readonly expectedInputState: ConnectorRuntimeExecutionState;
  readonly expectedOutputState: ConnectorRuntimeExecutionState;
};

export type ConnectorRuntimeExecutionPipeline<TInput = unknown, TOutput = unknown> = {
  readonly name: string;
  readonly stages: readonly ConnectorRuntimePipelineStage[];
  readonly input: ConnectorRuntimePipelineInput<TInput>;
  readonly result?: ConnectorRuntimePipelineResult<TOutput>;
};
