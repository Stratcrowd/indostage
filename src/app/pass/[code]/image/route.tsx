import { site } from "@/lib/site";
import { getPass } from "@/lib/passes";
import { passImage } from "../../pass-image";

export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const pass = await getPass(decodeURIComponent(code).toUpperCase());
  if (!pass) return new Response("Pass not found", { status: 404 });
  return passImage({ ...pass, type: "general" }, `${site.url}/pass/${pass.code}`);
}
