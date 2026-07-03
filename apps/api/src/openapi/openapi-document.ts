import type { ApiRouteDefinition } from "../routing/index.js";
import { createVersionedPath } from "../versioning/index.js";

export interface ApiOpenApiOperation {
  readonly operationId: string;
  readonly summary: string;
  readonly tags: readonly string[];
}

export interface ApiOpenApiDocument {
  readonly openapi: "3.1.0";
  readonly info: {
    readonly title: string;
    readonly version: string;
  };
  readonly paths: Readonly<Record<string, Readonly<Record<string, ApiOpenApiOperation>>>>;
}

export function createApiOpenApiDocument(input: {
  readonly title: string;
  readonly version: string;
  readonly routes: readonly ApiRouteDefinition[];
}): ApiOpenApiDocument {
  const paths: Record<string, Record<string, ApiOpenApiOperation>> = {};

  for (const route of input.routes) {
    const path = createVersionedPath(route.path);
    paths[path] = {
      ...(paths[path] ?? {}),
      [route.method.toLowerCase()]: {
        operationId: route.operationId,
        summary: route.summary,
        tags: [...route.tags]
      }
    };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: input.title,
      version: input.version
    },
    paths
  };
}
