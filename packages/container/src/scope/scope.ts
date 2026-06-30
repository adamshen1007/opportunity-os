export type ScopeId = string;

export type ContainerScope = {
  readonly id: ScopeId;
  readonly dispose: () => void | Promise<void>;
};
