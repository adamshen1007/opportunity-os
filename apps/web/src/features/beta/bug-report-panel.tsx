"use client";

import { useState } from "react";
import type {
  DashboardApiBugReportDto,
  DashboardApiCreateBugReportRequestBody,
  DashboardApiResult
} from "../../api";
import { Button, Input, Panel, Select } from "../../components/ui";
import { dashboardBugReportFixture, dashboardBugReportRequestFixture } from "../../testing";

export interface BugReportPanelProps {
  readonly submitBugReport?: (
    body: DashboardApiCreateBugReportRequestBody
  ) => Promise<DashboardApiResult<DashboardApiBugReportDto>>;
}

export function BugReportPanel({ submitBugReport = createDeterministicBugReportSubmission }: BugReportPanelProps) {
  const [message, setMessage] = useState("Bug reports are captured deterministically for the beta validation loop.");

  async function submit() {
    const result = await submitBugReport({
      ...dashboardBugReportRequestFixture,
      safeMetadata: {
        validationMode: "private-beta"
      }
    });
    setMessage(result.ok ? `Bug report captured: ${result.data.status}.` : "Bug report could not be captured safely.");
  }

  return (
    <Panel title="Bug Reporting">
      <div className="bug-report-panel">
        <Button type="button" onClick={() => void submit()}>Send bug report</Button>
        <p className="feedback-message" aria-live="polite">{message}</p>
        <Input label="Title" name="bugTitle" defaultValue={dashboardBugReportRequestFixture.title} disabled />
        <label className="field">
          <span>Safe description</span>
          <textarea name="bugDescription" defaultValue={dashboardBugReportRequestFixture.safeDescription} disabled />
        </label>
        <Select
          label="Severity"
          name="bugSeverity"
          defaultValue={dashboardBugReportRequestFixture.severity}
          disabled
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" }
          ]}
        />
      </div>
    </Panel>
  );
}

async function createDeterministicBugReportSubmission(
  body: DashboardApiCreateBugReportRequestBody
): Promise<DashboardApiResult<DashboardApiBugReportDto>> {
  return {
    ok: true,
    data: {
      ...dashboardBugReportFixture,
      title: body.title,
      safeDescription: body.safeDescription,
      severity: body.severity,
      safeMetadata: body.safeMetadata
    }
  };
}
