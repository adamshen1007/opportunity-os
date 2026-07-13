"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound } from "lucide-react";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL ?? "http://127.0.0.1:4000";
}

export default function BetaAccessPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function acceptInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/invites/accept`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json", "x-correlation-id": `web-invite-${Date.now().toString(36)}` },
        body: JSON.stringify({ inviteCode: String(data.get("inviteCode") ?? ""), displayName: String(data.get("displayName") ?? "") })
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      window.location.assign("/");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="access-page">
      <section className="access-card" aria-label="Private beta access">
        <span className="access-icon"><KeyRound aria-hidden="true" size={21} /></span>
        <p className="access-eyebrow">Opportunity OS private beta</p>
        <h1>Enter your workspace</h1>
        <p>Use the invitation code provided by the Opportunity OS operator. Your session expires automatically after eight hours.</p>
        <form onSubmit={acceptInvite}>
          <label className="field"><span>Display name</span><input name="displayName" autoComplete="name" required /></label>
          <label className="field"><span>Invite code</span><input name="inviteCode" type="password" autoComplete="one-time-code" required /></label>
          <button className="button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Checking invite" : "Continue"}<ArrowRight aria-hidden="true" size={17} /></button>
        </form>
        {status === "error" ? <p className="access-error" role="alert">The invitation could not be accepted. Check the code or ask the operator for a new invitation.</p> : null}
      </section>
    </main>
  );
}
