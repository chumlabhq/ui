import { Avatar, AvatarGroup } from "../../components/Avatar/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

/** A 1x1 transparent PNG, so `load` actually fires in a browser. */
const PNG_1PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const fixtures: Fixtures<typeof Avatar> = [
  { name: "loading", props: { loading: true } },
  { name: "initials", props: { name: "Ada Lovelace" } },
  { name: "image", props: { src: "https://example.test/a.png", alt: "Ada" } },
  {
    name: "fallback",
    props: { fallback: <span>?</span>, alt: "Unknown" },
    note: "fallback renders only with no src and no initials, so `name` is omitted.",
  },
  { name: "with-status", props: { name: "Ada", status: "online" } },
  {
    name: "in-group",
    note: "`render`, not `wrap`: the overlap is a computed margin between real siblings, and sibling Avatars inside a `wrap` are rendered WITHOUT `unstyled`, so their decorative utilities leak into unstyled.contract's measurement. Avatar keeps five static fixtures, so the classes contracts lose nothing (fixtures.contract guards that).",
    props: {},
    render: () => (
      <AvatarGroup>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Bob Barker" />
        <Avatar name="Cy Coleman" />
      </AvatarGroup>
    ),
  },
  {
    name: "group-surplus",
    note: "The surplus count had no fixture at all, so the one part of the group that is not an Avatar was never painted in a baseline, never measured by e2e and never sat in an axe run. Its overlap regressed three times before this existed.",
    props: {},
    render: () => (
      <AvatarGroup max={2}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Bob Barker" />
        <Avatar name="Cy Coleman" />
        <Avatar name="Dee Dee" />
      </AvatarGroup>
    ),
  },
  {
    name: "image-decodable",
    props: { src: PNG_1PX, alt: "Ada" },
    note: "A data URI, not a URL: the fixture page has no network and CSP blocks one, so a real decode needs the bytes inline.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
