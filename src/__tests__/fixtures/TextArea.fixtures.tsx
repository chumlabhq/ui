import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: {} },
  { name: "labelled", props: { label: "Bio", description: "Keep it short." } },
  { name: "error", props: { label: "Bio", error: true, errorMessage: "Too long" } },
  { name: "success", props: { label: "Bio", success: true, successMessage: "Nice" } },
  { name: "with-value-clearable", props: { defaultValue: "hello", clearable: true } },
  { name: "loading", props: { loading: true } },
  { name: "disabled", props: { disabled: true } },
  { name: "with-counter", props: { maxLength: 100, showCount: true, defaultValue: "hi" } },
];
export default fixtures;
