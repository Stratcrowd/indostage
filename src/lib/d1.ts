// Cloudflare D1 (SQLite) database for passes and the admin login, bound to the Worker as DB in
// wrangler.jsonc. Replaced Neon Postgres when the site moved from Vercel to Cloudflare (Nov 2026).
import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// The parts of the D1 API used here (the project does not load @cloudflare/workers-types).
type Row = Record<string, unknown>;
export type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  first<T = Row>(): Promise<T | null>;
  all<T = Row>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
};
export type D1 = {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown[]>;
};

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS crossing_passes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    tier TEXT NOT NULL DEFAULT 'general',
    name TEXT NOT NULL,
    title TEXT,
    phone TEXT,
    email TEXT,
    passes INTEGER NOT NULL,
    source TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )`,
  // One public booking per number; invitations may share a number (e.g. an assistant's).
  `CREATE UNIQUE INDEX IF NOT EXISTS crossing_passes_general_phone ON crossing_passes (phone) WHERE tier = 'general'`,
  `CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )`,
  `CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL
  )`,
];

let ready: Promise<unknown> | undefined;

/** The database, with its tables created on first use (every statement is safe to run again). */
export async function d1(): Promise<D1> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as unknown as { DB: D1 }).DB;
  ready ??= db.batch(SCHEMA.map((s) => db.prepare(s))).catch((e) => {
    ready = undefined;
    throw e;
  });
  await ready;
  return db;
}

/** Current time in the same format as the created_at columns, so text comparisons sort correctly. */
export const nowIso = () => new Date().toISOString();
