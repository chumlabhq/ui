import { Switch } from "../../components/Switch";
import type { Fixtures } from "./types";

const fixtures: Fixtures<typeof Switch> = [
  { name: "default", props: {} },
  { name: "checked", props: { defaultChecked: true } },
  { name: "labelled", props: { label: "Notify", description: "Email me." } },
  { name: "checked-labelled", props: { label: "Notify", defaultChecked: true } },
  { name: "disabled", props: { label: "Notify", disabled: true } },
  { name: "disabled-checked", props: { label: "Notify", disabled: true, defaultChecked: true } },
  { name: "error", props: { label: "Notify", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Notify", success: true, successMessage: "Saved" } },
  { name: "loading", props: { loading: true } },
];
export default fixtures;
