import type { Tier } from "./passes-config";

// Look of each pass tier, shared by the pass page (/pass/[code]) and its downloadable image.
// General: the free pass. VIP: maroon invitation. VVIP: black-and-gold invitation, double frame.
export type PassTheme = {
  kicker: string;
  /** Large tier mark on invitations; none on the free pass. */
  badge: string | null;
  invite: boolean;
  bg: string;
  frame: string;
  accent: string;
  /** Second, inner frame line (VVIP only). */
  innerFrame: string | null;
  band: string;
};

export const passTheme: Record<Tier, PassTheme> = {
  general: {
    kicker: "Free Pass · IndoStage presents",
    badge: null,
    invite: false,
    bg: "linear-gradient(180deg, #2a0f0c 0%, #140e0a 45%, #140e0a 100%)",
    frame: "#d6a54f",
    accent: "#d6a54f",
    innerFrame: null,
    band: "rgba(214,165,79,0.14)",
  },
  vip: {
    kicker: "VIP Invitation · IndoStage presents",
    badge: "VIP",
    invite: true,
    bg: "linear-gradient(180deg, #5a1414 0%, #3a0d0d 50%, #210707 100%)",
    frame: "#e0b25c",
    accent: "#ecd09a",
    innerFrame: null,
    band: "rgba(224,178,92,0.18)",
  },
  vvip: {
    kicker: "Special Invitation · IndoStage presents",
    badge: "VVIP",
    invite: true,
    bg: "radial-gradient(ellipse at top, #3b2a12 0%, #120c06 55%, #050403 100%)",
    frame: "#f0c86a",
    accent: "#f5d98f",
    innerFrame: "rgba(240,200,106,0.55)",
    band: "linear-gradient(90deg, rgba(240,200,106,0.10), rgba(240,200,106,0.28), rgba(240,200,106,0.10))",
  },
};
