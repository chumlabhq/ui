import { Button } from "../../components/Button/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof Button> = [
  { name: "default", props: {}, children: "Save" },
  { name: "loading", props: { loading: true }, children: "Save" },
  { name: "disabled", props: { disabled: true }, children: "Save" },
  {
    name: "with-icons",
    props: { startIcon: <span>L</span>, endIcon: <span>R</span> },
    children: "Save",
  },
  { name: "full-width", props: { fullWidth: true }, children: "Save" },
  {
    name: "as-button",
    props: { as: "button" },
    children: "Save",
    note: "`as` is the escape hatch from the anchor form: it forces the button element.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
