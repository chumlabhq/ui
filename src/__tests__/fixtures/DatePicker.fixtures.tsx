import { DatePicker } from "../../components/DatePicker/index.js";
import type { Fixtures } from "./types.js";
import { PortalTarget, RtlBoundary } from "./_harness.js";
import { motionOverrides } from "./_motion.js";

const D = new Date(2026, 0, 15);

const fixtures: Fixtures<typeof DatePicker> = [
  { name: "closed", props: {} },
  { name: "labelled", props: { label: "Date", description: "Pick a day" } },
  { name: "open", props: { defaultOpen: true } },
  { name: "open-with-value", props: { defaultOpen: true, value: D, clearable: true } },
  { name: "range", props: { defaultOpen: true, selectionMode: "range", value: { start: D, end: new Date(2026, 0, 20) } } },
  { name: "multiple", props: { defaultOpen: true, selectionMode: "multiple", value: [D] } },
  { name: "with-presets", props: { defaultOpen: true, showPresets: true } },
  { name: "with-today-button", props: { defaultOpen: true, showTodayButton: true } },
    {
    name: "with-dropdowns",
    props: { defaultOpen: true },
    note: "The month and year dropdowns always render with the calendar; their MENUS need a click. The fixture used to pass `showMonthDropdown`/`showYearDropdown`, neither of which is a prop, and so never opened either menu.",
    act: (c, ui) => ui.click(c.ownerDocument.querySelector('[aria-label="Select month"]')),
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
    name: "marker-tooltip",
    props: {
      defaultOpen: true,
      value: D,
      showMarkerTooltip: true,
      markers: [{ date: D, label: "Release", color: "#f00", type: "event" }],
    },
    note:
      "Hovers the marked day. The tooltip is the one surface in this component " +
      "that anchors to the cell under the pointer rather than to a trigger, and " +
      "it was a declared exception in the positioner and portal gates with no " +
      "fixture reaching it at all.",
    act: async (c, ui) => {
      ui.mouseEnter(c.ownerDocument.querySelector("[data-marked]"));
      await ui.settle();
    },
  },
  {
    name: "with-active-preset",
    props: { defaultOpen: true, showPresets: true, value: new Date() },
    note: "A preset matching the current value is the only way presetTrigger reaches its active state.",
  },
  {
    name: "keyboard-focus",
    props: { value: D },
    note: "Opens the calendar from its trigger, then arrow-keys the grid so a day carries data-highlighted. Opened by the reader, not by defaultOpen: since L24 a calendar open at mount takes no focus, so the keyboard user this fixture stands for is never in it.",
    act: async (c, ui) => {
      ui.click(c.querySelector('[aria-haspopup="dialog"]'));
      await ui.settle(50);
      // The day cell, not the grid. `onKeyDown` is on each DayCell, and an
      // event dispatched at the grid travels upward, away from it — so this
      // fixture moved no highlight in either tier until the browser tier
      // reported the act as changing nothing.
      ui.keyDown(
        c.ownerDocument.querySelector('[role="grid"] [tabindex="0"]') ??
          c.ownerDocument.querySelector('[role="gridcell"]'),
        "ArrowRight",
      );
      await ui.settle();
    },
  },
  { name: "bounded", props: { defaultOpen: true, minDate: new Date(2026, 0, 10), maxDate: new Date(2026, 0, 20) } },
  {
    name: "bounded-in-range",
    props: { defaultOpen: true, value: D, minDate: new Date(2026, 0, 10), maxDate: new Date(2026, 0, 20) },
    note: "Opens on the bounded month, so disabled days sit beside enabled ones. `bounded` opens on today's month, where every day is out of range.",
  },
  { name: "error", props: { label: "Date", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Date", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { disabled: true } },
  { name: "loading", props: { loading: true } },
  { name: "required", props: { label: "Date", required: true } },
  {
    name: "open-no-clear",
    props: { defaultOpen: true, value: D, clearable: false },
    note: "Removes the clear control, which is one of the two buttons in the trigger.",
  },
  {
    name: "open-today-action",
    props: { defaultOpen: true, showTodayButton: true, todayAction: true },
    note: "`todayAction` turns the footer's today button into a select-and-close action.",
  },
  {
    name: "open-no-outside-days",
    props: { defaultOpen: true, value: D, showOutsideDays: false },
    note: "The leading and trailing cells disappear, which changes the grid's row contents.",
  },
  {
    name: "open-markers-no-indicator",
    props: {
      defaultOpen: true,
      value: D,
      markers: [{ date: D, label: "Release", color: "#f00", type: "event" }],
      showMarkerIndicator: false,
    },
    note: "A marked day with the dot suppressed — the branch `with-markers` never renders.",
  },
  {
    name: "portal-container",
    props: {},
    render: () => (
      <PortalTarget>
        {(container) => <DatePicker defaultOpen value={D} portalContainer={container} />}
      </PortalTarget>
    ),
  },
  {
    name: "open-rtl",
    props: { defaultOpen: true, value: D },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
  },
  {
    name: "loading-reduced-motion",
    props: { loading: true, value: D, reduceMotion: true },
    note: "The trigger's spinner follows the picker's reduceMotion, the one state that writes `data-reduce-motion`.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
