import type { ApiRequest } from "../http/index.js";
import type { ApiAuthResult } from "./auth-result.js";

export interface ApiAuthenticator {
  readonly name: string;
  authenticate(request: ApiRequest): ApiAuthResult;
}

export interface ApiAuthenticationRequirement {
  readonly required: boolean;
  readonly permissions?: readonly string[];
}
