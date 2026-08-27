import { homeHtml } from "../generated/site-html.mjs";

export const dynamic = "force-static";

export function GET() {
  return new Response(homeHtml, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
