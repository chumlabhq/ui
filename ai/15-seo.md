Implement SEO + Generative Engine Optimization (GEO) + Answer Engine Optimization (AEO) + Social Preview coverage across the entire site, with programmatic verification at every step.

This step does NOT trust LLM self-reports. Every claim of "PASS" requires actual evidence: a curl, a parser result, a validator call, or a rendered HTML inspection.

PHASE 0 — DISCOVERY (do this first, then PAUSE for approval before any edits):

1. Read framework type and metadata location (Next.js App Router / Pages / Vite / etc.)

2. Build a route manifest. Enumerate EVERY URL the site will serve and write it to /ai/route-manifest.json:

{
"generatedAt": "<ISO timestamp>",
"routes": [
{ "url": "/", "type": "homepage", "source": "<file path>" },
{ "url": "/components", "type": "catalog", "source": "<file>" },
{ "url": "/components/<slug>", "type": "component-doc", "source": "<file>", "componentName": "<name>" },
{ "url": "/blog", "type": "blog-listing", "source": "<file>" },
{ "url": "/blog/<slug>", "type": "blog-article", "source": "<file>", "title": "<title>" },
{ "url": "/faq", "type": "faq", "source": "<file>" },
...
],
"totals": {
"componentDocs": <count>,
"blogArticles": <count>,
"other": <count>
}
}

3. Cross-reference the route manifest against:
   - /ai/system-state.json `components` array (every component must have a doc route)
   - The blog articles directory (every MDX/markdown file must have a route)
   - The FAQ source data (the FAQ page must exist if data exists)

4. Audit existing social preview assets:
   - Check if /public/og-default.png exists. If yes, capture its dimensions and file size.
   - Check if a per-route OG image directory exists (typically /public/og/components/, /public/og/blog/).
   - Check if a per-route OG image generation system exists (typically a Next.js opengraph-image.tsx pattern, or a build-time script).

5. Report findings:
   - Route count
   - Existing OG asset count
   - Missing OG assets
   - Whether per-route OG generation exists or needs to be built

6. List all files you plan to create or modify.

7. STOP. Wait for explicit approval before proceeding to Phase 1.

PHASE 1 — CANONICAL ENTITY:

Use these EXACT strings everywhere:

| Field      | Value                                                                               |
| ---------- | ----------------------------------------------------------------------------------- |
| Name       | Chumlab                                                                             |
| Product    | Chumlab UI                                                                          |
| Package    | @chumlab/ui                                                                         |
| Homepage   | https://chumlab.com                                                                 |
| Repository | https://github.com/chumlab/ui                                                       |
| npm        | https://www.npmjs.com/package/@chumlab/ui                                           |
| License    | MIT                                                                                 |
| Tagline    | A free, open source React component library, built for people who care about craft. |
| Twitter    | @chumlab                                                                            |

Audit and align across:

- /package.json (name, description, homepage, repository, keywords, author)
- /README.md (H1, description block)
- All "About" mentions in marketing site
- All meta tags (og:site_name, twitter:site)

PHASE 2 — GLOBAL METADATA (root layout):

Apply to the framework's global metadata location:

```html
<title>Chumlab UI — Free, open source React component library</title>
<meta
  name="description"
  content="Chumlab UI is a free, open source React component library with 30+ accessible primitives, an AI playground that ships React from prompts, and one token system for any brand. MIT licensed. Built for craft."
/>
<meta
  name="keywords"
  content="react component library, react ui library, accessible react components, headless react components, react design system, open source react components, ai react playground, chumlab"
/>
<link rel="canonical" href="https://chumlab.com/" />

<meta
  name="robots"
  content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
/>
<html lang="en">
  <!-- Open Graph (Facebook, LinkedIn, WhatsApp, Telegram, Discord, Slack) -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Chumlab UI" />
  <meta
    property="og:title"
    content="Chumlab UI — Free, open source React component library"
  />
  <meta
    property="og:description"
    content="30+ accessible primitives, an AI playground, and one token system for any brand. MIT licensed."
  />
  <meta property="og:url" content="https://chumlab.com/" />
  <meta property="og:image" content="https://chumlab.com/og-default.png" />
  <meta
    property="og:image:secure_url"
    content="https://chumlab.com/og-default.png"
  />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta
    property="og:image:alt"
    content="Chumlab UI — a React component library, built for craft"
  />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@chumlab" />
  <meta name="twitter:creator" content="@chumlab" />
  <meta
    name="twitter:title"
    content="Chumlab UI — Free, open source React component library"
  />
  <meta
    name="twitter:description"
    content="30+ accessible primitives, an AI playground, and one token system for any brand."
  />
  <meta name="twitter:image" content="https://chumlab.com/og-default.png" />
  <meta
    name="twitter:image:alt"
    content="Chumlab UI — a React component library, built for craft"
  />

  <!-- iMessage / Pinterest fallback (square) -->
  <meta
    property="og:image"
    content="https://chumlab.com/og-default-square.png"
  />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1200" />
  <meta property="og:image:alt" content="Chumlab UI" />

  <meta name="theme-color" content="#050608" />
</html>
```

DO NOT include geo.region, geo.position, geo.placename, ICBM, or hreflang (unless multi-language docs exist).

PHASE 3 — JSON-LD ON HOMEPAGE:

Inject 4 JSON-LD scripts on the homepage:

[Organization, SoftwareApplication, WebSite (with SearchAction), and FAQPage parsed from the FAQ section component, NOT hardcoded — full schemas as previously specified]

After injection, validate:

curl -s https://chumlab.com/ | grep -A 200 'application/ld+json' | jq .

For each script: valid JSON, required fields present, no placeholder values remaining ("<package.json version>" must be replaced with actual version, etc.).

If validation fails for any script: STOP, log the failure, do not mark step complete.

PHASE 4 — PER-ROUTE METADATA (programmatic SEO):

For every route in /ai/route-manifest.json that is type "component-doc" or "blog-article", generate:

A. Title: unique per route, 50-60 chars

B. Description: unique per route, 120-160 chars

C. Canonical URL: matches the route's url field exactly

D. Open Graph and Twitter tags: title and description match the meta tags above; og:image and twitter:image point to the per-route image (defined in Phase 5)

E. JSON-LD:

- Component pages: TechArticle (per the existing pattern)
- Blog articles: Article (with author, datePublished, dateModified, headline, image, articleBody)

F. H-tag structure (mandatory):

- Component pages: H1 = "<Component> — Chumlab UI", followed by definitional sentence, then H2s as specced
- Blog articles: H1 = article title, then H2/H3 hierarchy from the article content

After generating, run programmatic checks:

CHECK 4.1 — Title uniqueness across all routes
CHECK 4.2 — Title length 50-60 chars
CHECK 4.3 — Description uniqueness across all routes
CHECK 4.4 — Description length 120-160 chars
CHECK 4.5 — Canonical URL matches route URL exactly
CHECK 4.6 — Exactly ONE H1 per page, non-empty, matches expected pattern
CHECK 4.7 — H-tag hierarchy with no level skipping
CHECK 4.8 — JSON-LD validity per route (parse, validate against schema.org)
CHECK 4.9 — No template placeholders in rendered HTML ("<Component>", "<slug>", "TODO", "FIXME")

PHASE 5 — SOCIAL PREVIEW IMAGES (per-route, multi-platform):

This phase ensures every shareable URL on the site produces a branded preview on every social platform.

5.1 — DEFAULT OG IMAGES (homepage / fallback):

Create or verify the following files exist at /public/:

A. /public/og-default.png

- Dimensions: 1200 × 630 px
- File size: ≤ 250KB (CRITICAL — WhatsApp drops images over ~300KB)
- Format: PNG (Twitter and Facebook prefer PNG over JPG for branded content)
- Content: Chumlab logo, tagline, accent color background (#5b9bff), wordmark
- Used as: og:image fallback, twitter:image fallback

B. /public/og-default-square.png

- Dimensions: 1200 × 1200 px
- File size: ≤ 300KB
- Format: PNG
- Used as: iMessage / square social preview fallback

C. /public/og-default-portrait.png (Pinterest)

- Dimensions: 1000 × 1500 px
- File size: ≤ 400KB
- Format: PNG
- Used as: Pinterest preview fallback

If any of these files does not exist, generate them. Use a static design tool (Figma export) OR a programmatic generator (described in Phase 5.3).

5.2 — PER-ROUTE OG IMAGE STRATEGY:

Three strategies, in order of preference. Use whichever the framework supports:

STRATEGY A — Next.js opengraph-image (PREFERRED for Next.js App Router):

For each route directory, add an opengraph-image.tsx file that uses ImageResponse to generate the OG image at request time.

Example for /app/blog/[slug]/opengraph-image.tsx:

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chumlab UI blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  return new ImageResponse(
    <div
      style={{
        background: "#050608",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 60,
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div
        style={{
          color: "#5b9bff",
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {article.category}
      </div>
      <div
        style={{
          color: "#edeff4",
          fontSize: 64,
          fontWeight: 500,
          lineHeight: 1.05,
          marginTop: 20,
          maxWidth: 1000,
        }}
      >
        {article.title}
      </div>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ color: "#edeff4", fontWeight: 600, fontSize: 24 }}>
          Chumlab
        </div>
        <div style={{ color: "#edeff4", opacity: 0.5, fontSize: 18 }}>
          chumlab.com
        </div>
      </div>
    </div>,
    { ...size },
  );
}
```

Apply the same pattern to:

- /app/components/[slug]/opengraph-image.tsx (component name + description + tagline)
- /app/blog/[slug]/opengraph-image.tsx (article title + category + author)
- /app/page.tsx — already covered by /app/opengraph-image.tsx

Each generator uses the route's own data (article title, component name, etc.) so the preview is genuinely route-specific.

STRATEGY B — Build-time generation (for non-Next frameworks):

Use a Node script that generates a PNG per route at build time:

- Read /ai/route-manifest.json
- For each route, render an HTML template to PNG using puppeteer or playwright
- Save to /public/og/<route-type>/<slug>.png
- Reference the saved file in the route's og:image meta tag

STRATEGY C — Static-only (last resort):

For sites with few routes, design each OG image manually in Figma and export to /public/og/. Only acceptable if the site has < 20 routes.

5.3 — IMAGE OPTIMIZATION (mandatory for all OG images):

Every generated OG image MUST be optimized:

- Run through pngquant or sharp with quality 80-90 to reduce file size
- Verify file size ≤ 250KB (250000 bytes) — this is the WhatsApp threshold
- Verify dimensions are exactly 1200×630 (landscape) or 1200×1200 (square)

Use the following Node check:

```js
const { statSync } = require("fs");
const { sizeOf } = require("image-size");

function verifyOgImage(path) {
  const stats = statSync(path);
  const dim = sizeOf(path);
  if (stats.size > 250000)
    throw new Error(`${path}: ${stats.size} bytes exceeds 250KB`);
  if (dim.width !== 1200)
    throw new Error(`${path}: width ${dim.width} != 1200`);
  if (dim.height !== 630 && dim.height !== 1200)
    throw new Error(`${path}: height ${dim.height} != 630 or 1200`);
}
```

Run for every OG image in /public/og/. Any failure is a step failure.

5.4 — PER-ROUTE OG TAG INJECTION:

For every route, the rendered HTML must include:

- og:image pointing to the route's specific image (not the default, unless this is the homepage)
- twitter:image pointing to the same image (Twitter requires its own tag even when og:image is set)
- og:image:width = 1200
- og:image:height = 630
- og:image:alt = route-specific (article title for blog, component name for component docs)
- twitter:image:alt = same as og:image:alt

  5.5 — VERIFICATION ACROSS PLATFORMS:

For 5 representative routes (homepage, 1 component doc, 1 blog article, /faq, /components), run the following platform-specific validators:

CHECK 5.5.1 — Facebook Sharing Debugger:
URL: https://developers.facebook.com/tools/debug/
Expected: Image renders at 1200×630, no warnings about size or aspect ratio.
Document the result for each route. Failures are STEP FAILURES.

CHECK 5.5.2 — Twitter Card Validator:
Note: Twitter retired the public Card Validator in 2023. Use the Twitter Embed page or post a test tweet (delete after) to verify the card renders as `summary_large_image`. Document the result.

CHECK 5.5.3 — LinkedIn Post Inspector:
URL: https://www.linkedin.com/post-inspector/
Expected: Image renders at 1200×627, title and description correct.
Document the result for each route. Failures are STEP FAILURES.

CHECK 5.5.4 — WhatsApp test:
WhatsApp has no public validator. Test manually by:

- Sending the URL to yourself in WhatsApp (Web or Desktop)
- Verifying the preview shows the image, title, and description
- If no preview appears: file size is over 300KB OR meta tags are missing OR caching needs to clear (try a fresh URL with ?v=1 cache buster)
  Document the result for each route.

CHECK 5.5.5 — iMessage test:
Send the URL via iMessage. Verify the preview shows the square OG image (or large landscape if site doesn't have square fallback). Document the result.

CHECK 5.5.6 — Programmatic OG check:
For each route, fetch the rendered HTML and parse meta tags:

```bash
curl -s https://chumlab.com/blog/some-article | grep -E 'og:|twitter:'
```

Verify:

- og:image is reachable (HEAD request returns 200)
- og:image:width and og:image:height present
- twitter:card is "summary_large_image"
- twitter:image is reachable
- Both image URLs use https (not http)
- Both image URLs are absolute (not relative)

CHECK 5.5.7 — Image accessibility:
For each og:image and twitter:image URL, perform a HEAD request. Verify:

- Status 200
- Content-Type: image/png or image/jpeg
- Content-Length within size limits
- CDN or cache headers set appropriately

PHASE 6 — /llms.txt:

[paste the existing llms.txt content from the original prompt, unchanged]

After creation, verify:

- File exists at /public/llms.txt
- File served at https://chumlab.com/llms.txt with content-type: text/plain
- File contains all canonical entity strings from Phase 1
- File is under 8000 characters

PHASE 7 — /sitemap.xml:

Generate dynamically using /ai/route-manifest.json as the SOURCE OF TRUTH.

For every route in the manifest, emit a <url> entry with:

- <loc>: the full URL
- <lastmod>: ISO date from the source file's last git commit
- <changefreq>: per route type
- <priority>: per route type

For images, ALSO include:

- <image:image> sub-entries pointing to the route's OG image
- This helps Google index your social preview images

CHECK 7.1 — Route coverage (sitemap entries match manifest exactly)
CHECK 7.2 — Valid XML (parse with XML parser)
CHECK 7.3 — All URLs return 200 (HEAD request per <loc>)
CHECK 7.4 — All <lastmod> are valid ISO 8601
CHECK 7.5 — Image extension declarations present in the sitemap header

PHASE 8 — /robots.txt:

[paste the existing robots.txt content from the original prompt, unchanged]

PHASE 9 — INTERNAL LINKING AUDIT:

Build a graph of internal links across the site.

CHECK 9.1 — No broken internal links (every internal href resolves)
CHECK 9.2 — No orphan pages (every non-homepage route has at least 1 incoming link)
CHECK 9.3 — Anchor text quality (flag generic patterns like "click here", "read more")
CHECK 9.4 — Component cross-references (every component doc links to ≥ 2 related components)

PHASE 10 — IMAGE / OG ASSET COVERAGE (final check):

CHECK 10.1 — Default OG images exist:

- /public/og-default.png (1200×630, ≤ 250KB)
- /public/og-default-square.png (1200×1200, ≤ 300KB)

CHECK 10.2 — Per-component OG images exist for every component:
For every entry in /ai/route-manifest.json with type "component-doc", verify the OG image is reachable and meets size/dimension requirements.

CHECK 10.3 — Per-blog OG images exist for every article:
Same as above for blog articles.

CHECK 10.4 — Image alt text coverage:
For every <img> element in rendered HTML, verify non-empty alt attribute (or role="presentation" / aria-hidden="true" for decorative).

CHECK 10.5 — Favicons:

- /favicon.ico (multi-resolution, 16+32+48px)
- /apple-touch-icon.png (180×180)
- /icon-192.png (192×192, for Android home screen)
- /icon-512.png (512×512, for PWA)
- /manifest.json (web app manifest with icons defined)

CHECK 10.6 — Image MIME types:
For every OG/twitter image, the og:image:type meta tag matches the actual file type. PNG files declare image/png, not image/jpeg.

PHASE 11 — LIGHTHOUSE AUDIT (programmatic):

Run Lighthouse against homepage and 3 representative routes:

```bash
npx lighthouse https://chumlab.com --output=json --quiet --chrome-flags="--headless"
```

CHECK 11.1 — SEO score per route ≥ 100
CHECK 11.2 — Accessibility ≥ 95
CHECK 11.3 — No "Document does not have a meta description" warnings
CHECK 11.4 — No "Document doesn't have a <title> element" warnings
CHECK 11.5 — No "Links don't have a discernible name" warnings
CHECK 11.6 — No "Image elements do not have explicit width and height" warnings (impacts LCP and OG indexing)

PHASE 12 — SCHEMA.ORG VALIDATION:

For each unique JSON-LD script across the site, validate against schema.org via:

- https://validator.schema.org/ (manual)
- OR programmatic via a schema.org validator library

Every script must have ZERO errors.

PHASE 13 — FINAL VERIFICATION REPORT:

Produce a single report at /ai/seo-verification-report.json:

```json
{
  "timestamp": "<ISO>",
  "routes": {
    "totalInManifest": <count>,
    "totalWithMetadata": <count>,
    "totalInSitemap": <count>,
    "missingMetadata": [],
    "missingFromSitemap": [],
    "200Responses": <count>,
    "non200Responses": []
  },
  "metadata": {
    "uniqueTitles": <bool>,
    "titleLengthCompliance": "<count>/<total>",
    "uniqueDescriptions": <bool>,
    "descriptionLengthCompliance": "<count>/<total>",
    "canonicalCoverage": "<count>/<total>"
  },
  "structuredData": {
    "homepageJsonLd": <count>,
    "perRouteJsonLd": <count>,
    "schemaValidation": {
      "valid": <count>,
      "errors": []
    }
  },
  "socialPreviews": {
    "defaultLandscape": { "exists": <bool>, "size": "<bytes>", "dimensions": "1200x630" },
    "defaultSquare": { "exists": <bool>, "size": "<bytes>", "dimensions": "1200x1200" },
    "perRouteCoverage": "<count>/<total>",
    "oversizedImages": [],
    "facebook": { "tested": <bool>, "result": "PASS | FAIL", "notes": "..." },
    "linkedin": { "tested": <bool>, "result": "PASS | FAIL", "notes": "..." },
    "twitter": { "tested": <bool>, "result": "PASS | FAIL", "notes": "..." },
    "whatsapp": { "tested": <bool>, "result": "PASS | FAIL", "notes": "..." },
    "imessage": { "tested": <bool>, "result": "PASS | FAIL", "notes": "..." }
  },
  "files": {
    "llmsTxt": "<created | exists>",
    "sitemap": "<created | updated>",
    "robotsTxt": "<created | exists>",
    "favicon": "<exists | missing>",
    "appleTouchIcon": "<exists | missing>",
    "manifest": "<exists | missing>"
  },
  "internalLinks": {
    "brokenLinks": [],
    "orphanPages": [],
    "genericAnchors": <count>
  },
  "lighthouse": {
    "homepage": { "seo": <score>, "a11y": <score>, "perf": <score>, "bp": <score> },
    "componentDoc": { ... },
    "blogArticle": { ... },
    "faq": { ... }
  },
  "verdict": "PASS | FAIL",
  "failures": []
}
```

PHASE 14 — STATE UPDATE:

In /ai/system-state.json:

- pipeline.currentStep = 15
- validation.seo = "PASS" only if /ai/seo-verification-report.json verdict is "PASS"
- coverage.seo = { routes: <count>, jsonLd: <count>, lighthouseSeo: <score>, internalLinks: <count>, socialPreviews: "<count>/<total>" }

ACCEPTANCE CRITERIA:

- /ai/route-manifest.json exists and includes every site route
- Every route has unique title, unique description, canonical URL
- Every route has og:image and twitter:image meta tags pointing to a reachable, dimension-correct, size-compliant image
- Default OG images exist at /public/og-default.png (1200×630, ≤ 250KB) and /public/og-default-square.png (1200×1200, ≤ 300KB)
- Per-component and per-blog OG images exist for every route
- Every component doc has TechArticle JSON-LD
- Every blog article has Article JSON-LD
- Homepage has 4 valid JSON-LD scripts
- llms.txt, sitemap.xml, robots.txt all exist and serve correctly
- Sitemap contains every route from manifest
- Every URL in sitemap returns 200
- Favicon, apple-touch-icon, manifest.json all exist
- Every internal link resolves
- Every <img> has alt text
- Lighthouse SEO = 100 on all sampled routes
- Schema.org validator returns zero errors on all JSON-LD
- Facebook, LinkedIn, Twitter, WhatsApp, iMessage previews all render correctly on the 5 sample routes
- /ai/seo-verification-report.json verdict is "PASS"

PASS only if every criterion above holds. Any failure → set pipeline.status = FAIL, log specific failures in pipeline.failureReason, STOP.

CONSTRAINTS:

- Do NOT trust LLM self-reports. Every check must produce verifiable output.
- Do NOT add geo.region, geo.position, geo.placename, ICBM, or hreflang
- Do NOT keyword-stuff (keywords meta ≤ 12 terms)
- Do NOT fabricate ratings, reviews, or aggregateRating
- Do NOT modify existing section markup beyond what's needed for metadata injection
- Do NOT block AI bots in robots.txt
- Do NOT skip Phase 0 — the route manifest is the source of truth for all subsequent phases
- Do NOT generate OG images larger than 250KB (WhatsApp threshold)
- Do NOT use relative URLs in og:image or twitter:image — always absolute https URLs
- Do NOT skip the Twitter card meta tags even when og tags are set — Twitter requires its own
- Do NOT publish if /ai/seo-verification-report.json verdict is FAIL
- Do not run git commands, do not commit. Just make the file changes and run the verification.
