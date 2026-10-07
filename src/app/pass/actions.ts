"use server";

import { redirect } from "next/navigation";
import { crossing, site } from "@/lib/site";
import { MAX_PER_BOOKING, bookPasses, normalisePhone, passesConfigured } from "@/lib/passes";

export type PassState = {
  status: "idle" | "error" | "full";
  message?: string;
  errors?: Partial<Record<"name" | "phone" | "passes", string>>;
  values?: Record<string, string>;
};

export async function requestPass(_prev: PassState, formData: FormData): Promise<PassState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = { name: get("name").replace(/\s+/g, " "), phone: get("phone"), passes: get("passes") || "1" };

  // Honeypot: real visitors never see or fill this field.
  if (get("company")) return { status: "error", message: "Something went wrong. Please try again." };

  const errors: PassState["errors"] = {};
  const phone = normalisePhone(values.phone);
  const passes = Number(values.passes);
  if (values.name.length < 2 || values.name.length > 80) errors.name = "Please enter your full name.";
  if (!phone) errors.phone = "Please enter a valid 10-digit mobile number.";
  if (!Number.isInteger(passes) || passes < 1 || passes > MAX_PER_BOOKING) errors.passes = `Choose 1 to ${MAX_PER_BOOKING} passes.`;
  if (Object.keys(errors).length) return { status: "error", errors, values };

  if (!passesConfigured()) {
    console.warn("[pass] DATABASE_URL is not set — booking not saved:", values);
    return { status: "error", message: `Pass booking is being set up. Please WhatsApp ${crossing.enquiry} for your pass.`, values };
  }

  let result;
  try {
    result = await bookPasses({ name: values.name, phone: phone!, passes, source: get("source").slice(0, 120) });
  } catch (e) {
    console.error("[pass] booking failed", e);
    return { status: "error", message: `Sorry, something went wrong. Please try again or WhatsApp ${crossing.enquiry}.`, values };
  }

  if (result.status === "full") {
    return {
      status: "full",
      message: result.left
        ? `Only ${result.left} pass${result.left === 1 ? "" : "es"} left. Please choose fewer passes.`
        : `All free passes have been booked. Follow ${site.name} for updates.`,
      values,
    };
  }
  redirect(`/pass/${result.code}?${result.status === "booked" ? "new" : "existing"}=1`);
}
