import { CircularLoader } from "../../components/Loader";
import type { Fixtures } from "./types";
import { motionOverrides } from "./_motion";

const fixtures: Fixtures<typeof CircularLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { size: 48, thickness: 4 } },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
