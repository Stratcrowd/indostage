"use server";

import { redirect } from "next/navigation";
import { normalisePhone } from "@/lib/passes";
import { makePassToken, type PassType } from "@/lib/pass-token";
import { crossing } from "@/lib/site";

export type IssueState = { message?: string; values?: Record<string, string> };

// For the IndoStage team: make a VVIP / VIP (or General) pass for a guest.
export async function issuePass(_prev: IssueState, formData: FormData): Promise<IssueState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = { name: get("name").replace(/\s+/g, " "), phone: get("phone"), passes: get("passes") || "1", type: get("type") };
  const phone = normalisePhone(values.phone);
  const passes = Number(values.passes);
  const type = values.type as PassType;

  if (!(type in crossing.passTypes)) return { message: "Choose a pass type.", values };
  if (values.name.length < 2 || values.name.length > 80) return { message: "Enter the guest's full name.", values };
  if (!phone) return { message: "Enter a valid 10-digit mobile number.", values };
  if (!Number.isInteger(passes) || passes < 1 || passes > 20) return { message: "Choose 1 to 20 people.", values };

  const token = makePassToken({ name: values.name, phone, passes, type }, get("password"));
  if (!token) {
    return {
      message: process.env.PASSES_ADMIN_PASSWORD
        ? "Wrong team password."
        : "VVIP and VIP passes need a team password. Add PASSES_ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.",
      values,
    };
  }
  redirect(`/pass/v/${token}`);
}
