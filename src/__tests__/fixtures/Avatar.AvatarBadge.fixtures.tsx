import { AvatarBadge } from "../../components/Avatar/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";

/**
 * The badge had no fixture at all, and it is the reason it had a contrast
 * defect: `bg-red-500` under `text-white` is 3.76:1, and neither the axe sweep
 * nor the painted-contrast check can measure markup nothing renders. One
 * fixture per variant, because the variant is the colour pair.
 *
 * `position: absolute` needs a positioned ancestor or the badge lands against
 * the page; the wrapper is what the demo puts around it.
 */
const inline = (node: React.ReactNode) => (
  <div style={{ position: "relative", display: "inline-flex", width: 40, height: 40 }}>
    {node}
  </div>
);

const fixtures: Fixtures<typeof AvatarBadge> = [
  { name: "count-solid", props: { count: 3 }, wrap: inline },
  { name: "count-top-start", props: { count: 3, position: "top-start" }, wrap: inline },
  {
    name: "count-overflow-rtl",
    props: { count: 120, max: 99 },
    wrap: (node) => <RtlBoundary>{inline(node)}</RtlBoundary>,
    note: "The default top-end corner in a right-to-left page is the top left, and the `99+` cap reads in its own order.",
  },
  { name: "count-outline", props: { count: 3, variant: "outline" }, wrap: inline },
  { name: "count-soft", props: { count: 3, variant: "soft" }, wrap: inline },
  {
    name: "count-overflow",
    props: { count: 120, max: 99 },
    wrap: inline,
    note: "The `max` cap renders `99+`, which is the widest the pill gets.",
  },
  { name: "dot", props: { dot: true }, wrap: inline },
];

export default fixtures;
