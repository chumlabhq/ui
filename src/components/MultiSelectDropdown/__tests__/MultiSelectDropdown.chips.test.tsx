import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelectDropdown } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

describe("MultiSelectDropdown chips", () => {
  it("nests no interactive element in the combobox", () => {
    render(<MultiSelectDropdown label="Fruit" options={OPTIONS} defaultValue={["a", "b"]} />);
    const combobox = screen.getByRole("combobox");
    expect(combobox.querySelector('button, a[href], input, [role="button"], [tabindex]')).toBeNull();
    expect(screen.getByRole("button", { name: "Remove Apple" }).tagName).toBe("BUTTON");
    expect(combobox).toHaveAccessibleName("Fruit");
  });

  it("removes a chip by keyboard, in Tab order after the combobox, and hands focus back", async () => {
    const onValueChange = vi.fn();
    render(<MultiSelectDropdown aria-label="F" options={OPTIONS} defaultValue={["a", "b"]} onValueChange={onValueChange} />);
    screen.getByRole("combobox").focus();
    await userEvent.tab();
    const remove = screen.getByRole("button", { name: "Remove Apple" });
    expect(remove).toHaveFocus();
    expect(remove.tagName).toBe("BUTTON");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange.mock.calls[0][0]).toEqual(["b"]);
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("keeps an open list open when a chip is removed by pointer", () => {
    render(<MultiSelectDropdown aria-label="F" options={OPTIONS} defaultValue={["a", "b"]} defaultOpen />);
    const remove = screen.getByRole("button", { name: "Remove Banana" });
    expect(remove.tagName).toBe("BUTTON");
    fireEvent.mouseDown(remove);
    fireEvent.click(remove);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove Banana" })).toBeNull();
  });

  it("offers no removal while disabled", () => {
    const onValueChange = vi.fn();
    render(<MultiSelectDropdown aria-label="F" options={OPTIONS} defaultValue={["a"]} disabled onValueChange={onValueChange} />);
    const remove = screen.getByRole("button", { name: "Remove Apple" });
    expect(remove).toBeDisabled();
    fireEvent.click(remove);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
