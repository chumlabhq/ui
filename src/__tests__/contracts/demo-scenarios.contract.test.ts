/**
 * The demo scenario matrix is complete, and every cell in it is true.
 *
 * D12 graded 660 cells by hand — 30 components by 22 scenarios, each shown on
 * a demo section, not applicable for a reason, or missing — and the grading
 * lived in a scratch file. A demo page that dropped its only form section, a
 * component that gained `loadOptions` under an n/a that said it had no data
 * source, or a slice that added the missing demo without anyone recording it:
 * none of those changed a number anywhere.
 *
 * `docs/demo-scenarios.json` is the record, and `src/test/demoScenarios.ts`
 * holds what it is checked against: an AST index of the demo pages' sections,
 * one predicate per scenario, and one probe per n/a reason over the props walk.
 * The rules are listed on `checkMatrix`. Each one has a plant below that turns
 * it red, written against a copy of the record so the real file is never edited
 * to prove anything.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  checkMatrix,
  publicComponents,
  sectionIndex,
  type Component,
  type Matrix,
  type Section,
} from "../../test/demoScenarios.js";

const matrix = JSON.parse(readFileSync("docs/demo-scenarios.json", "utf8")) as Matrix;
const gapRatchet = (JSON.parse(readFileSync("docs/adr/002-gate-populations.json", "utf8")) as {
  ratchets?: Record<string, { value?: number }>;
}).ratchets?.["demo-scenarios-gap"]?.value;

const components = publicComponents();
const index = sectionIndex();
const context = { components, index, gapRatchet: gapRatchet ?? Number.NaN };

const copy = (): Matrix => JSON.parse(JSON.stringify(matrix)) as Matrix;
const run = (m: Matrix, overrides: Partial<typeof context> = {}) => checkMatrix(m, { ...context, ...overrides });

/** The plant's red, printed so a report can quote it and asserted so it cannot go quiet. */
const red = (name: string, errors: string[], expected: RegExp) => {
  const hit = errors.filter((e) => expected.test(e));
  for (const e of hit) console.log(`DEMO_SCENARIOS_PLANT ${name}: ${e}`);
  expect(hit, `${name} should fail with ${expected}; got ${JSON.stringify(errors)}`).not.toEqual([]);
};

describe("demo scenarios", () => {
  it("the record names a ratchet for its gaps", () => {
    expect(typeof gapRatchet, 'ratchets["demo-scenarios-gap"].value in docs/adr/002-gate-populations.json').toBe("number");
  });

  it("every cell is complete and true", () => {
    // Read from the root barrel, so a 31st component is a missing row here.
    expect(components.length).toBe(30);
    const { errors, tally, cells } = run(matrix);
    console.log(
      `DEMO_SCENARIOS cells ${cells}, shown ${tally.shown}, na ${tally.na}, gap ${tally.gap} (ratchet ${gapRatchet})`,
    );
    expect(errors).toEqual([]);
    expect(cells).toBe(660);
  });
});

describe("demo scenarios: each rule has a plant", () => {
  it("a shown cell whose section is renamed", () => {
    const cited = (matrix.components.Accordion.default as { shown: { page: string; section: string } }).shown;
    const renamed: Section[] = index.map((s) =>
      s.page === cited.page && s.title === cited.section ? { ...s, title: `${s.title} (renamed)` } : s,
    );
    red("renamed section", run(matrix, { index: renamed }).errors, /^Accordion\.default: cites "Basic Usage" .* no section there has that title$/);
  });

  it("a shown cell whose predicate fails", () => {
    const m = copy();
    // "Basic Usage" exists on the page and passes no `disabled` to anything.
    m.components.Accordion.disabled = { shown: { page: "AccordionDemo.tsx", section: "Basic Usage" } };
    red("predicate fails", run(m).errors, /^Accordion\.disabled: "Basic Usage" .* the disabled predicate does not hold on it$/);
  });

  it("an overlay shown with nothing in its section to open it", () => {
    const cited = (matrix.components.Modal.default as { shown: { page: string; section: string } }).shown;
    const untriggered: Section[] = index.map((s) =>
      s.page === cited.page && s.title === cited.section ? { ...s, setters: new Map() } : s,
    );
    red("overlay without a trigger", run(matrix, { index: untriggered }).errors, /^Modal\.default: .* no trigger in the section that sets its open state$/);
  });

  it("a phone frame whose route names no preview", () => {
    const gone: Section[] = index.map((s) =>
      s.page === "PaginationDemo.tsx" && s.title === "At phone width"
        ? { ...s, elements: s.elements.map((e) => (e.tag === "PhoneFrame" ? { ...e, attrs: new Map([...e.attrs, ["route", '"/preview/Pagination/gone"']]) } : e)) }
        : s,
    );
    red("frame naming no preview", run(matrix, { index: gone }).errors, /^Pagination\.phoneWidth: "At phone width" .* the phoneWidth predicate does not hold on it$/);
  });

  it("a failing section whose loader cannot reject", () => {
    // The section's loader is `warehouses`, from useFakeLoader; with its
    // declaration out of reach, nothing it is handed can reject.
    const plain: Section[] = index.map((s) =>
      s.page === "DropdownDemo.tsx" && s.title === "When loading fails"
        ? { ...s, declarations: new Map([...s.declarations].filter(([name]) => name !== "warehouses")) }
        : s,
    );
    red("loader that cannot reject", run(matrix, { index: plain }).errors, /^Dropdown\.failing: "When loading fails" .* the failing predicate does not hold on it$/);
  });

  it("an uncontrolled section that hands the component the page's state", () => {
    const fed: Section[] = index.map((s) =>
      s.page === "PaginationDemo.tsx" && s.title === "Uncontrolled"
        ? { ...s, elements: s.elements.map((e) => (e.tag === "Pagination" ? { ...e, attrs: new Map([...e.attrs, ["value", "{page}"]]) } : e)) }
        : s,
    );
    red("uncontrolled fed by state", run(matrix, { index: fed }).errors, /^Pagination\.uncontrolled: "Uncontrolled" .* the uncontrolled predicate does not hold on it$/);
  });

  it("an overlay mounted open with nothing in its section to mount it", () => {
    const unmounted: Section[] = index.map((s) =>
      s.page === "ModalDemo.tsx" && s.title === "Uncontrolled" ? { ...s, setters: new Map() } : s,
    );
    red("overlay never mounted", run(matrix, { index: unmounted }).errors, /^Modal\.uncontrolled: .* no trigger in the section that sets its open state$/);
  });

  it("a section titled long with no long text in it", () => {
    // Button's Basic Usage, retitled, with the real Long labels section gone.
    const retitled: Section[] = index
      .filter((s) => !(s.page === "ButtonDemo.tsx" && s.title === "Long labels"))
      .map((s) => (s.page === "ButtonDemo.tsx" && s.title === "Basic Usage" ? { ...s, title: "Long labels" } : s));
    red("long title, short text", run(matrix, { index: retitled }).errors, /^Button\.longContent: "Long labels" .* the longContent predicate does not hold on it$/);
  });

  it("an n/a whose probe goes stale", () => {
    // Accordion's read-only n/a is `no-prop:readOnly`; give it the prop.
    const grown: Component[] = components.map((c) =>
      c.dir === "Accordion" ? { ...c, props: new Set([...c.props, "readOnly"]) } : c,
    );
    red("stale probe", run(matrix, { components: grown }).errors, /^Accordion\.readOnly: the n\/a probe no-prop:readOnly is stale/);
  });

  it("a gap whose predicate passes", () => {
    const m = copy();
    m.components.Accordion.default = { gap: { reason: "planted", slice: "D12d" } };
    red("gap that is shown", run(m, { gapRatchet: context.gapRatchet + 1 }).errors, /^Accordion\.default: recorded as a gap, and .* record it as shown$/);
  });

  it("a missing cell", () => {
    const m = copy();
    delete (m.components.Accordion as Record<string, unknown>).ssr;
    red("missing cell", run(m).errors, /^missing cell: Accordion\.ssr$/);
  });

  it("a free-text n/a", () => {
    const m = copy();
    m.components.Accordion.readOnly = { na: { reason: "accordions are never read-only" } } as never;
    red("free-text n/a", run(m).errors, /^Accordion\.readOnly: n\/a needs a probe .* is free text$/);
  });

  it("the gap count moves either way without the ratchet", () => {
    red("gap ratchet rise", run(matrix, { gapRatchet: context.gapRatchet - 1 }).errors, /^gaps rose: /);
    red("gap ratchet fall", run(matrix, { gapRatchet: context.gapRatchet + 1 }).errors, /^gaps fell to /);
  });
});
