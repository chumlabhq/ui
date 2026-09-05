import { CountryFlagShimmer } from "../../components/CountryFlag/index.js";
import type { Fixtures } from "./types.js";

/**
 * COUNTRYFLAG.ai.md:19 imports CountryFlagShimmer directly, so it renders
 * without CountryFlag and carries its own anatomy.
 */
const fixtures: Fixtures<typeof CountryFlagShimmer> = [
  { name: "default", props: {} },
  { name: "sized", props: { size: 32 } },
  { name: "wide", props: { aspectRatio: 1.5 } },
];

export default fixtures;
