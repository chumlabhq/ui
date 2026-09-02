import { DotLoader } from "../../components/Loader";
import type { Fixtures } from "./types";

const fixtures: Fixtures<typeof DotLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { dotSize: 12, gap: 8 } },
];
export default fixtures;
