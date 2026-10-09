import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { adminExists, currentAdmin, setupCodeConfigured } from "@/lib/admin-auth";
import { passesConfigured } from "@/lib/passes";
import { AccountForm, LoginForm } from "./LoginForms";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

// One admin account. The first visit creates it (with the setup code); after that this page only
// logs in, with a "forgot password" reset that needs the same setup code.
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  if (await currentAdmin()) redirect("/admin");
  const reset = (await searchParams).reset === "1";

  let exists = false;
  let problem = "";
  if (!passesConfigured()) problem = "The database is not connected (DATABASE_URL is missing in Vercel).";
  else if (!setupCodeConfigured()) problem = "PASSES_ADMIN_PASSWORD is not set in Vercel, so the account can't be created yet.";
  else {
    try {
      exists = await adminExists();
    } catch (e) {
      console.error("[admin] could not check account", e);
      problem = "Could not reach the database. Try again in a minute.";
    }
  }
  const mode = !exists ? "setup" : reset ? "reset" : "login";
  const titles = { setup: "Create Admin Account", reset: "Reset Password", login: "Admin Login" };

  return (
    <section className="grain relative isolate flex min-h-[80vh] items-center pt-28 pb-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(107,26,26,0.45),transparent_60%)]" />
      <div className="container-x">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-ink-2/90 p-6 shadow-2xl sm:p-8">
          <p className="kicker">IndoStage Admin</p>
          <h1 className="mt-3 font-display text-4xl text-ivory">{titles[mode]}</h1>
          {mode === "setup" && (
            <p className="mt-2 text-sm text-muted">First time only. Choose the username and password you&apos;ll use to log in from now on.</p>
          )}
          {mode === "reset" && <p className="mt-2 text-sm text-muted">Set a new username and password. Other devices will be logged out.</p>}

          <div className="mt-7">
            {problem ? (
              <p className="rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-ivory">{problem}</p>
            ) : mode === "login" ? (
              <LoginForm />
            ) : (
              <AccountForm mode={mode} />
            )}
          </div>

          {!problem && (
            <p className="mt-6 text-center text-sm">
              {mode === "login" ? (
                <Link href="/admin/login?reset=1" className="text-gold-soft hover:text-gold">
                  Forgot password?
                </Link>
              ) : mode === "reset" ? (
                <Link href="/admin/login" className="text-gold-soft hover:text-gold">
                  Back to login
                </Link>
              ) : null}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
