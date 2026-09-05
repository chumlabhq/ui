import { LinearLoader } from "../../components/Loader/index.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof LinearLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { height: 8, width: 240 } },
];
export default fixtures;
