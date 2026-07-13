import { AppShell } from "../../components/layout";
import { ActiveEvidenceView } from "../../features/scans";

export default function EvidencePage() {
  return (
    <AppShell title="Evidence View" subtitle="Trace source evidence, confidence, and provenance from your latest persisted scan.">
      <ActiveEvidenceView />
    </AppShell>
  );
}
