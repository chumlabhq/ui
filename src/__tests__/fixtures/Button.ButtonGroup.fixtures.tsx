import { Button, ButtonGroup } from "../../components/Button/index.js";
import type { Fixtures } from "./types.js";

/**
 * A group is only itself with children in it: the first-and-last radius rules
 * and the shared border are written against the buttons inside, and an empty
 * group renders none of them.
 */
const buttons = (
  <>
    <Button>Left</Button>
    <Button>Middle</Button>
    <Button>Right</Button>
  </>
);

const fixtures: Fixtures<typeof ButtonGroup> = [
  { name: "horizontal", props: {}, children: buttons },
  { name: "vertical", props: { orientation: "vertical" }, children: buttons },
];

export default fixtures;
