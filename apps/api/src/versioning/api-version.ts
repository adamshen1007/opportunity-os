export const API_VERSIONS = {
  v1: "v1"
} as const;

export type ApiVersion = (typeof API_VERSIONS)[keyof typeof API_VERSIONS];

export function isSupportedApiVersion(version: string): version is ApiVersion {
  return Object.values(API_VERSIONS).includes(version as ApiVersion);
}

export function normalizeApiVersion(version: string): ApiVersion | undefined {
  const normalized = version.trim().replace(/^\/+/u, "");
  return isSupportedApiVersion(normalized) ? normalized : undefined;
}
