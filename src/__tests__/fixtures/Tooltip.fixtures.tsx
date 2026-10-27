import { Tooltip } from "../../components/Tooltip/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { PortalTarget } from "./_harness.js";
import { ModalFromTooltip, NEVER } from "./_tooltip.js";

const fixtures: Fixtures<typeof Tooltip> = [
  { name: "closed", props: { content: "Tip" }, children: <button>Trigger</button> },
  { name: "open", props: { content: "Tip", open: true }, children: <button>Trigger</button> },
  {
    name: "open-with-arrow",
    props: { content: "Tip", open: true, showArrow: true },
    children: <button>Trigger</button>,
  },
  {
    // A ROTATED side, with the arrow on. `open-with-arrow` above is top-placed,
    // and the arrow's offset is computed differently once the SVG is rotated —
    // that is where it sat 3px inside the bubble with both stroked edges
    // showing, and no picture covered it.
    name: "open-right-with-arrow",
    props: { content: "Tip", open: true, showArrow: true, side: "right" as const },
    children: <button>Trigger</button>,
  },
  { name: "disabled", props: { content: "Tip", disabled: true }, children: <button>Trigger</button> },
  {
    name: "focus-only",
    props: { content: "Tip", delayDuration: NEVER, hideDelayDuration: NEVER },
    children: <span>Trigger</span>,
    note: "A text trigger, so the wrapper takes the tab stop and Tab reaches it in every engine; hover is out of reach, so focus alone decides.",
  },
  {
    name: "restores-focus-from-modal",
    props: { content: "Tip" },
    render: () => <ModalFromTooltip />,
  },
  {
    name: "bottom",
    props: { content: "Tip", side: "bottom", delayDuration: 0 },
    children: <button>Trigger</button>,
    note: "Hovered rather than forced open: the side is only resolved once there is a trigger rect to flip against.",
  },
  {
    name: "in-scroller",
    props: { content: "Tip", delayDuration: 0 },
    children: <button>Trigger</button>,
    note: "Padded to make the page scroll, so the reposition-on-scroll listener has something to react to.",
    wrap: (node) => (
      <div style={{ paddingTop: "60vh", paddingBottom: "150vh" }}>{node}</div>
    ),
  },
  {
    name: "portalled",
    props: { content: "Tip", open: true, portal: true },
    children: <button>Trigger</button>,
    note: "The default renders inline; `portal` sends the tip to the body, which is the only shape the portal-scoped gates can see.",
  },
  {
    name: "portal-container",
    props: { content: "Tip" },
    render: () => (
      <PortalTarget>
        {(container) => (
          <Tooltip content="Tip" open portal portalContainer={container}>
            <button>Trigger</button>
          </Tooltip>
        )}
      </PortalTarget>
    ),
  },
  {
    name: "open-rtl",
    props: { content: "Tip", open: true },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    children: <button>Trigger</button>,
  },
  {
    name: "align-start-rtl",
    props: { content: "Copied to clipboard", open: true, align: "start" as const, showArrow: true },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    children: <button>Trigger</button>,
  },
];
export default fixtures;
