export const API_BUG_REPORT_STATUSES = {
  open: "open",
  acknowledged: "acknowledged",
  closed: "closed"
} as const;

export type ApiBugReportStatus = (typeof API_BUG_REPORT_STATUSES)[keyof typeof API_BUG_REPORT_STATUSES];

