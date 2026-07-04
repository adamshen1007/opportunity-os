import { Badge, Panel } from "../../components/ui";
import type { DashboardBetaInviteWorkflowFixture, DashboardBetaSessionFixture } from "../../testing";

export interface BetaAccessPanelProps {
  readonly session: DashboardBetaSessionFixture;
  readonly invite: DashboardBetaInviteWorkflowFixture;
}

export function BetaAccessPanel({ session, invite }: BetaAccessPanelProps) {
  return (
    <Panel title="Private Beta Access">
      <div className="beta-access">
        <div className="feedback-status-row">
          <span>Dashboard protection</span>
          <Badge tone="success">Invite only</Badge>
        </div>
        <dl className="beta-session-grid">
          <div>
            <dt>Session</dt>
            <dd>{session.status}</dd>
          </div>
          <div>
            <dt>Partner</dt>
            <dd>{session.displayName}</dd>
          </div>
          <div>
            <dt>Invite</dt>
            <dd>{invite.safeMessage}</dd>
          </div>
        </dl>
        <ol className="beta-onboarding">
          {session.onboardingSteps.map((step) => (
            <li key={step.stepId}>
              <Badge tone={step.status === "complete" ? "success" : step.status === "current" ? "warning" : "neutral"}>
                {step.status}
              </Badge>
              <span>{step.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}

