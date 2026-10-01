import { Input } from "../../components/Input/index.js";
import type { Fixtures } from "./types.js";

const UNDERLINE_CONTROL =
  "px-0 py-2.5 gap-2.5 transition-all duration-150 rounded-none border-0 border-b-2 bg-transparent border-cl-border focus-within:ring-0 focus-within:border-cl-border-input-focus";

const fixtures: Fixtures<typeof Input> = [
  // One per size. `size` paints dimensions as of v1 — it emitted `data-size`
  // and nothing else before — and the smallest is the one that has to clear the
  // 24px target floor: sm is 30px tall including its border.
  { name: "size-sm", props: { size: "sm" as const, label: "Email" } },
  { name: "size-md", props: { size: "md" as const, label: "Email" } },
  { name: "size-lg", props: { size: "lg" as const, label: "Email" } },
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
  {
    // The demo's underline recipe, verbatim. It proves a contract rather than a
    // look: `focus-within:ring-0` is the same key as the default's
    // `focus-within:ring-2`, so `mergeSlot` drops the default ring, and focus is
    // left to the bottom edge. Without it the underline focused as a box.
    // `render`, because the classes are a consumer's restyle: the classes-key
    // contracts pass their own sentinel map over every props fixture, which
    // would replace this one, and `unstyled` has nothing of the library's to
    // strip from it.
    name: "underline",
    props: { label: "Email" },
    render: () => <Input label="Email" classes={{ control: UNDERLINE_CONTROL }} />,
  },
];
export default fixtures;
