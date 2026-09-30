#!/usr/bin/env node
/**
 * publint and attw as a gate on every library build, not a thing someone ran
 * once.
 *
 * Both defects they found were invisible from inside this repo, and would have
 * stayed that way: every tsconfig here resolves with `bundler`, and nothing
 * else reads the package the way a consumer does. `attw` said 272 problems —
 * types masquerading as ESM for all 32 entrypoints, and 240 relative imports
 * in the declarations that `node16` cannot resolve.
 *
 * `--ignore-scripts` on the pack, deliberately: this runs from `postbuild:lib`,
 * which runs from `prepack`, and a pack that reran `prepack` would not
 * terminate. `dist/` is finished by the time this is called.
 *
 *   node scripts/assert-packaging.mjs              gate the built dist
 *   node scripts/assert-packaging.mjs --self-check plant each defect back
 */
import { spawnSync } from "node:child_process";
import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The entrypoint floor. A `--exclude-entrypoints` typo, an `exports` map that
 * failed to parse, or a tarball missing `dist/` all produce an analysis of
 * nothing, and an analysis of nothing has no problems in it. Three gates on
 * this branch have been caught passing on an empty set.
 */
const MIN_ENTRYPOINTS = 30;

function run(command, argv, options = {}) {
  const result = spawnSync(command, argv, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...options });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`,
  };
}

/**
 * `--strict`, because publint's default exit code ignores warnings, and its
 * warnings are the interesting ones: it reported the root `types` condition
 * resolving as ESM for `require` consumers and still exited 0.
 */
export function publint(tarball) {
  const { status, output } = run("npx", ["publint", "--strict", tarball], { cwd: ROOT });
  return { ok: status === 0, output };
}

/** Reads attw under node10, node16 (both directions) and bundler. */
export function areTheTypesWrong(tarball, into) {
  // Through a file descriptor, not a pipe. attw calls `process.exit` while its
  // JSON is still draining, and on a pipe that loses everything past 64 KB —
  // which for this package was 250 of its 282 findings.
  const jsonPath = join(into, "attw.json");
  const handle = openSync(jsonPath, "w");
  const { status } = run(
    "npx",
    [
      "attw",
      tarball,
      // A stylesheet has no type declarations and never will. attw reports both
      // CSS entrypoints as unresolvable under all four resolutions, which is
      // 8 findings about the wrong thing sitting on top of the real ones.
      "--exclude-entrypoints",
      "./styles.css",
      "./tokens.css",
      "--format",
      "json",
    ],
    { cwd: ROOT, stdio: ["ignore", handle, "pipe"] },
  );
  closeSync(handle);
  const raw = readFileSync(jsonPath, "utf8");

  let analysis;
  try {
    analysis = JSON.parse(raw).analysis;
  } catch {
    return { ok: false, entrypoints: 0, summary: raw.split("\n").slice(-30).join("\n"), status };
  }

  const problems = analysis.problems ?? [];
  const entrypoints = Object.keys(analysis.entrypoints ?? {}).length;

  // Grouped, not listed. 240 InternalResolutionErrors are one defect — the
  // declaration files import without extensions — and printing each one buries
  // the second defect underneath it.
  const groups = new Map();
  for (const problem of problems) {
    // Only some kinds name a resolution. FalseESM does not — it is a property
    // of the declaration file, and attw reports it once per entrypoint — so
    // inventing "every resolution" for it would state something untrue.
    const key = problem.resolutionOption ? `${problem.kind} under ${problem.resolutionOption}` : problem.kind;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(problem.moduleSpecifier ?? problem.typesFileName ?? "");
  }

  const summary = [...groups]
    .map(([key, examples]) => {
      const distinct = [...new Set(examples)];
      return (
        `      ${String(examples.length).padStart(4)}  ${key}\n` +
        distinct.slice(0, 3).map((e) => `            e.g. ${e}`).join("\n") +
        (distinct.length > 3 ? `\n            ...and ${distinct.length - 3} more` : "")
      );
    })
    .join("\n");

  return {
    ok: status === 0 && problems.length === 0 && entrypoints >= MIN_ENTRYPOINTS,
    kinds: [...groups.keys()],
    count: problems.length,
    entrypoints,
    summary,
    status,
  };
}

/**
 * Every relative link in a shipped document has to resolve inside the tarball.
 *
 * The published README linked to `ACCESSIBILITY.md`, which `files` did not
 * carry — so the one document that qualifies every accessibility claim was a
 * 404 for everyone reading the package on npm. The repo could not see it,
 * because on GitHub the link resolves fine.
 *
 * Only relative links are checked. An absolute URL is someone else's problem
 * and a `mailto:` is not a file; a link out to the repo is the correct way to
 * reference something that deliberately does not ship.
 */
export function linksResolve(tarball) {
  const { status, stdout, output } = run("tar", ["-tzf", tarball]);
  if (status !== 0) return { ok: false, broken: [`could not list the tarball: ${output}`] };

  const entries = new Set(
    stdout.split("\n").filter(Boolean).map((line) => line.replace(/^package\//, "").replace(/\/$/, "")),
  );
  const documents = [...entries].filter((name) => name.endsWith(".md") && !name.includes("/"));
  if (documents.length === 0) return { ok: false, broken: ["the tarball ships no documents at all"] };

  const dir = mkdtempSync(join(tmpdir(), "chumlab-docs-"));
  run("tar", ["-xzf", tarball, "-C", dir]);

  const broken = [];
  let checked = 0;
  for (const document of documents) {
    const text = readFileSync(join(dir, "package", document), "utf8");
    for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      checked += 1;
      const path = target.split("#")[0];
      if (path && !entries.has(path)) broken.push(`${document} links to "${target}", which the tarball does not carry`);
    }
  }
  rmSync(dir, { recursive: true, force: true });

  return { ok: broken.length === 0, broken, checked, documents: documents.length };
}

/**
 * Every declaration file in `dist/` belongs to a library entry or to the shared
 * internals the entries import.
 *
 * `tsconfig.lib.json` included all of `src/components` and excluded the site's
 * loose files one name at a time, so `AnnouncementBanner.tsx` — added for the
 * playground's top bar, excluded nowhere — shipped as
 * `dist/components/AnnouncementBanner.d.ts` and its `.d.cts` twin. attw and
 * publint cannot see it: they walk from `exports`, and nothing in `exports`
 * reaches it.
 *
 * The allowed set is derived, never listed, because a list is what failed. An
 * entry is a `types` path in `exports`; its component directory is the entry's
 * own. Shared internals are the top-level `dist/` directories that at least one
 * entry's import graph reaches — `utils`, today. Directory rather than file:
 * 622 of 982 declarations are internal to a directory an entry already owns and
 * are reached only through the JavaScript, not through another declaration.
 */
export function siteOnlyDeclarations(pkgDir) {
  const manifest = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
  const dist = join(pkgDir, "dist");
  const isDeclaration = (name) => name.endsWith(".d.ts") || name.endsWith(".d.cts");
  const declarations = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (isDeclaration(entry.name)) declarations.push(relative(dist, path).split(sep).join("/"));
    }
  };
  if (existsSync(dist)) walk(dist);

  const entries = new Set();
  for (const value of Object.values(manifest.exports ?? {})) {
    if (typeof value !== "object") continue;
    for (const condition of Object.values(value)) {
      if (condition?.types?.startsWith("./dist/")) entries.add(condition.types.slice("./dist/".length));
    }
  }
  const entryComponents = new Set(
    [...entries].map((entry) => entry.match(/^components\/([^/]+)\//)?.[1]).filter(Boolean),
  );

  const reached = new Set();
  const queue = [...entries];
  while (queue.length > 0) {
    const file = queue.pop();
    if (reached.has(file) || !existsSync(join(dist, file))) continue;
    reached.add(file);
    const source = ts.createSourceFile(file, readFileSync(join(dist, file), "utf8"), ts.ScriptTarget.Latest);
    const visit = (node) => {
      let specifier;
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        specifier = node.moduleSpecifier.text;
      } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
        specifier = node.argument.literal.text;
      }
      if (specifier?.startsWith(".")) {
        const base = posix.join(posix.dirname(file), specifier);
        const ext = file.endsWith(".d.cts") ? ".d.cts" : ".d.ts";
        const target = [base.replace(/\.c?js$/, ext), `${base}${ext}`, `${base}/index${ext}`].find((candidate) =>
          existsSync(join(dist, candidate)),
        );
        if (target) queue.push(target);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  const sharedInternals = new Set(
    [...reached].filter((file) => !file.startsWith("components/") && file.includes("/")).map((file) => file.split("/")[0]),
  );

  const siteOnly = declarations.filter((file) => {
    if (entries.has(file)) return false;
    const [top, component, ...rest] = file.split("/");
    if (top === "components") return !(rest.length > 0 && entryComponents.has(component));
    return !(component !== undefined && sharedInternals.has(top));
  });

  return {
    ok: declarations.length > 0 && siteOnly.length === 0,
    count: declarations.length,
    siteOnly,
    sharedInternals: [...sharedInternals].sort(),
  };
}

export function declarationsBelong(tarball) {
  const dir = mkdtempSync(join(tmpdir(), "chumlab-decls-"));
  try {
    const { status, output } = run("tar", ["-xzf", tarball, "-C", dir]);
    if (status !== 0) throw new Error(`could not unpack the tarball: ${output}`);
    return siteOnlyDeclarations(join(dir, "package"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function packIgnoringScripts(into) {
  // `npm_config_dry_run` is stripped, not inherited. `npm publish --dry-run`
  // sets it in the environment, `prepublishOnly` runs this gate inside that
  // environment, and the child `npm pack` then honours it — printing the
  // tarball name and writing no file, so the gate failed and took the standard
  // pre-publish check down with it.
  const { npm_config_dry_run: _dryRun, ...env } = process.env;
  const { status, stdout, output } = run(
    "npm",
    ["pack", "--ignore-scripts", "--pack-destination", into],
    { cwd: ROOT, env },
  );
  if (status !== 0) throw new Error(`npm pack failed:\n${output}`);
  const name = stdout.trim().split("\n").filter(Boolean).pop().trim();
  const tarball = join(into, name);
  if (!existsSync(tarball)) throw new Error(`npm pack reported "${name}" but wrote nothing`);
  return tarball;
}

/**
 * Unpacks, mutates, repacks with tar. `npm pack` would rerun `prepack` and
 * rebuild `dist/`, undoing the plant.
 */
function repack(tarball, into, suffix, mutate) {
  const dir = join(into, `plant-${suffix}`);
  mkdirSync(dir, { recursive: true });
  run("tar", ["-xzf", tarball, "-C", dir]);
  mutate(join(dir, "package"));
  const planted = join(dir, `planted-${suffix}.tgz`);
  const { status, output } = run("tar", ["-czf", planted, "-C", dir, "package"]);
  if (status !== 0) throw new Error(`repack failed: ${output}`);
  return planted;
}

/**
 * The defects put back, one at a time, and required to be caught.
 *
 * The first two are the ones this gate was added for, so the question is not
 * whether attw works in general — it is whether this invocation of it, with
 * these exclusions, still sees them. The empty exports map and the empty dist
 * are aimed at the gate itself.
 */
function selfCheck(tarball, into) {
  const outcomes = [];

  const esmTypesForRequire = repack(tarball, into, "false-esm", (pkg) => {
    const manifest = join(pkg, "package.json");
    const json = JSON.parse(readFileSync(manifest, "utf8"));
    // Pointed back at the ESM declaration, which is the shape this package
    // shipped before the split. Merely dropping the condition no longer
    // reproduces it: TypeScript infers `index.d.cts` from `index.cjs`, and
    // those files now exist.
    for (const value of Object.values(json.exports)) {
      if (typeof value === "object") value.require.types = value.import.types;
    }
    writeFileSync(manifest, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  });
  const falseEsm = areTheTypesWrong(esmTypesForRequire, into);
  outcomes.push({
    plant: "require.types pointed back at the ESM declaration",
    caught: falseEsm.kinds?.includes("FalseESM") ?? false,
    saw: falseEsm.kinds?.join(", ") || "nothing",
  });

  const extensionless = repack(tarball, into, "node16", (pkg) => {
    const index = join(pkg, "dist", "index.d.ts");
    const text = readFileSync(index, "utf8");
    const stripped = text.replace(/from "(\.[^"]*)\.js"/g, 'from "$1"');
    if (stripped === text) throw new Error("dist/index.d.ts has no extensioned relative import to strip");
    writeFileSync(index, stripped, "utf8");
  });
  const node16 = areTheTypesWrong(extensionless, into);
  outcomes.push({
    plant: "extensions stripped from dist/index.d.ts",
    caught: node16.kinds?.some((kind) => kind.startsWith("InternalResolutionError")) ?? false,
    saw: node16.kinds?.join(", ") || "nothing",
  });

  // The third plant is not a defect in the package but a defect in the gate:
  // an exports map with nothing typed in it. attw finds no problems, because
  // it looked at nothing, and only the entrypoint floor separates that from a
  // clean bill of health.
  const nothingTyped = repack(tarball, into, "empty", (pkg) => {
    const manifest = join(pkg, "package.json");
    const json = JSON.parse(readFileSync(manifest, "utf8"));
    json.exports = { "./styles.css": "./dist/styles.css", "./tokens.css": "./dist/tokens.css" };
    writeFileSync(manifest, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  });
  const empty = areTheTypesWrong(nothingTyped, into);
  outcomes.push({
    plant: "an exports map with no typed entrypoint",
    caught: !empty.ok && empty.entrypoints < MIN_ENTRYPOINTS,
    saw: `${empty.entrypoints} entrypoint(s), ${empty.count} problem(s)`,
  });

  const danglingLink = repack(tarball, into, "link", (pkg) => {
    const readme = join(pkg, "README.md");
    writeFileSync(readme, `${readFileSync(readme, "utf8")}\n[gone](CONTRIBUTING.md)\n`, "utf8");
  });
  const links = linksResolve(danglingLink);
  outcomes.push({
    plant: "a README link to a file the tarball does not carry",
    caught: !links.ok,
    saw: links.ok ? `nothing across ${links.checked} link(s)` : links.broken[0],
  });

  // Both shapes a site-only file takes: a loose file beside the component
  // directories, which is how AnnouncementBanner leaked, and a directory no
  // entry names, which is what BrandLogo, Reveal and ui would be.
  for (const [suffix, file] of [
    ["loose", "components/AnnouncementBanner.d.ts"],
    ["site-dir", "components/BrandLogo/index.d.ts"],
  ]) {
    const planted = repack(tarball, into, suffix, (pkg) => {
      const target = join(pkg, "dist", file);
      if (existsSync(target)) throw new Error(`dist/${file} already exists; the plant would prove nothing`);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, "export default function Planted(): null;\n", "utf8");
    });
    const verdict = declarationsBelong(planted);
    outcomes.push({
      plant: `a site-only declaration at dist/${file}`,
      caught: !verdict.ok && verdict.siteOnly.includes(file),
      saw: verdict.siteOnly.length ? verdict.siteOnly.join(", ") : `nothing across ${verdict.count} declaration(s)`,
    });
  }

  const noDeclarations = repack(tarball, into, "no-decls", (pkg) => {
    rmSync(join(pkg, "dist"), { recursive: true, force: true });
  });
  const none = declarationsBelong(noDeclarations);
  outcomes.push({
    plant: "a dist with no declaration files",
    caught: !none.ok && none.count === 0,
    saw: `${none.count} declaration(s), ${none.siteOnly.length} site-only`,
  });

  for (const outcome of outcomes) {
    console.log(`  ${outcome.caught ? "caught" : "NOT CAUGHT"}  ${outcome.plant} — saw ${outcome.saw}`);
  }
  return outcomes.every((o) => o.caught);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const workspace = mkdtempSync(join(tmpdir(), "chumlab-packaging-"));
  let ok = true;
  try {
    const tarball = packIgnoringScripts(workspace);

    const lint = publint(tarball);
    if (lint.ok) console.log("✓ publint --strict clean");
    else {
      console.error(lint.output);
      console.error("✗ publint --strict reported problems");
      ok = false;
    }

    const types = areTheTypesWrong(tarball, workspace);
    if (types.ok) {
      console.log(`✓ attw clean across node10, node16 and bundler (${types.entrypoints} entrypoints)`);
    } else {
      console.error(
        types.entrypoints < MIN_ENTRYPOINTS
          ? `✗ attw analysed ${types.entrypoints} entrypoint(s), under the floor of ${MIN_ENTRYPOINTS} — ` +
            "a clean verdict on nothing is not a clean verdict"
          : `✗ attw reported ${types.count} problem(s)\n${types.summary}`,
      );
      ok = false;
    }

    const links = linksResolve(tarball);
    if (links.ok) {
      console.log(`✓ ${links.checked} relative link(s) across ${links.documents} shipped document(s) resolve`);
    } else {
      for (const line of links.broken) console.error(`  ${line}`);
      console.error("✗ a shipped document links to something the tarball does not carry");
      ok = false;
    }

    const shipped = declarationsBelong(tarball);
    if (shipped.ok) {
      console.log(
        `✓ ${shipped.count} declaration files, 0 site-only ` +
          `(entries from exports, shared internals: ${shipped.sharedInternals.join(", ")})`,
      );
    } else {
      for (const file of shipped.siteOnly) console.error(`  dist/${file} belongs to no library entry or shared internal`);
      console.error(
        shipped.count === 0
          ? "✗ dist carries 0 declaration files — a clean verdict on nothing is not a clean verdict"
          : `✗ ${shipped.count} declaration files, ${shipped.siteOnly.length} site-only`,
      );
      ok = false;
    }

    if (process.argv.includes("--self-check") && !selfCheck(tarball, workspace)) ok = false;
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
  console.log(ok ? "packaging gate OK" : "packaging gate FAILED");
  process.exit(ok ? 0 : 1);
}
