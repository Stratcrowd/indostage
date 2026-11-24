// Passes for Ravi Chary Crossing, stored in Cloudflare D1 (see ./d1.ts; Neon Postgres until Nov 2026).
// Three tiers: "general" (booked by the public on /pass, capped at GENERAL_PASS_LIMIT, first come
// first served) and "vip" / "vvip" (invitations issued by admins only, outside that cap).
// Env: PASSES_ADMIN_PASSWORD (admin setup code). Database: the DB binding in wrangler.jsonc.
import { d1 } from "./d1";
import { GENERAL_PASS_LIMIT, MAX_PER_BOOKING, MAX_PER_INVITE, type Tier } from "./passes-config";
import { crossing } from "./site";

export { MAX_PER_BOOKING, MAX_PER_INVITE };
// Fixed in code (the old PASS_LIMIT variable in Vercel is no longer read).
export const passLimit = () => GENERAL_PASS_LIMIT;

export type Pass = {
  code: string;
  tier: Tier;
  name: string;
  /** Designation shown on VIP / VVIP invitations, e.g. "Hon. Deputy Chief Minister". */
  title: string | null;
  phone: string | null;
  email: string | null;
  passes: number;
  created_at: string;
};

export const passesConfigured = () => true;
export const showIsOver = () => Date.now() > Date.parse(crossing.endISO);

// Unambiguous characters only (no 0/O, 1/I/L), so codes read cleanly at the door: RCC-7K4Q-M2XD.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const c = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `RCC-${c.slice(0, 4)}-${c.slice(4)}`;
}

/** Indian mobile numbers become 10 digits; anything else must be a +country number. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  const in10 = digits.replace(/^(\+?91|0)(?=\d{10}$)/, "");
  if (/^[6-9]\d{9}$/.test(in10)) return in10;
  if (/^\+\d{8,15}$/.test(digits) && !digits.startsWith("+91")) return digits;
  return null;
}

/** General passes booked so far (the public cap). */
export async function passesTaken() {
  const db = await d1();
  const row = await db.prepare(`SELECT COALESCE(SUM(passes), 0) AS n FROM crossing_passes WHERE tier = 'general'`).first<{ n: number }>();
  return Number(row?.n ?? 0);
}

export type BookResult =
  | { status: "booked" | "existing"; code: string }
  | { status: "full"; left: number };

/** A general pass. Used by the public form and by admins; same number gets its existing pass back. */
export async function bookPasses(input: { name: string; phone: string; email: string | null; passes: number; source: string }): Promise<BookResult> {
  const db = await d1();
  const limit = passLimit();
  const code = newCode();
  // One statement, so the limit check and the insert can't be split by a parallel booking.
  const { results } = await db
    .prepare(
      `INSERT INTO crossing_passes (code, tier, name, phone, email, passes, source)
       SELECT ?1, 'general', ?2, ?3, ?4, ?5, ?6
       WHERE (SELECT COALESCE(SUM(passes), 0) FROM crossing_passes WHERE tier = 'general') + ?5 <= ?7
       ON CONFLICT (phone) WHERE tier = 'general' DO NOTHING
       RETURNING code`,
    )
    .bind(code, input.name, input.phone, input.email, input.passes, input.source || null, limit)
    .all<{ code: string }>();
  if (results.length) return { status: "booked", code: results[0].code };

  // Same phone booked before: hand back their existing pass instead of a second one.
  const existing = await db
    .prepare(`SELECT code FROM crossing_passes WHERE tier = 'general' AND phone = ?1`)
    .bind(input.phone)
    .first<{ code: string }>();
  if (existing) return { status: "existing", code: existing.code };
  return { status: "full", left: Math.max(0, limit - (await passesTaken())) };
}

/** A VIP or VVIP invitation, issued by an admin. Not counted against the public cap. */
export async function issueInvitation(input: {
  tier: Exclude<Tier, "general">;
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  passes: number;
  issuedBy: string;
}) {
  const db = await d1();
  const code = newCode();
  await db
    .prepare(
      `INSERT INTO crossing_passes (code, tier, name, title, phone, email, passes, source)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
    )
    .bind(code, input.tier, input.name, input.title, input.phone, input.email, input.passes, `Admin: ${input.issuedBy}`)
    .run();
  return code;
}

export async function getPass(code: string): Promise<Pass | null> {
  if (!/^RCC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return null;
  const db = await d1();
  return db
    .prepare(`SELECT code, tier, name, title, phone, email, passes, created_at FROM crossing_passes WHERE code = ?1`)
    .bind(code)
    .first<Pass>();
}

/** Admin-only: removes a pass for good. Its link stops working and a general pass frees its seats. */
export async function deletePass(code: string) {
  if (!/^RCC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return false;
  const db = await d1();
  const { results } = await db.prepare(`DELETE FROM crossing_passes WHERE code = ?1 RETURNING code`).bind(code).all();
  return results.length > 0;
}

export async function allPasses() {
  const db = await d1();
  const { results } = await db
    .prepare(`SELECT code, tier, name, title, phone, email, passes, source, created_at FROM crossing_passes ORDER BY created_at`)
    .all<Pass & { source: string | null }>();
  return results;
}

export const maskPhone = (p: string) => p.slice(0, 2) + "•".repeat(Math.max(0, p.length - 5)) + p.slice(-3);
