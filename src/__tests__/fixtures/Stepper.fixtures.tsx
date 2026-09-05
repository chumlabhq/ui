import { Stepper } from "../../components/Stepper/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";
import { STEPS } from "./_data.js";

const fixtures: Fixtures<typeof Stepper> = [
  { name: "horizontal-numbered", props: { steps: STEPS, value: 1, showDescriptions: true } },
  { name: "all-statuses", props: { steps: STEPS, value: 1, showDescriptions: true, getStepStatus: (_id: unknown, index: number) => (["completed", "error", "pending"] as const)[index] }, note: "completed/error/pending variants have no other route." },
  { name: "vertical", props: { steps: STEPS, value: 1, orientation: "vertical" } },
  { name: "dot", props: { steps: STEPS, value: 1, variant: "dot" } },
  { name: "icon", props: { steps: STEPS, value: 1, variant: "icon" } },
  { name: "label-bottom", props: { steps: STEPS, value: 1, labelPosition: "bottom" } },
  { name: "with-error", props: { steps: STEPS.map((s, i) => (i === 1 ? { ...s, status: "error" } : s)), value: 1 } },
  { name: "clickable", props: { steps: STEPS, defaultValue: 1 }, note: "Uncontrolled: e2e clicks it, and a controlled `value` with no handler would swallow the change. There is no `clickable` prop — completed and active steps are interactive by default." },
  { name: "disabled", props: { steps: STEPS.map((s) => ({ ...s, disabled: true })), value: 0 } },
  { name: "with-tooltips", props: { steps: STEPS.map((s) => ({ ...s, tooltip: "Tip" })), value: 1, showTooltips: true } },
  { name: "last-complete", props: { steps: STEPS, value: 2 } },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
