import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { TOOLS } from './seo/tools.mjs';
import { renderHome, renderDirectory, renderTool, renderSitemap, renderRobots } from './seo/render.mjs';

await rm("public", { recursive: true, force: true });
await rm("generated", { recursive: true, force: true });
await mkdir("public", { recursive: true });
await mkdir("generated", { recursive: true });

for (const file of [
  "styles.css",
  "catalog.js",
  "core-a.js",
  "core-b.js",
  "patch.js",
  "prism-1.js",
  "prism-2.js"
]) {
  await cp(file, `public/${file}`);
}
await cp("assets", "public/assets", { recursive: true });

const [homeSource, toolsSource] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("tools.html", "utf8")
]);

const homeHtml = renderHome(homeSource);
const toolsHtml = renderDirectory(toolsSource);
const toolPages = Object.fromEntries(TOOLS.map(tool => [tool.slug, renderTool(toolsSource, tool)]));

await writeFile('public/sitemap.xml', renderSitemap());
await writeFile('public/robots.txt', renderRobots());

await writeFile(
  "generated/site-html.mjs",
  `export const homeHtml = ${JSON.stringify(homeHtml)};\nexport const toolsHtml = ${JSON.stringify(toolsHtml)};\nexport const toolPages = ${JSON.stringify(toolPages)};\n`
);
