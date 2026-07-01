export const CONNECTOR_CAPABILITY_KINDS = [
  "read",
  "sync",
  "validate",
  "health",
  "discover"
] as const;

export type ConnectorCapabilityKind =
  (typeof CONNECTOR_CAPABILITY_KINDS)[number];

export type ConnectorCapability = {
  readonly kind: ConnectorCapabilityKind;
  readonly enabled: boolean;
  readonly description?: string;
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
};

export type ConnectorCapabilitySet = {
  readonly capabilities: readonly ConnectorCapability[];
};
