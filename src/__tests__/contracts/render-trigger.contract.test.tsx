/** @jsxImportSource react */
/**
 * `renderTrigger(triggerProps, state)`: the first argument is exactly what the
 * default trigger puts on its own element, and nothing else.
 *
 * The five components that accept a custom trigger handed it one bag holding
 * the element's attributes AND `isOpen`, `selectedOption(s)`, `displayValue`
 * and `placeholder`. The documented use — spread it onto a `<button>` — put
 * those on the DOM: React warned about each one, and `selectedOption` landed as
 * `[object Object]`. Three of the five also wrote the attribute list out twice,
 * once per branch, and the copies had drifted: only SearchableDropdown passed
 * `type="button"`, so a custom trigger inside a `<form>` submitted it, and
 * CascadingDropdown's custom trigger never got `aria-controls`.
 *
 * So, per component:
 * - spreading the first argument onto a `<button>` raises no React prop warning,
 *   and every key in it is something an element can carry;
 * - the custom trigger ends up with the default trigger's attributes and event
 *   handlers, closed and open, class and children aside;
 * - the second argument carries the state, and the first carries none of it.
 *
 * The population is every component whose own props declare `renderTrigger`,
 * read from source. One with no fixture passing `renderTrigger` fails rather
 * than being skipped: the fixture supplies the props it renders with.
 */
import { describe, expect, it, afterEach, beforeEach, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { componentNames } from "../../test/emittedAttributes.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry) ? [path] : [];
  });

/** Whether a component's own `…Props` declarations include `renderTrigger`. */
const acceptsRenderTrigger = (name: string): boolean =>
  sourceFiles(join(process.cwd(), "src/components", name)).some((file) => {
    const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    let found = false;
    const visit = (node: ts.Node): void => {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text.startsWith(name) &&
        node.name.text.endsWith("Props")
      ) {
        const scan = (n: ts.Node): void => {
          if (ts.isPropertySignature(n) && n.name.getText(sf) === "renderTrigger") found = true;
          ts.forEachChild(n, scan);
        };
        scan(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return found;
  });

const POPULATION = componentNames().filter(acceptsRenderTrigger);

/** The state a trigger needs to draw itself, which is not an attribute of it. */
const STATE_KEYS = ["isOpen", "selectedOption", "selectedOptions", "displayValue", "placeholder"];

/** A key an element can carry: an attribute, an event handler, or the ref. */
const DOM_KEY = /^(ref|id|role|type|disabled|tabIndex|aria-[a-z]+|data-[a-z-]+|on[A-Z][A-Za-z]+)$/;

/** React's own warnings for a prop that does not belong on a DOM element. */
const PROP_WARNING =
  /React does not recognize the|Invalid value for prop|Received `(true|false)` for a non-boolean attribute|Unknown event handler property|is using incorrect casing/;

/** Attributes on the trigger element, `class` aside, values normalised where they are generated ids. */
const attributesOf = (el: Element) => {
  const ids = new Set([...document.querySelectorAll("[id]")].map((n) => n.id));
  return Object.fromEntries(
    [...el.attributes]
      .filter((a) => a.name !== "class" && a.name !== "data-contract-trigger")
      .map((a) => [
        a.name,
        a.value
          .split(/\s+/)
          // React's `useId` output in each of its formats (`_r_7_`, `«r7»`,
          // `:r7:`), wherever it sits in a derived id like `_r_7_-listbox`: the
          // two renders are separate mounts, so the ids differ by construction.
          .map((part) => (ids.has(part) ? "<id>" : part.replace(/_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g, "<id>")))
          .join(" "),
      ]),
  );
};

/** The event handlers React holds for an element — attributes cannot show them. */
const handlersOf = (el: Element): string[] => {
  const key = Object.keys(el).find((k) => k.startsWith("__reactProps$"));
  const props = key ? ((el as unknown as Record<string, Record<string, unknown>>)[key] ?? {}) : {};
  return Object.keys(props)
    .filter((k) => /^on[A-Z]/.test(k) && typeof props[k] === "function")
    .sort();
};

describe("renderTrigger contract", () => {
  it("derives a non-empty population from the components' own props", () => {
    console.log(`RENDER_TRIGGER population ${POPULATION.length}: ${POPULATION.join(", ")}`);
    expect(POPULATION.length, "no component declares renderTrigger — the derivation read nothing").toBeGreaterThan(0);
  });

  for (const name of POPULATION) {
    describe(name, () => {
      const entry = COMPONENTS.find((c) => c.name === name);
      const Comp = entry?.Component ?? (() => null);
      const fixture = fixturesFor(name).find((f) => f.props && "renderTrigger" in f.props);
      const base = (() => {
        const { renderTrigger: _ignored, ...rest } = (fixture?.props ?? {}) as Record<string, unknown>;
        return { ...(entry?.props ?? {}), ...rest };
      })();

      it("has a fixture that passes renderTrigger, which supplies the props to render with", () => {
        expect(entry, `${name} is not in the contract registry`).toBeDefined();
        expect(fixture, `${name} accepts renderTrigger and no fixture of it passes one`).toBeDefined();
      });

      it("hands the first argument only what an element can carry, with no React prop warning", () => {
        const errors: string[] = [];
        const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
          errors.push(args.map(String).join(" "));
        });
        let first: Record<string, unknown> = {};
        try {
          render(
            <Comp
              {...base}
              renderTrigger={(triggerProps: Record<string, unknown>) => {
                first = triggerProps;
                return <button {...triggerProps} data-contract-trigger="" />;
              }}
            />,
          );
        } finally {
          spy.mockRestore();
        }
        const foreign = Object.keys(first).filter((k) => !DOM_KEY.test(k));
        const warnings = errors.filter((e) => PROP_WARNING.test(e));
        expect(foreign, `${name}: keys in triggerProps that are not attributes, handlers or the ref`).toEqual([]);
        expect(warnings, `${name}: React warned while spreading triggerProps onto a <button>`).toEqual([]);
      });

      for (const open of [false, true]) {
        it(`gives the custom trigger the default trigger's attributes and handlers (${open ? "open" : "closed"})`, () => {
          const props = { ...base, defaultOpen: open };
          const def = render(<Comp {...props} />);
          const defaultEl = def.container.querySelector("[aria-haspopup]")!;
          const expected = { attributes: attributesOf(defaultEl), handlers: handlersOf(defaultEl) };
          def.unmount();
          cleanup();

          const custom = render(
            <Comp
              {...props}
              renderTrigger={(triggerProps: Record<string, unknown>) => (
                <button {...triggerProps} data-contract-trigger="" />
              )}
            />,
          );
          const customEl = custom.container.querySelector("[data-contract-trigger]")!;
          const actual = { attributes: attributesOf(customEl), handlers: handlersOf(customEl) };
          expect(actual, `${name}: the custom trigger differs from the default one`).toEqual(expected);
        });
      }

      it("passes the state as the second argument, and none of it in the first", () => {
        let first: Record<string, unknown> = {};
        let second: Record<string, unknown> | undefined;
        render(
          <Comp
            {...base}
            renderTrigger={(triggerProps: Record<string, unknown>, state?: Record<string, unknown>) => {
              first = triggerProps;
              second = state;
              return <button {...triggerProps} data-contract-trigger="" />;
            }}
          />,
        );
        expect(second, `${name}: renderTrigger received no second argument`).toBeDefined();
        const stateKeys = Object.keys(second ?? {});
        expect(stateKeys, `${name}: state is missing isOpen or placeholder`).toEqual(
          expect.arrayContaining(["isOpen", "placeholder"]),
        );
        expect(
          stateKeys.some((k) => ["selectedOption", "selectedOptions", "displayValue"].includes(k)),
          `${name}: state carries no value (selectedOption, selectedOptions or displayValue)`,
        ).toBe(true);
        expect(
          stateKeys.filter((k) => !STATE_KEYS.includes(k)),
          `${name}: state carries keys that are not state`,
        ).toEqual([]);
        expect(
          Object.keys(first).filter((k) => STATE_KEYS.includes(k)),
          `${name}: triggerProps still carries state`,
        ).toEqual([]);
      });
    });
  }
});
