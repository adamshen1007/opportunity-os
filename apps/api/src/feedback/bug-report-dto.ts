import type { ApiBugReportSeverity } from "./bug-report-severity.js";
import type { ApiBugReportStatus } from "./bug-report-status.js";

export interface ApiBugReportDto {
  readonly bugReportId: string;
  readonly title: string;
  readonly safeDescription: string;
  readonly severity: ApiBugReportSeverity;
  readonly status: ApiBugReportStatus;
  readonly createdAt: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ApiCreateBugReportRequestBody {
  readonly title?: string;
  readonly safeDescription?: string;
  readonly severity?: ApiBugReportSeverity;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}
