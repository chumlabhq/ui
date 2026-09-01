import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: {}, children: "Save" },
  { name: "loading", props: { loading: true }, children: "Save" },
  { name: "disabled", props: { disabled: true }, children: "Save" },
  {
    name: "with-icons",
    props: { startIcon: <span>L</span>, endIcon: <span>R</span> },
    children: "Save",
  },
  { name: "full-width", props: { fullWidth: true }, children: "Save" },
];
export default fixtures;
