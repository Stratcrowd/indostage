import Link from "next/link";
import QRCode from "qrcode";
import { Arrow } from "@/components/ui";
import { crossing } from "@/lib/site";
import { maskPhone } from "@/lib/passes";
import type { PassType } from "@/lib/pass-token";
import { PrintButton } from "./PrintButton";

export type TicketPass = { code: string; name: string; phone: string; passes: number; type: PassType };

/** The pass itself plus its Print / Download / WhatsApp buttons. Shared by database and link passes. */
export async function PassTicket({
  pass,
  url,
  imageHref,
  status,
  sendHref,
}: {
  pass: TicketPass;
  /** Address the QR code points to. */
  url: string;
  imageHref: string;
  status: string;
  /** When set, the visitor still has to send their details to us on WhatsApp. */
  sendHref?: string;
}) {
  const qr = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0c0806", light: "#f5ecdc" } });
  const share = `https://wa.me/?text=${encodeURIComponent(`My pass for Ravi Chary Crossing (18 Oct, ${crossing.venue}): ${url}`)}`;
  const typeLabel = crossing.passTypes[pass.type];

  return (
    <section className="grain relative isolate overflow-hidden pt-32 pb-24 sm:pt-36 print:p-0">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(107,26,26,0.55),transparent_60%)] print:hidden" />
      <div className="container-x max-w-xl">
        <p role="status" className="text-center text-lg text-ivory/90 print:hidden">
          {status}
        </p>

        {sendHref && (
          <div className="mt-6 rounded-3xl border border-[#1faa53]/60 bg-[#1faa53]/10 p-6 text-center print:hidden">
            <p className="text-ivory">
              <strong>One last step:</strong> send your details to IndoStage on WhatsApp so we can confirm your pass.
            </p>
            <a
              href={sendHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-4 w-full justify-center bg-[#1faa53] text-white hover:bg-[#1c9a4b]"
            >
              Send on WhatsApp
            </a>
          </div>
        )}

        <article className="mt-6 overflow-hidden rounded-3xl border border-gold/50 bg-ink-2 shadow-2xl print:mt-0 print:shadow-none">
          <div className="border-b border-dashed border-gold/40 px-6 pt-7 pb-6 text-center sm:px-8">
            <p className="kicker">Free pass · IndoStage presents</p>
            <h1 className="h-display mt-3 text-4xl sm:text-5xl">
              Ravi Chary <em className="text-gold-grad">Crossing</em>
            </h1>
            <p className="mt-3 text-ivory/80">
              {crossing.dateLabel} · {crossing.time}
              <br />
              {crossing.venue}, {crossing.area}
            </p>
            <p className="mt-4 inline-block rounded-full border border-gold px-5 py-1.5 font-display text-xl tracking-[0.2em] text-gold uppercase">
              {typeLabel} Pass
            </p>
          </div>

          <div className="grid gap-6 px-6 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8">
            <dl className="space-y-4">
              <div>
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">Name</dt>
                <dd className="font-display text-2xl text-ivory">{pass.name}</dd>
              </div>
              <div className="flex gap-8">
                <div>
                  <dt className="text-xs tracking-[0.2em] text-muted uppercase">Admits</dt>
                  <dd className="font-display text-3xl text-gold-soft">
                    {pass.passes} {pass.passes === 1 ? "person" : "people"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-[0.2em] text-muted uppercase">Mobile</dt>
                  <dd className="mt-1.5 text-ivory/80">{maskPhone(pass.phone)}</dd>
                </div>
              </div>
              <div>
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">Pass No.</dt>
                <dd className="font-mono text-xl tracking-wider text-gold">{pass.code}</dd>
              </div>
            </dl>
            <div
              className="mx-auto w-44 overflow-hidden rounded-xl border-4 border-ivory bg-ivory sm:w-40 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
              aria-label={`QR code for pass ${pass.code}`}
              role="img"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
          </div>
          <p className="bg-gold/10 px-6 py-3 text-center text-sm text-ivory/80">
            Show this pass at the entrance, on your phone or printed.
          </p>
        </article>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 print:hidden">
          <PrintButton className="btn-gold justify-center" />
          <a href={imageHref} download className="btn-ghost justify-center">
            Download Pass
          </a>
          <a href={share} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center">
            Save to WhatsApp
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-muted print:hidden">
          Bookmark this page to open your pass again. Questions? Call{" "}
          <a href={crossing.enquiryHref} className="text-gold">
            {crossing.enquiry}
          </a>
          .
        </p>
        <p className="mt-8 text-center print:hidden">
          <Link href={crossing.href} className="inline-flex items-center gap-2 text-gold-soft hover:text-gold">
            About the concert <Arrow />
          </Link>
        </p>
      </div>
    </section>
  );
}
