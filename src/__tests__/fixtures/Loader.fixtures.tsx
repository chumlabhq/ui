import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: {} },
  { name: "with-label", props: { label: "Loading" } },
  { name: "sized", props: { size: 48, thickness: 4 } },
];
export default fixtures;
