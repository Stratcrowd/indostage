// Free passes for Ravi Chary Crossing, stored in Postgres (Neon via the Vercel Marketplace).
// Env: DATABASE_URL (set by the Neon integration), PASS_LIMIT (total seats to hand out),
// PASSES_ADMIN_PASSWORD (for the CSV export at /api/passes).
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { MAX_PER_BOOKING } from "./passes-config";
import { crossing } from "./site";

export { MAX_PER_BOOKING };
export const passLimit = () => Number(process.env.PASS_LIMIT) || 1500;

export type Pass = {
  code: string;
  name: string;
  phone: string;
  email: string | null;
  passes: number;
  created_at: string;
};

let sql: NeonQueryFunction<false, false> | undefined;
let ready: Promise<unknown> | undefined;

async function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const q = (sql ??= neon(process.env.DATABASE_URL));
  // DDL can't take bind parameters, so the (constant) limit is written into the statement.
  ready ??= q
    .query(`
    CREATE TABLE IF NOT EXISTS crossing_passes (
      id SERIAL PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      passes INT NOT NULL CHECK (passes BETWEEN 1 AND ${Number(MAX_PER_BOOKING)}),
      source TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
    // Email was added after launch; tables created before then get the column here.
    .then(() => q.query(`ALTER TABLE crossing_passes ADD COLUMN IF NOT EXISTS email TEXT`))
    .catch((e) => {
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

export async function passesTaken() {
  const sql = await db();
  const [row] = await sql`SELECT COALESCE(SUM(passes), 0)::int AS n FROM crossing_passes`;
  return row.n as number;
}

export type BookResult =
  | { status: "booked" | "existing"; code: string }
  | { status: "full"; left: number };

export async function bookPasses(input: { name: string; phone: string; email: string | null; passes: number; source: string }): Promise<BookResult> {
  const sql = await db();
  const limit = passLimit();
  const code = newCode();
  // One statement, so the limit check and the insert can't be split by a parallel booking.
  const rows = await sql`
    INSERT INTO crossing_passes (code, name, phone, email, passes, source)
    SELECT ${code}, ${input.name}, ${input.phone}, ${input.email}, ${input.passes}, ${input.source || null}
    WHERE (SELECT COALESCE(SUM(passes), 0) FROM crossing_passes) + ${input.passes} <= ${limit}
    ON CONFLICT (phone) DO NOTHING
    RETURNING code`;
  if (rows.length) return { status: "booked", code: rows[0].code };

  // Same phone booked before: hand back their existing pass instead of a second one.
  const [existing] = await sql`SELECT code FROM crossing_passes WHERE phone = ${input.phone}`;
  if (existing) return { status: "existing", code: existing.code };
  return { status: "full", left: Math.max(0, limit - (await passesTaken())) };
}

export async function getPass(code: string): Promise<Pass | null> {
  if (!/^RCC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return null;
  const sql = await db();
  const [row] = await sql`SELECT code, name, phone, email, passes, created_at FROM crossing_passes WHERE code = ${code}`;
  return (row as Pass) ?? null;
}

export async function allPasses() {
  const sql = await db();
  return sql`SELECT code, name, phone, email, passes, source, created_at FROM crossing_passes ORDER BY created_at`;
}

export const maskPhone = (p: string) => p.slice(0, 2) + "•".repeat(Math.max(0, p.length - 5)) + p.slice(-3);
