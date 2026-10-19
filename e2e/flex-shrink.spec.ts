import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import type { Page } from "@playwright/test";
import { test, expect } from "./_test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { markPortalRoots, PORTAL_MARK } from "./_portals";

/**
 * A flex child that holds a field or a line that cannot wrap shrinks with its
 * row, at phone widths.
 *
 * A flex item's minimum width is `auto`, which for an `<input>` is its
 * intrinsic width and for `white-space: nowrap` text is the whole line. So
 * `flex-1` alone lets the item grow but never shrink below its content, and
 * when the row is narrower than that the content runs out of it.
 * InternationalPhoneInput's number input did exactly that: 196 px wide in
 * Chromium, 227 in Firefox, 216 in WebKit, in a row that is 248 px at a 280 px
 * viewport once the country trigger takes its 110 — the row's content ran 66 to
 * 121 px past its edge, and the document scrolled sideways.
 *
 * The cases are read from source: every class string in `src/components` that
 * grows a flex child. Each fixture of a component that owns one is opened at
 * 280, 320 and 360 px — 320 is the README's floor, 360 the docs' phone frame,
 * 280 the margin below both — inside a 16 px gutter, which is what
 * `PreviewRoute` gives the docs' phone frames (`p-4`). Then every child of a
 * flex row that grows and holds a field or nowrap text is read, whether or not
 * a class string claims it, and its row must not scroll: `scrollWidth` may not
 * exceed `clientWidth` by any amount. Both are integers read off the same
 * layout, and across 1083 rows in each engine every row that fits read them
 * equal, so there is no rounding slack to allow for.
 *
 * What this does not see: a row whose container is sized to its content. Such
 * a row grows with the item instead of overflowing, and the overflow lands on
 * an ancestor — SearchableDropdown's list in Firefox grows past a 280 px
 * viewport that way. That is a different cause (the surface is not bounded by
 * the viewport) and is not asserted here.
 */

const WIDTHS = [280, 320, 360] as const;

/** The cases step 0 of A1 found rendered; a walk that reaches fewer has lost fixtures or states, not defects. */
const FLOOR = 18;

/**
 * Class strings that grow a flex child but hold nothing this asserts, each with
 * why. One reached by the walk fails as an exclusion that no longer applies, and
 * one no longer in source fails as stale.
 */
const EXCLUDED: Record<string, string> = {
  'Accordion "flex-1 text-left"': "the item's title, which wraps",
  'Accordion "flex-1 space-y-2"': "AccordionShimmer's skeleton bars; no text",
  'MultiSelectDropdown "flex-1 h-4 bg-cl-bg-skeleton rounded animate-pulse"': "a skeleton bar; no text",
  'Stepper "flex-1 min-w-2 px-1 sm:min-w-4 sm:px-2"': "the connector between steps; no text",
  'Table "flex-1"': "an empty spacer in the header cell",
  'Table "min-w-0 flex-1"':
    "rendered only with pinned columns, a maxHeight and a sticky header or footer, which no fixture combines",
  'TimePicker "flex-1"': "an option's time, which wraps",
  'Toast "flex-1 min-w-0"': "the title and body, which wrap",
};

/** The site's home-page catalogue lives in `src/components` but is no library export and has no fixtures. */
const OUTSIDE_LIBRARY = ["CatalogSection.tsx"];

const COMPONENTS = resolve(process.cwd(), "src/components");
const GROWS = /(?:^|\s)(?:flex-1|grow|flex-grow|flex-auto|grow-\[[^\]]+\])(?=\s|$)/;

type Case = { key: string; owner: string; tokens: string[]; at: string[] };

/** Every class string under `src/components` that grows a flex child, by owner and string. */
function casesFromSource(): Case[] {
  const byKey = new Map<string, Case>();
  const files = (readdirSync(COMPONENTS, { recursive: true }) as string[]).filter(
    (f) => /\.tsx?$/.test(f) && !f.includes("__tests__") && !OUTSIDE_LIBRARY.includes(f),
  );
  for (const file of files) {
    const path = resolve(COMPONENTS, file);
    const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
      if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && GROWS.test(node.text)) {
        const owner = file.split("/")[0];
        const tokens = node.text.trim().split(/\s+/);
        const key = `${owner} "${tokens.join(" ")}"`;
        const at = `${relative(process.cwd(), path)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;
        const known = byKey.get(key);
        if (known) known.at.push(at);
        else byKey.set(key, { key, owner, tokens, at: [at] });
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return [...byKey.values()];
}

/** A component and the components its source imports: where a class string it renders can come from, nearest first. */
function ownersFor(component: string): string[] {
  const deps = new Set<string>();
  const dir = resolve(COMPONENTS, component);
  for (const file of readdirSync(dir, { recursive: true }) as string[]) {
    if (!/\.tsx?$/.test(file) || file.includes("__tests__")) continue;
    for (const m of readFileSync(resolve(dir, file), "utf8").matchAll(/from "(?:\.\.\/)+([A-Z]\w+)\//g)) {
      if (m[1] !== component) deps.add(m[1]);
    }
  }
  return [component, ...deps];
}

type Row = { key: string | null; el: string; client: number; scroll: number };

/**
 * Every growing flex child in the fixture and its portals that holds a field
 * or nowrap text, with its row's widths — read until two reads two frames
 * apart agree, since a surface placed against the viewport is re-placed after
 * a resize.
 */
async function growingRows(page: Page, cases: Case[], owners: string[]): Promise<Row[]> {
  await markPortalRoots(page);
  return page.evaluate(
    async ({ cases, owners, portal }) => {
      const read = () => {
        const rows: Row[] = [];
        const scope = document.querySelectorAll(`[data-fixture] *, [${portal}] *`);
        for (const el of scope) {
          const row = el.parentElement!;
          const own = getComputedStyle(el);
          const parent = getComputedStyle(row);
          if (!parent.display.includes("flex") || !parent.flexDirection.startsWith("row")) continue;
          if (parseFloat(own.flexGrow) <= 0 || el.getClientRects().length === 0) continue;
          const field = el.matches("input:not([type=hidden]), textarea") || !!el.querySelector("input:not([type=hidden]), textarea");
          const nowrap = [el, ...el.querySelectorAll("*")].some(
            (x) => /nowrap|^pre$/.test(getComputedStyle(x).whiteSpace) && [...x.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()),
          );
          if (!field && !nowrap) continue;
          const classes = [...el.classList];
          const fits = cases.filter((c) => c.tokens.every((t) => classes.includes(t)));
          const most = Math.max(0, ...fits.map((c) => c.tokens.length));
          const best = fits.filter((c) => c.tokens.length === most);
          const owned = owners.map((o) => best.filter((c) => c.owner === o)).find((list) => list.length) ?? best;
          rows.push({
            key: owned.length === 1 ? owned[0].key : null,
            el: `${el.tagName.toLowerCase()}.${classes.slice(0, 3).join(".")}`,
            client: row.clientWidth,
            scroll: row.scrollWidth,
          });
        }
        return rows;
      };
      const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      let last = JSON.stringify(read());
      for (let i = 0; i < 30; i++) {
        await frames();
        const now = JSON.stringify(read());
        if (now === last) return JSON.parse(now) as Row[];
        last = now;
      }
      throw new Error("the rows never stopped changing across 30 double frames");
    },
    { cases, owners, portal: PORTAL_MARK },
  );
}

/** The act, the harness's still-document answer and the fonts; a fixture that never settles is named, not read. */
async function settle(page: Page, id: string): Promise<void> {
  await page
    .waitForFunction(
      () => {
        const main = document.querySelector("main[data-fixture-act]");
        const act = main?.getAttribute("data-fixture-act");
        const still = main?.getAttribute("data-fixture-still");
        return act && act !== "pending" && still && still !== "pending" ? act : null;
      },
      undefined,
      { timeout: 30000 },
    )
    .catch((error: Error) => {
      throw new Error(`${id} never reported a settled act and a still document: ${error.message}`);
    });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/**
 * The phone frame's gutter, and no motion. A spinning loader's rotated box
 * counts toward its row's scrollable overflow — InternationalPhoneInput's
 * loading row read 1 to 3 px wider than its children, by frame — which is
 * paint, not a child that failed to shrink.
 */
const FRAME =
  "main[data-fixture-act] { padding: 16px !important; } " +
  "*, *::before, *::after { animation: none !important; transition: none !important; }";

test("a growing flex child holding a field or nowrap text shrinks with its row", async ({ page }) => {
  test.setTimeout(1_800_000);
  const cases = casesFromSource();
  const excluded = cases.filter((c) => c.key in EXCLUDED);
  const expected = cases.filter((c) => !(c.key in EXCLUDED));
  const owners = [...new Set(cases.map((c) => c.owner))];
  const at = new Map(cases.map((c) => [c.key, c.at.join(", ")]));

  await gotoFixtureIndex(page);
  const paths = (
    await page.locator("[data-fixture-index] li a").evaluateAll((els) => els.map((e) => new URL((e as HTMLAnchorElement).href).pathname))
  ).filter((path) => owners.includes(path.split("/")[2].split(".")[0]));

  const reached = new Set<string>();
  const overflowing: string[] = [];
  let rows = 0;
  let unattributed = 0;
  for (const path of paths) {
    const id = path.replace("/__fixtures/", "");
    await page.setViewportSize({ width: WIDTHS[0], height: 640 });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await settle(page, id);
    await page.addStyleTag({ content: FRAME });
    const near = ownersFor(id.split(/[./]/)[0]);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 640 });
      for (const r of await growingRows(page, cases, near)) {
        rows += 1;
        if (r.key) reached.add(r.key);
        else unattributed += 1;
        if (r.scroll > r.client) overflowing.push(`${id} at ${width}px: ${r.key ? at.get(r.key) : r.el} — row ${r.client}, content ${r.scroll} (+${r.scroll - r.client})`);
      }
    }
  }

  const missing = expected.filter((c) => !reached.has(c.key)).map((c) => `${c.key} (${c.at.join(", ")})`);
  const stillExcluded = excluded.filter((c) => reached.has(c.key)).map((c) => c.key);
  const stale = Object.keys(EXCLUDED).filter((key) => !cases.some((c) => c.key === key));
  const findings = [...new Set(overflowing)];
  console.log(
    `FLEX_SHRINK cases ${reached.size} (floor ${FLOOR}, expected ${expected.length}, excluded ${excluded.length}), ` +
      `rows ${rows} (unattributed ${unattributed}), fixtures ${paths.length} x ${WIDTHS.length} widths, overflowing ${findings.length}`,
  );
  for (const f of findings) console.log(`FLEX_SHRINK_FINDING ${f}`);

  expect(reached.size, "fewer cases than step 0 counted: the walk lost fixtures or states").toBeGreaterThanOrEqual(FLOOR);
  expect(missing, "class strings that grow a flex child and that no fixture reached — reach them, or exclude them with a reason").toEqual([]);
  expect(stillExcluded, "excluded, but the walk found them holding a field or nowrap text: the exclusion no longer applies").toEqual([]);
  expect(stale, "exclusions naming a class string no longer in source").toEqual([]);
  expect(findings, "a growing flex child that cannot shrink below its content runs out of its row — give it min-w-0").toEqual([]);
});

/**
 * The plant goes through the real component and the real read: the number
 * input's own `min-w-0` overridden back to `min-w-auto` through the fixture's
 * `classes`, which is the defect exactly, and the same fixture without it.
 */
test("the check reports a growing field that cannot shrink, and clears it once it can", async ({ page }) => {
  const [found] = casesFromSource().filter((c) => c.at.some((at) => at.startsWith("src/components/InternationalPhoneInput/")) && c.tokens.includes("h-10"));
  expect(found?.tokens, "InternationalPhoneInput's number input no longer carries min-w-0: re-point the plant").toContain("min-w-0");
  // Matched without the class the plant overrides, so the planted input is still read as this case.
  const input = { ...found, tokens: found.tokens.filter((t) => t !== "min-w-0") };
  const near = ownersFor("InternationalPhoneInput");
  const at = async (classes: Record<string, string> | undefined) => {
    await page.setViewportSize({ width: WIDTHS[0], height: 640 });
    await gotoFixture(page, "InternationalPhoneInput", "default", classes ? { classes } : undefined);
    await settle(page, "InternationalPhoneInput/default");
    await page.addStyleTag({ content: FRAME });
    return (await growingRows(page, [input], near)).filter((r) => r.key === input.key);
  };

  const planted = await at({ input: "min-w-auto" });
  const clean = await at(undefined);
  const widths = (rows: Row[]) => rows.map((r) => `row ${r.client}, content ${r.scroll}`).join("; ");
  console.log(`FLEX_SHRINK_SELF_CHECK ${input.at.join(", ")}: planted ${widths(planted)}; clean ${widths(clean)}`);
  expect(planted.length, "the plant's input was not read at all").toBe(1);
  expect(planted[0].scroll, "an input held at its intrinsic width did not overflow a 248 px row").toBeGreaterThan(planted[0].client);
  expect(clean.map((r) => r.scroll - r.client), "the fixture overflows without the plant").toEqual([0]);
});
