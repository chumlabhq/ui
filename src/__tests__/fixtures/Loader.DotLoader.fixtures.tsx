import { DotLoader } from "../../components/Loader/index.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof DotLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { size: 12, gap: 8 } },
];
export default fixtures;
