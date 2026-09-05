import { ResizablePanel } from "../../components/ResizablePanel/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof ResizablePanel> = [
  { name: "default", props: {}, children: <div>Panel</div> },
  { name: "disabled", props: { disabled: true }, children: <div>Panel</div> },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
