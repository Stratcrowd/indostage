// Login for the IndoStage admin pages (/admin) and the booking export (/api/passes): the browser's
// own username/password prompt (HTTP Basic auth). Any username; the password is
// PASSES_ADMIN_PASSWORD from Vercel. One realm, so a single login covers both.
export const ADMIN_REALM = "IndoStage admin";

export function isAdmin(authorization: string | null): boolean {
  const password = process.env.PASSES_ADMIN_PASSWORD;
  if (!password || !authorization?.startsWith("Basic ")) return false;
  let given = "";
  try {
    given = atob(authorization.slice(6)).split(":").slice(1).join(":");
  } catch {
    return false;
  }
  // Compare every character so the time taken doesn't reveal how much of the password matched.
  let diff = given.length ^ password.length;
  for (let i = 0; i < password.length; i++) diff |= password.charCodeAt(i) ^ (given.charCodeAt(i) || 0);
  return diff === 0;
}

export const askForLogin = () =>
  new Response("Login required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${ADMIN_REALM}", charset="UTF-8"`, "Cache-Control": "no-store" },
  });
