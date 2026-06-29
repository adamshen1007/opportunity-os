export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value) && !Array.isArray(value);
}

export function hasOwnKey<Key extends PropertyKey>(
  value: unknown,
  key: Key
): value is Record<Key, unknown> {
  return isObject(value) && Object.prototype.hasOwnProperty.call(value, key);
}

export function getOwnValue<Key extends PropertyKey>(
  value: unknown,
  key: Key
): unknown | undefined {
  return hasOwnKey(value, key) ? value[key] : undefined;
}

export function pickKeys<T extends object, Key extends keyof T>(
  value: T | null | undefined,
  keys: readonly Key[]
): Partial<Pick<T, Key>> {
  const selected: Partial<Pick<T, Key>> = {};

  if (!isObject(value)) {
    return selected;
  }

  for (const key of keys) {
    if (hasOwnKey(value, key)) {
      selected[key] = value[key];
    }
  }

  return selected;
}

export function omitKeys<T extends object, Key extends keyof T>(
  value: T | null | undefined,
  keys: readonly Key[]
): Omit<T, Key> {
  if (!isObject(value)) {
    return {} as Omit<T, Key>;
  }

  const omitted = new Set<PropertyKey>(keys);
  const entries = Reflect.ownKeys(value)
    .filter((key) => !omitted.has(key))
    .map((key) => [key, value[key as keyof T]] as const);

  return Object.fromEntries(entries) as Omit<T, Key>;
}
