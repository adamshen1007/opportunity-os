import type { DashboardNavItem } from "../../navigation";

export interface SidebarProps {
  readonly items: readonly DashboardNavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Opportunity OS</p>
        <h1>Dashboard</h1>
      </div>
      <nav aria-label="Dashboard navigation">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href}>
                <span>{item.label}</span>
                <small>{item.description}</small>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
