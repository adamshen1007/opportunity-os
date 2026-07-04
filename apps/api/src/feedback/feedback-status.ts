export const API_FEEDBACK_STATUSES = {
  saved: "saved",
  dismissed: "dismissed",
  rated: "rated",
  reasonProvided: "reason-provided"
} as const;

export type ApiFeedbackStatus = (typeof API_FEEDBACK_STATUSES)[keyof typeof API_FEEDBACK_STATUSES];

