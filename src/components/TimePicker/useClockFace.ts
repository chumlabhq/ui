import { useLazyComponent } from "../../utils/useLazyComponent.js";
import type { ClockFaceProps } from "./utils/types.js";

/**
 * The analog clock, fetched only when a consumer asks for it.
 *
 * `mode="clock"` is half of this component and the default is the dropdown
 * list, so every consumer of the list paid for a clock face they never render.
 * Behind a dynamic import it leaves the eager closure, which is what
 * `assert-bundle-size.mjs` measures: 10.50 KB exclusive to 7.97.
 *
 * Fetched when the component mounts rather than when the panel opens, so by the
 * time anyone can see the panel the chunk has long resolved.
 */
const load = () => import("./ClockFace.js").then((module) => module.ClockFace);

export const useClockFace = (enabled: boolean) =>
  useLazyComponent<ClockFaceProps>(enabled, load);
