import { createAnonymousAuthContext, type ApiAuthContext } from "../auth/index.js";
import type { ApiRequestContext } from "../http/index.js";
import type { ApiEndpointContext } from "./api-request-context.js";

export function createApiEndpointContext(
  context: ApiRequestContext,
  auth: ApiAuthContext = createAnonymousAuthContext()
): ApiEndpointContext {
  return {
    ...context,
    auth,
    apiVersion: "v1"
  };
}
