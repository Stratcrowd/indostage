import { site } from "@/lib/site";
import { readPassToken } from "@/lib/pass-token";
import { passImage } from "../../../pass-image";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const pass = readPassToken(decodeURIComponent(token));
  if (!pass) return new Response("Pass not found", { status: 404 });
  return passImage(pass, `${site.url}/pass/v/${token}`);
}
