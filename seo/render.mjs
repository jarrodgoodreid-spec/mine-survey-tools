import { TOOLS, SITE_URL, toolPath, byKey } from './tools.mjs';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const jsonForHtml = value => JSON.stringify(value).replace(/</g, '\\u003c');

function metadata(html, { title, description, path, graph }) {
  const url = SITE_URL + path;
  // Retain unrelated head markup, including verification and tracking tags.
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)} | Mine Survey Tools</title>`)
    .replace(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/gi, '')
    .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '')
    .replace('</head>', `<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Mine Survey Tools">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">${jsonForHtml({'@context':'https://schema.org','@graph':graph})}</script>
</head>`);
}

function pageGraph(title, description, path) {
  return {'@type':'WebPage','@id':SITE_URL+path+'#webpage',url:SITE_URL+path,name:title,description,inLanguage:'en-AU',isPartOf:{'@id':SITE_URL+'/#website'}};
}

function breadcrumbs(tool) {
  const items = [{ name:'Home', item:SITE_URL+'/' },{name:'All tools',item:SITE_URL+'/tools'}];
  if (tool) items.push({name:tool.title,item:SITE_URL+toolPath(tool)});
  return {'@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,...item}))};
}

function commonToolAssets(html) {
  // catalog.js already contains the complete catalogue. The older second catalogue
  // redeclared its top-level const bindings and failed in every classic-script scope.
  return html
    .replace('<script src="/assets/catalog-full.js"></script>', '')
    .replace(/<script>window\.addEventListener\('load',\(\)=>\{const k=new URLSearchParams\(location\.search\)[\s\S]*?<\/script>/, '')
    .replace('</head>', '<link rel="stylesheet" href="/assets/tool-pages.css"></head>')
    .replace('</body>', '<script src="/assets/tool-pages.js"></script></body>');
}

export function renderHome(source) {
  let html = source;
  for (const tool of TOOLS) {
    html = html.replaceAll(`href="/tools?tool=${tool.key}"`, `href="${toolPath(tool)}"`);
    html = html.replaceAll(`"key":"${tool.key}"`, `"key":"${tool.key}","slug":"${tool.slug}"`);
  }
  html = html.replaceAll("/tools?tool='+encodeURIComponent(t.key)+'", "/tools/'+encodeURIComponent(t.slug)+'");
  return metadata(html, {
    title:'Free Australian Mine Survey Calculators',
    description:'Free mine survey calculators for Australian coordinates, prism monitoring, Bowditch traverses, levelling, batters and polygon area. Browse 18 practical tools.',
    path:'/', graph:[{'@type':'WebSite','@id':SITE_URL+'/#website',url:SITE_URL+'/',name:'Mine Survey Tools',inLanguage:'en-AU'},pageGraph('Mine Survey Tools','Free practical calculators for mine survey workflows.','/')]
  });
}

function toolCard(tool) {
  return `<a class="toolCard seoToolCard" href="${toolPath(tool)}"><span class="seoCategory">${escapeHtml(tool.category)}</span><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><span class="open">Open calculator →</span></a>`;
}

export function renderDirectory(source) {
  let html = commonToolAssets(source)
    .replace(/<h1>[\s\S]*?<\/h1>/i, '<h1>Free mine survey calculators</h1>')
    .replace('<div class="toolGrid" id="toolGrid"></div>', `<nav class="toolGrid" id="toolDirectory" aria-label="All survey calculators">${TOOLS.map(toolCard).join('')}</nav><div id="toolGrid" hidden></div>`);
  return metadata(html, {title:'All Survey Calculators',description:'Browse 18 free survey tools: coordinates, bearings, Bowditch, levelling, prism monitoring, JXL extraction, batters, slopes and polygon area.',path:'/tools',graph:[pageGraph('All Survey Calculators','Browse all Mine Survey Tools calculators.','/tools'),breadcrumbs()]});
}

export function renderTool(source, tool) {
  const path = toolPath(tool);
  const related = tool.related.map(byKey).filter(Boolean);
  const main = `<main class="toolPage">
<div class="shell">
  <nav class="seoBreadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/tools">All tools</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(tool.title)}</span></nav>
  <header class="seoHeading"><p class="seoCategory">${escapeHtml(tool.category)}</p><h1>${escapeHtml(tool.title)}</h1><p>${escapeHtml(tool.intro)}</p></header>
  <section id="calculator" aria-label="Interactive calculator">
    <div id="toolGrid" hidden></div>
    <div id="calcArea"><p id="calculatorStatus" role="status">Loading calculator…</p></div>
    <noscript><p>This calculator needs JavaScript for interactive results. The instructions, formula and worked example below remain available without JavaScript.</p></noscript>
  </section>
  <article class="seoGuide" aria-label="Calculator instructions">
    <section><h2>How to use this calculator</h2><ol>${tool.steps.map(step=>`<li>${escapeHtml(step)}</li>`).join('')}</ol></section>
    <section><h2>Formula and conventions</h2><pre class="seoFormula">${escapeHtml(tool.formula)}</pre></section>
    <section><h2>Worked example</h2><p>${escapeHtml(tool.example)}</p><p class="seoExampleNote">This is a separate worked example; enter its values to reproduce the result. The calculator may initially show different demonstration data.</p></section>
    <section><h2>Checks and limitations</h2><p>${escapeHtml(tool.caution)}</p><p>Independently check critical results against known data, approved software and the requirements for your survey.</p></section>
  </article>
  <section class="seoRelated"><h2>Related survey tools</h2><nav aria-label="Related calculators">${related.map(item=>`<a href="${toolPath(item)}">${escapeHtml(item.title)}</a>`).join('')}</nav></section>
</div>
</main>`;
  let html = commonToolAssets(source)
    .replace(/<body([^>]*)>/i, `<body$1 data-tool-key="${tool.key}">`)
    .replace(/<main>[\s\S]*?<\/main>/i, main);
  html = metadata(html, {title:tool.title,description:tool.description,path,graph:[pageGraph(tool.title,tool.description,path),breadcrumbs(tool)]});
  // The original navigation points to page-local sections absent on dedicated pages.
  return html.replace('href="#tools"','href="/tools"').replace('href="#about"','href="/tools#about"');
}

export function renderSitemap() {
  const urls = ['/', '/tools', ...TOOLS.map(toolPath)];
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(path=>`  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n') + '\n</urlset>\n';
}

export const renderRobots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
