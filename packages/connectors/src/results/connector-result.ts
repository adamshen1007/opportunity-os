import type { ConnectorId } from "../metadata/index.js";

export type ConnectorResultMetadata = {
  readonly connectorId?: ConnectorId;
  readonly operationName?: string;
  readonly correlationId?: string;
  readonly requestId?: string;
};

export type ConnectorSuccess<TValue = void> = {
  readonly ok: true;
  readonly value: TValue;
  readonly metadata?: ConnectorResultMetadata;
};

export type ConnectorFailure<TError = unknown> = {
  readonly ok: false;
  readonly error: TError;
  readonly metadata?: ConnectorResultMetadata;
};

export type ConnectorResult<TValue = void, TError = unknown> =
  | ConnectorSuccess<TValue>
  | ConnectorFailure<TError>;

export function connectorSuccess<TValue>(
  value: TValue,
  metadata?: ConnectorResultMetadata
): ConnectorSuccess<TValue> {
  return metadata ? { ok: true, value, metadata } : { ok: true, value };
}

export function connectorFailure<TError>(
  error: TError,
  metadata?: ConnectorResultMetadata
): ConnectorFailure<TError> {
  return metadata ? { ok: false, error, metadata } : { ok: false, error };
}
