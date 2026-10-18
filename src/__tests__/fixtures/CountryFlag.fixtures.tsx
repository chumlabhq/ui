import { CountryFlag } from "../../components/CountryFlag/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof CountryFlag> = [
  {
    name: "resolved",
    props: { code: "US" },
    note: "A valid code takes the img branch immediately; the packaged SVG arrives later.",
  },
  { name: "loading", props: { code: "GB", loading: true } },
  {
    name: "fallback",
    props: { code: "", fallback: <span>?</span> },
    note: "showFallback needs an invalid code AND a fallback node — it renders null otherwise.",
  },
  {
    name: "error",
    props: { code: "US", basePath: "/__missing-flags" },
    note: "A base path with no flags behind it: the image fails and the root takes `data-error`.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
