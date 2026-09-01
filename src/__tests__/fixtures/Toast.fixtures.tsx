import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: { message: "Saved" } },
  { name: "with-description", props: { message: "Saved", description: "Your changes are live." } },
  { name: "with-action", props: { message: "Saved", action: <button>Undo</button> } },
  { name: "variants", props: { message: "Saved", variant: "success", showProgress: true } },
];
export default fixtures;
