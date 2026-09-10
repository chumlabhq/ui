import { Input } from "../../components/Input/index.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof Input> = [
  { name: "default", props: {} },
  { name: "labelled", props: { label: "Email", description: "We never share it." } },
  { name: "error", props: { label: "Email", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Email", success: true, successMessage: "Looks good" } },
  { name: "with-value-clearable", props: { defaultValue: "ada@example.test", clearable: true } },
  { name: "loading", props: { loading: true } },
  // Label and value, not a bare disabled field: `disabled` paints by dimming,
  // and an empty near-white box on a near-white page has nothing to dim —
  // the baseline passed with the whole affordance removed. Ink is what
  // makes the state photographable.
  { name: "disabled", props: { disabled: true, label: "Email", defaultValue: "ada@example.com" } },
  { name: "with-adornments", props: { startIcon: <span>@</span>, endIcon: <span>x</span> } },
  { name: "with-affixes", props: { prefix: "https://", suffix: ".com" } },
  { name: "with-counter", props: { maxLength: 40, showCount: true, defaultValue: "hi" } },
];
export default fixtures;
