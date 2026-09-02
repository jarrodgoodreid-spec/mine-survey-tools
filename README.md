# Mine Survey Tools

Free, practical web calculators for Australian mine survey workflows.

## Included tools

- Australian coordinate conversion and local mine-grid transformation
- Prism movement monitoring with CSV/JXL import and movement graphs
- Bowditch traverse adjustment and levelling calculations
- Bearing, distance, chainage, offset, batter and slope calculations
- Drillhole toe, control comparison, polygon area and JXL extraction tools

## Deployment

This is a static Vercel site. Pushes to the connected `main` branch deploy automatically.

## Tool pages and search discovery

Each calculator has a dedicated `/tools/<slug>` page with initial-HTML instructions,
formulas, a worked example, limitations, canonical metadata and related-tool links.
The existing calculator code powers the interactive area. Old `/tools?tool=<key>`
links permanently redirect to the corresponding new page.

- Page content and route registry: `seo/tools.mjs`
- HTML generation: `seo/render.mjs` and `prepare-next.mjs`
- Local production build: `npm run vercel-build`
- Content checks: `node --test tests/seo.test.mjs`
- Sitemap: https://mine-survey-tools.vercel.app/sitemap.xml
- Robots file: https://mine-survey-tools.vercel.app/robots.txt

To request discovery, verify this site's URL-prefix property in Google Search Console
and submit `sitemap.xml` in Sitemaps. Google decides whether and when to index a page;
a successful build or sitemap submission does not guarantee inclusion or rankings.
Existing analytics and verification tags in the HTML templates are preserved.
