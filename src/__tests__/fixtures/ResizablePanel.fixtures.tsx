import { ResizablePanel } from "../../components/ResizablePanel/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof ResizablePanel> = [
  { name: "default", props: {}, children: <div>Panel</div> },
  { name: "disabled", props: { disabled: true }, children: <div>Panel</div> },
  {
    name: "resizing",
    props: {},
    children: <div>Panel</div>,
    note: "A press on the handle starts a resize and holds it until release, which is the only moment `data-resizing` is set.",
    act: (c, ui) => ui.pointerDown(c.querySelector('[role="separator"]'), { pointerId: 1, clientX: 300, buttons: 1 }),
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
