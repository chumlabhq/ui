import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: {}, children: <div>Panel</div> },
  { name: "disabled", props: { disabled: true }, children: <div>Panel</div> },
];
export default fixtures;
