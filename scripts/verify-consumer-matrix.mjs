#!/usr/bin/env node
/**
 * The first gate on this branch that looks at the library from outside it.
 *
 * Everything else measures the repo against itself: the contracts render from
 * `src/`, the e2e suite drives the dev server, the bundle gate reads `dist/`.
 * None of them installs the package, and a package can be broken in ways that
 * are invisible from inside — a subpath export pointing at a file `files` does
 * not ship, types that resolve under `bundler` and not `node16`, a chunk that
 * lost its `"use client"` and takes down every App Router build that imports it.
 *
 * So: `npm pack`, then throwaway applications in a temp directory that install
 * the tarball the way a consumer would and run their framework's production
 * build. Five of them, because the failures are framework-specific — React 18
 * and 19 disagree about `ref`, the App Router is the only one that renders on a
 * server without a DOM, and Vite's resolver is more forgiving than Next's.
 *
 * The scaffolds are templates in `scripts/consumers/`, not `create-next-app`
 * output. Scraping a generator makes the gate depend on the generator's current
 * defaults, which is a second moving part to debug when the matrix goes red.
 *
 *   node scripts/verify-consumer-matrix.mjs                 everything
 *   node scripts/verify-consumer-matrix.mjs --target next-app
 *   node scripts/verify-consumer-matrix.mjs --tarball a.tgz reuse a pack
 *   node scripts/verify-consumer-matrix.mjs --self-check    plant the defects
 *   node scripts/verify-consumer-matrix.mjs --keep          leave the scaffolds
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { areTheTypesWrong, publint } from "./assert-packaging.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATES = join(ROOT, "scripts", "consumers");

/** Rendered by the shared Showcase, and the thing server-rendered HTML is searched for. */
const SENTINEL = "chumlab-consumer-smoke";

/**
 * `showcase` is where the shared component is copied to; `output` is the build
 * directory walked afterwards. `ssr` targets must leave HTML on disk — a build
 * that emitted none rendered nothing on a server, whatever its exit code said.
 */
const TARGETS = [
  { name: "vite-react19", showcase: "src", output: "dist", ssr: false, react: 19 },
  { name: "vite-react18", showcase: "src", output: "dist", ssr: false, react: 18 },
  { name: "next-app", showcase: ".", output: ".next", ssr: true, react: 19 },
  { name: "next-pages", showcase: ".", output: ".next", ssr: true, react: 19 },
  { name: "react-router7", showcase: "app", output: "build", ssr: true, react: 19 },
  // Neither optional peer installed. `peerDependenciesMeta` marks
  // @tanstack/react-table and date-fns optional; this is the target that finds
  // out whether that is true, since a consumer taking the manifest at its word
  // and installing neither is the case nothing else here covers.
  {
    name: "vite-no-optional-peers",
    showcase: "src",
    output: "dist",
    ssr: false,
    react: 19,
    app: "MinimalShowcase.tsx",
    absentPeers: ["@tanstack/react-table", "date-fns"],
  },
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : null);

const log = (line = "") => process.stdout.write(`${line}\n`);

function run(command, argv, options = {}) {
  const result = spawnSync(command, argv, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  const stdout = result.stdout ?? "";
  const output = `${stdout}${result.stderr ?? ""}`;
  return { status: result.status ?? 1, output, stdout };
}

/** Last few meaningful lines of a failed command, for a report that fits on a screen. */
const tail = (output, lines = 12) =>
  output
    .split("\n")
    .filter((line) => line.trim())
    .slice(-lines)
    .map((line) => `      ${line}`)
    .join("\n");

function walk(dir, extension, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, extension, found);
    else if (entry.name.endsWith(extension)) found.push(path);
  }
  return found;
}

// ── the package under test ────────────────────────────────────────────────

function pack(into) {
  log("▸ npm pack");
  const { status, output, stdout } = run("npm", ["pack", "--pack-destination", into], { cwd: ROOT });
  if (status !== 0) {
    log(tail(output, 20));
    throw new Error("npm pack failed");
  }
  // The filename is on stdout; every `npm notice` goes to stderr, and reading
  // the combined stream gets the last notice instead.
  const name = stdout.trim().split("\n").filter(Boolean).pop().trim();
  const tarball = join(into, name);
  if (!existsSync(tarball)) throw new Error(`npm pack reported "${name}" but wrote nothing`);
  return tarball;
}

/**
 * Unpacks a tarball, hands the package directory to `mutate`, and packs it back
 * up with tar rather than npm — `npm pack` would rerun `prepack`, which rebuilds
 * `dist/` and undoes the very thing being planted.
 */
function repack(tarball, into, suffix, mutate) {
  const dir = join(into, `plant-${suffix}-src`);
  mkdirSync(dir, { recursive: true });
  run("tar", ["-xzf", tarball, "-C", dir]);
  mutate(join(dir, "package"));
  const planted = join(dir, `planted-${suffix}.tgz`);
  const { status, output } = run("tar", ["-czf", planted, "-C", dir, "package"]);
  if (status !== 0) throw new Error(`repack failed: ${output}`);
  return planted;
}

// ── one consumer ──────────────────────────────────────────────────────────

function scaffold(target, tarball, into) {
  const dir = join(into, target.name);
  cpSync(join(TEMPLATES, target.name), dir, { recursive: true });
  mkdirSync(join(dir, target.showcase), { recursive: true });
  cpSync(join(TEMPLATES, "_app", target.app ?? "Showcase.tsx"), join(dir, target.showcase, "Showcase.tsx"));

  const manifest = join(dir, "package.json");
  writeFileSync(manifest, readFileSync(manifest, "utf8").replace("__TARBALL__", tarball), "utf8");
  return dir;
}

function verifyConsumer(target, tarball, into) {
  const dir = scaffold(target, tarball, into);
  const started = Date.now();
  const steps = [];

  const step = (label, command, argv) => {
    const { status, output } = run(command, argv, { cwd: dir });
    steps.push({ label, ok: status === 0, output });
    return status === 0;
  };

  if (
    // `--include=optional` is not the default it looks like: without it npm 11
    // installed 74 packages here and left out `@rollup/rollup-darwin-arm64`,
    // so every Vite build died on a missing native binary that has nothing to
    // do with the package under test. No `--prefer-offline` for the same
    // reason in reverse — a stale packument in the local cache reported
    // `@next/env@16.3.4` as nonexistent, failing a target over the cache.
    step("install", "npm", [
      "install",
      "--no-audit",
      "--no-fund",
      "--include=optional",
      "--loglevel=error",
    ]) &&
    step("typecheck", "npm", ["run", "typecheck"])
  ) {
    step("build", "npm", ["run", "build"]);
  }

  // The React major is asserted, not assumed. A peer range wide enough to
  // satisfy both majors means npm is free to resolve either, and a
  // "vite-react18" target quietly running React 19 tests nothing new.
  if (steps[0].ok) {
    const installed = JSON.parse(
      readFileSync(join(dir, "node_modules", "react", "package.json"), "utf8"),
    ).version;
    steps.splice(1, 0, {
      label: `react ${installed}`,
      ok: Number(installed.split(".")[0]) === target.react,
      output: `expected React ${target.react}.x, installed ${installed}`,
    });
  }

  // An optional peer npm resolved anyway proves nothing about it being
  // optional, so its absence is asserted rather than assumed.
  if (steps[0].ok && target.absentPeers) {
    const present = target.absentPeers.filter((name) => existsSync(join(dir, "node_modules", name)));
    steps.splice(1, 0, {
      label: "peers absent",
      ok: present.length === 0,
      output: `${present.join(", ") || "neither"} installed; expected neither of ${target.absentPeers.join(", ")}`,
    });
  }

  const built = steps.some((step) => step.label === "build" && step.ok);
  if (built) {
    const output = join(dir, target.output);

    // The stylesheet has to survive the consumer's own bundler, not merely be
    // importable: a token in the emitted CSS is the only proof it did.
    const css = walk(output, ".css").filter((file) => readFileSync(file, "utf8").includes("--cl-accent"));
    steps.push({
      label: "css resolves",
      ok: css.length > 0,
      output: `${walk(output, ".css").length} stylesheet(s) under ${target.output}, ${css.length} carrying --cl-accent`,
    });

    if (target.ssr) {
      const html = walk(output, ".html").filter((file) => {
        const text = readFileSync(file, "utf8");
        return text.includes(SENTINEL) && text.includes("<table");
      });
      steps.push({
        label: "server render",
        ok: html.length > 0,
        output:
          html.length > 0
            ? `${html.length} prerendered document(s) carrying the sentinel and a <table>`
            : `no prerendered HTML under ${target.output} contains both "${SENTINEL}" and "<table" ` +
              `(${walk(output, ".html").length} .html file(s) found)`,
      });
    }
  }

  return { target: target.name, seconds: Math.round((Date.now() - started) / 1000), steps, dir };
}

// ── reporting ─────────────────────────────────────────────────────────────

function report(results, packaging) {
  log("\n══ consumer matrix ═════════════════════════════════════════════");
  for (const check of packaging) {
    log(`  ${check.ok ? "pass" : "FAIL"}  ${check.name}`);
  }
  for (const result of results) {
    const failed = result.steps.find((s) => !s.ok);
    log(
      `  ${failed ? "FAIL" : "pass"}  ${result.target.padEnd(15)} ` +
        `${result.steps.map((s) => `${s.label}${s.ok ? "" : " ✗"}`).join(" · ")}  ${result.seconds}s`,
    );
  }
  const bad = [...packaging.filter((c) => !c.ok), ...results.filter((r) => r.steps.some((s) => !s.ok))];
  log(bad.length === 0 ? "  RESULT: every consumer installed, typechecked and built" : `  RESULT: FAILED — ${bad.length} target(s)`);
  log("════════════════════════════════════════════════════════════════");

  for (const check of packaging.filter((c) => !c.ok)) {
    log(`\n── ${check.name} ──`);
    log(check.detail ?? tail(check.output ?? "", 40));
  }
  for (const result of results) {
    for (const failed of result.steps.filter((s) => !s.ok)) {
      log(`\n── ${result.target} / ${failed.label} ──`);
      log(tail(failed.output, 30));
    }
  }
  return bad.length === 0;
}

// ── self-check ────────────────────────────────────────────────────────────

/**
 * Two plants, each aimed at a failure this matrix exists to catch and at
 * nothing else. A gate that has never been shown to fail is a gate nobody has
 * tested, and on this branch that has been true of three of them.
 */
function selfCheck(tarball, into) {
  const failure = (result) => result.steps.find((step) => !step.ok);
  const describe = (result) => {
    const failed = failure(result);
    return failed ? `${result.target} failed at ${failed.label}` : `${result.target} passed`;
  };

  // The clean tarball first. A plant proves nothing against a target that was
  // already red, which is exactly the credit publint would take here: it fails
  // on the unplanted package too, so its verdict is not evidence either way.
  log("\n▸ control: the unplanted tarball");
  const control = verifyConsumer(TARGETS[0], tarball, join(into, "control"));
  if (failure(control)) {
    log(`  ${describe(control)} — the plants below would prove nothing`);
    return false;
  }
  log(`  ${describe(control)}`);

  const outcomes = [];

  log("\n▸ plant 1: a subpath export pointing at a file that is not there");
  const brokenExports = repack(tarball, into, "exports", (pkg) => {
    const manifest = join(pkg, "package.json");
    const json = JSON.parse(readFileSync(manifest, "utf8"));
    json.exports["./button"].import.default = "./dist/components/Button/does-not-exist.js";
    writeFileSync(manifest, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  });
  const planted = verifyConsumer(TARGETS[0], brokenExports, join(into, "plant-exports"));
  outcomes.push({
    plant: "a subpath export pointing at a missing file",
    caught: Boolean(failure(planted)),
    by: describe(planted),
  });

  log('\n▸ plant 2: every chunk stripped of its "use client" directive');
  const noDirective = repack(tarball, into, "use-client", (pkg) => {
    let stripped = 0;
    for (const extension of [".js", ".cjs"]) {
      for (const file of walk(join(pkg, "dist"), extension)) {
        const text = readFileSync(file, "utf8");
        if (!text.startsWith('"use client";')) continue;
        writeFileSync(file, text.replace('"use client";\n', ""), "utf8");
        stripped += 1;
      }
    }
    if (stripped === 0) throw new Error('no chunk carried a "use client" directive — nothing was planted');
    log(`  stripped ${stripped} chunk(s)`);
  });
  const appRouter = verifyConsumer(TARGETS[2], noDirective, join(into, "plant-use-client"));
  const stillVite = verifyConsumer(TARGETS[0], noDirective, join(into, "plant-use-client"));
  outcomes.push({
    plant: 'a component shipped without "use client"',
    // Both halves. `next-app` failing on its own could be the plant breaking
    // the package outright; it is only the App Router's failure if a consumer
    // that never renders on a server is still fine.
    caught: Boolean(failure(appRouter)) && !failure(stillVite),
    by: `${describe(appRouter)}, ${describe(stillVite)}`,
  });

  log("\n══ self-check ══════════════════════════════════════════════════");
  for (const outcome of outcomes) {
    log(`  ${outcome.caught ? "caught" : "NOT CAUGHT"}  ${outcome.plant}`);
    log(`            ${outcome.by}`);
  }
  const ok = outcomes.every((o) => o.caught);
  log(ok ? "  RESULT: both plants were caught" : "  RESULT: FAILED — a planted defect passed the matrix");
  log("════════════════════════════════════════════════════════════════");
  return ok;
}

// ── driver ────────────────────────────────────────────────────────────────

const workspace = mkdtempSync(join(tmpdir(), "chumlab-consumers-"));
let ok = false;
try {
  const tarball = value("tarball") ? resolve(value("tarball")) : pack(workspace);
  log(`  tarball: ${tarball}`);

  if (flag("self-check")) {
    ok = selfCheck(tarball, workspace);
  } else {
    const only = value("target");
    const targets = only ? TARGETS.filter((t) => t.name === only) : TARGETS;
    if (targets.length === 0) {
      throw new Error(`unknown target "${only}". Known: ${TARGETS.map((t) => t.name).join(", ")}`);
    }

    log("▸ publint");
    const lint = publint(tarball);
    log("▸ attw (node16, bundler, node10)");
    const types = areTheTypesWrong(tarball, workspace);

    const packaging = [
      { name: "publint", ok: lint.ok, output: lint.output },
      {
        name: `attw (${types.count ?? "?"} problem(s) across ${types.entrypoints ?? "?"} entrypoints)`,
        ok: types.ok,
        detail: types.summary,
      },
    ];

    const results = [];
    for (const target of targets) {
      log(`\n▸ ${target.name}`);
      results.push(verifyConsumer(target, tarball, workspace));
    }
    ok = report(results, packaging);
  }
} finally {
  if (flag("keep")) log(`\n  scaffolds kept at ${workspace}`);
  else rmSync(workspace, { recursive: true, force: true });
}

process.exit(ok ? 0 : 1);
