import type { Metadata } from "next";
import { IssueForm } from "./IssueForm";

// Team-only page; not linked anywhere and kept out of search results.
export const metadata: Metadata = { title: "Make a Pass — Ravi Chary Crossing", robots: { index: false, follow: false } };

export default function IssuePassPage() {
  return (
    <section className="pt-32 pb-24 sm:pt-36">
      <div className="container-x max-w-md">
        <p className="kicker">IndoStage team</p>
        <h1 className="h-display mt-4 text-4xl">Make a Pass</h1>
        <p className="mt-3 text-sm text-muted">
          For VVIP and VIP guests. The pass opens on the next screen, ready to print, download or send on WhatsApp.
        </p>
        <div className="mt-8">
          <IssueForm />
        </div>
      </div>
    </section>
  );
}
