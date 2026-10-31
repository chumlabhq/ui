import { ResizablePanel } from "../../components/ResizablePanel/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";
import { RtlBoundary } from "./_harness.js";

const fixtures: Fixtures<typeof ResizablePanel> = [
  { name: "default", props: {}, children: <div>Panel</div> },
  { name: "disabled", props: { disabled: true }, children: <div>Panel</div> },
  {
    name: "start",
    props: { resizeDirection: "start" },
    children: <div>Panel</div>,
    wrap: (node) => <div style={{ display: "flex", justifyContent: "flex-end" }}>{node}</div>,
    note: "The handle on the panel's inline-start edge, the panel placed at the inline end so that edge is the inner one.",
  },
  {
    name: "default-rtl",
    props: {},
    children: <div>Panel</div>,
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    note: "The default end edge in a right-to-left page: the panel sits on the right and its handle on its left, between the panes.",
  },
  {
    name: "resizing",
    props: {},
    children: <div>Panel</div>,
    note: "A press on the handle starts a resize and holds it until release, which is the only moment `data-resizing` is set.",
    act: (c, ui) => ui.pointerDown(c.querySelector('[role="separator"]'), { pointerId: 1, clientX: 300, buttons: 1 }),
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
