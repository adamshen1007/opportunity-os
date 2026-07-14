"use client";

import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentSession, logoutCurrentSession, type DashboardApiSessionDto } from "../../api";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL ?? "http://127.0.0.1:4000";
}

function createOptions() {
  return {
    baseUrl: getApiBaseUrl(),
    fetch: window.fetch.bind(window),
    correlationId: `dashboard-session-${Date.now().toString(36)}`
  } as const;
}

export function SessionControls() {
  const [session, setSession] = useState<DashboardApiSessionDto>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void getCurrentSession(createOptions()).then((result) => {
      if (active && result.ok) setSession(result.data);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  async function logout() {
    setBusy(true);
    try {
      const result = await logoutCurrentSession(createOptions());
      if (result.ok) window.location.assign("/access");
      else setBusy(false);
    } catch {
      setBusy(false);
    }
  }

  if (!session) {
    return <div className="operator-chip"><span>OS</span><div><strong>Demo workspace</strong><small>Fixture mode available</small></div></div>;
  }

  return (
    <div className="session-control">
      <div className="operator-chip">
        <span>{(session.principal.displayName ?? session.principal.principalId).slice(0, 2).toUpperCase()}</span>
        <div><strong>{session.principal.displayName ?? session.principal.principalId}</strong><small>Session ends {new Date(session.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></div>
      </div>
      <button type="button" onClick={logout} disabled={busy} aria-label="Sign out of Opportunity OS"><LogOut aria-hidden="true" size={16} />{busy ? "Signing out" : "Sign out"}</button>
    </div>
  );
}
