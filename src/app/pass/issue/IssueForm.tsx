"use client";

import { useActionState } from "react";
import { issuePass, type IssueState } from "./actions";
import { crossing } from "@/lib/site";

const input = "w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-ivory outline-none transition focus:border-gold";
const label = "mb-2 block text-sm text-ivory/80";

export function IssueForm() {
  const [state, action, pending] = useActionState(issuePass, {} as IssueState);
  const v = state.values ?? {};

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="type" className={label}>Pass type</label>
        <select id="type" name="type" defaultValue={v.type ?? "vvip"} className={input}>
          {Object.entries(crossing.passTypes).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="name" className={label}>Guest name</label>
        <input id="name" name="name" required defaultValue={v.name} className={input} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className={label}>Mobile</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" required defaultValue={v.phone} className={input} />
        </div>
        <div>
          <label htmlFor="passes" className={label}>People</label>
          <input id="passes" name="passes" type="number" min={1} max={20} defaultValue={v.passes ?? "1"} className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="password" className={label}>Team password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" className={input} />
      </div>
      {state.message && (
        <p role="alert" className="rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-ivory">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-gold w-full disabled:cursor-wait disabled:opacity-60">
        {pending ? "Making pass…" : "Make Pass"}
      </button>
    </form>
  );
}
