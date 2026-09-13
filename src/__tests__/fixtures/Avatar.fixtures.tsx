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
    note: "Carries a `classes.surplus` override because that slot was in the public type and read nowhere — a consumer could set it and it painted nothing. The ring around the surplus is an inline boxShadow and no class reaches it; the fill and text colour are what this proves. The surplus count had no fixture at all, so the one part of the group that is not an Avatar was never painted in a baseline, never measured by e2e and never sat in an axe run. Its overlap regressed three times before this existed.",
    props: {},
    render: () => (
      // `classes.surplus` is passed here because it was in the public type and
      // read nowhere — a slot a consumer could set that painted nothing. This
      // fixture is the only place the wired slot reaches markup.
      <AvatarGroup max={2} classes={{ surplus: "bg-cl-accent text-cl-on-accent" }}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Bob Barker" />
        <Avatar name="Cy Coleman" />
        <Avatar name="Dee Dee" />
      </AvatarGroup>
    ),
  },
  {
    name: "group-render-surplus",
    note: "The `renderSurplus` escape hatch had no fixture: the branch that hands the slot to the caller was never painted, measured or photographed, while the default surplus beside it was. It is also the branch that does NOT join the overlap stack, which is the behaviour most likely to regress.",
    props: {},
    render: () => (
      <AvatarGroup max={2} renderSurplus={(n) => <span>and {n} more</span>}>
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
