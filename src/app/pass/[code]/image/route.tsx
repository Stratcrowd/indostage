import { getPass } from "@/lib/passes";
import { passImage } from "@/lib/pass-image";

// The pass as a PNG, for saving to the phone gallery or sending on WhatsApp.
export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const pass = await getPass(decodeURIComponent(code).toUpperCase());
  if (!pass) return new Response("Pass not found", { status: 404 });
  return passImage(pass);
}
