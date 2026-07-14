import Link from "next/link";
import { AppShell } from "../../components/layout";
import { Panel } from "../../components/ui";

export default function PrivacyPage() {
  return (
    <AppShell title="Privacy and data controls" subtitle="Understand what Opportunity OS retains and how to remove it.">
      <div className="dashboard-grid privacy-grid">
        <Panel title="What is stored">
          <ul className="privacy-list">
            <li>Scan requests, safe source attribution, normalized text, generated opportunities, ranking explanations, and your validation feedback.</li>
            <li>Session identifiers are stored in a secure HTTP-only cookie and expire after eight hours.</li>
            <li>API keys, provider tokens, authorization headers, raw provider payloads, prompts, stack traces, and raw causes are not stored in scan results.</li>
          </ul>
        </Panel>
        <Panel title="Your controls">
          <ul className="privacy-list">
            <li>Delete a completed scan from Recent scans on the Overview page. Related normalized, analysis, candidate, generated, and ranking records are removed.</li>
            <li>Sign out from the sidebar to revoke the current beta session immediately.</li>
            <li>Ask the beta operator to remove a feedback record by its feedback identifier while account-level ownership controls remain in closed beta.</li>
          </ul>
          <Link className="primary-action" href="/#run-scan">Return to scans</Link>
        </Panel>
      </div>
    </AppShell>
  );
}
