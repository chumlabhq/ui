import { AvatarGroupCount } from "../../components/Avatar/index.js";
import type { Fixtures } from "./types.js";

/**
 * The surplus pill. Its three variants are three colour pairs, none of them
 * painted by any fixture until now.
 */
const fixtures: Fixtures<typeof AvatarGroupCount> = [
  { name: "solid", props: { count: 3, variant: "solid" } },
  { name: "outline", props: { count: 3, variant: "outline" } },
  { name: "ghost", props: { count: 3, variant: "ghost" } },
];

export default fixtures;
