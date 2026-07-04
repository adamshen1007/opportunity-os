import type { ReactNode } from "react";
import { dashboardNavItems } from "../../navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export interface AppShellProps {
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="dashboard-shell">
      <Sidebar items={dashboardNavItems} />
      <div className="workspace">
        <Topbar title={title} subtitle={subtitle} />
        <div className="workspace-content">{children}</div>
      </div>
    </main>
  );
}
