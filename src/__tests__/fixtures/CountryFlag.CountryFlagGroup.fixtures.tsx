import { CountryFlag, CountryFlagGroup, CountryFlagShimmer } from "../../components/CountryFlag/index.js";
import type { Fixtures } from "./types.js";

// An array, not a fragment: the group counts children to work out the surplus,
// and a fragment counts as one.
const flags = ["US", "GB", "FR"].map((code) => (
  <CountryFlag key={code} code={code} />
));

const fixtures: Fixtures<typeof CountryFlagGroup> = [
  { name: "default", props: {}, children: flags },
  { name: "capped", props: { maxVisible: 2 }, children: flags, note: "Drives the surplus count." },
  { name: "with-tooltips", props: { maxVisible: 2, showCountTooltip: true }, children: flags },
  {
    name: "mixed-loading",
    props: {},
    note: "A shimmer beside a decoded image: the alignment between the two is a layout claim only a browser can settle.",
    children: [
      <CountryFlagShimmer key="s1" />,
      <CountryFlag key="US" code="US" />,
      <CountryFlagShimmer key="s2" />,
      <CountryFlag key="GB" code="GB" />,
    ],
  },
];
export default fixtures;
