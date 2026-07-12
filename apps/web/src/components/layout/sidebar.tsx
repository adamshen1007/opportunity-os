"use client";

import { BarChart3, FileSearch, Home, Lightbulb, ScanSearch, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "../../navigation";

export interface SidebarProps {
  readonly items: readonly DashboardNavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
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
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
            <li key={item.href}>
              <a href={item.href} aria-current={active ? "page" : undefined}>
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
