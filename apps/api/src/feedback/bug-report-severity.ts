export const API_BUG_REPORT_SEVERITIES = {
  low: "low",
  medium: "medium",
  high: "high"
} as const;

export type ApiBugReportSeverity = (typeof API_BUG_REPORT_SEVERITIES)[keyof typeof API_BUG_REPORT_SEVERITIES];

