/**
 * Every generated copy-paste snippet mounts.
 *
 * The consumer matrix typechecks and builds every snippet and mounts none of
 * them, and the snippet typecheck does the same against dist/. D7 found what
 * that misses: Drawer's Directions snippet declared its hooks at module scope,
 * so it threw "Invalid hook call" the moment it was imported, and it had passed
 * every gate. A snippet that compiles and throws is a copy button that ships a
 * crash.
 *
 * So each snippet is imported and rendered here, as a consumer would run it:
 * `@chumlab/ui` resolves through the package's `exports` to dist/ (see the
 * "snippets" project in vitest.config.ts), JSX is React's own runtime, and the
 * environment is the unit tier's jsdom setup (ResizeObserver, matchMedia and
 * scrollIntoView stubs), with `prefers-reduced-motion` answered as a browser
 * with no preference answers it. A snippet fails on:
 *   - a throw while importing it, or while rendering it;
 *   - a React error reported during the mount, or any `console.error`;
 *   - an empty render: nothing in its container and nothing portalled out.
 *
 * The population is the react flavour's directory, read here, not a list. The
 * next flavour is the same file with a `"use client"` line where the snippet
 * holds state; the build writes both from one source, so mounting it again
 * would mount the same code twice.
 *
 * `SNIPPET_MOUNT_DIR` points the gate at another snippet directory — how it was
 * proven red against D7's parent. It has to sit inside the project (the module
 * loader serves nothing outside its root); node_modules/.cache is the place.
 */
import { act, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { format } from "node:util";
import { describe, expect, it, vi } from "vitest";
import { setReducedMotion } from "../../test/matchMedia.js";

const ROOT = process.cwd();
const DIR = resolve(process.env.SNIPPET_MOUNT_DIR ?? join(ROOT, "scripts/consumers/_app/snippets/demo/react"));
const DIST = join(ROOT, "dist");

interface Mounted {
  name: string;
  problem: string | null;
  empty: boolean;
  /** Rendered an element carrying `cl-s`, the marker only dist/'s JSX runtime adds. */
  fromDist?: boolean;
}

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const firstLine = (e: unknown) => (e instanceof Error ? `${e.name}: ${e.message}` : String(e)).split("\n")[0].slice(0, 240);

async function mount(file: string): Promise<Mounted> {
  const name = file.split("/").pop()!.replace(/\.tsx$/, "");
  const errors: string[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(format(...args));
  });
  const onWindowError = (event: ErrorEvent) => errors.push(firstLine(event.error ?? event.message));
  window.addEventListener("error", onWindowError);
  const container = document.createElement("div");
  document.body.appendChild(container);
  const bodyBefore = document.body.childElementCount;
  let root: ReturnType<typeof createRoot> | null = null;
  try {
    let mod: { default?: unknown };
    try {
      mod = await import(/* @vite-ignore */ file);
    } catch (e) {
      return { name, problem: `throws at import: ${firstLine(e)}`, empty: false };
    }
    if (typeof mod.default !== "function") return { name, problem: "has no default-exported component", empty: false };
    const Example = mod.default as ComponentType;
    root = createRoot(container, {
      onUncaughtError: (e) => errors.push(`uncaught: ${firstLine(e)}`),
      onCaughtError: (e) => errors.push(`caught: ${firstLine(e)}`),
      onRecoverableError: (e) => errors.push(`recoverable: ${firstLine(e)}`),
    });
    try {
      await act(async () => {
        root!.render(<Example />);
      });
      // Effects that schedule a task (a lazy half, a measured layout) settle here.
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
    } catch (e) {
      return { name, problem: `throws at render: ${firstLine(e)}`, empty: false };
    }
    const empty = container.childNodes.length === 0 && document.body.childElementCount === bodyBefore;
    const fromDist = document.body.querySelector(".cl-s") !== null;
    if (errors.length) return { name, problem: `reports an error: ${firstLine(errors[0])}`, empty, fromDist };
    return { name, problem: null, empty, fromDist };
  } finally {
    if (root) {
      try {
        await act(async () => root!.unmount());
      } catch {
        /* an unmount failure after a reported problem adds nothing */
      }
    }
    container.remove();
    document.body.replaceChildren();
    window.removeEventListener("error", onWindowError);
    spy.mockRestore();
  }
}

async function mountAll(dir: string) {
  // The unit stub answers no media query until told (src/test/matchMedia.ts),
  // so a component that reads one throws. A consumer's browser does answer:
  // no motion preference. This is the only query dist/ asks; a new one throws
  // here and has to be given its default answer, rather than being guessed.
  setReducedMotion(false);
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx")).sort().map((f) => join(dir, f));
  const results: Mounted[] = [];
  for (const file of files) results.push(await mount(file));
  return results;
}

describe("snippet mount gate", () => {
  it("mounts every generated snippet without a throw, an error or an empty render", async () => {
    expect(existsSync(DIST), "dist/ is missing: run `npm run build:lib` first. Snippets mount against the built package, as a consumer's do.").toBe(true);
    expect(existsSync(DIR), `no snippet directory at ${DIR}: run \`node scripts/build-demo-snippets.mjs\``).toBe(true);
    const results = await mountAll(DIR);
    const failed = results.filter((r) => r.problem);
    const empty = results.filter((r) => !r.problem && r.empty);
    const mounted = results.length - failed.length - empty.length;
    const verdict = failed.length || empty.length ? "FAIL" : "ok";
    const fromDist = results.filter((r) => r.fromDist).length;
    console.log(
      `SNIPPET_MOUNT snippets=${results.length} mounted=${mounted} failed=${failed.length} empty=${empty.length} ` +
        `(library markup from dist/ in ${fromDist}) ${verdict}`,
    );
    for (const f of failed) console.log(`  FAILED ${f.name}: ${f.problem}`);
    for (const e of empty) console.log(`  EMPTY  ${e.name}`);
    // A gate that mounts nothing passes vacuously.
    expect(results.length, "no snippet was found to mount").toBeGreaterThan(0);
    // `cl-s` is added by the JSX runtime dist/ is compiled with, and by nothing
    // here, so its absence everywhere means @chumlab/ui did not resolve to dist/.
    expect(fromDist, "no snippet rendered dist/'s markup: @chumlab/ui is not resolving to dist/").toBeGreaterThan(0);
    expect([...failed.map((f) => `${f.name}: ${f.problem}`), ...empty.map((e) => `${e.name}: rendered nothing`)]).toEqual([]);
  });

  /**
   * The plant goes through `mount` itself, on a snippet written to a scratch
   * directory: a hook at module scope, the shape D7 shipped. Proven here on
   * every run, so the gate cannot quietly lose the ability to fail.
   */
  it("self-check: fails a snippet that calls a hook at module scope, and one that renders nothing", async () => {
    // Inside the project: the module loader serves nothing outside its root.
    // node_modules/.cache is ignored by git and by every other gate.
    const cache = join(ROOT, "node_modules/.cache");
    mkdirSync(cache, { recursive: true });
    const dir = mkdtempSync(join(cache, "snippet-mount-plant-"));
    try {
      writeFileSync(
        join(dir, "Planted__Module-Hook.tsx"),
        'import { useState } from "react";\nconst [open] = useState(false);\nexport default function Example() {\n  return <p>{String(open)}</p>;\n}\n',
      );
      writeFileSync(join(dir, "Planted__Empty.tsx"), "export default function Example() {\n  return null;\n}\n");
      const results = await mountAll(dir);
      const byName = Object.fromEntries(results.map((r) => [r.name, r]));
      // Failing for the hook, not for any import failure: a plant that cannot be
      // found would "fail" too, and prove nothing.
      expect(byName["Planted__Module-Hook"].problem).toMatch(/throws at import: .*(Invalid hook call|reading 'useState')/);
      expect(byName["Planted__Empty"]).toMatchObject({ problem: null, empty: true });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
