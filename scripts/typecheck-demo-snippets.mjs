// Typecheck every extracted demo snippet against the built package.
//
// There are over a thousand of these once React and Next are counted, and
// putting each through five framework builds would add most of an hour to the
// matrix for very little extra signal. Typechecking is where the signal was:
// the defects the consumer matrix caught in the hand-written snippets were a
// subpath that does not exist, a `classes` slot key passed as a data field and
// a missing export — all of them type errors, none of them runtime ones.
//
// The one canonical snippet per component keeps its framework builds. This
// gate covers the rest.
//
//   node scripts/typecheck-demo-snippets.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SNIPPETS = join(root, "scripts/consumers/_app/snippets/demo");
const DIST = join(root, "dist");

if (!existsSync(DIST)) {
  process.stderr.write("✗ dist/ is missing — run `npm run build:lib` first. Snippets are checked against the built types, not the source.\n");
  process.exit(1);
}
if (!existsSync(SNIPPETS)) {
  process.stderr.write("✗ no demo snippets — run `node scripts/build-demo-snippets.mjs` first.\n");
  process.exit(1);
}

/**
 * The published subpaths, mapped to the declarations they actually resolve to.
 *
 * Derived from `exports` rather than guessed from the folder layout: a snippet
 * that imports a subpath the package does not publish has to fail here, and it
 * only can if this map is the same one npm will use.
 */
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const paths = {};
for (const [key, target] of Object.entries(pkg.exports)) {
  const types = typeof target === "string" ? null : target.import?.types ?? target.types ?? null;
  if (!types) continue;
  paths[key.replace(/^\./, "@chumlab/ui")] = [types.replace(/^\.\//, "./")];
}

const files = [];
for (const flavour of ["react", "next"]) {
  const dir = join(SNIPPETS, flavour);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) if (f.endsWith(".tsx")) files.push(join(SNIPPETS, flavour, f));
}

if (files.length === 0) {
  process.stderr.write("✗ no snippet files found. A gate that checks nothing is not a gate.\n");
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), "demo-snippets-"));
const configPath = join(dir, "tsconfig.json");
writeFileSync(
  configPath,
  `${JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "bundler",
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        baseUrl: root,
        paths,
        typeRoots: [join(root, "node_modules/@types")],
      },
      files,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const run = spawnSync("npx", ["tsc", "-p", configPath], {
    cwd: root,
    encoding: "utf8",
    // The default 1MB truncated the compiler's output, so this saw 34 of
    // the 78 failing files and let the rest through as passing.
    maxBuffer: 64 * 1024 * 1024,
  });
rmSync(dir, { recursive: true, force: true });

const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
const lines = output.split("\n").filter((l) => /error TS\d+/.test(l));

// Which snippets failed, not just how many errors — one broken example usually
// produces several lines and the count that matters is the example count.
const failed = new Map();
for (const line of lines) {
  const m = /^(.*?)\((\d+),(\d+)\): error (TS\d+): (.*)$/.exec(line);
  if (!m) continue;
  const file = m[1].replace(`${root}/`, "").replace("scripts/consumers/_app/snippets/demo/", "");
  if (!failed.has(file)) failed.set(file, []);
  failed.get(file).push(`${m[4]} ${m[5]}`);
}

process.stdout.write(`\n── demo snippet typecheck ${"─".repeat(38)}\n`);
process.stdout.write(`  checked ${files.length} snippet file(s) against dist/\n`);

if (failed.size === 0) {
  process.stdout.write(`  RESULT: every snippet typechecks\n${"═".repeat(64)}\n`);
  process.exit(0);
}

process.stdout.write(`  ${failed.size} file(s) failed, ${lines.length} error(s)\n\n`);
const byCode = new Map();
for (const errs of failed.values()) {
  for (const e of errs) {
    const code = e.split(" ")[0];
    byCode.set(code, (byCode.get(code) ?? 0) + 1);
  }
}
for (const [code, n] of [...byCode.entries()].sort((a, b) => b[1] - a[1])) {
  process.stdout.write(`    ${String(n).padStart(4)}  ${code}\n`);
}

// Grouped by what the error actually says, with the specific name folded out.
// One mistake repeated across thirty pages is one thing to fix, and the count
// of error lines hides that.
const byMessage = new Map();
for (const errs of failed.values()) {
  for (const e of errs) {
    const key = e.replace(/'[^']*'/g, "'…'");
    byMessage.set(key, (byMessage.get(key) ?? 0) + 1);
  }
}
process.stdout.write("\n  distinct problems:\n");
for (const [msg, n] of [...byMessage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  process.stdout.write(`    ${String(n).padStart(4)}  ${msg.slice(0, 96)}\n`);
}
process.stdout.write("\n");
for (const [file, errs] of [...failed.entries()].slice(0, 25)) {
  process.stdout.write(`  ${file}\n      ${errs[0]}\n`);
}
if (failed.size > 25) process.stdout.write(`  … and ${failed.size - 25} more\n`);
process.stdout.write(`  RESULT: FAILED\n${"═".repeat(64)}\n`);
process.exit(1);
