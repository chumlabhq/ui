import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

const OCTOBER = new Date(2026, 9, 1);
const SEPTEMBER = new Date(2026, 8, 1);
const open = () => fireEvent.click(screen.getByRole("combobox"));
const focusedDay = () => document.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')!;

describe("DatePicker onMonthChange", () => {
  it("reports a month reached by PageDown", () => {
    const onMonthChange = vi.fn();
    render(<DatePicker aria-label="D" defaultValue={new Date(2026, 8, 15)} onMonthChange={onMonthChange} />);
    open();
    fireEvent.keyDown(focusedDay(), { key: "PageDown" });
    expect(onMonthChange.mock.calls).toEqual([[OCTOBER]]);
  });

  it("reports a month reached by an arrow key across the month's end", () => {
    const onMonthChange = vi.fn();
    render(<DatePicker aria-label="D" defaultValue={new Date(2026, 8, 30)} onMonthChange={onMonthChange} />);
    open();
    fireEvent.keyDown(focusedDay(), { key: "ArrowRight" });
    expect(onMonthChange.mock.calls).toEqual([[OCTOBER]]);
  });

  it("reports the return to the value's month on reopening", () => {
    const onMonthChange = vi.fn();
    render(<DatePicker aria-label="D" defaultValue={new Date(2026, 8, 15)} onMonthChange={onMonthChange} />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    open();
    open();
    expect(onMonthChange.mock.calls).toEqual([[OCTOBER], [SEPTEMBER]]);
  });
});

describe("DatePicker paging by pointer", () => {
  it("leaves focus on the button pressed, so Escape still closes", () => {
    render(<DatePicker aria-label="D" defaultValue={new Date(2026, 8, 15)} />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("button", { name: "Next month" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Next month" }), { key: "Escape" });
    expect(screen.queryByRole("grid")).toBeNull();
  });
});

describe("DatePicker keyboard paging", () => {
  it("keeps focus in the grid when an arrow pages a defaultOpen calendar", () => {
    render(<DatePicker aria-label="D" defaultOpen defaultValue={new Date(2026, 8, 30)} />);
    const day = focusedDay();
    day.focus();
    fireEvent.keyDown(day, { key: "ArrowRight" });
    expect(document.activeElement).toHaveAttribute("role", "gridcell");
    expect(document.activeElement).toHaveTextContent("1");
  });
});

describe("DatePicker onValueChange", () => {
  it("stays quiet when the day already selected is pressed, and still closes", () => {
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="D" defaultValue={new Date(2026, 8, 15)} onValueChange={onValueChange} />);
    open();
    fireEvent.click(focusedDay());
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("grid")).toBeNull();
  });
});
