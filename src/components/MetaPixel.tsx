import Script from "next/script";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Meta Pixel for the free-pass funnel, so Instagram/Facebook ads can optimise for bookings.
// Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is set in Vercel.
export function MetaPixel({ event, value }: { event?: "Lead"; value?: number }) {
  if (!pixelId || !/^\d+$/.test(pixelId)) return null;
  const track = event ? `fbq('track','${event}',{content_name:'Ravi Chary Crossing free pass',num_items:${Number(value) || 1}});` : "";
  return (
    <Script id={`meta-pixel-${event ?? "view"}`} strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');fbq('track','PageView');${track}`}
    </Script>
  );
}
