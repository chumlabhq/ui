import type { Fixtures } from "./types";

const fixtures: Fixtures = [
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
];
export default fixtures;
