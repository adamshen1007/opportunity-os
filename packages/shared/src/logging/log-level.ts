export const LOG_LEVELS = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error"
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

const LOG_LEVEL_VALUES = new Set<string>(Object.values(LOG_LEVELS));

export function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === "string" && LOG_LEVEL_VALUES.has(value);
}
