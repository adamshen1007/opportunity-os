export const API_FEEDBACK_RATING_TARGETS = {
  usefulness: "usefulness",
  evidenceQuality: "evidence-quality",
  rankingQuality: "ranking-quality"
} as const;

export const API_FEEDBACK_RATING_VALUES = [1, 2, 3, 4, 5] as const;

export type ApiFeedbackRatingTarget =
  (typeof API_FEEDBACK_RATING_TARGETS)[keyof typeof API_FEEDBACK_RATING_TARGETS];

export type ApiFeedbackRatingValue = (typeof API_FEEDBACK_RATING_VALUES)[number];

