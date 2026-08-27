import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const output = ".vercel/output";
const staticDir = `${output}/static`;

await rm(output, { recursive: true, force: true });
await mkdir(`${staticDir}/assets`, { recursive: true });

const rootFiles = [
  "index.html",
  "tools.html",
  "styles.css",
  "catalog.js",
  "core-a.js",
  "core-b.js",
  "patch.js",
  "prism-1.js",
  "prism-2.js"
];

for (const file of rootFiles) {
  await cp(file, `${staticDir}/${file}`);
}

await cp("assets", `${staticDir}/assets`, { recursive: true });

await writeFile(
  `${output}/config.json`,
  JSON.stringify({
    version: 3,
    routes: [
      { src: "/tools/?", dest: "/tools.html" },
      { handle: "filesystem" }
    ]
  }, null, 2) + "\n"
);
