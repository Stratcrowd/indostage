"use server";

import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/admin-auth";
import { bookPasses, issueInvitation, normalisePhone } from "@/lib/passes";
import { MAX_PER_BOOKING, MAX_PER_INVITE, isTier, type Tier } from "@/lib/passes-config";

export type IssueState = {
  error?: string;
  issued?: { code: string; tier: Tier; name: string; phone: string | null; existing?: boolean };
  values?: Record<string, string>;
};

/** Admin-only: create a VVIP / VIP invitation, or a general pass on someone's behalf. */
export async function issuePass(_prev: IssueState, form: FormData): Promise<IssueState> {
  const admin = await currentAdmin();
  if (!admin) return { error: "Your login has expired. Please log in again." };

  const get = (k: string) => String(form.get(k) ?? "").trim();
  const values = { tier: get("tier"), name: get("name").replace(/\s+/g, " "), title: get("title"), phone: get("phone"), email: get("email").toLowerCase(), passes: get("passes") };
  const tier = values.tier;
  if (!isTier(tier)) return { error: "Choose VVIP, VIP or General.", values };

  const max = tier === "general" ? MAX_PER_BOOKING : MAX_PER_INVITE;
  const passes = Number(values.passes);
  const phone = values.phone ? normalisePhone(values.phone) : null;
  if (values.name.length < 2 || values.name.length > 100) return { error: "Enter the guest's name.", values };
  if (values.title.length > 120) return { error: "Designation is too long.", values };
  if (values.phone && !phone) return { error: "That WhatsApp number doesn't look right (10 digits, or +country code).", values };
  if (tier === "general" && !phone) return { error: "General passes need a WhatsApp number.", values };
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return { error: "Check the email address.", values };
  if (!Number.isInteger(passes) || passes < 1 || passes > max) return { error: `Admits: choose 1 to ${max}.`, values };

  try {
    if (tier === "general") {
      const r = await bookPasses({ name: values.name, phone: phone!, email: values.email || null, passes, source: `Admin: ${admin}` });
      if (r.status === "full") return { error: `General passes are full (${r.left} left).`, values };
      revalidatePath("/admin");
      return { issued: { code: r.code, tier, name: values.name, phone, existing: r.status === "existing" } };
    }
    const code = await issueInvitation({ tier, name: values.name, title: values.title || null, phone, email: values.email || null, passes, issuedBy: admin });
    revalidatePath("/admin");
    return { issued: { code, tier, name: values.name, phone } };
  } catch (e) {
    console.error("[admin] issue pass failed", e);
    return { error: "Could not save the pass. Try again in a minute.", values };
  }
}
