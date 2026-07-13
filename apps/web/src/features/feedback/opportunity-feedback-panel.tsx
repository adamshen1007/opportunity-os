"use client";

import { useMemo, useState } from "react";
import type {
  DashboardApiCreateFeedbackRequestBody,
  DashboardApiFeedbackDto,
  DashboardApiFeedbackRatingTarget,
  DashboardApiFeedbackRatingValue,
  DashboardApiFeedbackReasonCategory,
  DashboardApiFeedbackStatus,
  DashboardApiResult
} from "../../api";
import { Badge, Button, Panel } from "../../components/ui";
import { dashboardFeedbackReasonCategories, type DashboardFeedbackFixture } from "../../testing";
import { dashboardFeedbackRatingLabels, dashboardFeedbackReasonLabels } from "./feedback-labels";

export interface OpportunityFeedbackPanelProps {
  readonly opportunityId: string;
  readonly initialFeedback?: DashboardFeedbackFixture;
  readonly submitFeedback?: (body: DashboardApiCreateFeedbackRequestBody) => Promise<DashboardApiResult<DashboardApiFeedbackDto>>;
}

const ratingTargets: readonly DashboardApiFeedbackRatingTarget[] = [
  "usefulness",
  "evidence-quality",
  "ranking-quality"
] as const;
const ratingValues: readonly DashboardApiFeedbackRatingValue[] = [1, 2, 3, 4, 5] as const;
type FeedbackSubmissionState = "idle" | "submitting" | "success" | "error";

export function OpportunityFeedbackPanel({
  opportunityId,
  initialFeedback,
  submitFeedback = createDeterministicFeedbackSubmission
}: OpportunityFeedbackPanelProps) {
  const [status, setStatus] = useState<DashboardApiFeedbackStatus>(initialFeedback?.status ?? "saved");
  const [reasonCategories, setReasonCategories] = useState<readonly DashboardApiFeedbackReasonCategory[]>(
    initialFeedback?.reasonCategories ?? []
  );
  const [ratings, setRatings] = useState<Readonly<Record<DashboardApiFeedbackRatingTarget, DashboardApiFeedbackRatingValue>>>(
    () => ({
      usefulness: findInitialRating(initialFeedback, "usefulness"),
      "evidence-quality": findInitialRating(initialFeedback, "evidence-quality"),
      "ranking-quality": findInitialRating(initialFeedback, "ranking-quality")
    })
  );
  const [submissionState, setSubmissionState] = useState<FeedbackSubmissionState>(initialFeedback ? "success" : "idle");
  const [message, setMessage] = useState(
    initialFeedback
      ? "Saved feedback is attached to this opportunity."
      : "Choose ratings or reasons, then submit your feedback."
  );

  const selectedReasons = useMemo(() => new Set(reasonCategories), [reasonCategories]);

  async function submit(statusOverride = status) {
    const body: DashboardApiCreateFeedbackRequestBody = {
      opportunityId,
      status: statusOverride,
      reasonCategories,
      ratings: ratingTargets.map((target) => ({
        target,
        value: ratings[target]
      })),
      safeMetadata: {
        validationMode: "dashboard-feedback"
      }
    };
    setSubmissionState("submitting");
    setMessage("Saving feedback...");
    try {
      const result = await submitFeedback(body);
      if (!result.ok) {
        setSubmissionState("error");
        setMessage("Feedback was not saved. Check your session and try again.");
        return;
      }
      setStatus(result.data.status);
      setSubmissionState("success");
      setMessage(successMessage(result.data.status));
    } catch {
      setSubmissionState("error");
      setMessage("Feedback was not saved. Check your session and try again.");
    }
  }

  function markDraft(nextStatus: DashboardApiFeedbackStatus) {
    setStatus(nextStatus);
    setSubmissionState("idle");
    setMessage("Changes are ready to submit.");
  }

  return (
    <Panel title="Validation Feedback">
      <div className="feedback-panel">
        <div className="feedback-status-row">
          <span>Current validation status</span>
          <Badge tone={submissionState === "success" ? (status === "dismissed" ? "warning" : "success") : "neutral"}>
            {submissionState === "success" ? formatFeedbackStatus(status) : "Not submitted"}
          </Badge>
        </div>
        <div className="feedback-actions" aria-label="Save or dismiss opportunity">
          <Button type="button" disabled={submissionState === "submitting"} onClick={() => submit("saved")}>Save</Button>
          <Button type="button" disabled={submissionState === "submitting"} onClick={() => submit("dismissed")}>Dismiss</Button>
        </div>
        <div className="feedback-ratings" aria-label="Opportunity ratings">
          {ratingTargets.map((target) => (
            <fieldset key={target} className="feedback-rating-group">
              <legend>{dashboardFeedbackRatingLabels[target]}</legend>
              <div>
                {ratingValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={ratings[target] === value ? "rating-button rating-button-selected" : "rating-button"}
                    aria-pressed={ratings[target] === value}
                    disabled={submissionState === "submitting"}
                    onClick={() => {
                      setRatings((current) => ({ ...current, [target]: value }));
                      markDraft(reasonCategories.length > 0 ? "reason-provided" : "rated");
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <fieldset className="feedback-reasons">
          <legend>Reason categories</legend>
          <div>
            {dashboardFeedbackReasonCategories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedReasons.has(category)}
                  disabled={submissionState === "submitting"}
                  onChange={() => {
                    const next = toggleReason(reasonCategories, category);
                    setReasonCategories(next);
                    markDraft(next.length > 0 ? "reason-provided" : "rated");
                  }}
                />
                <span>{dashboardFeedbackReasonLabels[category]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <Button type="button" disabled={submissionState === "submitting"} onClick={() => submit()}>
          {submissionState === "submitting" ? "Saving feedback" : "Submit feedback"}
        </Button>
        <p className="feedback-message" aria-live="polite" role={submissionState === "error" ? "alert" : "status"}>
          {message}
        </p>
      </div>
    </Panel>
  );
}

function findInitialRating(
  feedback: DashboardFeedbackFixture | undefined,
  target: DashboardApiFeedbackRatingTarget
): DashboardApiFeedbackRatingValue {
  return feedback?.ratings.find((rating) => rating.target === target)?.value ?? 3;
}

function toggleReason(
  current: readonly DashboardApiFeedbackReasonCategory[],
  category: DashboardApiFeedbackReasonCategory
): readonly DashboardApiFeedbackReasonCategory[] {
  return current.includes(category) ? current.filter((item) => item !== category) : [...current, category];
}

function formatFeedbackStatus(status: DashboardApiFeedbackStatus): string {
  return status
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function successMessage(status: DashboardApiFeedbackStatus): string {
  if (status === "saved") return "Opportunity saved. Your feedback is attached to this opportunity.";
  if (status === "dismissed") return "Opportunity dismissed. Your feedback is attached to this opportunity.";
  if (status === "reason-provided") return "Feedback submitted. Your ratings and reasons are saved.";
  return "Feedback submitted. Your ratings are saved.";
}

async function createDeterministicFeedbackSubmission(
  body: DashboardApiCreateFeedbackRequestBody
): Promise<DashboardApiResult<DashboardApiFeedbackDto>> {
  return {
    ok: true,
    data: {
      feedbackId: "feedback-local-validation",
      opportunityId: body.opportunityId,
      status: body.status,
      reasonCategories: body.reasonCategories ?? [],
      ratings: body.ratings ?? [],
      createdAt: "2026-07-04T00:00:00.000Z",
      safeMetadata: body.safeMetadata
    }
  };
}
