import type { ApiValidationIssue } from "../validation/index.js";
import type { ApiCreateBugReportRequestBody } from "./bug-report-dto.js";
import { API_BUG_REPORT_SEVERITIES, type ApiBugReportSeverity } from "./bug-report-severity.js";

export interface ValidatedApiBugReportInput {
  readonly sessionId: string;
  readonly title: string;
  readonly safeDescription: string;
  readonly severity: ApiBugReportSeverity;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export type ApiBugReportValidationResult =
  | { readonly valid: true; readonly value: ValidatedApiBugReportInput }
  | { readonly valid: false; readonly issues: readonly ApiValidationIssue[] };

export function validateCreateBugReportBody(body: ApiCreateBugReportRequestBody | undefined): ApiBugReportValidationResult {
  const issues: ApiValidationIssue[] = [];
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const safeDescription = typeof body?.safeDescription === "string" ? body.safeDescription.trim() : "";
  const severity = body?.severity;
  const supportedSeverity = Object.values(API_BUG_REPORT_SEVERITIES).find((value) => value === severity);

  if (!sessionId) {
    issues.push({ field: "sessionId", code: "missing-required-field", message: "Session ID is required." });
  }

  if (!title) {
    issues.push({ field: "title", code: "missing-required-field", message: "Bug report title is required." });
  }

  if (!safeDescription) {
    issues.push({ field: "safeDescription", code: "missing-required-field", message: "Safe description is required." });
  }

  if (!severity) {
    issues.push({ field: "severity", code: "missing-required-field", message: "Severity is required." });
  } else if (!supportedSeverity) {
    issues.push({ field: "severity", code: "unsupported-value", message: "Severity is not supported." });
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return {
    valid: true,
    value: {
      sessionId,
      title,
      safeDescription,
      severity: supportedSeverity as ApiBugReportSeverity,
      safeMetadata: body?.safeMetadata ? { ...body.safeMetadata } : undefined
    }
  };
}
