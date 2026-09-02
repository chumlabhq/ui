/**
 * The dev-only warning for an unnamed form control.
 *
 * The full-fixture axe sweep found 18 nodes across Checkbox, Input and TextArea
 * rendering a control with no accessible name (E2E-TRIAGE.md Appendix K). Those
 * fixtures are correct — a bare control is a legitimate thing to render, and a
 * consumer may be supplying an external `<label for>`. What was wrong is that
 * the library said nothing.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Input } from "../index";
import { TextArea } from "../../TextArea";
import { Checkbox } from "../../Checkbox";

import { setReducedMotion } from "../../../test/matchMedia";

// The stub answers nothing by default, so every file that renders a
// motion-aware component states the preference it is testing under.
beforeEach(() => setReducedMotion(false));

const CASES = [
  ["Input", Input],
  ["TextArea", TextArea],
  ["Checkbox", Checkbox],
] as const;

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  warn.mockRestore();
});

describe.each(CASES)("%s accessible-name warning", (name, Component) => {
  it("warns when the control has no name at all", () => {
    render(<Component />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain(`${name}: rendered with no accessible name`);
  });

  it.each(["label", "aria-label", "aria-labelledby"])(
    "stays silent when named by %s",
    (prop) => {
      render(<Component {...{ [prop]: "Named" }} />);
      expect(warn).not.toHaveBeenCalled();
    },
  );

  it("calls out `title`, which is not a label", () => {
    render(<Component title="Not a label" />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("not a substitute");
  });

  it("warns once per instance, not once per render", () => {
    const { rerender } = render(<Component />);
    rerender(<Component />);
    rerender(<Component />);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("warns once per instance, not once for the whole component", () => {
    cleanup();
    render(
      <>
        <Component />
        <Component />
      </>,
    );
    expect(warn).toHaveBeenCalledTimes(2);
  });
});
