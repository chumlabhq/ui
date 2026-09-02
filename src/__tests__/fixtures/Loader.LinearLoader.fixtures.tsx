import { LinearLoader } from "../../components/Loader";
import type { Fixtures } from "./types";

const fixtures: Fixtures<typeof LinearLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { height: 8, width: 240 } },
];
export default fixtures;
