import { Avatar, AvatarGroup } from "../../components/Avatar/index.js";
import type { Fixtures } from "./types.js";

/**
 * `layout` selects the group's arrangement and its overlap classes, and no fixture
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
  { name: "stack", props: { layout: "stack" }, children: faces },
  { name: "grid", props: { layout: "grid" }, children: faces },
  { name: "inline", props: { layout: "inline" }, children: faces },
  { name: "with-surplus", props: { layout: "stack", max: 2 }, children: faces },
];

export default fixtures;
