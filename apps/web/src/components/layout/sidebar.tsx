"use client";

import { BarChart3, FileSearch, Home, Lightbulb, ScanSearch, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "../../navigation";
import { useActiveScan } from "../../features/scans";

export interface SidebarProps {
  readonly items: readonly DashboardNavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const { scan } = useActiveScan();
  const detailHref = scan?.opportunities[0]
    ? `/opportunities/${encodeURIComponent(scan.opportunities[0].opportunityId)}`
    : "/opportunities";
  const icons = { Overview: Home, Opportunities: Lightbulb, Detail: ScanSearch, Rankings: BarChart3, Evidence: FileSearch } as const;

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true" />
        <span>Opportunity OS</span>
      </div>
      <nav aria-label="Dashboard navigation">
        <ul>
          {items.map((item) => {
            const Icon = icons[item.label as keyof typeof icons] ?? Lightbulb;
            const href = item.label === "Detail" ? detailHref : item.href;
            const active = item.href === "/" ? pathname === "/" : item.label === "Detail" ? pathname.startsWith("/opportunities/") : pathname === item.href;
            return (
            <li key={item.label}>
              <a href={href} aria-current={active ? "page" : undefined}>
                <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                <span>{item.label}</span>
              </a>
            </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <a href="/#beta-tools"><Settings aria-hidden="true" size={18} strokeWidth={1.7} /><span>Beta tools</span></a>
        <div className="operator-chip"><span>AD</span><div><strong>Adam</strong><small>Research workspace</small></div></div>
      </div>
    </aside>
  );
}
