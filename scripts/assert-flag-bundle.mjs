// Bundle guarantee: packaged flag SVGs must be reachable ONLY through the
// per-code dynamic imports, never statically inlined into the CountryFlag
// entry - otherwise importing the component would pull ~1 MB of SVG eagerly.
// Run after `build:lib`.
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const srcFlags = resolve(root, "src/components/CountryFlag/flags");

const read = (p) => readFileSync(p, "utf8");

// Follow an entry's STATIC imports one level. Dynamic import() is deliberately
// not followed - that is the boundary this script exists to police.
function staticallyReachable(entryRel) {
  const entry = resolve(dist, entryRel);
  if (!existsSync(entry)) throw new Error(`missing build output: ${entryRel}`);
  const files = [entry];
  for (const m of read(entry).matchAll(/from\s*"([^"]+)"/g)) {
    if (m[1].startsWith(".")) {
      const p = resolve(dirname(entry), m[1]);
      if (existsSync(p)) files.push(p);
    }
  }
  return files;
}

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
};

// 1. No SVG payload may be statically reachable from the component entry.
const reachable = staticallyReachable("components/CountryFlag/index.js");
const inlined = reachable.filter((f) => read(f).includes("<svg"));
if (inlined.length) {
  fail(`flag SVG inlined into the default entry:\n  ${inlined.join("\n  ")}`);
} else {
  console.log("✓ default ./country-flag entry has no inlined flag SVG");
}

// 2. Every source flag must have shipped as its own chunk, in both formats.
const expected = readdirSync(srcFlags).filter((f) => f.endsWith(".ts") && f !== "index.ts").length;
for (const ext of ["js", "cjs"]) {
  const dir = resolve(dist, "flags");
  const got = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(`.${ext}`)).length : 0;
  if (got !== expected) {
    fail(`expected ${expected} .${ext} flag chunks, found ${got}`);
  } else {
    console.log(`✓ ${got} per-flag .${ext} chunks emitted`);
  }
}

// 3. The CDN constant ships as an opt-in, but must not be wired to a default.
const impl = readdirSync(resolve(dist, "shared")).find((f) => /^CountryFlag-.*\.js$/.test(f));
if (!impl) {
  fail("could not locate the CountryFlag implementation chunk");
} else {
  const src = read(resolve(dist, "shared", impl));
  if (!src.includes("chumflagscdn")) {
    fail("CHUMLAB_FLAG_CDN opt-in constant is missing from the build");
  } else if (/basePath\s*=\s*"https/.test(src)) {
    fail("a remote URL is being used as the basePath default");
  } else {
    console.log("✓ CDN constant is export-only, not a default");
  }
}

if (process.exitCode) {
  console.error("flag bundle guarantee FAILED");
} else {
  console.log("flag bundle guarantee OK");
}
