import { TimePicker } from "../../components/TimePicker/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof TimePicker> = [
  { name: "closed", props: {} },
  { name: "labelled", props: { label: "Time", description: "24h clock" } },
  { name: "open", props: { defaultOpen: true } },
  { name: "open-24h", props: { defaultOpen: true, format: "24h" } },
  { name: "open-with-value", props: { defaultOpen: true, defaultValue: "09:30", clearable: true } },
  {
    name: "open-clock",
    props: { defaultOpen: true, variant: "clock", defaultValue: "09:30" },
    note: "`defaultValue` is what makes the dial deterministic. Without it the hand points at the current time and moves between runs — 96 to 295 differing pixels against a visual baseline, once a minute, forever.",
  },
  { name: "open-clock-12h", props: { defaultOpen: true, variant: "clock", format: "12h", defaultValue: "09:30" }, note: "The period toggle only exists on a 12-hour clock." },
  { name: "open-bounded", props: { defaultOpen: true, variant: "clock", minTime: "09:00", maxTime: "17:00", defaultValue: "10:00" }, note: "Disabled clock numbers need a bounded range." },
  { name: "open-no-matches", props: { defaultOpen: true, minTime: "23:59", maxTime: "23:59" } },
  {
    name: "open-keyboard-focus",
    props: { defaultOpen: true },
    act: (c, ui) => ui.keyDown(c.querySelector("input"), "ArrowDown"),
  },
  { name: "loading", props: { loading: true, defaultOpen: true } },
  { name: "error", props: { label: "Time", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Time", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { disabled: true } },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
