import type {
  CorrelationId,
  Logger,
  RequestContext,
  RequestId
} from "@opportunity-os/shared";

export type ApplicationContext = RequestContext & {
  readonly logger?: Logger;
};

export type ApplicationContextInput = {
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
  readonly logger?: Logger;
};

export function createApplicationContext(
  input: ApplicationContextInput
): ApplicationContext {
  return {
    correlationId: input.correlationId,
    ...(input.requestId === undefined ? {} : { requestId: input.requestId }),
    ...(input.logger === undefined ? {} : { logger: input.logger })
  };
}
