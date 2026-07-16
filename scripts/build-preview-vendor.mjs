// Builds the static assets the playground preview iframe runs on:
//   public/preview-vendor/  ESM bundles for @chumlab/ui (all exports subpaths,
//                           built from dist/), react, react-dom, phosphor,
//                           recharts, clsx, tailwind-merge + babel/tailwind
//                           runtimes copied from node_modules
//   public/preview.html     the preview document with the generated import map
//                           and the token blocks extracted from src/index.css
//
// @chumlab/ui is unpublished, so no CDN can resolve it - the iframe's import
// map must point every allowlisted specifier at these local files.
import { build } from "esbuild";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(repoRoot, "public", "preview-vendor");
const pkg = JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));

if (!existsSync(path.join(repoRoot, "dist", "components"))) {
  console.error("dist/components not found - run `npm run build:lib` first.");
  process.exit(1);
}

// npm packages the generated code may import. Shim entries with explicit
// named exports are generated below because `export * from` a CJS package
// (react) yields no static names for the iframe's ESM imports to link to.
const NPM_SPECIFIERS = [
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "@phosphor-icons/react",
  "recharts",
  "clsx",
  "tailwind-merge",
];

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

// Inside the repo so bare specifiers in the shims resolve to node_modules.
const shimDir = path.join(repoRoot, "node_modules", ".cache", "chumlab-preview-shims");
rmSync(shimDir, { recursive: true, force: true });
mkdirSync(shimDir, { recursive: true });

async function writeShim(specifier) {
  // Node may resolve a package's CJS build while esbuild resolves its ESM
  // build, so the export names come from Node but are re-exported as
  // namespace properties - static enough for the iframe's named imports,
  // tolerant of the default-export mismatch between the two builds.
  const ns = await import(specifier);
  const names = Object.keys(ns).filter(
    (n) => n !== "default" && n !== "__esModule" && IDENT.test(n)
  );
  const lines = [`import * as ns from ${JSON.stringify(specifier)};`];
  for (const name of names) {
    lines.push(`export const ${name} = ns.${name};`);
  }
  lines.push("export default ns.default !== undefined ? ns.default : ns;");
  const file = path.join(shimDir, `${specifier.replace(/[@/]/g, "_")}.js`);
  writeFileSync(file, `${lines.join("\n")}\n`);
  return file;
}

function outName(specifier) {
  return specifier.replace(/^@/, "").replace(/\//g, "-");
}

const entryPoints = [];
const importMap = {};

for (const specifier of NPM_SPECIFIERS) {
  const out = outName(specifier);
  entryPoints.push({ in: await writeShim(specifier), out });
  importMap[specifier] = `/preview-vendor/${out}.js`;
}

// @chumlab/ui entries come straight from its exports map so new subpaths are
// picked up without touching this script. dist files are already ESM.
for (const [key, value] of Object.entries(pkg.exports)) {
  const target = typeof value === "object" ? value.import : value;
  if (!target || !target.endsWith(".js")) continue;
  const specifier = key === "." ? "@chumlab/ui" : `@chumlab/ui/${key.slice(2)}`;
  const out = key === "." ? "chumlab-ui/index" : `chumlab-ui/${key.slice(2)}`;
  entryPoints.push({ in: path.join(repoRoot, target), out });
  importMap[specifier] = `/preview-vendor/${out}.js`;
}

rmSync(outDir, { recursive: true, force: true });

await build({
  entryPoints,
  bundle: true,
  format: "esm",
  splitting: true,
  outdir: outDir,
  chunkNames: "chunks/[name]-[hash]",
  minify: true,
  target: "es2022",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});

// Resolved from each package's main because neither exports these files.
copyFileSync(
  path.join(path.dirname(require.resolve("@babel/standalone")), "babel.min.js"),
  path.join(outDir, "babel.min.js")
);
copyFileSync(
  path.join(path.dirname(require.resolve("@tailwindcss/browser")), "index.global.js"),
  path.join(outDir, "tailwindcss-browser.js")
);

// Token extraction. The unindented anchors skip the indented copies inside
// the @media header-height override.
const css = readFileSync(path.join(repoRoot, "src", "index.css"), "utf8");

function extractBlock(anchor) {
  const match = css.match(anchor);
  if (!match) {
    console.error(`Token block not found in src/index.css: ${anchor}`);
    process.exit(1);
  }
  const start = match.index;
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    if (depth === 0) return css.slice(start, i + 1);
  }
  console.error(`Unbalanced token block in src/index.css: ${anchor}`);
  process.exit(1);
}

const customVariant = css.match(/^@custom-variant dark .*;$/m);
if (!customVariant) {
  console.error("`@custom-variant dark` not found in src/index.css");
  process.exit(1);
}
const darkTokens = extractBlock(/^:root,\n:root\[data-theme="dark"\] \{/m);
const lightTokens = extractBlock(/^:root\[data-theme="light"\] \{/m);
const themeBlock = extractBlock(/^@theme inline \{/m);

const html = `<!doctype html>
<!-- Generated by scripts/build-preview-vendor.mjs - do not edit by hand. -->
<html data-theme="dark" class="dark">
  <head>
    <meta charset="utf-8" />
    <title>Preview</title>
    <style>
${darkTokens}

${lightTokens}

body {
  margin: 0;
  background: var(--bg-base);
  color: var(--text-primary);
}
    </style>
    <style type="text/tailwindcss">
${customVariant[0]}

${themeBlock}
    </style>
    <script type="importmap">
${JSON.stringify({ imports: importMap }, null, 2)}
    </script>
    <script src="/preview-vendor/babel.min.js"></script>
    <script src="/preview-vendor/tailwindcss-browser.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/preview-bridge.js"></script>
  </body>
</html>
`;

writeFileSync(path.join(repoRoot, "public", "preview.html"), html);
rmSync(shimDir, { recursive: true, force: true });

console.log(
  `preview vendor built: ${entryPoints.length} entries, import map with ${Object.keys(importMap).length} specifiers`
);
