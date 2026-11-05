import { beforeEach, beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ResizablePanel } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

beforeAll(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

const setup = () => {
  const onResizeStart = vi.fn();
  const onResizeEnd = vi.fn();
  render(<ResizablePanel defaultValue={300} minValue={100} maxValue={500} onResizeStart={onResizeStart} onResizeEnd={onResizeEnd}>x</ResizablePanel>);
  return { onResizeStart, onResizeEnd, handle: screen.getByRole("separator") };
};

describe("ResizablePanel onResizeStart and onResizeEnd", () => {
  it("fires neither on a press and release with no movement", () => {
    const { onResizeStart, onResizeEnd, handle } = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    fireEvent.pointerUp(document);
    expect(onResizeStart).not.toHaveBeenCalled();
    expect(onResizeEnd).not.toHaveBeenCalled();
  });

  it("fires start once, on the first movement, with the size it started at", () => {
    const { onResizeStart, handle } = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    expect(onResizeStart).not.toHaveBeenCalled();
    fireEvent.pointerMove(document, { clientX: 320 });
    fireEvent.pointerMove(document, { clientX: 340 });
    expect(onResizeStart.mock.calls).toEqual([[300]]);
  });

  it("closes a drag abandoned with Escape, with the restored size", () => {
    const { onResizeEnd, handle } = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 340 });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onResizeEnd.mock.calls).toEqual([[300]]);
  });
});
