import { AppShell } from "../../components/layout";
import { EvidenceView } from "../../features/evidence/evidence-view";
import { dashboardEvidenceFixtures } from "../../testing";

export default function EvidencePage() {
  return (
    <AppShell title="Evidence View" subtitle="Trace safe synthetic evidence, confidence, and provenance metadata.">
      <EvidenceView evidence={dashboardEvidenceFixtures} />
    </AppShell>
  );
}
