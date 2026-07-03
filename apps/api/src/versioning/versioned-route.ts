import { API_VERSIONS, type ApiVersion } from "./api-version.js";

export interface VersionedApiRoute {
  readonly version: ApiVersion;
  readonly path: string;
}

export function createVersionedPath(path: string, version: ApiVersion = API_VERSIONS.v1): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${version}${normalizedPath}`.replace(/\/{2,}/gu, "/");
}
