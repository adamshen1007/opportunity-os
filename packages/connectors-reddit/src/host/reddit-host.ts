import type {
  ConnectorHostBindings,
  ConnectorHostExecutionOrchestrationContract,
  ConnectorHostResult,
  ConnectorHostStartupValidationResult,
  ConnectorHostTestHarnessContract
} from "@opportunity-os/connector-host";
import type { RedditOperationContract } from "../operations/index.js";
import type { RedditValidationResult } from "../validation/index.js";

export type RedditHostValidationContract = {
  readonly startupValidation: ConnectorHostStartupValidationResult;
  readonly redditValidation: RedditValidationResult;
};

export type RedditHostExecutionContract = {
  readonly orchestration: ConnectorHostExecutionOrchestrationContract;
  readonly operations: readonly RedditOperationContract[];
};

export type RedditHostResultContract = {
  readonly result: ConnectorHostResult;
};

export type RedditHostIntegrationContract = {
  readonly bindings: ConnectorHostBindings;
  readonly validation: RedditHostValidationContract;
  readonly execution: RedditHostExecutionContract;
  readonly result: RedditHostResultContract;
  readonly testHarness?: ConnectorHostTestHarnessContract;
};
