// Passes for Ravi Chary Crossing, stored in Postgres (Neon via the Vercel Marketplace).
// Three tiers: "general" (booked by the public on /pass, capped at GENERAL_PASS_LIMIT, first come
// first served) and "vip" / "vvip" (invitations issued by admins only, outside that cap).
// Env: DATABASE_URL (set by the Neon integration), PASSES_ADMIN_PASSWORD (admin setup code).
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
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

let sql: NeonQueryFunction<false, false> | undefined;
let ready: Promise<unknown> | undefined;

// Brings tables created by earlier versions (phone required and unique, at most 4 passes, no
// tier) up to date. Every statement is safe to run again.
const MIGRATIONS = [
  `ALTER TABLE crossing_passes ADD COLUMN IF NOT EXISTS email TEXT`,
  `ALTER TABLE crossing_passes ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'general'`,
  `ALTER TABLE crossing_passes ADD COLUMN IF NOT EXISTS title TEXT`,
  `ALTER TABLE crossing_passes ALTER COLUMN phone DROP NOT NULL`,
  `ALTER TABLE crossing_passes DROP CONSTRAINT IF EXISTS crossing_passes_phone_key`,
  `ALTER TABLE crossing_passes DROP CONSTRAINT IF EXISTS crossing_passes_passes_check`,
  // One public booking per number; invitations may share a number (e.g. an assistant's).
  `CREATE UNIQUE INDEX IF NOT EXISTS crossing_passes_general_phone ON crossing_passes (phone) WHERE tier = 'general'`,
];

export async function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const q = (sql ??= neon(process.env.DATABASE_URL));
  ready ??= (async () => {
    await q.query(`
      CREATE TABLE IF NOT EXISTS crossing_passes (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        phone TEXT,
        passes INT NOT NULL,
        source TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
    for (const m of MIGRATIONS) await q.query(m);
  })().catch((e) => {
    ready = undefined;
    throw e;
  });
  await ready;
  return q;
}

export const passesConfigured = () => Boolean(process.env.DATABASE_URL);
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
  const sql = await db();
  const [row] = await sql`SELECT COALESCE(SUM(passes), 0)::int AS n FROM crossing_passes WHERE tier = 'general'`;
  return row.n as number;
}

export type BookResult =
  | { status: "booked" | "existing"; code: string }
  | { status: "full"; left: number };

/** A general pass. Used by the public form and by admins; same number gets its existing pass back. */
export async function bookPasses(input: { name: string; phone: string; email: string | null; passes: number; source: string }): Promise<BookResult> {
  const sql = await db();
  const limit = passLimit();
  const code = newCode();
  // One statement, so the limit check and the insert can't be split by a parallel booking.
  const rows = await sql`
    INSERT INTO crossing_passes (code, tier, name, phone, email, passes, source)
    SELECT ${code}, 'general', ${input.name}, ${input.phone}, ${input.email}, ${input.passes}, ${input.source || null}
    WHERE (SELECT COALESCE(SUM(passes), 0) FROM crossing_passes WHERE tier = 'general') + ${input.passes} <= ${limit}
    ON CONFLICT (phone) WHERE tier = 'general' DO NOTHING
    RETURNING code`;
  if (rows.length) return { status: "booked", code: rows[0].code };

  // Same phone booked before: hand back their existing pass instead of a second one.
  const [existing] = await sql`SELECT code FROM crossing_passes WHERE tier = 'general' AND phone = ${input.phone}`;
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
  const sql = await db();
  const code = newCode();
  await sql`
    INSERT INTO crossing_passes (code, tier, name, title, phone, email, passes, source)
    VALUES (${code}, ${input.tier}, ${input.name}, ${input.title}, ${input.phone}, ${input.email}, ${input.passes}, ${`Admin: ${input.issuedBy}`})`;
  return code;
}

export async function getPass(code: string): Promise<Pass | null> {
  if (!/^RCC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return null;
  const sql = await db();
  const [row] = await sql`SELECT code, tier, name, title, phone, email, passes, created_at FROM crossing_passes WHERE code = ${code}`;
  return (row as Pass) ?? null;
}

export async function allPasses() {
  const sql = await db();
  return sql`SELECT code, tier, name, title, phone, email, passes, source, created_at FROM crossing_passes ORDER BY created_at`;
}

export const maskPhone = (p: string) => p.slice(0, 2) + "•".repeat(Math.max(0, p.length - 5)) + p.slice(-3);
