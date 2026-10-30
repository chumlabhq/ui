import { Switch } from "../../components/Switch/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { motionOverrides } from "./_motion.js";

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
  { name: "required", props: { label: "Notifications", required: true } },
  {
    name: "custom-loader",
    props: { label: "Notifications", loading: true, loader: <span data-loader>…</span> },
  },
  {
    name: "rendered-label",
    props: {
      // `htmlFor={switchId}` is why the render props carry the id: a replaced
      // label still has to name the control, and a `<strong>` does not.
      renderLabel: ({ checked, switchId }) => (
        <label htmlFor={switchId}>{checked ? "On" : "Off"}</label>
      ),
      renderDescription: ({ switchId }) => <em>{`for ${switchId}`}</em>,
    },
    note: "Both render props replace library markup with the consumer's own.",
  },
  {
    name: "checked-rtl",
    props: { label: "Notify", defaultChecked: true },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    note: "The checked thumb travels to the inline end, the left; the A2 audit measured it painted past the track's right edge.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
