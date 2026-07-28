import type { ApiBugReportDto } from "./bug-report-dto.js";
import { API_BUG_REPORT_STATUSES } from "./bug-report-status.js";
import type { ValidatedApiBugReportInput } from "./bug-report-validation.js";

export interface ApiBugReportStoreCreateInput extends ValidatedApiBugReportInput {
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiBugReportStore {
  readonly createBugReport: (input: ApiBugReportStoreCreateInput) => Promise<ApiBugReportDto>;
  readonly listBugReports: () => Promise<readonly ApiBugReportDto[]>;
}

export interface InMemoryBugReportStoreInput {
  readonly initialBugReports?: readonly ApiBugReportDto[];
  readonly clock?: () => string;
  readonly idFactory?: () => string;
}

export function createInMemoryBugReportStore(input: InMemoryBugReportStoreInput = {}): ApiBugReportStore {
  const bugReports = [...(input.initialBugReports ?? [])].map(cloneBugReport);
  let sequence = bugReports.length;
  const clock = input.clock ?? (() => new Date().toISOString());
  const idFactory = input.idFactory ?? (() => `bug-report-${++sequence}`);

  return {
    async createBugReport(createInput) {
      const item: ApiBugReportDto = {
        bugReportId: idFactory(),
        title: createInput.title,
        safeDescription: createInput.safeDescription,
        severity: createInput.severity,
        status: API_BUG_REPORT_STATUSES.open,
        createdAt: clock(),
        safeMetadata: createInput.safeMetadata ? { ...createInput.safeMetadata } : undefined
      };
      bugReports.push(item);
      return cloneBugReport(item);
    },
    async listBugReports() {
      return bugReports.map(cloneBugReport);
    }
  };
}

function cloneBugReport(report: ApiBugReportDto): ApiBugReportDto {
  return {
    ...report,
    safeMetadata: report.safeMetadata ? { ...report.safeMetadata } : undefined
  };
}
