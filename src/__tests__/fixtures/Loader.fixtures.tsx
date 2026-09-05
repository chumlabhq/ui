import { CircularLoader } from "../../components/Loader/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof CircularLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { size: 48, thickness: 4 } },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
