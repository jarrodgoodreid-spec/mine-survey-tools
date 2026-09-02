import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { TOOLS, SITE_URL, toolPath, byKey, bySlug } from '../seo/tools.mjs';
import { renderHome, renderDirectory, renderTool, renderSitemap, renderRobots } from '../seo/render.mjs';
import config from '../next.config.mjs';

const homeSource = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const toolsSource = await readFile(new URL('../tools.html', import.meta.url), 'utf8');
const home = renderHome(homeSource);
const directory = renderDirectory(toolsSource);
const pages = TOOLS.map(tool => ({ tool, html: renderTool(toolsSource, tool) }));

test('all 18 existing tools have unique, valid routes and related tools', () => {
  assert.equal(TOOLS.length, 18);
  for (const field of ['key', 'slug', 'title', 'description']) assert.equal(new Set(TOOLS.map(t => t[field])).size, 18);
  for (const tool of TOOLS) {
    assert.match(tool.slug, /^[a-z]+(?:-[a-z]+)*$/);
    assert.equal(byKey(tool.key), tool);
    assert.equal(bySlug(tool.slug), tool);
    assert.equal(tool.steps.length, 3);
    for (const key of tool.related) {
      assert.ok(byKey(key), `Missing related tool: ${key}`);
      assert.notEqual(key, tool.key);
    }
  }
});

test('each tool has its own server-rendered title, content, canonical and breadcrumbs', () => {
  for (const { tool, html } of pages) {
    assert.ok(html.includes(`<title>${tool.title} | Mine Survey Tools</title>`), tool.key);
    assert.ok(html.includes(`<h1>${tool.title}</h1>`), tool.key);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE_URL}${toolPath(tool)}">`));
    assert.equal((html.match(/name="description"/g) || []).length, 1);
    for (const heading of ['How to use this calculator', 'Formula and conventions', 'Worked example', 'Checks and limitations']) assert.ok(html.includes(heading));
    assert.ok(html.includes('data-tool-key="' + tool.key + '"'));
    assert.ok(html.includes('<div id="toolGrid" hidden></div>'));
    assert.ok(!html.includes('noindex'));
    assert.ok(!html.includes('src="/assets/catalog-full.js"'));
    assert.ok(!html.includes("new URLSearchParams(location.search).get('tool')"));
    assert.ok(!html.includes('href="#tools"'));
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    assert.equal(graphs.length, 1);
    const graph = graphs[0]['@graph'];
    assert.equal(graph[0].url, SITE_URL + toolPath(tool));
    assert.equal(graph[1]['@type'], 'BreadcrumbList');
    assert.equal(graph[1].itemListElement[2].item, SITE_URL + toolPath(tool));
  }
});

test('home and directory expose ordinary crawlable links to every calculator', () => {
  for (const tool of TOOLS) {
    assert.ok(home.includes(`href="${toolPath(tool)}"`), 'Home: ' + tool.key);
    assert.ok(directory.includes(`href="${toolPath(tool)}"`), 'Directory: ' + tool.key);
    assert.ok(home.includes(`"slug":"${tool.slug}"`));
  }
  assert.ok(!home.includes('/tools?tool='));
  assert.ok(home.includes("/tools/'+encodeURIComponent(t.slug)+'"));
  assert.ok(directory.includes('aria-label="All survey calculators"'));
});

test('sitemap and robots list exactly the canonical public pages', () => {
  const urls = [...renderSitemap().matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(urls, ['/', '/tools', ...TOOLS.map(toolPath)].map(path => SITE_URL + path));
  assert.equal(new Set(urls).size, 20);
  assert.ok(renderRobots().includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
  assert.ok(renderRobots().includes('Allow: /'));
  assert.ok(!renderRobots().includes('Disallow: /'));
});

test('old shared query links have permanent redirects to the matching tool', async () => {
  const redirects = await config.redirects();
  assert.equal(redirects.length, 18);
  for (const tool of TOOLS) {
    const redirect = redirects.find(r => r.has[0].value === tool.key);
    assert.deepEqual(redirect, {source:'/tools', has:[{type:'query',key:'tool',value:tool.key}], destination:toolPath(tool), permanent:true});
  }
});

test('unrelated verification and tracking head markup is preserved', () => {
  const sentinel = '<meta name="google-site-verification" content="test-verification"><script defer src="/existing-tracking.js"></script>';
  for (const [source, render] of [[homeSource, renderHome], [toolsSource, renderDirectory], [toolsSource, html => renderTool(html, TOOLS[0])]]) {
    assert.ok(render(source.replace('</head>', sentinel + '</head>')).includes(sentinel));
  }
});

test('all local stylesheet and script dependencies exist', async () => {
  const paths = new Set();
  for (const html of [home, directory, ...pages.map(p => p.html)]) {
    for (const match of html.matchAll(/(?:src|href)="(\/[^"?]+\.(?:js|css))"/g)) paths.add(match[1]);
  }
  for (const path of paths) await access(new URL('..' + path, import.meta.url));
});
