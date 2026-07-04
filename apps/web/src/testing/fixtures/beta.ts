import type { DashboardApiBugReportDto, DashboardApiCreateBugReportRequestBody } from "../../api";

export interface DashboardBetaSessionFixture {
  readonly sessionId: string;
  readonly inviteEmail: string;
  readonly displayName: string;
  readonly status: "active";
  readonly onboardingSteps: readonly DashboardBetaOnboardingStepFixture[];
}

export interface DashboardBetaOnboardingStepFixture {
  readonly stepId: string;
  readonly label: string;
  readonly status: "complete" | "current" | "pending";
}

export interface DashboardBetaInviteWorkflowFixture {
  readonly inviteCode: string;
  readonly email: string;
  readonly acceptedAt: string;
  readonly safeMessage: string;
}

export const dashboardBetaSessionFixture: DashboardBetaSessionFixture = {
  sessionId: "session-synthetic-1",
  inviteEmail: "design.partner@example.com",
  displayName: "Design Partner",
  status: "active",
  onboardingSteps: [
    {
      stepId: "accept-invite",
      label: "Invite accepted",
      status: "complete"
    },
    {
      stepId: "review-ranked-opportunities",
      label: "Review ranked opportunities",
      status: "current"
    },
    {
      stepId: "share-feedback",
      label: "Share validation feedback",
      status: "pending"
    }
  ]
};

export const dashboardBetaInviteWorkflowFixture: DashboardBetaInviteWorkflowFixture = {
  inviteCode: "synthetic-private-beta-code",
  email: dashboardBetaSessionFixture.inviteEmail,
  acceptedAt: "2026-07-04T00:00:00.000Z",
  safeMessage: "Invite accepted for the private beta workspace."
};

export const dashboardBugReportFixture: DashboardApiBugReportDto = {
  bugReportId: "bug-report-synthetic-1",
  sessionId: dashboardBetaSessionFixture.sessionId,
  title: "Synthetic dashboard issue",
  safeDescription: "Synthetic beta report with safe reproduction notes.",
  severity: "medium",
  status: "open",
  createdAt: "2026-07-04T00:00:00.000Z",
  safeMetadata: {
    fixture: true
  }
};

export const dashboardBugReportRequestFixture: DashboardApiCreateBugReportRequestBody = {
  sessionId: dashboardBetaSessionFixture.sessionId,
  title: dashboardBugReportFixture.title,
  safeDescription: dashboardBugReportFixture.safeDescription,
  severity: dashboardBugReportFixture.severity,
  safeMetadata: {
    fixture: true
  }
};

