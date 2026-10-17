/** @jsxImportSource react */
/**
 * Every component page has the same skeleton, in the reader's order.
 *
 *   1. the header: name, summary and the import       <DocsHero>
 *   2. setup                                          <SetupNote>
 *   3. Anatomy: the tags you write, the slots          <ComponentAnatomy>
 *   4. the examples, the page's own sections           <Section>…
 *   5. the reference: API Reference, Data attributes, Types, CSS custom
 *      properties, Keyboard Interactions, Accessibility <ComponentDocs>
 *   6. the patterns: controlled vs uncontrolled, edge cases, do and don't
 *   7. Copy and paste                                  <CopyPasteBlock>
 *
 * Measured before D11 on the 30 pages: all 30 put Copy and paste before the
 * first example and Anatomy after the last, where a reader meets the parts
 * once they have finished reading about them; Accessibility came before
 * Keyboard Interactions; Drawer and Modal each had an example section after
 * the reference. The order is read from each page's AST — the children of the
 * element that holds <DocsHero> — and the reference's own order is read from
 * what ComponentDocs renders, since that order lives in one component.
 *
 * Each rule has a plant below, run against a copy of a page's source.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ts from "typescript";
import { readFileSync } from "node:fs";
import { publicComponents } from "../../test/demoScenarios.js";
import { ComponentDocs } from "../../pages/demo/components/ComponentDocs.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

const FLOOR = 30;
const BLOCKS: Record<string, string> = {
  DocsHero: "header",
  SetupNote: "setup",
  ComponentAnatomy: "anatomy",
  ComponentDocs: "reference",
  DocControlledPattern: "controlled",
  DocEdgeCases: "edge cases",
  DocDoDont: "do and don't",
  CopyPasteBlock: "copy and paste",
};
const SKELETON = ["header", "setup", "anatomy", "examples", "reference", "controlled", "edge cases", "do and don't", "copy and paste"];
const REFERENCE = ["API Reference", "Data attributes", "Types", "CSS custom properties", "Keyboard Interactions", "Accessibility"];

/** The page's top level, in order, with consecutive example sections folded into one "examples". */
function skeletonOf(source: string, file = "page.tsx"): string[] {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const tagOf = (n: ts.Node) =>
    ts.isJsxSelfClosingElement(n) ? n.tagName.getText(sf) : ts.isJsxElement(n) ? n.openingElement.tagName.getText(sf) : "";
  let root: ts.JsxElement | undefined;
  const find = (n: ts.Node) => {
    if (!root && ts.isJsxElement(n) && n.children.some((k) => tagOf(k) === "DocsHero")) root = n;
    ts.forEachChild(n, find);
  };
  find(sf);
  if (!root) return ["(no element holds <DocsHero>)"];
  const seq: string[] = [];
  const push = (part: string) => { if (!(part === "examples" && seq.at(-1) === "examples")) seq.push(part); };
  const walk = (kids: readonly ts.Node[]) => {
    for (const k of kids) {
      if (ts.isJsxText(k)) continue;
      if (ts.isJsxExpression(k)) {
        // `{cond && <Section>}` and comments: the elements inside, in order.
        const inner: ts.Node[] = [];
        const v = (n: ts.Node) => { if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) inner.push(n); else ts.forEachChild(n, v); };
        if (k.expression) v(k.expression);
        walk(inner);
        continue;
      }
      if (ts.isJsxFragment(k)) { walk(k.children); continue; }
      const tag = tagOf(k);
      // A plain wrapper (Input's grid of examples) is layout, not a part.
      if (/^[a-z]/.test(tag) && ts.isJsxElement(k)) { walk(k.children); continue; }
      if (tag === "Section") push("examples");
      else push(BLOCKS[tag] ?? `<${tag}>`);
    }
  };
  walk(root.children);
  return seq;
}

/** What breaks the skeleton on one page. */
function skeletonErrors(page: string, seq: string[]): string[] {
  if (seq.join(" > ") === SKELETON.join(" > ")) return [];
  const unknown = seq.filter((p) => !SKELETON.includes(p));
  return [
    `${page}: ${seq.join(" > ")}` +
      (unknown.length ? ` — not part of the skeleton: ${unknown.join(", ")}` : "") +
      `; expected ${SKELETON.join(" > ")}`,
  ];
}

/** A walk that reads fewer pages than the library has components is not a pass. */
const floorErrors = (read: number) =>
  read < FLOOR ? [`${read} component pages read, under the floor of ${FLOOR}: the walk lost pages, the pages did not pass`] : [];

const pages = publicComponents().map((c) => ({ name: c.dir, file: `src/pages/demo/${c.dir}Demo.tsx` }));

describe("demo page skeleton", () => {
  it("every component page has the skeleton, in order", () => {
    const errors = pages.flatMap((p) => skeletonErrors(p.name, skeletonOf(readFileSync(p.file, "utf8"), p.file)));
    console.log(`DEMO_SKELETON pages ${pages.length} (floor ${FLOOR}), order ${SKELETON.join(" > ")}`);
    expect([...floorErrors(pages.length), ...errors]).toEqual([]);
  });

  it("the reference renders in the skeleton's order on every page", () => {
    const wrong: string[] = [];
    for (const p of pages) {
      const view = render(<MemoryRouter><ComponentDocs name={p.name} /></MemoryRouter>);
      const titles = [...view.container.querySelectorAll("h2")].map((h) => h.textContent ?? "");
      const expected = REFERENCE.filter((t) => titles.includes(t));
      if (titles.join("|") !== expected.join("|") || titles[0] !== "API Reference") {
        wrong.push(`${p.name}: ${titles.join(" > ")}`);
      }
      cleanup();
    }
    expect(wrong, `expected a subsequence of ${REFERENCE.join(" > ")}, starting with API Reference`).toEqual([]);
  });
});

describe("demo page skeleton: each rule has a plant", () => {
  const modal = readFileSync("src/pages/demo/ModalDemo.tsx", "utf8");
  const red = (name: string, errors: string[], expected: RegExp) => {
    for (const e of errors) console.log(`DEMO_SKELETON_PLANT ${name}: ${e}`);
    expect(errors.some((e) => expected.test(e)), `${name}: ${JSON.stringify(errors)}`).toBe(true);
  };

  it("Copy and paste back above the examples", () => {
    const planted = modal
      .replace('\n      <CopyPasteBlock name="Modal" />\n', "\n")
      .replace("      <SetupNote />\n", '      <SetupNote />\n\n      <CopyPasteBlock name="Modal" />\n');
    red("copy first", skeletonErrors("Modal", skeletonOf(planted)), /setup > copy and paste > anatomy/);
  });

  it("an example section after the reference", () => {
    const planted = modal.replace('      <CopyPasteBlock name="Modal" />', '      <Section title="Late">x</Section>\n\n      <CopyPasteBlock name="Modal" />');
    red("late example", skeletonErrors("Modal", skeletonOf(planted)), /do and don't > examples > copy and paste/);
  });

  it("a page with no anatomy", () => {
    const planted = modal.replace('      <ComponentAnatomy name="Modal" />\n', "");
    red("no anatomy", skeletonErrors("Modal", skeletonOf(planted)), /^Modal: header > setup > examples/);
  });

  it("fewer pages than the floor", () => {
    red("floor", floorErrors(pages.slice(1).length), /^29 component pages read, under the floor of 30/);
  });
});
