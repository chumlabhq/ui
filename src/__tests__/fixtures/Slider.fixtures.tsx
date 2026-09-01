import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: {} },
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
