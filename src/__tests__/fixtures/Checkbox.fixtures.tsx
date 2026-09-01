import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: {} },
  { name: "checked", props: { defaultChecked: true } },
  { name: "indeterminate", props: { indeterminate: true } },
  { name: "labelled", props: { label: "Accept", description: "Terms apply." } },
  { name: "error", props: { label: "Accept", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Accept", success: true, successMessage: "Thanks" } },
  { name: "disabled", props: { label: "Accept", disabled: true } },
  { name: "loading", props: { loading: true } },
];
export default fixtures;
