// Passes that work without a database: the pass details live in the link itself.
// General passes are open to anyone (free entry); VVIP / VIP links carry a signature made
// with PASSES_ADMIN_PASSWORD, so they can't be made up by editing a link.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { crossing } from "./site";

export type PassType = keyof typeof crossing.passTypes;
export type TokenPass = { code: string; name: string; phone: string; passes: number; type: PassType };

const isType = (t: unknown): t is PassType => typeof t === "string" && t in crossing.passTypes;
const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url").slice(0, 22);

// Same alphabet as database passes (no 0/O, 1/I/L), so codes read cleanly at the door.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function codeFor(payload: string) {
  const c = Array.from(createHash("sha256").update(payload).digest().subarray(0, 8), (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `RCC-${c.slice(0, 4)}-${c.slice(4)}`;
}

/** Returns null for VVIP / VIP when no password is set or the given one is wrong. */
export function makePassToken(p: Omit<TokenPass, "code">, password?: string): string | null {
  const payload = Buffer.from(JSON.stringify({ n: p.name, p: p.phone, q: p.passes, t: p.type })).toString("base64url");
  if (p.type === "general") return payload;
  const key = process.env.PASSES_ADMIN_PASSWORD;
  if (!key || password !== key) return null;
  return `${payload}.${sign(payload, key)}`;
}

export function readPassToken(token: string): TokenPass | null {
  const [payload, sig, extra] = token.split(".");
  if (!payload || extra !== undefined || token.length > 600) return null;
  let d: { n?: unknown; p?: unknown; q?: unknown; t?: unknown };
  try {
    d = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (typeof d.n !== "string" || typeof d.p !== "string" || !Number.isInteger(d.q) || !isType(d.t)) return null;
  if (d.t !== "general") {
    const key = process.env.PASSES_ADMIN_PASSWORD;
    if (!key || !sig) return null;
    const want = Buffer.from(sign(payload, key));
    const got = Buffer.from(sig);
    if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  }
  return { code: codeFor(payload), name: d.n.slice(0, 80), phone: d.p.slice(0, 16), passes: Math.min(Math.max(Number(d.q), 1), 20), type: d.t };
}
