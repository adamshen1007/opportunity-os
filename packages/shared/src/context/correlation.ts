export type CorrelationId = string;

export type CorrelationContext = {
  readonly correlationId: CorrelationId;
};

export function createCorrelationContext(
  correlationId: CorrelationId
): CorrelationContext {
  return { correlationId };
}

export function withCorrelationContext<T extends object>(
  value: T,
  context: CorrelationContext
): T & CorrelationContext {
  return {
    ...value,
    correlationId: context.correlationId
  };
}
