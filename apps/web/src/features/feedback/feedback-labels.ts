import type { DashboardApiFeedbackReasonCategory, DashboardApiFeedbackRatingTarget } from "../../api";

export const dashboardFeedbackReasonLabels: Readonly<Record<DashboardApiFeedbackReasonCategory, string>> = {
  irrelevant: "Irrelevant",
  duplicate: "Duplicate",
  "low-confidence": "Low confidence",
  "weak-evidence": "Weak evidence",
  "poor-ranking": "Poor ranking",
  "already-solved": "Already solved",
  "not-actionable": "Not actionable",
  other: "Other"
};

export const dashboardFeedbackRatingLabels: Readonly<Record<DashboardApiFeedbackRatingTarget, string>> = {
  usefulness: "Usefulness",
  "evidence-quality": "Evidence quality",
  "ranking-quality": "Ranking quality"
};

