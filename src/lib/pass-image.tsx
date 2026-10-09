import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { crossing, site } from "@/lib/site";
import { maskPhone, type Pass } from "@/lib/passes";
import { tierInfo } from "@/lib/passes-config";
import { passTheme } from "@/lib/pass-theme";

// The pass as a 1080×1350 PNG, in the look of its tier (src/lib/pass-theme.ts).
// Rendered by next/og (Satori): every element with several children needs display:flex, and text
// with {variables} must be one template string. calc() is not supported.
export async function passImage(pass: Pass) {
  const t = passTheme[pass.tier];
  const qr = await QRCode.toDataURL(`${site.url}/pass/${pass.code}`, {
    width: 520,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0c0806", light: "#f5ecdc" },
  });
  const muted = "#b8a78d";
  const ivory = "#f5ecdc";
  const label = { fontSize: 22, letterSpacing: 4, color: muted, textTransform: "uppercase" as const };
  const admits = `${pass.passes} ${pass.passes === 1 ? "person" : "people"}`;

  const details = t.invite ? (
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ fontSize: 34, fontStyle: "italic", color: muted }}>IndoStage cordially invites</div>
      <div style={{ marginTop: 16, fontSize: 66, color: ivory, textAlign: "center", lineHeight: 1.1 }}>{pass.name}</div>
      {pass.title ? <div style={{ marginTop: 10, fontSize: 30, color: muted, textAlign: "center" }}>{pass.title}</div> : null}
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 48 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} width={280} height={280} style={{ borderRadius: 18, border: `8px solid ${ivory}` }} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={label}>Admits</div>
          <div style={{ fontSize: 56, color: t.accent, fontWeight: 700 }}>{admits}</div>
          <div style={{ ...label, marginTop: 24 }}>Pass No.</div>
          <div style={{ fontSize: 32, letterSpacing: 3, color: t.accent }}>{pass.code}</div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ marginTop: 44, display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 440 }}>
        <div style={label}>Name</div>
        <div style={{ fontSize: 44, marginTop: 4, lineHeight: 1.15 }}>{pass.name}</div>
        <div style={{ ...label, marginTop: 30 }}>Admits</div>
        <div style={{ fontSize: 56, marginTop: 2, color: "#ecd09a", fontWeight: 700 }}>{admits}</div>
        {pass.phone ? <div style={{ ...label, marginTop: 30 }}>Mobile</div> : null}
        {pass.phone ? <div style={{ fontSize: 32, marginTop: 4 }}>{maskPhone(pass.phone)}</div> : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} width={340} height={340} style={{ borderRadius: 20, border: `8px solid ${ivory}` }} alt="" />
        <div style={{ marginTop: 16, fontSize: 34, letterSpacing: 3, color: t.accent }}>{pass.code}</div>
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 40, background: "#0c0806", fontFamily: "sans-serif" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: `${t.innerFrame ? 4 : 2}px solid ${t.frame}`,
            borderRadius: 32,
            background: t.bg,
            color: ivory,
            padding: "52px 60px 0",
            position: "relative",
          }}
        >
          {t.innerFrame ? (
            <div style={{ position: "absolute", top: 14, left: 14, right: 14, bottom: 14, border: `2px solid ${t.innerFrame}`, borderRadius: 22, display: "flex" }} />
          ) : null}
          <div style={{ fontSize: 22, letterSpacing: 8, color: t.accent, textTransform: "uppercase" }}>{t.kicker}</div>
          {t.badge ? (
            <div
              style={{
                marginTop: 26,
                display: "flex",
                padding: "6px 40px",
                border: `3px solid ${t.frame}`,
                borderRadius: 999,
                fontSize: 54,
                fontWeight: 700,
                letterSpacing: 18,
                color: t.accent,
              }}
            >
              {t.badge}
            </div>
          ) : null}
          <div style={{ marginTop: t.badge ? 22 : 24, fontSize: t.badge ? 72 : 84, fontWeight: 700, color: "#ecd09a", letterSpacing: 2 }}>
            RAVI CHARY
          </div>
          <div style={{ fontSize: t.badge ? 72 : 84, fontWeight: 700, color: t.frame, letterSpacing: 18, marginTop: -10 }}>CROSSING</div>
          <div style={{ marginTop: 18, fontSize: 30, color: ivory }}>{`${crossing.dateLabel} · ${crossing.time}`}</div>
          <div style={{ marginTop: 6, fontSize: 28, color: muted }}>{`${crossing.venue}, ${crossing.area}`}</div>

          <div style={{ marginTop: 36, width: "100%", borderTop: `3px dashed ${t.frame}66` }} />

          {details}

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {t.invite ? null : <div style={{ fontSize: 26, color: muted }}>{`With special guest ${crossing.guest.name}`}</div>}
            <div style={{ marginTop: 14, fontSize: 24, letterSpacing: 3, color: t.accent }}>
              {`IN MEMORY OF ${crossing.tribute.name.toUpperCase()}`}
            </div>
            <div style={{ marginTop: 6, fontSize: 22, letterSpacing: 3, color: muted }}>
              {`${crossing.tribute.centenary.toUpperCase()} · ${crossing.tribute.years}`}
            </div>
          </div>

          <div
            style={{
              marginTop: 36,
              // The card has 60px side padding; pull the footer band out to its edges.
              alignSelf: "stretch",
              marginLeft: -60,
              marginRight: -60,
              display: "flex",
              justifyContent: "center",
              padding: "26px 0",
              background: t.band,
              borderRadius: "0 0 30px 30px",
              fontSize: 26,
              color: ivory,
            }}
          >
            {`${tierInfo[pass.tier].seating} · Enquiries ${crossing.enquiry}`}
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      headers: {
        "Content-Disposition": `attachment; filename="ravi-chary-crossing-${pass.tier}-${pass.code}.png"`,
        "Cache-Control": "private, no-store",
      },
    },
  );
}
