import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { dashboardFeedbackRatingLabels, dashboardFeedbackReasonLabels } from "../features/feedback/feedback-labels";
import { renderDashboardElement } from "../testing/component-render";
import { dashboardFeedbackFixtures } from "../testing";

describe("Dashboard component test infrastructure", () => {
  it("renders simple dashboard elements to inspectable static output", () => {
    const rendered = renderDashboardElement(
      createElement("section", { "aria-label": "Dashboard test section" }, [
        createElement("h2", { key: "heading" }, "Dashboard state"),
        createElement("p", { key: "copy" }, "Synthetic component output")
      ])
    );

    expect(rendered.markup).toContain("Dashboard test section");
    expect(rendered.text).toContain("Dashboard state");
    expect(rendered.text).toContain("Synthetic component output");
  });

  it("keeps deterministic feedback labels available for validation UI", () => {
    expect(dashboardFeedbackRatingLabels.usefulness).toBe("Usefulness");
    expect(dashboardFeedbackRatingLabels["evidence-quality"]).toBe("Evidence quality");
    expect(dashboardFeedbackRatingLabels["ranking-quality"]).toBe("Ranking quality");
    expect(dashboardFeedbackReasonLabels["weak-evidence"]).toBe("Weak evidence");
    expect(dashboardFeedbackReasonLabels["poor-ranking"]).toBe("Poor ranking");
    expect(dashboardFeedbackFixtures[0]?.ratings).toHaveLength(3);
  });
});
