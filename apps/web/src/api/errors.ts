import type { DashboardApiErrorResponseBody, DashboardApiFailureResponse } from "./types";

export interface DashboardApiError {
  readonly code: string;
  readonly statusCode: number;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
}

export const DASHBOARD_API_FALLBACK_ERROR_MESSAGE =
  "The dashboard could not complete the request. Retry or check the API health endpoint.";

const secretLikePattern = /api[_-]?key|authorization|bearer|credential|password|provider|secret|stack|token|raw payload|cause/iu;

export function sanitizeDashboardApiErrorMessage(message: string | undefined): string {
  if (message === undefined || message.trim().length === 0 || secretLikePattern.test(message)) {
    return DASHBOARD_API_FALLBACK_ERROR_MESSAGE;
  }

  return message;
}

export function mapDashboardApiError(response: DashboardApiFailureResponse<DashboardApiErrorResponseBody>): DashboardApiError {
  return {
    code: response.error.code,
    statusCode: response.error.statusCode,
    message: sanitizeDashboardApiErrorMessage(response.error.message),
    correlationId: response.meta.correlationId,
    requestId: response.meta.requestId
  };
}

export function createTransportDashboardApiError(statusCode: number): DashboardApiError {
  return {
    code: "dashboard.transport_error",
    statusCode,
    message: DASHBOARD_API_FALLBACK_ERROR_MESSAGE
  };
}
