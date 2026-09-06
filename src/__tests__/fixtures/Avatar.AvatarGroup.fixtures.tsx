import { Avatar, AvatarGroup } from "../../components/Avatar/index.js";
import type { Fixtures } from "./types.js";

/**
 * `variant` selects the group's layout and its overlap classes, and no fixture
 * rendered any of them — the same shape as `AvatarBadge.variant`, which is how
 * a 3.76:1 pair reached a release.
 */
const faces = (
  <>
    <Avatar name="Ada" />
    <Avatar name="Grace" />
    <Avatar name="Alan" />
    <Avatar name="Edsger" />
  </>
);

const fixtures: Fixtures<typeof AvatarGroup> = [
  { name: "stack", props: { variant: "stack" }, children: faces },
  { name: "grid", props: { variant: "grid" }, children: faces },
  { name: "inline", props: { variant: "inline" }, children: faces },
  { name: "with-surplus", props: { variant: "stack", max: 2 }, children: faces },
];

export default fixtures;
