// Renders public/og-image.png, the 1200×630 card every share of the site uses.
//
// `index.html` has pointed og:image and twitter:image at
// https://chumlab.com/og-image.png since the SEO step, and the file has never
// existed — so every link to the site has rendered as a bare text card. This
// draws it from the same tokens and fonts the site uses, rather than tracking a
// binary nobody can regenerate.
//
//   node scripts/build-og-image.mjs
import { writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public", "og-image.png");

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #050608;
    color: #edeff4;
    font-family: "Geist", system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 96px;
    position: relative;
    overflow: hidden;
  }
  /* The same single glow the hero allows itself, and nothing else. */
  .glow {
    position: absolute; top: -280px; right: -180px;
    width: 720px; height: 720px; border-radius: 50%;
    background: radial-gradient(circle, rgba(91,155,255,0.16) 0%, rgba(91,155,255,0) 70%);
  }
  .eyebrow {
    font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(237,239,244,0.45); margin-bottom: 28px;
  }
  h1 {
    font-family: "Space Grotesk", "Geist", sans-serif;
    font-size: 76px; font-weight: 500; line-height: 1.05; letter-spacing: -0.03em;
    max-width: 900px;
  }
  h1 em {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic; font-weight: 400; color: #5b9bff;
  }
  p {
    margin-top: 32px; font-size: 24px; line-height: 1.5; font-weight: 300;
    color: rgba(237,239,244,0.62); max-width: 760px;
  }
  .rule { margin-top: 48px; width: 96px; height: 1px; background: rgba(237,239,244,0.18); }
  .foot {
    margin-top: 28px; font-family: "Geist", monospace; font-size: 18px;
    color: rgba(237,239,244,0.45); letter-spacing: 0.02em;
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="eyebrow">React component library</div>
  <h1>Components that ship at the <em>speed</em> of thought.</h1>
  <p>30 accessible, themeable React components. One token system. MIT licensed.</p>
  <div class="rule"></div>
  <div class="foot">chumlab.com · npm i @chumlab/ui</div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
// The webfonts arrive after `networkidle` resolves the stylesheet but before
// the faces are applied; without this the card renders in the fallback stack.
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();

writeFileSync(OUT, png);
console.log(`✓ wrote public/og-image.png (${(png.length / 1024).toFixed(0)} KB, 1200×630)`);
