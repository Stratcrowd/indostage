// IndoStage admin login: one admin account (username + password) stored in D1 (./d1.ts), with
// login sessions kept as hashed random tokens in an httpOnly cookie.
// The account is created, and its password reset, on /admin/login with a setup code:
// the PASSES_ADMIN_PASSWORD secret on the Cloudflare Worker, which only the site owner can see or change.
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { d1, nowIso } from "./d1";

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

import { SESSION_COOKIE } from "./admin-cookie";

export { SESSION_COOKIE };
const SESSION_DAYS = 30;

// Tables are created in ./d1.ts.
const adminDb = d1;

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
  const db = await adminDb();
  const row = await db.prepare(`SELECT COUNT(*) AS n FROM admin_users`).first<{ n: number }>();
  return Number(row?.n ?? 0) > 0;
}

/** Creates the admin account, or replaces it (password reset). Logs every device out. */
export async function setAdminAccount(username: string, password: string) {
  const db = await adminDb();
  const hash = await hashPassword(password);
  // Sessions are removed with the user (D1 does not enforce ON DELETE CASCADE by default).
  await db.batch([
    db.prepare(`DELETE FROM admin_sessions`),
    db.prepare(`DELETE FROM admin_users`),
    db.prepare(`INSERT INTO admin_users (username, password_hash) VALUES (?1, ?2)`).bind(username, hash),
  ]);
}

export async function checkLogin(username: string, password: string): Promise<number | null> {
  const db = await adminDb();
  const user = await db
    .prepare(`SELECT id, password_hash FROM admin_users WHERE lower(username) = lower(?1)`)
    .bind(username)
    .first<{ id: number; password_hash: string }>();
  // Hash even when the username is wrong, so timing doesn't reveal which part failed.
  const ok = await passwordMatches(password, user?.password_hash ?? `${"0".repeat(32)}:${"0".repeat(128)}`);
  return user && ok ? (user.id as number) : null;
}

/** Starts a session for the user and sets the cookie. Server Functions only. */
export async function startSession(userId: number) {
  const db = await adminDb();
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db.batch([
    db.prepare(`DELETE FROM admin_sessions WHERE expires_at < ?1`).bind(nowIso()),
    db.prepare(`INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (?1, ?2, ?3)`).bind(sha256(token), userId, expires.toISOString()),
  ]);
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
    const db = await adminDb();
    const row = await db
      .prepare(
        `SELECT u.username FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
         WHERE s.token_hash = ?1 AND s.expires_at > ?2`,
      )
      .bind(sha256(token), nowIso())
      .first<{ username: string }>();
    return row?.username ?? null;
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
      const db = await adminDb();
      await db.prepare(`DELETE FROM admin_sessions WHERE token_hash = ?1`).bind(sha256(token)).run();
    } catch (e) {
      console.error("[admin] logout cleanup failed", e);
    }
  }
  store.delete(SESSION_COOKIE);
}
