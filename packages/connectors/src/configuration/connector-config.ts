export type ConnectorConfigFieldKind =
  | "string"
  | "number"
  | "boolean"
  | "url"
  | "secret";

export type ConnectorConfigField<TValue = unknown> = {
  readonly key: string;
  readonly kind: ConnectorConfigFieldKind;
  readonly required: boolean;
  readonly sensitive?: boolean;
  readonly value?: TValue;
  readonly description?: string;
};

export type ConnectorSensitiveConfigField<TValue = string> =
  ConnectorConfigField<TValue> & {
    readonly kind: "secret";
    readonly sensitive: true;
  };

export type ConnectorConfigInput = {
  readonly fields: readonly ConnectorConfigField[];
};

export type ConnectorConfig = {
  readonly fields: readonly ConnectorConfigField[];
};
