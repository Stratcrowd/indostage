import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetaPixel } from "@/components/MetaPixel";
import { crossing, site, whatsappLink } from "@/lib/site";
import { readPassToken } from "@/lib/pass-token";
import { PassTicket } from "../../PassTicket";

// Each pass is personal: keep it out of search results.
export const metadata: Metadata = { title: "Your Free Pass — Ravi Chary Crossing", robots: { index: false, follow: false } };

// A pass whose details live in the link (used while there is no booking database).
export default async function LinkPassPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const pass = readPassToken(decodeURIComponent(token));
  if (!pass) notFound();
  const url = `${site.url}/pass/v/${token}`;
  const isNew = sp.new === "1";

  // The lead reaches IndoStage as a WhatsApp message with everything needed to check the pass at the door.
  const sendHref = whatsappLink(
    [
      `Hi IndoStage! I've booked free passes for ${crossing.title} (${crossing.dateLabel}).`,
      `Name: ${pass.name}`,
      `Mobile: ${pass.phone}`,
      `Passes: ${pass.passes}`,
      `Pass type: ${crossing.passTypes[pass.type]}`,
      `Pass No.: ${pass.code}`,
      url,
    ].join("\n"),
  );

  return (
    <>
      <PassTicket
        pass={pass}
        url={url}
        imageHref={`/pass/v/${token}/image`}
        status={isNew ? "You're in! Here is your free pass." : `Your ${crossing.passTypes[pass.type]} pass`}
        sendHref={isNew && pass.type === "general" ? sendHref : undefined}
      />
      <MetaPixel event={isNew ? "Lead" : undefined} value={pass.passes} />
    </>
  );
}
