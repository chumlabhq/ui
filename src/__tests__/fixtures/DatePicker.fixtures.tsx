import { fireEvent } from "@testing-library/react";
import { tick } from "./_act";
import { DatePicker } from "../../components/DatePicker";
import type { Fixtures } from "./types";
import { motionOverrides } from "./_motion";

const D = new Date(2026, 0, 15);

const fixtures: Fixtures<typeof DatePicker> = [
  { name: "closed", props: {} },
  { name: "labelled", props: { label: "Date", description: "Pick a day" } },
  { name: "open", props: { defaultOpen: true } },
  { name: "open-with-value", props: { defaultOpen: true, value: D, clearable: true } },
  { name: "range", props: { defaultOpen: true, mode: "range", value: { start: D, end: new Date(2026, 0, 20) } } },
  { name: "multiple", props: { defaultOpen: true, mode: "multiple", value: [D] } },
  { name: "with-presets", props: { defaultOpen: true, showPresets: true } },
  { name: "with-today-button", props: { defaultOpen: true, showTodayButton: true } },
    {
    name: "with-dropdowns",
    props: { defaultOpen: true },
    note: "The month and year dropdowns always render with the calendar; their MENUS need a click. The fixture used to pass `showMonthDropdown`/`showYearDropdown`, neither of which is a prop, and so never opened either menu.",
    act: (c) => {
      const btn = c.ownerDocument.querySelector('[aria-label="Select month"]');
      if (btn) fireEvent.click(btn);
    },
  },
  {
    name: "with-week-numbers",
    props: { defaultOpen: true, showWeekNumbers: true },
    note: "The only fixture rendering `weekNumber`. It was waived as needing 'a locale week config the fixture could not resolve'; `showWeekNumbers` alone is enough.",
  },
  {
    name: "with-markers",
    props: { defaultOpen: true, value: D, markers: [{ date: D, label: "Release", color: "#f00", type: "event" }] },
    note: "`value` pins the calendar to the marker's month. Without it the grid opened on today and the marked day was never rendered, so data-marked had no fixture.",
  },
  {
    name: "with-active-preset",
    props: { defaultOpen: true, showPresets: true, value: new Date() },
    note: "A preset matching the current value is the only way presetTrigger reaches its active state.",
  },
  {
    name: "keyboard-focus",
    props: { defaultOpen: true, value: D },
    note: "Arrow-keys the grid so a day carries data-highlighted. Uses the component's own keyboard handling; touches no focus management.",
    act: async (c) => {
      const grid = c.ownerDocument.querySelector('[role="grid"]');
      if (grid) fireEvent.keyDown(grid, { key: "ArrowRight" });
      await tick();
    },
  },
  { name: "bounded", props: { defaultOpen: true, minDate: new Date(2026, 0, 10), maxDate: new Date(2026, 0, 20) } },
  { name: "error", props: { label: "Date", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Date", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { disabled: true } },
  { name: "loading", props: { loading: true } },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
