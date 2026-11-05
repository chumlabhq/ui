import { beforeEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Drawer, DrawerBody } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

beforeAll(() => {
  HTMLElement.prototype.setPointerCapture ??= vi.fn();
});

describe("Drawer onTransitionEnd", () => {
  it("fires after a defaultOpen drawer has slid in", () => {
    vi.useFakeTimers();
    const onTransitionEnd = vi.fn();
    render(<Drawer defaultOpen aria-label="D" animationDuration={100} onTransitionEnd={onTransitionEnd}><DrawerBody>x</DrawerBody></Drawer>);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    vi.useRealTimers();
    expect(onTransitionEnd.mock.calls).toEqual([[true]]);
  });
});

describe("Drawer onSnapPointIndexChange", () => {
  const drag = (panel: HTMLElement, from: number, to: number) => {
    Object.defineProperty(panel, "offsetHeight", { value: 300, configurable: true });
    fireEvent.pointerDown(panel.querySelector("[data-drawer-handle]")!, { button: 0, clientX: 100, clientY: from, pointerId: 1, pointerType: "mouse" });
    fireEvent.pointerMove(panel, { buttons: 1, clientX: 100, clientY: to, pointerId: 1 });
    fireEvent.pointerUp(panel, { clientX: 100, clientY: to, pointerId: 1 });
  };

  it("moves up to a larger snap point when the sheet is dragged open", () => {
    const onSnapPointIndexChange = vi.fn();
    const now = vi.spyOn(Date, "now");
    now.mockReturnValueOnce(0).mockReturnValue(100000);
    render(<Drawer defaultOpen aria-label="D" side="bottom" swipeable animationDuration={0} snapPoints={[0.3, 0.9]} onSnapPointIndexChange={onSnapPointIndexChange}><DrawerBody>x</DrawerBody></Drawer>);
    drag(screen.getByRole("dialog"), 800, 620);
    now.mockRestore();
    expect(onSnapPointIndexChange.mock.calls).toEqual([[1]]);
  });
});
