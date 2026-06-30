export type InjectionToken<TValue = unknown> = {
  readonly id: string;
  readonly description?: string;
  readonly valueType?: TValue;
};

export function createInjectionToken<TValue = unknown>(
  id: string,
  description?: string
): InjectionToken<TValue> {
  return description === undefined
    ? { id }
    : {
        id,
        description
      };
}
