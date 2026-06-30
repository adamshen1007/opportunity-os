export type DependencyToken<TValue = unknown> = {
  readonly id: string;
  readonly description?: string;
  readonly valueType?: TValue;
};

export function createDependencyToken<TValue = unknown>(
  id: string,
  description?: string
): DependencyToken<TValue> {
  return description === undefined
    ? { id }
    : {
        id,
        description
      };
}
