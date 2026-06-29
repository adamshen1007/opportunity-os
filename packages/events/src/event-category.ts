export const EVENT_CATEGORIES = {
  infrastructure: "infrastructure",
  integration: "integration",
  lifecycle: "lifecycle",
  observability: "observability",
  security: "security"
} as const;

export type EventCategory =
  (typeof EVENT_CATEGORIES)[keyof typeof EVENT_CATEGORIES];

const EVENT_CATEGORY_VALUES = new Set<string>(Object.values(EVENT_CATEGORIES));

export function isEventCategory(value: unknown): value is EventCategory {
  return typeof value === "string" && EVENT_CATEGORY_VALUES.has(value);
}
