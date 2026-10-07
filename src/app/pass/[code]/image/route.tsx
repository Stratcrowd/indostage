import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { crossing, site } from "@/lib/site";
import { getPass, maskPhone } from "@/lib/passes";

// The pass as a 1080×1350 PNG, for saving to the phone gallery or sending on WhatsApp.
export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const pass = await getPass(decodeURIComponent(code).toUpperCase());
  if (!pass) return new Response("Pass not found", { status: 404 });

  const qr = await QRCode.toDataURL(`${site.url}/pass/${pass.code}`, {
    width: 520,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0c0806", light: "#f5ecdc" },
  });
  const gold = "#d6a54f";
  const muted = "#b8a78d";
  const label = { fontSize: 22, letterSpacing: 4, color: muted, textTransform: "uppercase" as const };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 40, background: "#0c0806", fontFamily: "sans-serif" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: `2px solid ${gold}`,
            borderRadius: 32,
            background: "linear-gradient(180deg, #2a0f0c 0%, #140e0a 45%, #140e0a 100%)",
            color: "#f5ecdc",
            padding: "56px 60px 0",
          }}
        >
          <div style={{ fontSize: 24, letterSpacing: 10, color: gold }}>FREE PASS · INDOSTAGE PRESENTS</div>
          <div style={{ marginTop: 24, fontSize: 84, fontWeight: 700, color: "#ecd09a", letterSpacing: 2 }}>RAVI CHARY</div>
          <div style={{ fontSize: 84, fontWeight: 700, color: gold, letterSpacing: 18, marginTop: -10 }}>CROSSING</div>
          <div style={{ marginTop: 20, fontSize: 30, color: "#f5ecdc" }}>
            {crossing.dateLabel} · {crossing.time}
          </div>
          <div style={{ marginTop: 6, fontSize: 28, color: muted }}>
            {crossing.venue}, {crossing.area}
          </div>

          <div style={{ marginTop: 44, width: "100%", borderTop: `3px dashed ${gold}66` }} />

          <div style={{ marginTop: 44, display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 440 }}>
              <div style={label}>Name</div>
              <div style={{ fontSize: 44, marginTop: 4, lineHeight: 1.15 }}>{pass.name}</div>
              <div style={{ ...label, marginTop: 30 }}>Admits</div>
              <div style={{ fontSize: 56, marginTop: 2, color: "#ecd09a", fontWeight: 700 }}>
                {pass.passes} {pass.passes === 1 ? "person" : "people"}
              </div>
              <div style={{ ...label, marginTop: 30 }}>Mobile</div>
              <div style={{ fontSize: 32, marginTop: 4 }}>{maskPhone(pass.phone)}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} width={340} height={340} style={{ borderRadius: 20, border: "8px solid #f5ecdc" }} alt="" />
              <div style={{ marginTop: 16, fontSize: 34, letterSpacing: 3, color: gold, fontFamily: "monospace" }}>{pass.code}</div>
            </div>
          </div>

          <div
            style={{
              marginTop: "auto",
              marginBottom: 0,
              width: "calc(100% + 120px)",
              display: "flex",
              justifyContent: "center",
              padding: "26px 0",
              background: "rgba(214,165,79,0.14)",
              borderRadius: "0 0 30px 30px",
              fontSize: 26,
              color: "#f5ecdc",
            }}
          >
            Show this pass at the entrance · Enquiries {crossing.enquiry}
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      headers: {
        "Content-Disposition": `attachment; filename="ravi-chary-crossing-pass-${pass.code}.png"`,
        "Cache-Control": "private, no-store",
      },
    },
  );
}
