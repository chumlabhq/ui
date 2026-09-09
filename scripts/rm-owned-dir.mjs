/**
 * Recursively remove a directory only if this script wrote everything in it.
 *
 * `build-demo-snippets` removes its output directory on every run and was safe
 * only because its path ends in `/demo`. Its sibling `build-component-docs`
 * writes 31 files into the parent, `scripts/consumers/_app/snippets`, and had
 * either constant pointed one level up, every run of one would have deleted the
 * other's output — silently, because both then regenerate and both report
 * success. `generate-flags` is the same shape aimed at a real source directory,
 * `src/components/CountryFlag/flags`.
 *
 * Ownership is recorded rather than inferred. A shape test would not have
 * caught the near-miss: the other writer's files are `react/Accordion.tsx`,
 * which looks exactly like ours. So each run leaves a manifest of what it
 * wrote, and the next run treats those — and only those, plus what it is about
 * to write — as its own. Anything else is another writer's or a person's, and
 * neither is something a build step gets to delete on its way past.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Manifests live here, not inside the directory they describe.
 *
 * The first version wrote `.owned-by.json` into the output directory, which put
 * a build artefact inside `src/components/CountryFlag/flags` — and `src/` is
 * hashed into the browser matrix's fingerprint, so regenerating the flags would
 * have invalidated all seven projects for a file no test can see. `scripts/` is
 * outside that fingerprint.
 */
const SCRIPTS = dirname(fileURLToPath(import.meta.url));
const OWNED = resolve(SCRIPTS, ".owned");
const REPO = resolve(SCRIPTS, "..");
// Named for the directory's path relative to the repo, so the file is the same
// on every machine and reads as what it describes.
const manifestPath = (dir) =>
  join(OWNED, `${relative(REPO, dir).split(sep).join("-").replace(/[^a-zA-Z0-9-]/g, "-")}.json`);

/** Every file under `dir`, relative to it, with `/` separators. */
const filesUnder = (dir) => {
  const out = [];
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const path = join(current, entry);
      if (statSync(path).isDirectory()) walk(path);
      else out.push(relative(dir, path).split(sep).join("/"));
    }
  };
  walk(dir);
  return out;
};

/** What the last run of `owner` left here, or null if that was not this owner. */
const priorlyOwned = (dir, owner) => {
  const path = manifestPath(dir);
  if (!existsSync(path)) return null;
  try {
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    return manifest.owner === owner && Array.isArray(manifest.files) ? manifest.files : null;
  } catch {
    return null;
  }
};

/**
 * @param {string} dir      the directory to remove
 * @param {object} options
 * @param {string} options.owner  the script, recorded in the manifest
 * @param {Iterable<string>} options.owns  relative paths this run will write
 */
export function rmOwnedDir(dir, { owner, owns }) {
  if (!existsSync(dir)) return;

  const owned = new Set(owns);
  for (const file of priorlyOwned(dir, owner) ?? []) owned.add(file);

  const foreign = filesUnder(dir).filter((file) => !owned.has(file));
  if (foreign.length) {
    const shown = foreign.slice(0, 8).map((f) => `      ${f}`).join("\n");
    throw new Error(
      `${owner} will not recursively remove ${dir}:\n` +
        `    ${foreign.length} file(s) there are not this script's.\n` +
        `${shown}${foreign.length > 8 ? `\n      … and ${foreign.length - 8} more` : ""}\n` +
        "    Another writer owns part of this directory, or someone put a file in it.\n" +
        "    Point this script at a directory it owns outright rather than widening what it deletes.",
    );
  }

  rmSync(dir, { recursive: true, force: true });
}

/** Record what this run wrote, so the next one knows what it may remove. */
export function writeOwnedManifest(dir, owner, files) {
  mkdirSync(OWNED, { recursive: true });
  writeFileSync(
    manifestPath(dir),
    `${JSON.stringify({ owner, files: [...files].sort() }, null, 2)}\n`,
    "utf8",
  );
}
