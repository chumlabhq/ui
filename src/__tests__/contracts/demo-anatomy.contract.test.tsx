/** @jsxImportSource react */
/**
 * Every page's Anatomy says what the types say, and draws a tag tree only for
 * what a consumer must assemble.
 *
 * Three things fail here:
 *   - a slot table that disagrees with the types: a `classes` key the table
 *     lacks or invents, or a description that is not the key's own JSDoc. The
 *     expected rows are read from the type checker in this file, not from the
 *     generator whose output the page renders, so a stale generated file fails;
 *   - a composing component with no tag tree;
 *   - a component that does not compose showing a required tree. Optional
 *     sub-tags (Modal's, Drawer's) are a usage pattern with every part optional.
 *
 * "Composing" is the narrow rule: a consumer must place a second public tag
 * for the component to work. The three that do are proved here at runtime by
 * the evidence, not taken from the generator's declaration: the throw, or the
 * empty render. So is the other side for Modal and Drawer: each renders its
 * children with none of its sub-tags.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ts from "typescript";
import type { ReactElement } from "react";
import { publicViews } from "../../test/demoScenarios.js";
import { ComponentAnatomy } from "../../pages/demo/components/ComponentDocs.js";
import { COMPONENT_DOCS, type ComponentDoc } from "../../pages/demo/generated/componentDocs.js";
import { Accordion, AccordionItem } from "../../components/Accordion/index.js";
import { RadioButton } from "../../components/RadioButton/index.js";
import { useToast } from "../../components/Toast/index.js";
import { Modal } from "../../components/Modal/index.js";
import { Drawer } from "../../components/Drawer/index.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

/** Whether rendering this throws, with React's error report kept off the log. */
const throws = (node: ReactElement) => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    render(node);
    return false;
  } catch {
    return true;
  } finally {
    spy.mockRestore();
    cleanup();
  }
};

/** The components a consumer must assemble, each with the evidence. */
const MUST_ASSEMBLE: Record<string, { evidence: string; proves: () => boolean }> = {
  Accordion: {
    evidence: "AccordionItem throws outside an Accordion, and an Accordion with no items renders no trigger",
    proves: () => {
      const outside = throws(<AccordionItem value="a">x</AccordionItem>);
      const view = render(<Accordion selectionMode="single">{null}</Accordion>);
      const empty = view.container.querySelectorAll("button").length === 0;
      cleanup();
      return outside && empty;
    },
  },
  RadioButton: {
    evidence: "RadioButton throws outside a RadioGroup",
    proves: () => throws(<RadioButton value="a" label="A" />),
  },
  Toast: {
    evidence: "useToast() throws outside a ToastProvider",
    proves: () => {
      const Uses = () => {
        useToast();
        return null;
      };
      return throws(<Uses />);
    },
  },
};

/** Components whose sub-tags are optional, each shown working without them. */
const WORKS_ALONE: Record<string, () => boolean> = {
  Modal: () => {
    setReducedMotion(true);
    const view = render(<Modal open onOpenChange={() => {}} title="Title">Body without parts</Modal>);
    const ok = (view.baseElement.textContent ?? "").includes("Body without parts");
    cleanup();
    return ok;
  },
  Drawer: () => {
    setReducedMotion(true);
    const view = render(<Drawer open onOpenChange={() => {}} aria-label="D">Body without parts</Drawer>);
    const ok = (view.baseElement.textContent ?? "").includes("Body without parts");
    cleanup();
    return ok;
  },
};

/** The slots, from the types: every public `classes` prop's type, once per map. */
function slotsFromTypes(): Map<string, { rows: Map<string, string> }> {
  const { dirs, views } = publicViews();
  const byDir = new Map<string, { rows: Map<string, string> }>();
  for (const dir of dirs) byDir.set(dir, { rows: new Map() });
  for (const view of views) {
    const classes = view.props.find((p) => p.name === "classes");
    if (!classes) continue;
    const { checker } = view;
    const type = checker.getNonNullableType(classes.type);
    const map = /\b(\w+)Classes\b/.exec(checker.typeToString(type))?.[1];
    if (!map) continue;
    const entry = byDir.get(view.id.split("/")[0])!;
    for (const property of checker.getPropertiesOfType(type)) {
      const doc = ts.displayPartsToString(property.getDocumentationComment(checker)).replace(/\s+/g, " ").trim();
      entry.rows.set(`${map}.${property.getName()}`, doc);
    }
  }
  return byDir;
}

/** What the page renders, from `ComponentAnatomy`. */
function rendered(name: string, doc?: ComponentDoc) {
  const view = render(<MemoryRouter><ComponentAnatomy name={name} doc={doc} /></MemoryRouter>);
  const rows = new Map(
    [...view.container.querySelectorAll("[data-slot]")].map((row) => [
      row.getAttribute("data-slot")!,
      (row.querySelectorAll("td")[2]?.textContent ?? "").replace(/\s+/g, " ").trim(),
    ]),
  );
  const tree = view.container.querySelector("[data-anatomy='tree']")?.textContent ?? null;
  const usage = view.container.querySelector("[data-anatomy='usage']")?.textContent ?? null;
  cleanup();
  return { rows, tree, usage };
}

/** Markdown the page renders as code or emphasis reads as plain text. */
const plain = (text: string) => text.replace(/`|\*\*/g, "").replace(/\s+/g, " ").trim();

const types = slotsFromTypes();

function anatomyErrors(name: string, doc?: ComponentDoc): string[] {
  const errors: string[] = [];
  const page = rendered(name, doc);
  const expected = types.get(name)?.rows ?? new Map();
  for (const [slot, description] of expected) {
    if (!page.rows.has(slot)) errors.push(`${name}: the slot table lacks ${slot}, which the types declare`);
    else if (page.rows.get(slot) !== plain(description))
      errors.push(`${name}: ${slot} reads "${page.rows.get(slot)}", and its JSDoc says "${plain(description)}"`);
  }
  for (const slot of page.rows.keys()) if (!expected.has(slot)) errors.push(`${name}: the slot table shows ${slot}, which the types do not declare`);

  const composes = name in MUST_ASSEMBLE;
  if (composes && !page.tree) errors.push(`${name}: composes and shows no tag tree`);
  if (composes && page.tree && !page.tree.includes("required")) errors.push(`${name}: its tag tree marks no tag required`);
  if (!composes && page.tree) errors.push(`${name}: does not compose and shows a required tag tree`);
  if (page.usage?.includes("required")) errors.push(`${name}: its usage pattern marks a part required`);
  return errors;
}

describe("demo anatomy", () => {
  it("each composing component is proved by its evidence, and each optional one works alone", () => {
    const unproved = Object.entries(MUST_ASSEMBLE).filter(([, c]) => !c.proves()).map(([name, c]) => `${name}: ${c.evidence}`);
    const needsParts = Object.entries(WORKS_ALONE).filter(([, works]) => !works()).map(([name]) => `${name} did not render its children without its sub-tags`);
    expect([...unproved, ...needsParts]).toEqual([]);
  });

  it("every page's anatomy agrees with the types and the rule", () => {
    const names = [...types.keys()];
    const errors = names.flatMap((name) => anatomyErrors(name));
    const slots = [...types.values()].reduce((n, t) => n + t.rows.size, 0);
    const trees = names.filter((n) => COMPONENT_DOCS[n]?.parts.tree);
    const usage = names.filter((n) => COMPONENT_DOCS[n]?.parts.usage);
    console.log(
      `DEMO_ANATOMY pages ${names.length}, slots ${slots}, tag trees ${trees.length} (${trees.join(", ")}), usage patterns ${usage.length} (${usage.join(", ")})`,
    );
    expect(names.length).toBeGreaterThanOrEqual(30);
    expect(errors).toEqual([]);
  });
});

describe("demo anatomy: each rule has a plant", () => {
  const copy = (name: string): ComponentDoc => JSON.parse(JSON.stringify(COMPONENT_DOCS[name])) as ComponentDoc;
  const red = (name: string, errors: string[], expected: RegExp) => {
    for (const e of errors) console.log(`DEMO_ANATOMY_PLANT ${name}: ${e}`);
    expect(errors.some((e) => expected.test(e)), `${name}: ${JSON.stringify(errors)}`).toBe(true);
  };

  it("a slot table missing a slot the types declare", () => {
    const doc = copy("Switch");
    doc.parts.slots = doc.parts.slots.filter((s) => s.slot !== "thumb");
    red("missing slot", anatomyErrors("Switch", doc), /^Switch: the slot table lacks Switch\.thumb/);
  });

  it("a slot described by something other than its JSDoc", () => {
    const doc = copy("Switch");
    doc.parts.slots = doc.parts.slots.map((s) => (s.slot === "control" ? { ...s, description: "Written by hand." } : s));
    red("drifted description", anatomyErrors("Switch", doc), /^Switch: Switch\.control reads "Written by hand\."/);
  });

  it("a composing component with no tag tree", () => {
    const doc = copy("Accordion");
    doc.parts.tree = null;
    red("no tree", anatomyErrors("Accordion", doc), /^Accordion: composes and shows no tag tree$/);
  });

  it("a non-composing component showing a required tree", () => {
    const doc = copy("Modal");
    doc.parts.tree = (doc.parts.usage ?? []).map((line) => ({ ...line, mark: line.mark ? "required" : "" }));
    red("required tree on Modal", anatomyErrors("Modal", doc), /^Modal: does not compose and shows a required tag tree$/);
  });
});
