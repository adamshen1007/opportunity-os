import type {
  CorrelationContext,
  CorrelationId
} from "./correlation.js";

export type RequestId = string;

export type RequestContext = CorrelationContext & {
  readonly requestId?: RequestId;
};

export type RequestContextInput = {
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export function createRequestContext(
  input: RequestContextInput
): RequestContext {
  return input.requestId === undefined
    ? { correlationId: input.correlationId }
    : {
        correlationId: input.correlationId,
        requestId: input.requestId
      };
}

export function withRequestContext<T extends object>(
  value: T,
  context: RequestContext
): T & RequestContext {
  return context.requestId === undefined
    ? {
        ...value,
        correlationId: context.correlationId
      }
    : {
        ...value,
        correlationId: context.correlationId,
        requestId: context.requestId
      };
}
