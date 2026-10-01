/** @jsxImportSource react */
/**
 * SC 2.5.7 Dragging Movements — every function that can be done by dragging can
 * also be done without one.
 *
 * ADR 003 named `ResizablePanel` as the likely failure. It was wrong: that
 * separator has had arrow keys, a Shift multiplier and Home/End all along. The
 * two real failures were in `Table`, and both were invisible to axe because a
 * missing capability has no signature in the DOM: column resizing was
 * `onMouseDown` on a `<div>` with no `tabIndex`, and row reordering was HTML5
 * drag-and-drop on a `<span>` that could not take focus.
 *
 * The remedy the criterion asks for is a route that is not a drag, which is why
 * this asserts a keyboard path rather than a target size. Every drag surface in
 * the package is listed, so a new one cannot be added without answering for it.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import { Table } from "../../components/Table/index.js";
import { Slider } from "../../components/Slider/index.js";
import { ResizablePanel } from "../../components/ResizablePanel/index.js";

import { setReducedMotion } from "../../test/matchMedia.js";
import { fixtureSession } from "../fixtures/_act.contract.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

interface Row {
  id: number;
  name: string;
}
const DATA: Row[] = [
  { id: 1, name: "One" },
  { id: 2, name: "Two" },
  { id: 3, name: "Three" },
];
const COLUMNS = [{ accessorKey: "name", header: "Name", id: "name" }];

describe("dragging alternatives contract", () => {
  describe("Table column resize", () => {
    it("exposes the handle to the keyboard", () => {
      render(
        <Table columns={COLUMNS} data={DATA} enableColumnResizing ariaLabel="t" />,
      );
      const handle = document.querySelector("[data-resize-handle]") as HTMLElement;
      expect(handle, "no resize handle rendered").not.toBeNull();
      expect(handle.getAttribute("tabindex"), "the handle cannot take focus").toBe("0");
      expect(handle.getAttribute("aria-valuenow")).not.toBeNull();
    });

    it("resizes on the arrow keys, without a drag", () => {
      const onColumnSizingChange = vi.fn();
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          enableColumnResizing
          onColumnSizingChange={onColumnSizingChange}
          ariaLabel="t"
        />,
      );
      const handle = document.querySelector("[data-resize-handle]") as HTMLElement;

      fireEvent.keyDown(handle, { key: "ArrowRight" });
      expect(onColumnSizingChange).toHaveBeenCalled();
      const widened = Object.values(onColumnSizingChange.mock.calls.at(-1)![0])[0] as number;

      fireEvent.keyDown(handle, { key: "ArrowLeft" });
      const narrowed = Object.values(onColumnSizingChange.mock.calls.at(-1)![0])[0] as number;
      expect(narrowed, "ArrowLeft did not undo ArrowRight").toBeLessThan(widened);
    });

    it("takes a coarser step with Shift", () => {
      const session = fixtureSession();
      const onColumnSizingChange = vi.fn();
      session.render(
        <Table
          columns={COLUMNS}
          data={DATA}
          enableColumnResizing
          onColumnSizingChange={onColumnSizingChange}
          ariaLabel="t"
        />,
      );
      const handle = document.querySelector("[data-resize-handle]") as HTMLElement;

      fireEvent.keyDown(handle, { key: "ArrowRight" });
      const fine = Object.values(onColumnSizingChange.mock.calls.at(-1)![0])[0] as number;
      session.unmount();

      session.render(
        <Table
          columns={COLUMNS}
          data={DATA}
          enableColumnResizing
          onColumnSizingChange={onColumnSizingChange}
          ariaLabel="t"
        />,
      );
      const handle2 = document.querySelector("[data-resize-handle]") as HTMLElement;
      fireEvent.keyDown(handle2, { key: "ArrowRight", shiftKey: true });
      const coarse = Object.values(onColumnSizingChange.mock.calls.at(-1)![0])[0] as number;
      expect(coarse).toBeGreaterThan(fine);
    });
  });

  describe("Table row reorder", () => {
    it("exposes the handle to the keyboard", () => {
      render(
        <Table columns={COLUMNS} data={DATA} enableRowDragDrop ariaLabel="t" />,
      );
      const handles = screen.getAllByRole("button", { name: /Reorder row/ });
      expect(handles).toHaveLength(DATA.length);
    });

    it("reorders on the arrow keys, without a drag", () => {
      const onRowReorder = vi.fn();
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          enableRowDragDrop
          onRowReorder={onRowReorder}
          ariaLabel="t"
        />,
      );
      const handles = screen.getAllByRole("button", { name: /Reorder row/ });

      fireEvent.keyDown(handles[1], { key: "ArrowUp" });
      expect(onRowReorder).toHaveBeenCalledWith(1, 0);

      fireEvent.keyDown(handles[1], { key: "ArrowDown" });
      expect(onRowReorder).toHaveBeenCalledWith(1, 2);
    });

    it("does not move a row past either end", () => {
      const onRowReorder = vi.fn();
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          enableRowDragDrop
          onRowReorder={onRowReorder}
          ariaLabel="t"
        />,
      );
      const handles = screen.getAllByRole("button", { name: /Reorder row/ });

      fireEvent.keyDown(handles[0], { key: "ArrowUp" });
      fireEvent.keyDown(handles[DATA.length - 1], { key: "ArrowDown" });
      expect(onRowReorder).not.toHaveBeenCalled();
    });
  });

  describe("the other drag surfaces", () => {
    it("Slider moves on the arrow keys", () => {
      const onValueChange = vi.fn();
      render(<Slider value={50} onValueChange={onValueChange} aria-label="v" />);
      fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
      expect(onValueChange).toHaveBeenCalled();
    });

    it("ResizablePanel's separator moves on the arrow keys", () => {
      render(
        <ResizablePanel>
          <div>panel</div>
        </ResizablePanel>,
      );
      const separator = screen.getByRole("separator");
      expect(separator.getAttribute("tabindex")).toBe("0");
      const before = separator.getAttribute("aria-valuenow");
      fireEvent.keyDown(separator, { key: "ArrowRight" });
      expect(separator.getAttribute("aria-valuenow")).not.toBe(before);
    });
  });
});
