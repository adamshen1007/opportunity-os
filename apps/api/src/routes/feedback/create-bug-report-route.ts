import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import {
  type ApiBugReportDto,
  type ApiBugReportStore,
  type ApiCreateBugReportRequestBody,
  validateCreateBugReportBody
} from "../../feedback/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_CREATE_BUG_REPORT_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/feedback/bug-reports",
  operationId: "createPrivateBetaBugReport",
  summary: "Create a deterministic Private Beta bug report",
  tags: ["feedback", "private-beta"],
  requiresAuthentication: true
});

export async function handleCreateBugReportRequest(
  request: ApiRequest<ApiCreateBugReportRequestBody>,
  store: ApiBugReportStore
): Promise<ApiResponse<ApiBugReportDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = validateCreateBugReportBody(request.body);

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Bug report request is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const report = await store.createBugReport({
    ...parsed.value,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  });

  return createApiSuccessResponse(report, meta);
}

