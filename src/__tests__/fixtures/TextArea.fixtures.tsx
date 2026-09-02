import { TextArea } from "../../components/TextArea";
import type { Fixtures } from "./types";

const fixtures: Fixtures<typeof TextArea> = [
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
      startIconLabel: "Format",
      onStartIconClick: () => {},
      endIcon: <span>E</span>,
      endIconLabel: "Expand",
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
];
export default fixtures;
