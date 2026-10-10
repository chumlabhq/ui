/**
 * The dev-only warning for a lazy-children loader nothing can trigger.
 *
 * `loadChildrenForOption` runs only for an option whose `hasChildren` is set,
 * so `loadChildren` over a tree that never sets the flag does nothing at all.
 * The prop-union work fixed every inert combination the type system could
 * express; this one is a constraint on the consumer's data, so the only place
 * it can be caught is at runtime, and the only failure mode was silence.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { CascadingDropdown } from "../index.js";
import type { CascadingOption } from "../utils/types.js";

import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const FLAT: CascadingOption[] = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

const LAZY: CascadingOption[] = [
  { value: "a", label: "A", hasChildren: true },
  { value: "b", label: "B" },
];

/** The flag on a nested child, which a non-recursive check would miss. */
const NESTED_LAZY: CascadingOption[] = [
  {
    value: "a",
    label: "A",
    children: [{ value: "a1", label: "A1", hasChildren: true }],
  },
];

const load = async () => [{ value: "x", label: "X" }];

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

const warnings = (): string[] =>
  warn.mock.calls
    .map((c: unknown[]) => String(c[0]))
    .filter((m: string) => m.includes("hasChildren"));

describe("CascadingDropdown inert-loader warning", () => {
  it("warns when a loader is set and no option declares children", () => {
    render(<CascadingDropdown options={FLAT} loadChildren={load} />);
    expect(warnings()).toHaveLength(1);
    expect(warnings()[0]).toContain("never fire");
  });

  it("warns once per instance, not once per render", () => {
    const { rerender } = render(
      <CascadingDropdown options={FLAT} loadChildren={load} />,
    );
    rerender(<CascadingDropdown options={FLAT} loadChildren={load} />);
    rerender(<CascadingDropdown options={[...FLAT]} loadChildren={load} />);
    expect(warnings()).toHaveLength(1);
  });

  it("stays silent when an option declares children", () => {
    render(<CascadingDropdown options={LAZY} loadChildren={load} />);
    expect(warnings()).toEqual([]);
  });

  it("stays silent when only a nested option declares children", () => {
    render(<CascadingDropdown options={NESTED_LAZY} loadChildren={load} />);
    expect(warnings()).toEqual([]);
  });

  it("stays silent when there is no loader to be inert", () => {
    render(<CascadingDropdown options={FLAT} />);
    expect(warnings()).toEqual([]);
  });
});
