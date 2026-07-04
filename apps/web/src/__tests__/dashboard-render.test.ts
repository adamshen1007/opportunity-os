import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { renderDashboardElement } from "../testing/component-render";

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
});
