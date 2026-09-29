"use server";

import { site } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: Record<string, string>;
};

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    service: get("service"),
    message: get("message"),
  };

  // Honeypot: real visitors never see or fill this field.
  if (get("company")) return { status: "success", message: "Thank you! We'll be in touch shortly." };

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Please enter a valid email.";
  if (values.message.length < 10) errors.message = "Please tell us a little more (10+ characters).";
  if (values.name.length > 120 || values.message.length > 5000) errors.message = "Message is too long.";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set — message not sent:", values);
    return {
      status: "error",
      message: `Our form is being set up. Please email us at ${site.email} or WhatsApp ${site.phone}.`,
      values,
    };
  }

  const rows = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone || "—"],
    ["Interested in", values.service || "—"],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${escape(v)}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "IndoStage Website <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? site.email],
      reply_to: values.email,
      subject: `New enquiry from ${values.name} — indostage.in`,
      html: `<h2>New website enquiry</h2><table>${rows}</table><p style="white-space:pre-wrap">${escape(values.message)}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return {
      status: "error",
      message: `Sorry, something went wrong. Please email us at ${site.email}.`,
      values,
    };
  }

  return { status: "success", message: "Thank you! Your message has been sent — we'll be in touch within 24–48 hours." };
}
