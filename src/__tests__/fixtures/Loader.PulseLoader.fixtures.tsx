import { PulseLoader } from "../../components/Loader/index.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof PulseLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { size: 48 } },
];
export default fixtures;
