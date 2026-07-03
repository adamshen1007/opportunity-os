import type { ApiAuthContext } from "../auth/index.js";
import type { ApiRequestContext } from "../http/index.js";

export interface ApiEndpointContext extends ApiRequestContext {
  readonly auth: ApiAuthContext;
  readonly apiVersion: "v1";
}
