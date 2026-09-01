/** @jsxImportSource react */
/**
 * `classes` is the documented escape hatch (llms-full.txt:44-47): a typed
 * per-slot map for parts `className` cannot reach. This asserts the one
 * guarantee it makes — a consumer value replaces the default for that slot.
 *
 * Stated as a NEGATIVE, deliberately. Two earlier attempts inferred which slots
 * had rendered by reading the default render's classes, and both were unsound:
 * slots share utilities (`flex`, `w-full`, `relative`), so "this key's tokens
 * are in the DOM" can be another element, and "this key's whole token set is on
 * one element" can be a superset coincidence. Checkbox's `labelContainer` only
 * renders when a label is passed and tripped the first; Stepper's `connector`
 * tripped the second.
 *
 * So: override a key, then assert its default is GONE. That still passes
 * trivially for a slot that never rendered — which is why it now iterates
 * FIXTURES rather than default props, and why fixtures.contract exists to prove
 * separately that every key does render somewhere. The two together close
 * GATE-HONESTY §3: this suite says the override wins, that one says there was
 * something to win. If it rendered and the override was honoured, also
 * true. It fails only when a slot rendered and kept its default anyway, which
 * is exactly the defect. No reachability inference is needed, so there is
 * nothing left to get wrong.
 */
import { describe, expect, it } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";

const candidates = COMPONENTS.filter((c) => c.supports.classes && c.defaults);

const tokensOf = (value: unknown) =>
  typeof value === "string"
    ? [...new Set(value.split(/\s+/).filter(Boolean))]
    : [];

/**
 * Tokens that identify a key uniquely within its own component. A key whose
 * every token is shared with another slot cannot be told apart from outside the
 * component, so it is skipped rather than asserted-and-excused.
 */
const identifyingTokens = (
  defaults: Record<string, string>,
  counts: Map<string, number>,
) => {
  const out = new Map<string, string[]>();
  for (const [key, value] of Object.entries(defaults)) {
    const unique = tokensOf(value).filter((t) => counts.get(t) === 1);
    if (unique.length) out.set(key, unique);
  }
  return out;
};

const elementsWithAll = (root: Element, tokens: string[]) =>
  [root, ...Array.from(root.querySelectorAll("*"))].filter((el) => {
    const cls = el.getAttribute("class");
    if (!cls) return false;
    const set = new Set(cls.split(/\s+/).filter(Boolean));
    return tokens.every((t) => set.has(t));
  });

describe("classes override contract", () => {
  it("the index reports components with a classes prop and default classes", () => {
    expect(candidates.length).toBeGreaterThan(0);
  });

  describe.each(candidates)(
    "$name",
    ({ name, Component, props, defaults, allTokenCounts }) => {
      const identifying = identifyingTokens(defaults!, allTokenCounts);
      const fixtures = fixturesFor(name);

        it("a consumer value displaces the default for every slot it renders", async () => {
        const ignored: string[] = [];

        for (const [key, tokens] of identifying) {
          const { container } = render(
            <Component {...props} classes={{ [key]: `ovr-${key}` }} />,
          );

          // The slot's identifying tokens must not survive its own override,
          // whether the component ignored the value outright or merged with it.
          if (elementsWithAll(container, tokens).length > 0) {
            ignored.push(`${key} (kept ${tokens.join(" ")})`);
          }
        }

        expect(
          ignored,
          `classes values did not displace their defaults: ${ignored.join("; ")}`,
        ).toEqual([]);
      });

      it("no slot renders its default once every key is overridden", async () => {
        const overrides = Object.fromEntries(
          [...identifying.keys()].map((key) => [key, `ovr-${key}`]),
        );
        const leftover = new Set<string>();
        for (const f of fixtures) {
          const { container } = render(
            <Component {...props} {...f.props} classes={overrides}>
              {f.children as React.ReactNode}
            </Component>,
          );
          if (f.act) await f.act(container);
          for (const [key, tokens] of identifying)
            if (elementsWithAll(document.body, tokens).length > 0) leftover.add(key);
          cleanup();
        }

        expect(
          [...leftover],
          `slots still rendering their defaults after a full override: ${[...leftover].join(", ")}`,
        ).toEqual([]);
      });
    },
  );
});
