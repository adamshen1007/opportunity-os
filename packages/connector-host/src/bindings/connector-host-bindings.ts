import type { RuntimeConfig } from "@opportunity-os/config";
import type {
  ConfigBinding,
  ContainerContract,
  DependencyToken,
  LoggerBindingContract,
  ModuleRegistration
} from "@opportunity-os/container";
import type { EventPublisher } from "@opportunity-os/events";
import type {
  CorrelationId,
  RequestId,
  StructuredLogger
} from "@opportunity-os/shared";

export type ConnectorHostConfigBinding = ConfigBinding<RuntimeConfig>;

export type ConnectorHostDependencyBindings = {
  readonly container: ContainerContract;
  readonly registrations?: readonly ModuleRegistration[];
};

export type ConnectorHostLoggerBinding = {
  readonly binding: LoggerBindingContract;
  readonly logger: StructuredLogger;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostEventPublisherBinding<TPayload = unknown> = {
  readonly kind: "event-publisher";
  readonly token: DependencyToken<EventPublisher<TPayload>>;
  readonly publisher: EventPublisher<TPayload>;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostBindingContext = {
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostBindings = {
  readonly config: ConnectorHostConfigBinding;
  readonly dependencies: ConnectorHostDependencyBindings;
  readonly logger: ConnectorHostLoggerBinding;
  readonly events?: ConnectorHostEventPublisherBinding;
  readonly context: ConnectorHostBindingContext;
};
