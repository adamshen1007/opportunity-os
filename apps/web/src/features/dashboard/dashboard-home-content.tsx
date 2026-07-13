"use client";

import { useCallback, useState } from "react";
import { ChevronRight } from "lucide-react";
import { InfoHint, Panel } from "../../components/ui";
import { BetaAccessPanel, BugReportPanel } from "../beta";
import { ValidationSessionSummary } from "../feedback";
import { OpportunityList } from "../opportunities/opportunity-list";
import { mapScanResultToDashboardOpportunities, RedditScanWorkbench } from "../scans";
import type { DashboardApiScanResultDto } from "../../api";
import {
  dashboardBetaInviteWorkflowFixture,
  dashboardBetaSessionFixture,
  dashboardFeedbackFixtures,
  type DashboardOpportunityFixture
} from "../../testing";

export interface DashboardHomeContentProps {
  readonly initialOpportunities: readonly DashboardOpportunityFixture[];
}

export function DashboardHomeContent({ initialOpportunities }: DashboardHomeContentProps) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [activeScan, setActiveScan] = useState<DashboardApiScanResultDto>();

  const handleResultChange = useCallback((result: DashboardApiScanResultDto) => {
    setActiveScan(result);
    setOpportunities(mapScanResultToDashboardOpportunities(result));
  }, []);

  return (
    <>
      <div id="run-scan"><RedditScanWorkbench onResultChange={handleResultChange} /></div>
      <section className="opportunity-section" aria-label="Top opportunities">
        <div className="section-heading">
          <div>
            <h3>Top opportunities</h3>
            <p>
              {activeScan
                ? `Showing ${activeScan.mode} results from ${activeScan.source.attribution}.`
                : "Ranked by Opportunity OS confidence score"}
              {" "}
              <InfoHint label="About confidence scores">
                Confidence combines evidence quality, recurrence, clarity, and ranking factors. Review source evidence before acting.
              </InfoHint>
            </p>
          </div>
          <a href="/rankings">View full rankings <ChevronRight aria-hidden="true" size={16} /></a>
        </div>
        <Panel title="Opportunity List" className="table-panel">
          <OpportunityList opportunities={opportunities} />
        </Panel>
      </section>
      <details className="beta-tools" id="beta-tools">
        <summary>Beta session and support tools</summary>
        <div className="beta-tools-grid">
          <BetaAccessPanel session={dashboardBetaSessionFixture} invite={dashboardBetaInviteWorkflowFixture} />
          <ValidationSessionSummary opportunities={opportunities} feedback={dashboardFeedbackFixtures} />
          <BugReportPanel sessionId={dashboardBetaSessionFixture.sessionId} />
        </div>
      </details>
    </>
  );
}
