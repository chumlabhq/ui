import type { Fixtures } from "./types";
import { OPTIONS } from "./_data";

const fixtures: Fixtures = [
  { name: "default", props: { options: OPTIONS } },
  { name: "labelled", props: { options: OPTIONS, label: "Fruit", description: "Pick one." } },
  { name: "with-value", props: { options: OPTIONS, defaultValue: "a" } },
  { name: "error", props: { options: OPTIONS, label: "Fruit", error: true, errorMessage: "Required" } },
  { name: "success", props: { options: OPTIONS, label: "Fruit", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { options: OPTIONS, disabled: true } },
];
export default fixtures;
