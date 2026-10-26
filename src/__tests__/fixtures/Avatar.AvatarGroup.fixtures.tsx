import { Avatar, AvatarGroup } from "../../components/Avatar/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";

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

/** The same four as separate children: the group counts a Fragment as one member. */
const faceList = [
  <Avatar key="ada" name="Ada" />,
  <Avatar key="grace" name="Grace" />,
  <Avatar key="alan" name="Alan" />,
  <Avatar key="edsger" name="Edsger" />,
];

const fixtures: Fixtures<typeof AvatarGroup> = [
  { name: "stack", props: { layout: "stack" }, children: faces },
  { name: "grid", props: { layout: "grid" }, children: faces },
  { name: "inline", props: { layout: "inline" }, children: faces },
  { name: "with-surplus", props: { layout: "stack", maxVisible: 2 }, children: faces },
  {
    name: "with-surplus-rtl",
    props: { layout: "stack", maxVisible: 2 },
    children: faceList,
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    note: "No `dir` of its own: the stack inherits the page's right-to-left and overlaps from the right, the surplus count last.",
  },
];

export default fixtures;
