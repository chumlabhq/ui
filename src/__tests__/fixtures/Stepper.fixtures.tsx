import { Stepper } from "../../components/Stepper/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { motionOverrides } from "./_motion.js";
import { STEPS } from "./_data.js";

const fixtures: Fixtures<typeof Stepper> = [
  { name: "horizontal-numbered", props: { steps: STEPS, value: "two", showDescriptions: true } },
  { name: "all-statuses", props: { steps: STEPS, value: "two", showDescriptions: true, getStepStatus: (_id: unknown, index: number) => (["completed", "error", "pending"] as const)[index] }, note: "completed/error/pending variants have no other route." },
  { name: "vertical", props: { steps: STEPS, value: "two", orientation: "vertical" } },
  {
    name: "vertical-rtl",
    props: { steps: STEPS, value: "two", orientation: "vertical" },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    note: "The connector hangs under the indicator at the inline start, which is the right in right-to-left.",
  },
  { name: "dot", props: { steps: STEPS, value: "two", variant: "dot" } },
  { name: "icon", props: { steps: STEPS, value: "two", variant: "icon" } },
  { name: "label-bottom", props: { steps: STEPS, value: "two", labelPosition: "bottom" } },
  { name: "with-error", props: { steps: STEPS.map((s, i) => (i === 1 ? { ...s, status: "error" } : s)), value: "two" } },
  { name: "clickable", props: { steps: STEPS, defaultValue: "two" }, note: "Uncontrolled: e2e clicks it, and a controlled `value` with no handler would swallow the change. There is no `clickable` prop — completed and active steps are interactive by default." },
  { name: "disabled", props: { steps: STEPS.map((s) => ({ ...s, disabled: true })), value: "one" } },
  { name: "disabled-root", props: { steps: STEPS, defaultValue: "two", disabled: true }, note: "The whole stepper disabled, over steps that are clickable when it is not." },
  { name: "with-tooltips", props: { steps: STEPS.map((s) => ({ ...s, tooltip: "Tip" })), value: "two", showTooltips: true } },
  { name: "last-complete", props: { steps: STEPS, value: "three" } },
  {
    name: "no-connectors",
    props: { steps: STEPS, value: "two", showConnectors: false },
    note: "Drops the separator between steps, which carries its own role.",
  },
  {
    name: "horizontal-rtl",
    props: { steps: STEPS, value: "two", showDescriptions: true },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
  },
  {
    name: "keys",
    props: {
      steps: [{ id: "one", label: "One" }, { id: "two", label: "Two", disabled: true }, { id: "three", label: "Three" }, { id: "four", label: "Four" }],
      defaultValue: "one",
      isStepClickable: () => true,
    },
    note: "Several clickable steps with a disabled one between, so arrows have something to skip.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
