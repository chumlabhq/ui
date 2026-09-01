import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "open", props: { open: true }, children: "Body" },
  { name: "open-left", props: { open: true, direction: "left" }, children: "Body" },
  { name: "closed-kept-mounted", props: { open: false, keepMounted: true }, children: "Body" },
];
export default fixtures;
