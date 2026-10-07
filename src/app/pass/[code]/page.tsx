import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetaPixel } from "@/components/MetaPixel";
import { site } from "@/lib/site";
import { getPass } from "@/lib/passes";
import { PassTicket } from "../PassTicket";

// Each pass is personal: keep it out of search results.
export const metadata: Metadata = { title: "Your Free Pass — Ravi Chary Crossing", robots: { index: false, follow: false } };

export default async function PassTicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const pass = await getPass(decodeURIComponent(code).toUpperCase());
  if (!pass) notFound();
  const isNew = sp.new === "1";

  return (
    <>
      <PassTicket
        pass={{ ...pass, type: "general" }}
        url={`${site.url}/pass/${pass.code}`}
        imageHref={`/pass/${pass.code}/image`}
        status={
          isNew
            ? "You're in! Your free pass is booked."
            : sp.existing === "1"
              ? "This number already has a pass. Here it is."
              : "Your free pass"
        }
      />
      <MetaPixel event={isNew ? "Lead" : undefined} value={pass.passes} />
    </>
  );
}
