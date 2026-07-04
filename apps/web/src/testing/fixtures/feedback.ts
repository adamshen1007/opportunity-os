import type {
  DashboardApiFeedbackReasonCategory,
  DashboardApiFeedbackRatingDto,
  DashboardApiFeedbackStatus
} from "../../api";

export interface DashboardFeedbackFixture {
  readonly feedbackId: string;
  readonly opportunityId: string;
  readonly status: DashboardApiFeedbackStatus;
  readonly reasonCategories: readonly DashboardApiFeedbackReasonCategory[];
  readonly ratings: readonly DashboardApiFeedbackRatingDto[];
  readonly createdAt: string;
}

export const dashboardFeedbackReasonCategories = [
  "irrelevant",
  "duplicate",
  "low-confidence",
  "weak-evidence",
  "poor-ranking",
  "already-solved",
  "not-actionable",
  "other"
] as const satisfies readonly DashboardApiFeedbackReasonCategory[];

export const dashboardFeedbackFixtures = [
  {
    feedbackId: "feedback-synthetic-001",
    opportunityId: "synthetic-opportunity-001",
    status: "rated",
    reasonCategories: ["weak-evidence"],
    ratings: [
      {
        target: "usefulness",
        value: 4
      },
      {
        target: "evidence-quality",
        value: 3
      },
      {
        target: "ranking-quality",
        value: 5
      }
    ],
    createdAt: "2026-07-04T00:00:00.000Z"
  }
] as const satisfies readonly DashboardFeedbackFixture[];

