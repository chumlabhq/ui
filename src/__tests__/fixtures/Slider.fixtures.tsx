import { Slider } from "../../components/Slider/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";

const fixtures: Fixtures<typeof Slider> = [
  { name: "default", props: {} },
  {
    name: "dragging",
    props: { defaultValue: 40 },
    note: "thumbActive was gated on isDragging, which no static prop set reaches — the one state that needs a pointer. A press and a move: the slider starts dragging on the first move after the press, and a press alone left this fixture at rest until S3.",
    act: async (c, ui) => {
      const thumb = c.ownerDocument.querySelector('[role="slider"]');
      ui.pointerDown(thumb, { pointerId: 1, clientX: 40, buttons: 1 });
      await ui.settle();
      ui.pointerMove(thumb, { pointerId: 1, clientX: 40, buttons: 1 });
      await ui.settle();
    },
  },
  { name: "labelled", props: { label: "Volume", description: "0 to 100" } },
  { name: "range", props: { defaultValue: [20, 60] } },
  { name: "tooltip-always", props: { showTooltip: true, tooltipAlways: true, defaultValue: 40 } },
  { name: "with-marks", props: { marks: [{ value: 0, label: "0" }, { value: 50, label: "50" }, { value: 100, label: "100" }], defaultValue: 50 } },
  // A value, so the range has width. At `min` it was 0px wide, and its disabled
  // paint was invisible to every baseline and painted gate that loads this.
  { name: "disabled", props: { disabled: true, defaultValue: 40 } },
  { name: "error", props: { label: "Volume", error: true, errorMessage: "Too loud" } },
  { name: "success", props: { label: "Volume", success: true, successMessage: "Nice" } },
  { name: "vertical", props: { orientation: "vertical" } },
  {
    name: "thumb-active",
    props: { defaultValue: 40 },
    act: (c, ui) => {
      const thumb = c.querySelector("[role='slider']");
      ui.focus(thumb);
      ui.pointerDown(thumb);
    },
  },
  { name: "required", props: { label: "Volume", required: true } },
  {
    name: "negative",
    props: { min: -50, max: 50, defaultValue: -20, showTooltip: true, tooltipAlways: true },
    note: "A signed value in the tooltip: `-20` reads in its own order in a right-to-left page.",
  },
  {
    name: "rtl",
    props: { defaultValue: 25, label: "Volume" },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    note: "A slider's zero is on the right in RTL; the fill and the thumb are the directional part."
  },
  { name: "loading", props: { defaultValue: 40, loading: true } },
];
export default fixtures;
