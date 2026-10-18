import { Checkbox } from "../../components/Checkbox/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof Checkbox> = [
  { name: "default", props: {} },
  { name: "checked", props: { defaultChecked: true } },
  { name: "indeterminate", props: { indeterminate: true } },
  { name: "labelled", props: { label: "Accept", description: "Terms apply." } },
  { name: "error", props: { label: "Accept", error: true, errorMessage: "Required" } },
  { name: "success", props: { label: "Accept", success: true, successMessage: "Thanks" } },
  { name: "disabled", props: { label: "Accept", disabled: true } },
  { name: "loading", props: { loading: true } },
  {
    name: "siblings",
    props: { label: "Middle", disabled: true },
    note: "The FIXTURE is the disabled one, between two native checkboxes. Library siblings would be rendered without `unstyled` and leak their decorative classes into unstyled.contract's measurement.",
    wrap: (node) => (
      <>
        <input type="checkbox" aria-label="Before" />
        {node}
        <input type="checkbox" aria-label="After" />
      </>
    ),
  },
  { name: "readonly", props: { label: "Accept", readOnly: true, defaultChecked: true } },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
