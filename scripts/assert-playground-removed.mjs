// The playground is off the site (docs/playground-removal.md) and has to stay
// off. The standard it was removed to was "a visitor, a crawler and a bundle
// inspector all find nothing", so this checks all three against the built site
// rather than against the source:
//
//   1. no `playground` or `chumlab.ai` in any built file, case-insensitively
//   2. no preview-iframe artefacts in the output
//   3. /playground and /oauth/google answer the 404 page rather than rendering
//
// Usage: node scripts/assert-playground-removed.mjs [--dir dist] [--self-check]
//        [--no-route]  (skips 3, which needs a browser)
//
// --self-check plants each of the three defects in a scratch copy of the build
// and requires this script to catch every one. A gate nobody has watched fail
// is indistinguishable from one that is broken.
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const SELF_CHECK = args.includes("--self-check");
const WITH_ROUTES = !args.includes("--no-route");
const DIR = path.resolve(root, arg("--dir", "dist"));

const FORBIDDEN = /playground|chumlab\.ai/gi;

// Binary output the scanner cannot read as text. Every other extension is read,
// including .svg and .txt — llms.txt is exactly the kind of file a crawler
// reads and a reviewer forgets.
const BINARY = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm", ".zip"]);

const ARTEFACTS = ["preview-vendor", "preview.html", "preview-bridge.js"];

/** The 404 page's marker; see src/pages/NotFound.tsx. */
const NOT_FOUND_MARKER = "[data-route-404]";
const REMOVED_ROUTES = ["/playground", "/oauth/google"];
/** A route that must NOT 404, so the check above can be shown to discriminate. */
const LIVE_ROUTE = "/button";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function scanStrings(dir) {
  const hits = [];
  for (const file of walk(dir)) {
    if (BINARY.has(path.extname(file).toLowerCase())) continue;
    const rel = path.relative(dir, file);
    // A hashed asset name is one line; a bundle is one very long line. Report
    // the match with enough context to identify it and no more.
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(FORBIDDEN)) {
      const line = text.slice(0, m.index).split("\n").length;
      const from = Math.max(0, m.index - 40);
      hits.push({
        file: rel,
        line,
        match: m[0],
        context: text.slice(from, m.index + m[0].length + 40).replace(/\s+/g, " "),
      });
    }
    if (FORBIDDEN.test(rel)) hits.push({ file: rel, line: 0, match: rel, context: "(in the file name)" });
    FORBIDDEN.lastIndex = 0;
  }
  return hits;
}

function scanArtefacts(dir) {
  return ARTEFACTS.filter((name) => existsSync(path.join(dir, name)));
}

/** Static server with the SPA fallback a host does: unknown path -> index.html. */
function serve(dir) {
  const types = {
    ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".svg": "image/svg+xml", ".txt": "text/plain",
    ".png": "image/png", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json",
  };
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let file = path.join(dir, decodeURIComponent(url.pathname));
    if (!file.startsWith(dir) || !existsSync(file) || statSync(file).isDirectory()) {
      file = path.join(dir, "index.html");
    }
    res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

async function checkRoutes(dir) {
  const { chromium } = await import("playwright");
  const { server, port } = await serve(dir);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const problems = [];
  try {
    for (const route of REMOVED_ROUTES) {
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("body *", { timeout: 10000 }).catch(() => {});
      const is404 = (await page.locator(NOT_FOUND_MARKER).count()) > 0;
      const landed = new URL(page.url()).pathname;
      const body = (await page.locator("body").innerText().catch(() => "")) || "";
      if (!is404) {
        problems.push(`${route} rendered a page (landed on "${landed}") instead of the 404.`);
      }
      if (/playground/i.test(body)) {
        problems.push(`${route} rendered text containing "playground".`);
      }
      const robots = await page
        .locator('meta[name="robots"]')
        .getAttribute("content")
        .catch(() => null);
      if (!robots?.includes("noindex")) {
        problems.push(`${route} answered without noindex (robots="${robots}") — a crawler would index it.`);
      }
    }
    // Discrimination check: a marker test that can only pass is not a test.
    await page.goto(`http://127.0.0.1:${port}${LIVE_ROUTE}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("body *", { timeout: 10000 }).catch(() => {});
    if ((await page.locator(NOT_FOUND_MARKER).count()) > 0) {
      problems.push(`${LIVE_ROUTE} 404s — the 404 marker matches everything, so the checks above prove nothing.`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  return problems;
}

async function run(dir, { routes }) {
  const strings = scanStrings(dir);
  const artefacts = scanArtefacts(dir);
  const routeProblems = routes ? await checkRoutes(dir) : [];
  return { strings, artefacts, routeProblems, routes };
}

function report({ strings, artefacts, routeProblems, routes }, dir) {
  console.log(`\n── playground removal (${path.relative(root, dir) || dir}) ─────────────────────`);
  console.log(`  strings   ${strings.length} hit(s) for /playground|chumlab\\.ai/i`);
  for (const h of strings.slice(0, 40)) {
    console.log(`    ${h.file}:${h.line}  ${h.match}  …${h.context}…`);
  }
  if (strings.length > 40) console.log(`    … and ${strings.length - 40} more`);
  console.log(`  artefacts ${artefacts.length ? artefacts.join(", ") : "none"}`);
  console.log(
    `  routes    ${
      routes === false
        ? "SKIPPED (--no-route)"
        : routeProblems.length
          ? ""
          : "/playground and /oauth/google answer the 404 page"
    }`,
  );
  for (const p of routeProblems) console.log(`    ${p}`);
  const ok = !strings.length && !artefacts.length && !routeProblems.length;
  console.log(`  RESULT: ${ok ? "the playground is not in the build" : "FAILED"}`);
  console.log("──────────────────────────────────────────────────────────────────\n");
  return ok;
}

if (!existsSync(DIR)) {
  console.error(`✗ no build at ${DIR} — run \`npm run build\` first (or pass --dir).`);
  process.exit(1);
}

if (SELF_CHECK) {
  const scratch = path.join(root, ".playground-removal-selfcheck");
  const planted = [
    {
      name: "a built file mentioning the playground",
      plant: (d) => writeFileSync(path.join(d, "planted.js"), 'export const x = "/playground";\n'),
      caught: (r) => r.strings.some((h) => h.file === "planted.js"),
    },
    {
      name: "a preview artefact in the output",
      plant: (d) => writeFileSync(path.join(d, "preview.html"), "<!doctype html>\n"),
      caught: (r) => r.artefacts.includes("preview.html"),
    },
    {
      name: "a /playground that renders instead of 404ing",
      plant: (d) =>
        writeFileSync(
          path.join(d, "index.html"),
          "<!doctype html><meta charset=utf-8><body><h1>AI Playground</h1></body>",
        ),
      caught: (r) => r.routeProblems.length > 0,
      routes: true,
    },
  ];

  let ok = true;
  try {
    for (const defect of planted) {
      rmSync(scratch, { recursive: true, force: true });
      mkdirSync(scratch, { recursive: true });
      cpSync(DIR, scratch, { recursive: true });
      defect.plant(scratch);
      const result = await run(scratch, { routes: Boolean(defect.routes) && WITH_ROUTES });
      const caught = defect.caught(result);
      console.log(`  ${caught ? "caught" : "MISSED"}  ${defect.name}`);
      if (!caught) ok = false;
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
  console.log(ok ? "\nself-check: every planted defect was caught\n" : "\nself-check: FAILED\n");
  process.exit(ok ? 0 : 1);
}

const result = await run(DIR, { routes: WITH_ROUTES });
process.exit(report(result, DIR) ? 0 : 1);
