"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "./actions";
import { services } from "@/lib/site";

const initial: ContactState = { status: "idle" };

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [state, action, pending] = useActionState(sendContact, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-gold/40 bg-maroon-deep/40 p-10 text-center">
        <p className="font-display text-4xl text-gold-soft">Thank you!</p>
        <p className="mt-4 text-ivory/80">{state.message}</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const defaultServiceTitle = services.find((s) => s.slug === defaultService)?.title ?? "";

  return (
    <form action={action} noValidate className="space-y-5">
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" required autoComplete="name" defaultValue={v.name} error={state.errors?.name} />
        <Field label="Email Address" name="email" type="email" required autoComplete="email" defaultValue={v.email} error={state.errors?.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone Number" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} />
        <div>
          <label htmlFor="service" className="mb-2 block text-sm text-ivory/80">
            Interested In
          </label>
          <select
            id="service"
            name="service"
            defaultValue={v.service ?? defaultServiceTitle}
            className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-ivory outline-none transition focus:border-gold"
          >
            <option value="">Select a service (optional)</option>
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Shivachatrapati Varasa Shauryacha</option>
            <option>Artist / Talent Showcase</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <Field
        label="Your Message"
        name="message"
        required
        textarea
        defaultValue={v.message}
        error={state.errors?.message}
      />

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-ivory">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-gold w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
  error,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  error?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  const cls = `w-full rounded-xl border bg-ink px-4 py-3.5 text-ivory placeholder:text-muted/60 outline-none transition focus:border-gold ${
    error ? "border-saffron" : "border-line"
  }`;
  const common = {
    id: name,
    name,
    required,
    "aria-invalid": !!error || undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
    className: cls,
    ...rest,
  };
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-ivory/80">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {textarea ? <textarea rows={6} {...common} /> : <input type={type} {...common} />}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-saffron">
          {error}
        </p>
      )}
    </div>
  );
}
