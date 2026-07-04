export const API_FEEDBACK_REASON_CATEGORIES = {
  irrelevant: "irrelevant",
  duplicate: "duplicate",
  lowConfidence: "low-confidence",
  weakEvidence: "weak-evidence",
  poorRanking: "poor-ranking",
  alreadySolved: "already-solved",
  notActionable: "not-actionable",
  other: "other"
} as const;

export type ApiFeedbackReasonCategory =
  (typeof API_FEEDBACK_REASON_CATEGORIES)[keyof typeof API_FEEDBACK_REASON_CATEGORIES];

