import { isRtl } from "../../../utils/isBrowser.js";

export const physicalSide = (side: "start" | "end", el: Element | null): "left" | "right" =>
  (side === "end") === isRtl(el) ? "left" : "right";
