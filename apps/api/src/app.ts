import type { ApiRouteDefinition } from "./routing/index.js";
import { createApiRouter, type ApiRouter } from "./routing/index.js";

export interface ApiBootstrapInput {
  readonly serviceName: string;
  readonly version: string;
  readonly routes?: readonly ApiRouteDefinition[];
}

export interface ApiApplication {
  readonly serviceName: string;
  readonly version: string;
  readonly status: "configured";
  readonly router: ApiRouter;
}

export function createApiApplication(input: ApiBootstrapInput): ApiApplication {
  return {
    serviceName: input.serviceName,
    version: input.version,
    status: "configured",
    router: createApiRouter(input.routes ?? [])
  };
}
