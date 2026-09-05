import { Slider } from "../../components/Slider/index.js";
import { fireEvent } from "@testing-library/react";
import { tick } from "./_act.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof Slider> = [
  { name: "default", props: {} },
  {
    name: "dragging",
    props: { defaultValue: 40 },
    note: "thumbActive was gated on isDragging, which no static prop set reaches — the one state that needs a pointer.",
    act: async (c) => {
      const thumb = c.ownerDocument.querySelector('[role="slider"]');
      if (thumb) {
        // jsdom implements no pointer capture, and the drag handler calls it on
        // the target. Without the stub the handler throws before setting state.
        (thumb as HTMLElement).setPointerCapture = () => {};
        (thumb as HTMLElement).releasePointerCapture = () => {};
        fireEvent.pointerDown(thumb, { pointerId: 1, clientX: 40, buttons: 1 });
      }
      await tick();
    },
  },
  { name: "labelled", props: { label: "Volume", description: "0 to 100" } },
  { name: "range", props: { defaultValue: [20, 60] } },
  { name: "tooltip-always", props: { showTooltip: true, tooltipAlways: true, defaultValue: 40 } },
  { name: "with-marks", props: { marks: [{ value: 0, label: "0" }, { value: 50, label: "50" }, { value: 100, label: "100" }], defaultValue: 50 } },
  { name: "disabled", props: { disabled: true } },
  { name: "error", props: { label: "Volume", error: true, errorMessage: "Too loud" } },
  { name: "success", props: { label: "Volume", success: true, successMessage: "Nice" } },
  { name: "vertical", props: { orientation: "vertical" } },
  {
    name: "thumb-active",
    props: { defaultValue: 40 },
    act: (c) => {
      const thumb = c.querySelector("[role='slider']");
      if (thumb) { fireEvent.focus(thumb); fireEvent.pointerDown(thumb); }
    },
  },
];
export default fixtures;
