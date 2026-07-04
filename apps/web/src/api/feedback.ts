import { generatedApiRoutes } from "./generated/routes";
import type { DashboardApiResult } from "./client";
import type { DashboardApiRequester } from "./opportunities";
import type {
  DashboardApiBugReportDto,
  DashboardApiCreateBugReportRequestBody,
  DashboardApiCreateFeedbackRequestBody,
  DashboardApiFeedbackCollectionDto,
  DashboardApiFeedbackDto
} from "./types";

export function createFeedback(
  client: DashboardApiRequester,
  body: DashboardApiCreateFeedbackRequestBody
): Promise<DashboardApiResult<DashboardApiFeedbackDto>> {
  return client.request<DashboardApiFeedbackDto, DashboardApiCreateFeedbackRequestBody>({
    method: "POST",
    path: generatedApiRoutes.createFeedback.path,
    body
  });
}

export function listFeedback(
  client: DashboardApiRequester,
  query: { readonly opportunityId?: string } = {}
): Promise<DashboardApiResult<DashboardApiFeedbackCollectionDto>> {
  return client.request<DashboardApiFeedbackCollectionDto>({
    method: "GET",
    path: generatedApiRoutes.listFeedback.path,
    query
  });
}

export function getFeedback(
  client: DashboardApiRequester,
  feedbackId: string
): Promise<DashboardApiResult<DashboardApiFeedbackDto>> {
  return client.request<DashboardApiFeedbackDto>({
    method: "GET",
    path: generatedApiRoutes.getFeedback.path.replace(":feedbackId", encodeURIComponent(feedbackId))
  });
}

export function createPrivateBetaBugReport(
  client: DashboardApiRequester,
  body: DashboardApiCreateBugReportRequestBody
): Promise<DashboardApiResult<DashboardApiBugReportDto>> {
  return client.request<DashboardApiBugReportDto, DashboardApiCreateBugReportRequestBody>({
    method: "POST",
    path: generatedApiRoutes.createPrivateBetaBugReport.path,
    body
  });
}
