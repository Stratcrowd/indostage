"use client";

import { useActionState } from "react";
import { createAccount, login, type LoginState } from "./actions";

const input =
  "w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-ivory outline-none transition placeholder:text-muted/60 focus:border-gold";

function Field({ label, hint, ...rest }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ivory/80">{label}</span>
      <input className={input} required {...rest} />
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function ErrorNote({ state }: { state: LoginState }) {
  return state.error ? (
    <p role="alert" className="rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-ivory">
      {state.error}
    </p>
  ) : null;
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="space-y-5">
      <Field label="Username" name="username" autoComplete="username" defaultValue={state.username} autoFocus />
      <Field label="Password" name="password" type="password" autoComplete="current-password" />
      <ErrorNote state={state} />
      <button disabled={pending} className="btn-gold w-full disabled:opacity-60">
        {pending ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}

export function AccountForm({ mode }: { mode: "setup" | "reset" }) {
  const [state, action, pending] = useActionState(createAccount, {});
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="mode" value={mode} />
      <Field
        label="Setup code"
        name="code"
        type="password"
        autoComplete="off"
        hint="The value of PASSES_ADMIN_PASSWORD in Vercel → indostage → Settings → Environment Variables."
      />
      <Field label={mode === "reset" ? "Username (new or same)" : "Choose a username"} name="username" autoComplete="username" defaultValue={state.username} />
      <Field label={mode === "reset" ? "New password" : "Choose a password"} name="password" type="password" autoComplete="new-password" minLength={8} hint="At least 8 characters." />
      <Field label="Type the password again" name="confirm" type="password" autoComplete="new-password" minLength={8} />
      <ErrorNote state={state} />
      <button disabled={pending} className="btn-gold w-full disabled:opacity-60">
        {pending ? "Saving…" : mode === "reset" ? "Reset and Log In" : "Create Admin Account"}
      </button>
    </form>
  );
}
