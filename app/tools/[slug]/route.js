import { toolPages } from '../../../generated/site-html.mjs';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(toolPages).map(slug => ({ slug }));
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const html = Object.hasOwn(toolPages, slug) ? toolPages[slug] : null;
  if (!html) return new Response('Calculator not found', { status: 404 });
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}
