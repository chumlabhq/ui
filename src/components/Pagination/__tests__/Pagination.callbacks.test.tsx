import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Pagination } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

describe("Pagination fit", () => {
  it("measures again when a font arrives, since one that narrows the row leaves room", () => {
    const listeners = new Set<() => void>();
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) },
    });
    const { unmount } = render(<Pagination totalPages={20} value={5} />);
    expect(listeners.size).toBe(1);
    unmount();
    expect(listeners.size).toBe(0);
    Reflect.deleteProperty(document, "fonts");
  });
});

describe("Pagination onRowsPerPageChange", () => {
  it("stays quiet when the current option is picked, and reports another", () => {
    const onRowsPerPageChange = vi.fn();
    render(<Pagination totalPages={5} showRowsPerPage rowsPerPage={10} rowOptions={[10, 25]} onRowsPerPageChange={onRowsPerPageChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: /10/ }));
    expect(onRowsPerPageChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: /25/ }));
    expect(onRowsPerPageChange.mock.calls).toEqual([[25]]);
  });
});
