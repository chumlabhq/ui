import { PulseLoader } from "../../components/Loader";
import type { Fixtures } from "./types";

const fixtures: Fixtures<typeof PulseLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { size: 48 } },
];
export default fixtures;
