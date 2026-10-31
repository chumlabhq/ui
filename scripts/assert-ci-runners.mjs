/**
 * Every workflow job that launches a Playwright browser installs that browser
 * first, on a runner the locked Playwright can install it on.
 *
 * CI's e2e job ran on `ubuntu-latest`. GitHub moved that label to Ubuntu 26.04
 * from 2026-10-19, and Playwright 1.58 has no Chromium build for it, so every
 * push failed in `playwright install --with-deps chromium` before a test ran —
 * a failure no local gate could see, because nothing local reads the runner a
 * workflow asks for. And release-gates.yml's `consumers` job ran
 * `verify:consumers`, whose matrix calls `chromium.launch()`, with no install
 * step at all, which fails on any OS. This reads both.
 *
 * A job launches a browser when one of its `run:` steps reaches one. Steps are
 * followed through `npm run` (with its pre and post scripts), `npm pack`
 * (prepack, postpack), `node <file>` and that file's relative imports, static
 * and dynamic. A launch is `chromium|firefox|webkit.launch…(` in a file, or
 * `playwright test`, run directly or spawned from a file, which launches the
 * browser of every project it names (every project, when it names none or is
 * spawned from a file). Commands a file spawns other than `playwright test`
 * are not followed: they are the consumer apps' own scripts, not this
 * package's.
 *
 * A job installs a browser with a `playwright install [browsers]` step (no
 * browsers is all of them; `install-deps` installs none), and it has to come
 * before the step that launches it.
 *
 * Runners: Linux only. Playwright matches a Linux host by exact distribution
 * version (`ubuntu24.04-x64`), so a label that moves to a newer release is a
 * host it has never heard of. A macOS host newer than it knows is clamped to
 * the last one it does (`mac15`, hostPlatform.js), so `macos-latest` cannot
 * fail this way. The supported hosts are read from the installed
 * playwright-core, per browser, so a Playwright upgrade moves the answer with it.
 *
 *   node scripts/assert-ci-runners.mjs [workflows dir]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOWS = resolve(process.argv[2] ?? join(ROOT, ".github", "workflows"));
const BROWSERS = ["chromium", "firefox", "webkit"];
const require = createRequire(join(ROOT, "package.json"));

/**
 * The hosts Playwright has a download of `browser` for: its block of
 * DOWNLOAD_PATHS, whose entries are a URL or `void 0`. The table is not
 * exported, so it is read from the module the CLI itself runs, and an empty or
 * malformed read fails rather than passing on nothing.
 */
export function browserHosts(browser) {
  const file = require.resolve("playwright-core/lib/server/registry/index");
  const table = readFileSync(file, "utf8").split("DOWNLOAD_PATHS = {")[1] ?? "";
  const block = new RegExp(`\\n\\s*"${browser}": \\{([\\s\\S]*?)\\n\\s*\\}`).exec(`\n${table}`)?.[1];
  if (!block) throw new Error(`no "${browser}" block in DOWNLOAD_PATHS in ${file}: Playwright's registry changed shape`);
  const hosts = [...block.matchAll(/"([^"]+)": (void 0|[^,\n]+)/g)]
    .filter(([, , value]) => value !== "void 0")
    .map(([, host]) => host);
  if (!hosts.includes("ubuntu22.04-x64")) throw new Error(`read ${hosts.length} ${browser} hosts from ${file} and ubuntu22.04-x64 is not one: the read is wrong`);
  return new Set(hosts);
}

/** Each playwright.config.ts project's name and the browser its device runs. */
export function projectBrowsers(config = readFileSync(join(ROOT, "playwright.config.ts"), "utf8")) {
  const { devices } = require("playwright-core");
  const projects = new Map();
  const body = config.split(/^\s*projects: \[/m)[1] ?? "";
  for (const chunk of body.split(/\bname: /).slice(1)) {
    const name = /^"([^"]+)"/.exec(chunk)?.[1];
    const browser = /browserName: "(\w+)"/.exec(chunk)?.[1] ?? devices[/devices\["([^"]+)"\]/.exec(chunk)?.[1]]?.defaultBrowserType;
    if (name && browser) projects.set(name, browser);
  }
  if (!projects.has("chromium")) throw new Error(`read ${projects.size} projects from playwright.config.ts and "chromium" is not one: the read is wrong`);
  return projects;
}

/** Each job's id, `runs-on` and its steps' `run:` commands, in order. */
export function jobs(workflow) {
  const body = workflow.split(/^jobs:\s*$/m)[1] ?? "";
  return body
    .split(/^(?=  [A-Za-z0-9_-]+:\s*$)/m)
    .map((block) => ({
      id: /^  ([A-Za-z0-9_-]+):/.exec(block)?.[1],
      runsOn: /^    runs-on: *(.+?)\s*$/m.exec(block)?.[1],
      runs: block
        .split(/^      - /m)
        .slice(1)
        .map((step) => {
          const inline = /^ *run: *(?![|>])(.+?)\s*$/m.exec(step)?.[1];
          if (inline) return inline;
          const lines = /^ *run: *[|>]-?\s*\n((?:(?: {8,}.*)?\n?)*)/m.exec(step)?.[1];
          return lines ? lines.split("\n").map((l) => l.trim()).filter(Boolean).join("\n") : null;
        })
        .filter(Boolean),
    }))
    .filter((job) => job.id);
}

/** The browsers a `playwright install` command installs, or null when it is not one. */
export function installs(run) {
  const args = /(?:^|\s)playwright install(?!-)((?: +[^\s&|;]+)*)/.exec(run)?.[1];
  if (args === undefined) return null;
  const named = args.trim().split(/\s+/).filter((a) => a && !a.startsWith("-"));
  return new Set(named.length ? named.filter((b) => BROWSERS.includes(b)) : BROWSERS);
}

/** The browsers `run` launches, followed through scripts and files. */
export function launches(run, ctx, seen = new Set()) {
  const out = new Set();
  const add = (browsers) => browsers.forEach((b) => out.add(b));
  for (const segment of run.split(/&&|\|\||;|\n|\|/)) {
    const tokens = segment.trim().split(/\s+/).filter((t) => t && !/^[A-Z_][A-Z0-9_]*=/.test(t));
    if (tokens[0] === "npx") tokens.shift();
    const [cmd, sub, name] = tokens;
    if (cmd === "npm" && (sub === "run" || sub === "run-script") && name) add(script(name, ctx, seen));
    else if (cmd === "npm" && (sub === "test" || sub === "start")) add(script(sub, ctx, seen));
    else if (cmd === "npm" && sub === "pack") ["prepack", "postpack"].forEach((s) => add(script(s, ctx, seen, true)));
    else if (cmd === "playwright" && sub === "test") {
      const named = [...segment.matchAll(/--project[= ](?:"([^"]+)"|'([^']+)'|(\S+))/g)].map((m) => m[1] ?? m[2] ?? m[3]);
      add(named.length ? named.map((p) => ctx.projects.get(p)).filter(Boolean) : ctx.projects.values());
    } else if (cmd === "node" && sub && !sub.startsWith("-")) add(file(resolve(ROOT, sub), ctx, seen));
  }
  return out;
}

function script(name, ctx, seen, optional = false) {
  const out = new Set();
  for (const s of optional ? [name] : [`pre${name}`, name, `post${name}`]) {
    if (!ctx.scripts[s] || seen.has(`npm:${s}`)) continue;
    seen.add(`npm:${s}`);
    launches(ctx.scripts[s], ctx, seen).forEach((b) => out.add(b));
  }
  return out;
}

function file(path, ctx, seen) {
  const out = new Set();
  if (seen.has(path) || !existsSync(path)) return out;
  seen.add(path);
  const source = readFileSync(path, "utf8");
  for (const [, browser] of source.matchAll(/\b(chromium|firefox|webkit)\.(?:launch|launchPersistentContext|launchServer)\(/g)) out.add(browser);
  if (/["']playwright["'],\s*["']test["']/.test(source)) ctx.projects.forEach((b) => out.add(b));
  for (const [, spec] of source.matchAll(/(?:from|import\()\s*["'](\.{1,2}\/[^"']+)["']/g)) {
    file(resolve(dirname(path), spec), ctx, seen).forEach((b) => out.add(b));
  }
  return out;
}

/** Why `runsOn` cannot install `browser`, or null when it can. */
export function refusal(runsOn, browser, hosts) {
  if (!runsOn) return "it names no runs-on";
  if (!runsOn.startsWith("ubuntu-")) return null;
  const version = /^ubuntu-(\d+\.\d+)(-arm)?$/.exec(runsOn);
  if (!version) return `"${runsOn}" is not a pinned Ubuntu release, so the Ubuntu it runs is whatever GitHub moves the label to`;
  const host = `ubuntu${version[1]}-${version[2] ? "arm64" : "x64"}`;
  return hosts.get(browser).has(host) ? null : `Playwright has no ${browser} build for ${host}`;
}

/** What is wrong with one job, and what it launches and installs. */
export function check(job, ctx) {
  const installed = new Set();
  const launched = new Set();
  const problems = [];
  for (const run of job.runs) {
    const before = new Set(installed);
    installs(run)?.forEach((b) => installed.add(b));
    for (const browser of launches(run, ctx)) {
      launched.add(browser);
      if (!before.has(browser) && !installed.has(browser)) problems.push(`\`${run.split("\n")[0]}\` launches ${browser} and no earlier step installs it`);
    }
  }
  for (const browser of new Set([...installed, ...launched])) {
    const why = refusal(job.runsOn, browser, ctx.hosts);
    if (why && !problems.some((p) => p.startsWith("runs on"))) problems.push(`runs on ${job.runsOn}: ${why}`);
  }
  return { launched, installed, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ctx = {
    hosts: new Map(BROWSERS.map((b) => [b, browserHosts(b)])),
    projects: projectBrowsers(),
    scripts: JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).scripts,
  };
  const files = readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/.test(f));
  const checked = [];
  const failures = [];
  for (const file of files) {
    for (const job of jobs(readFileSync(join(WORKFLOWS, file), "utf8"))) {
      const { launched, installed, problems } = check(job, ctx);
      if (!launched.size && !installed.size) continue;
      checked.push(`${file}:${job.id} (${job.runsOn}; launches ${[...launched].sort().join(", ") || "none"})`);
      failures.push(...problems.map((p) => `${file}: job ${job.id}: ${p}`));
    }
  }
  const list = checked.map((c) => `    ${c}`).join("\n");
  if (!checked.length) {
    console.error(`✗ no job in ${relative(ROOT, WORKFLOWS) || WORKFLOWS} launches or installs a Playwright browser: the read is wrong`);
    process.exit(1);
  }
  if (failures.length) {
    console.error(`✗ ${failures.length} problem(s) in ${checked.length} Playwright job(s):\n${failures.map((f) => `    ${f}`).join("\n")}\n  checked:\n${list}`);
    process.exit(1);
  }
  console.log(`✓ ${checked.length} Playwright job(s) install each browser they launch, first, on a runner Playwright supports:\n${list}`);
}
