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
];
export default fixtures;
