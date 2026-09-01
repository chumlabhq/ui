/**
 * @vitest-environment node
 */
/**
 * AUDIT-GAP.md §2.6 — `react-dom/server` appeared in 0 of 47 test files, while
 * ai/system-state.json records "SSR safety — carried PASS" as a release gate.
 *
 * The node environment is the point. Under jsdom `document` exists, so a
 * component that reads `document.body` during render passes trivially and the
 * gate stays green. Here `document` is genuinely undefined, which is what a
 * server sees.
 *
 * This suite is expected to fail on DatePicker until remediation item 2.1
 * lands: DatePicker.tsx:987 evaluates `portalContainer ?? document.body` with
 * no isBrowser guard, reachable through the public `keepMounted` and `open`
 * props. Every one of its twelve sibling portal components guards correctly.
 */
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { COMPONENTS } from "./registry";

describe("SSR contract", () => {
  it("runs without a DOM", () => {
    // If this fails the whole suite is meaningless — see the docblock.
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  describe.each(COMPONENTS)("$name", ({ Component, props, supports }) => {
    it("renders to string with default props", () => {
      expect(() => renderToString(<Component {...props} />)).not.toThrow();
    });

    it.runIf(supports.keepMounted)("renders to string with keepMounted", () => {
      expect(() =>
        renderToString(<Component {...props} keepMounted />),
      ).not.toThrow();
    });

    it.runIf(supports.open)("renders to string while open", () => {
      expect(() =>
        renderToString(<Component {...props} open onOpenChange={() => {}} />),
      ).not.toThrow();
    });
  });
});
