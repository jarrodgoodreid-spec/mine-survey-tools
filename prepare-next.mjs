import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

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

const [homeHtml, toolsHtml] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("tools.html", "utf8")
]);

await writeFile(
  "generated/site-html.mjs",
  `export const homeHtml = ${JSON.stringify(homeHtml)};\nexport const toolsHtml = ${JSON.stringify(toolsHtml)};\n`
);
