import { Tooltip } from "../../components/Tooltip/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { PortalTarget } from "./_harness.js";

const fixtures: Fixtures<typeof Tooltip> = [
  { name: "closed", props: { content: "Tip" }, children: <button>Trigger</button> },
  { name: "open", props: { content: "Tip", open: true }, children: <button>Trigger</button> },
  {
    name: "open-with-arrow",
    props: { content: "Tip", open: true, showArrow: true },
    children: <button>Trigger</button>,
  },
  { name: "disabled", props: { content: "Tip", disabled: true }, children: <button>Trigger</button> },
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
];
export default fixtures;
