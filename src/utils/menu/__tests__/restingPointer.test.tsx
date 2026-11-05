import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from "../../../components/Dropdown/index.js";
import { MultiSelectDropdown } from "../../../components/MultiSelectDropdown/index.js";
import { SearchableDropdown } from "../../../components/SearchableDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../../components/MultiSelectSearchableDropdown/index.js";
import { TimePicker } from "../../../components/TimePicker/index.js";
import { Pagination } from "../../../components/Pagination/index.js";
import { CascadingDropdown } from "../../../components/CascadingDropdown/index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

const LISTS = [
  { name: "Dropdown", ui: <Dropdown aria-label="F" options={OPTIONS} defaultOpen />, item: () => screen.getByRole("option", { name: "Banana" }) },
  { name: "MultiSelectDropdown", ui: <MultiSelectDropdown aria-label="F" options={OPTIONS} defaultOpen />, item: () => screen.getByRole("option", { name: "Banana" }) },
  { name: "SearchableDropdown", ui: <SearchableDropdown aria-label="F" options={OPTIONS} defaultOpen />, item: () => screen.getByRole("option", { name: "Banana" }) },
  { name: "MultiSelectSearchableDropdown", ui: <MultiSelectSearchableDropdown aria-label="F" options={OPTIONS} defaultOpen />, item: () => screen.getByRole("option", { name: "Banana" }) },
  { name: "TimePicker", ui: <TimePicker aria-label="F" format="24h" minuteStep={60} defaultOpen />, item: () => screen.getByRole("option", { name: "02:00" }) },
  { name: "Pagination", ui: <Pagination totalPages={3} showRowsPerPage rowsPerPage={10} rowOptions={[10, 25]} keepMounted />, open: () => fireEvent.click(screen.getByRole("combobox")), item: () => screen.getByRole("option", { name: "25" }) },
  { name: "CascadingDropdown", ui: <CascadingDropdown aria-label="F" options={[{ value: "x", label: "One" }, { value: "y", label: "Two" }]} defaultOpen />, item: () => screen.getByText("Two").closest("[role]") as HTMLElement },
];

describe("a list under a resting pointer", () => {
  for (const list of LISTS) {
    it(`${list.name} highlights only when the pointer really moves`, () => {
      render(list.ui);
      list.open?.();
      fireEvent.mouseMove(document.body, { clientX: 50, clientY: 50 });
      const item = list.item();
      fireEvent.mouseEnter(item, { clientX: 50, clientY: 50 });
      fireEvent.mouseMove(item, { clientX: 50, clientY: 50 });
      expect(item).not.toHaveAttribute("data-highlighted");
      fireEvent.mouseMove(item, { clientX: 60, clientY: 50 });
      expect(list.item()).toHaveAttribute("data-highlighted");
    });
  }
});
