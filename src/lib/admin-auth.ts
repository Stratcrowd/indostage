// IndoStage admin login: one admin account (username + password) stored in Postgres, with
// login sessions kept as hashed random tokens in an httpOnly cookie.
// The account is created, and its password reset, on /admin/login with a setup code:
// the PASSES_ADMIN_PASSWORD value from Vercel, which only the site owner can see or change.
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { db } from "./passes";

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

import { SESSION_COOKIE } from "./admin-cookie";

export { SESSION_COOKIE };
const SESSION_DAYS = 30;

let ready: Promise<unknown> | undefined;
async function adminDb() {
  const sql = await db();
  ready ??= sql
    .query(
      `CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`,
    )
    .then(() =>
      sql.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL
      )`),
    )
    .catch((e) => {
      ready = undefined;
      throw e;
    });
  await ready;
  return sql;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function passwordMatches(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const given = await scryptAsync(password, Buffer.from(salt, "hex"), 64);
  return timingSafeEqual(given, Buffer.from(hash, "hex"));
}

/** True when the setup code matches PASSES_ADMIN_PASSWORD (compared in constant time). */
export function setupCodeMatches(code: string) {
  const expected = process.env.PASSES_ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(Buffer.from(sha256(code)), Buffer.from(sha256(expected)));
}

export const setupCodeConfigured = () => Boolean(process.env.PASSES_ADMIN_PASSWORD);

export async function adminExists() {
  const sql = await adminDb();
  const [row] = await sql`SELECT COUNT(*)::int AS n FROM admin_users`;
  return row.n > 0;
}

/** Creates the admin account, or replaces it (password reset). Logs every device out. */
export async function setAdminAccount(username: string, password: string) {
  const sql = await adminDb();
  const hash = await hashPassword(password);
  await sql`DELETE FROM admin_users`;
  await sql`INSERT INTO admin_users (username, password_hash) VALUES (${username}, ${hash})`;
}

export async function checkLogin(username: string, password: string): Promise<number | null> {
  const sql = await adminDb();
  const [user] = await sql`SELECT id, password_hash FROM admin_users WHERE lower(username) = lower(${username})`;
  // Hash even when the username is wrong, so timing doesn't reveal which part failed.
  const ok = await passwordMatches(password, user?.password_hash ?? `${"0".repeat(32)}:${"0".repeat(128)}`);
  return user && ok ? (user.id as number) : null;
}

/** Starts a session for the user and sets the cookie. Server Functions only. */
export async function startSession(userId: number) {
  const sql = await adminDb();
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await sql`DELETE FROM admin_sessions WHERE expires_at < now()`;
  await sql`INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (${sha256(token)}, ${userId}, ${expires.toISOString()})`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

/** The logged-in admin's username, or null. */
export async function currentAdmin(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const sql = await adminDb();
    const [row] = await sql`
      SELECT u.username FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ${sha256(token)} AND s.expires_at > now()`;
    return (row?.username as string) ?? null;
  } catch (e) {
    console.error("[admin] session check failed", e);
    return null;
  }
}

/** Ends this device's session. Server Functions only. */
export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      const sql = await adminDb();
      await sql`DELETE FROM admin_sessions WHERE token_hash = ${sha256(token)}`;
    } catch (e) {
      console.error("[admin] logout cleanup failed", e);
    }
  }
  store.delete(SESSION_COOKIE);
}
