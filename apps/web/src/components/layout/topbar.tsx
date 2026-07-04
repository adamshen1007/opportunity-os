import { Badge } from "../ui";

export interface TopbarProps {
  readonly title: string;
  readonly subtitle: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Dashboard MVP</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <Badge tone="success">API Ready</Badge>
    </header>
  );
}
