"use client";

import { useActionState, useState } from "react";
import { issuePass, type IssueState } from "./actions";
import { MAX_PER_BOOKING, MAX_PER_INVITE, tierInfo, type Tier } from "@/lib/passes-config";

const input =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-ivory outline-none transition placeholder:text-muted/60 focus:border-gold";

const order: Tier[] = ["vvip", "vip", "general"];

export function IssuePassForm({ siteUrl, event }: { siteUrl: string; event: string }) {
  const [state, action, pending] = useActionState<IssueState, FormData>(issuePass, {});
  const v = state.values ?? {};
  const [tier, setTier] = useState<Tier>((v.tier as Tier) || "vvip");
  const max = tier === "general" ? MAX_PER_BOOKING : MAX_PER_INVITE;
  const issued = state.issued;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <form action={action} className="space-y-4 rounded-3xl border border-line bg-ink-2 p-5 sm:p-6">
        <fieldset>
          <legend className="mb-2 text-sm text-ivory/80">Pass type</legend>
          <div className="grid grid-cols-3 gap-2">
            {order.map((t) => (
              <label key={t} className="cursor-pointer">
                <input type="radio" name="tier" value={t} checked={tier === t} onChange={() => setTier(t)} className="peer sr-only" />
                <span className="block rounded-xl border border-line bg-ink py-3 text-center font-display text-xl text-ivory transition peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink">
                  {tierInfo[t].short}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="mb-1.5 block text-sm text-ivory/80">Guest name *</span>
          <input name="name" required defaultValue={v.name} placeholder="e.g. Shri Ashish Shelar" className={input} />
        </label>
        {tier !== "general" && (
          <label className="block">
            <span className="mb-1.5 block text-sm text-ivory/80">Designation (optional)</span>
            <input name="title" defaultValue={v.title} placeholder="e.g. Hon. Minister of Cultural Affairs, Maharashtra" className={input} />
          </label>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm text-ivory/80">WhatsApp {tier === "general" ? "*" : "(optional)"}</span>
            <input name="phone" type="tel" inputMode="tel" required={tier === "general"} defaultValue={v.phone} placeholder="10-digit number" className={input} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-ivory/80">Email (optional)</span>
            <input name="email" type="email" defaultValue={v.email} className={input} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm text-ivory/80">Admits (people) *</span>
          <input name="passes" type="number" min={1} max={max} required defaultValue={v.passes || "1"} className={`${input} max-w-32`} />
          <span className="mt-1 block text-xs text-muted">Up to {max} for {tierInfo[tier].short}.</span>
        </label>
        {state.error && (
          <p role="alert" className="rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-ivory">
            {state.error}
          </p>
        )}
        <button disabled={pending} className="btn-gold w-full disabled:opacity-60">
          {pending ? "Creating…" : `Create ${tierInfo[tier].label}`}
        </button>
      </form>

      <div className="rounded-3xl border border-dashed border-line p-5 sm:p-6">
        {issued ? <Issued issued={issued} siteUrl={siteUrl} event={event} /> : (
          <div className="text-sm leading-relaxed text-muted">
            <p className="font-display text-2xl text-ivory">How it works</p>
            <p className="mt-3">
              <strong className="text-ivory">VVIP and VIP</strong> are invitations with their own design and reserved seating. Only admins can create them; the
              public page never shows them, and they don&apos;t use up the 800 general seats.
            </p>
            <p className="mt-3">
              <strong className="text-ivory">General</strong> is the same free pass people book on the website, for someone who asks by phone.
            </p>
            <p className="mt-3">After creating, download the pass or send it straight to the guest&apos;s WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Issued({ issued, siteUrl, event }: { issued: NonNullable<IssueState["issued"]>; siteUrl: string; event: string }) {
  const url = `${siteUrl}/pass/${issued.code}`;
  const invite = issued.tier !== "general";
  const message = invite
    ? `Namaskar ${issued.name}, IndoStage cordially invites you to ${event}. Your ${tierInfo[issued.tier].label}: ${url}`
    : `Namaskar ${issued.name}, here is your free pass for ${event}: ${url}`;
  const to = issued.phone ? (issued.phone.startsWith("+") ? issued.phone.slice(1) : `91${issued.phone}`) : "";
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.25em] text-saffron uppercase">
        {issued.existing ? "This number already had a pass" : `${tierInfo[issued.tier].label} created`}
      </p>
      <p className="mt-2 font-display text-3xl text-ivory">{issued.name}</p>
      <p className="mt-1 font-mono text-gold">{issued.code}</p>
      <div className="mt-5 grid gap-3">
        <a href={`/pass/${issued.code}`} target="_blank" className="btn-ghost justify-center">
          Open Pass
        </a>
        <a href={`/pass/${issued.code}/image`} download className="btn-ghost justify-center">
          Download Pass Image
        </a>
        <a href={`https://wa.me/${to}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="btn-gold justify-center">
          {issued.phone ? "Send on WhatsApp" : "Share on WhatsApp"}
        </a>
      </div>
    </div>
  );
}
