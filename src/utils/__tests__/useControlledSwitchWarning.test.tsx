import { describe, expect, it, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useControllableState } from "../useControllableState.js";

/**
 * The transition this warns about is the one that cost a round on Accordion:
 * `value` goes undefined, the component silently starts driving itself, and the
 * next interaction looks like it did nothing. Asserted through
 * `useControllableState` rather than the warning hook alone, because the wiring
 * is the part that breaks — the hook is easy to get right and easy to leave
 * disconnected.
 */
describe("controlled-to-uncontrolled warning", () => {
  afterEach(() => vi.restoreAllMocks());

  const spy = () => vi.spyOn(console, "warn").mockImplementation(() => {});

  const setup = (initial: string | undefined) =>
    renderHook(
      ({ value }: { value: string | undefined }) =>
        useControllableState({ value, defaultValue: "a", component: "TabPanel" }),
      { initialProps: { value: initial } },
    );

  it("warns once when a defined value becomes undefined", () => {
    const warn = spy();
    const { rerender } = setup("a");
    expect(warn).not.toHaveBeenCalled();

    rerender({ value: undefined });
    expect(warn).toHaveBeenCalledTimes(1);

    // Names the component and the prop, and says what to do about it. A warning
    // that only reports the transition sends the reader back to the source.
    const [message] = warn.mock.calls[0] as [string];
    expect(message).toContain("TabPanel");
    expect(message).toContain("`value`");
    expect(message).toMatch(/omit it/);

    // Once per instance. Every later render is the same already-reported state,
    // and a warning in a render loop is noise nobody reads.
    rerender({ value: "b" });
    rerender({ value: undefined });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("stays silent for a component that is uncontrolled from the start", () => {
    const warn = spy();
    const { rerender } = setup(undefined);
    rerender({ value: undefined });
    expect(warn).not.toHaveBeenCalled();
  });

  it("stays silent when an uncontrolled component becomes controlled", () => {
    // The reverse transition is a consumer taking control, which is fine.
    const warn = spy();
    const { rerender } = setup(undefined);
    rerender({ value: "a" });
    expect(warn).not.toHaveBeenCalled();
  });

  it("stays silent for a call site that has not been named", () => {
    // The warning is opt-in: `InternationalPhoneInput` and `Drawer` pass
    // expressions that go undefined without the consumer dropping a prop, so an
    // unnamed call site must not warn.
    const warn = spy();
    const { rerender } = renderHook(
      ({ value }: { value: string | undefined }) =>
        useControllableState({ value, defaultValue: "a" }),
      { initialProps: { value: "a" as string | undefined } },
    );
    rerender({ value: undefined });
    expect(warn).not.toHaveBeenCalled();
  });
});
