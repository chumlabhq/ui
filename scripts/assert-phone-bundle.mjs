// Bundle guarantee: libphonenumber-js must live ONLY in the opt-in
// ./phone-validators chunk, never in the default ./international-phone-input entry.
// Run after `build:lib`.
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const MARKER = "libphonenumber";

const read = (p) => readFileSync(p, "utf8");

// Follow an ESM entry's relative imports one level into shared chunks.
function filesReachableFrom(entryRel) {
  const entry = resolve(dist, entryRel);
  if (!existsSync(entry)) throw new Error(`missing build output: ${entryRel}`);
  const src = read(entry);
  const files = [entry];
  for (const m of src.matchAll(/from\s*"([^"]+)"/g)) {
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

// 1. Default component entry (+ its shared chunks) must be libphonenumber-free.
const componentFiles = filesReachableFrom("components/InternationalPhoneInput/index.js");
const leaked = componentFiles.filter((f) => read(f).includes(MARKER));
if (leaked.length) {
  fail(`libphonenumber leaked into the default entry:\n  ${leaked.join("\n  ")}`);
} else {
  console.log("✓ default ./international-phone-input entry is libphonenumber-free");
}

// 2. The validators chunk MUST contain libphonenumber.
const validatorsJs = resolve(dist, "components/InternationalPhoneInput/validators/index.js");
if (!existsSync(validatorsJs)) {
  fail("missing validators build output");
} else if (!read(validatorsJs).includes(MARKER)) {
  fail("validators chunk does not contain libphonenumber");
} else {
  console.log("✓ ./phone-validators chunk contains libphonenumber");
}

// 3. package.json ./phone-validators export targets exist on disk.
const pkg = JSON.parse(read(resolve(dist, "../package.json")));
const exp = pkg.exports?.["./phone-validators"];
if (!exp) {
  fail("package.json is missing the ./phone-validators export");
} else {
  for (const target of [exp.types, exp.import, exp.require]) {
    const abs = resolve(dist, "..", target);
    if (!existsSync(abs)) fail(`./phone-validators export target missing on disk: ${target}`);
  }
  if (!process.exitCode) console.log("✓ ./phone-validators export targets exist");
}

if (process.exitCode) {
  console.error("bundle guarantee FAILED");
} else {
  console.log("bundle guarantee OK");
}
