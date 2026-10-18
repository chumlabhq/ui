import { TextArea } from "../../components/TextArea/index.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof TextArea> = [
  // One per size. `size` paints dimensions as of v1 — it emitted `data-size`
  // and nothing else before — and the smallest is the one that has to clear the
  // 24px target floor: sm is 30px tall including its border.
  { name: "size-sm", props: { size: "sm" as const, label: "Email" } },
  { name: "size-md", props: { size: "md" as const, label: "Email" } },
  { name: "size-lg", props: { size: "lg" as const, label: "Email" } },
  { name: "default", props: {} },
  { name: "labelled", props: { label: "Bio", description: "Keep it short." } },
  { name: "error", props: { label: "Bio", error: true, errorMessage: "Too long" } },
  { name: "success", props: { label: "Bio", success: true, successMessage: "Nice" } },
  { name: "with-value-clearable", props: { defaultValue: "hello", clearable: true } },
  { name: "loading", props: { loading: true } },
  { name: "disabled", props: { disabled: true } },
  { name: "with-counter", props: { maxLength: 100, showCount: true, defaultValue: "hi" } },
  {
    name: "with-icon-buttons",
    props: {
      label: "Bio",
      startIcon: <span>S</span>,
      startIconAriaLabel: "Format",
      onStartIconClick: () => {},
      endIcon: <span>E</span>,
      endIconAriaLabel: "Expand",
      onEndIconClick: () => {},
    },
    note: "Icons only become buttons with a click handler, so the keyboard-activation tests need this pair.",
  },
  {
    name: "full-width",
    props: { label: "Bio", fullWidth: true },
    note: "fullWidth is a computed width claim; the class alone is not the same assertion.",
    wrap: (node) => <div style={{ width: 640 }}>{node}</div>,
  },
  {
    name: "siblings",
    props: { label: "First" },
    note: "A native textarea follows, not a second TextArea: a library sibling is rendered without `unstyled` and leaks its decorative classes into unstyled.contract's measurement.",
    wrap: (node) => (
      <>
        {node}
        <textarea aria-label="Second" />
      </>
    ),
  },
  { name: "readonly", props: { label: "Notes", readOnly: true, defaultValue: "Read only" } },
];
export default fixtures;
