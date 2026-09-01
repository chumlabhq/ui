import type { Fixtures } from "./types";

const D = new Date(2026, 0, 15);

const fixtures: Fixtures = [
  { name: "closed", props: {} },
  { name: "labelled", props: { label: "Date", description: "Pick a day" } },
  { name: "open", props: { defaultOpen: true } },
  { name: "open-with-value", props: { defaultOpen: true, value: D, clearable: true } },
  { name: "range", props: { defaultOpen: true, mode: "range", value: { start: D, end: new Date(2026, 0, 20) } } },
  { name: "multiple", props: { defaultOpen: true, mode: "multiple", value: [D] } },
  { name: "with-presets", props: { defaultOpen: true, showPresets: true } },
  { name: "with-today-button", props: { defaultOpen: true, showTodayButton: true } },
  { name: "with-dropdowns", props: { defaultOpen: true, showMonthDropdown: true, showYearDropdown: true } },
  { name: "with-markers", props: { defaultOpen: true, markers: [{ date: D, label: "Release", color: "#f00", type: "event" }] } },
  { name: "bounded", props: { defaultOpen: true, minDate: new Date(2026, 0, 10), maxDate: new Date(2026, 0, 20) } },
  { name: "error", props: { label: "Date", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Date", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { disabled: true } },
  { name: "loading", props: { loading: true } },
];
export default fixtures;
