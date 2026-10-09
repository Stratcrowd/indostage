// Shared by the pass forms (client) and src/lib/passes.ts (server).

/** Most passes one WhatsApp number can book on the public /pass page. */
export const MAX_PER_BOOKING = 4;
/** Most people one admin-issued pass (VIP / VVIP invitation) can admit. */
export const MAX_PER_INVITE = 10;
/** Seats handed out on the public page, first come first served. VIP and VVIP seats are separate. */
export const GENERAL_PASS_LIMIT = 800;

export const TIERS = ["general", "vip", "vvip"] as const;
export type Tier = (typeof TIERS)[number];
export const isTier = (v: unknown): v is Tier => TIERS.includes(v as Tier);

// Only admins can issue VIP and VVIP passes; the public page never mentions them.
export const tierInfo: Record<Tier, { label: string; short: string; seating: string }> = {
  general: { label: "Free Pass", short: "General", seating: "Free entry · First come, first served" },
  vip: { label: "VIP Invitation", short: "VIP", seating: "Reserved VIP seating" },
  vvip: { label: "VVIP Invitation", short: "VVIP", seating: "Reserved VVIP seating · Front rows" },
};
