import {
  connectorFailure,
  connectorSuccess,
  type ConnectorResult,
  type ConnectorResultMetadata
} from "@opportunity-os/connectors";
import type {
  RedditDataEnvelope
} from "../data/index.js";
import type { RedditOperationName } from "../operations/index.js";
import {
  createRedditRuntimeError,
  type SafeRedditRuntimeErrorDetails
} from "./runtime-error.js";

export type RedditRuntimeReadResult = ConnectorResult<
  RedditDataEnvelope,
  SafeRedditRuntimeErrorDetails
>;

export type RedditRuntimeResultMetadataInput = {
  readonly operationName: RedditOperationName;
  readonly correlationId?: string;
  readonly requestId?: string;
};

function createMetadata(
  input: RedditRuntimeResultMetadataInput
): ConnectorResultMetadata {
  return {
    connectorId: "reddit",
    operationName: input.operationName,
    correlationId: input.correlationId,
    requestId: input.requestId
  };
}

export function mapRedditRuntimeSuccess(
  envelope: RedditDataEnvelope,
  metadata: RedditRuntimeResultMetadataInput
): RedditRuntimeReadResult {
  return connectorSuccess(envelope, createMetadata(metadata));
}

export function mapRedditRuntimeFailure(
  message: string,
  metadata: RedditRuntimeResultMetadataInput
): RedditRuntimeReadResult {
  const error = createRedditRuntimeError({
    message,
    correlationId: metadata.correlationId,
    requestId: metadata.requestId
  });

  return connectorFailure(
    error.toRedditRuntimeSafeDetails(),
    createMetadata(metadata)
  );
}
