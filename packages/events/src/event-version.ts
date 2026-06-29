export type EventVersion = `v${number}`;

export const EVENT_VERSION_PATTERN = /^v[1-9]\d*$/u;

export function createEventVersion(majorVersion: number): EventVersion {
  if (!Number.isInteger(majorVersion) || majorVersion < 1) {
    throw new TypeError("Event version must be a positive integer");
  }

  return `v${majorVersion}` as EventVersion;
}

export function isEventVersion(value: unknown): value is EventVersion {
  return typeof value === "string" && EVENT_VERSION_PATTERN.test(value);
}
