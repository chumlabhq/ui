import { CircularLoader, LinearLoader, DotLoader, PulseLoader } from "../../components/Loader/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

/**
 * Loader ships four components; the module is typed by CircularLoader, so the
 * other three, and both track settings of the two that have a track, are
 * `render` fixtures. `loader-paint.spec` measures every one of them: the
 * indicator has to show against its track and against the surface, which the
 * linear bar did not when no `trackColor` was given.
 */
const TRACK = "var(--cl-bg-track)";

const fixtures: Fixtures<typeof CircularLoader> = [
  { name: "default", props: {} },
  { name: "sized", props: { size: 48, thickness: 4 } },
  { name: "circular-track", props: { trackColor: TRACK } },
  { name: "linear", props: {}, render: () => <LinearLoader width={200} /> },
  { name: "linear-track", props: {}, render: () => <LinearLoader width={200} trackColor={TRACK} /> },
  { name: "dot", props: {}, render: () => <DotLoader /> },
  { name: "pulse", props: {}, render: () => <PulseLoader /> },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
