"use server";

import { redirect } from "next/navigation";
import { adminExists, checkLogin, endSession, setAdminAccount, setupCodeMatches, startSession } from "@/lib/admin-auth";

export type LoginState = { error?: string; username?: string };

const field = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const pause = () => new Promise((r) => setTimeout(r, 600)); // slows down password guessing

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const username = field(form, "username");
  const password = String(form.get("password") ?? "");
  let userId: number | null = null;
  try {
    userId = await checkLogin(username, password);
  } catch (e) {
    console.error("[admin] login failed", e);
    return { error: "Could not reach the database. Try again in a minute.", username };
  }
  if (!userId) {
    await pause();
    return { error: "Wrong username or password.", username };
  }
  await startSession(userId);
  redirect("/admin");
}

/** First-time account creation and "forgot password" both go through here, gated by the setup code. */
export async function createAccount(_prev: LoginState, form: FormData): Promise<LoginState> {
  const username = field(form, "username");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  const code = String(form.get("code") ?? "");
  const reset = form.get("mode") === "reset";

  if (!setupCodeMatches(code)) {
    await pause();
    return { error: "That setup code is not right. It is the PASSES_ADMIN_PASSWORD value in Vercel.", username };
  }
  if (!/^[A-Za-z0-9._-]{3,32}$/.test(username))
    return { error: "Username: 3 to 32 letters or numbers (. _ - allowed, no spaces).", username };
  if (password.length < 8) return { error: "Password must be at least 8 characters.", username };
  if (password !== confirm) return { error: "The two passwords don't match.", username };

  try {
    // Without the reset flag, refuse to overwrite an account someone already made.
    if (!reset && (await adminExists())) return { error: "An admin account already exists. Please log in." };
    await setAdminAccount(username, password);
    const userId = await checkLogin(username, password);
    if (userId) await startSession(userId);
  } catch (e) {
    console.error("[admin] account setup failed", e);
    return { error: "Could not save the account. Try again in a minute.", username };
  }
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
