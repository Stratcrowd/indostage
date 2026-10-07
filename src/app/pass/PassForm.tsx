"use client";

import { useActionState } from "react";
import { requestPass, type PassState } from "./actions";
import { MAX_PER_BOOKING } from "@/lib/passes-config";

const initial: PassState = { status: "idle" };

export function PassForm({ source }: { source: string }) {
  const [state, action, pending] = useActionState(requestPass, initial);
  const v = state.values ?? {};

  return (
    <form action={action} noValidate className="space-y-5">
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="source" value={source} />

      <Field label="Full Name" name="name" autoComplete="name" defaultValue={v.name} error={state.errors?.name} />
      <Field
        label="Mobile Number"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="10-digit mobile number"
        defaultValue={v.phone}
        error={state.errors?.phone}
      />

      <fieldset>
        <legend className="mb-2 block text-sm text-ivory/80">
          Number of Passes <span className="text-gold">*</span>
        </legend>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: MAX_PER_BOOKING }, (_, i) => String(i + 1)).map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="passes" value={n} defaultChecked={(v.passes ?? "1") === n} className="peer sr-only" />
              <span className="block rounded-xl border border-line bg-ink py-3.5 text-center font-display text-2xl text-ivory transition peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-gold">
                {n}
              </span>
            </label>
          ))}
        </div>
        {state.errors?.passes && <p className="mt-2 text-sm text-saffron">{state.errors.passes}</p>}
      </fieldset>

      {state.message && (
        <p role="alert" className="rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-ivory">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-gold w-full disabled:cursor-wait disabled:opacity-60">
        {pending ? "Booking your pass…" : "Get My Free Pass"}
      </button>
      <p className="text-center text-xs text-muted">
        We only use your number for this event. Your pass appears on the next screen.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "tel";
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-ivory/80">
        {label} <span className="text-gold">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-ink px-4 py-3.5 text-ivory placeholder:text-muted/60 outline-none transition focus:border-gold ${
          error ? "border-saffron" : "border-line"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-saffron">
          {error}
        </p>
      )}
    </div>
  );
}
