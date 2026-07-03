export interface ApiFilterQuery {
  readonly filters: Readonly<Record<string, string>>;
}

export interface RawApiFilterQuery {
  readonly [key: string]: string | number | boolean | undefined;
}

export function parseApiFilterQuery(query: RawApiFilterQuery, allowedFields: readonly string[]): ApiFilterQuery {
  const allowed = new Set(allowedFields);
  const filters: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || !allowed.has(key)) {
      continue;
    }
    filters[key] = String(value);
  }

  return { filters };
}
