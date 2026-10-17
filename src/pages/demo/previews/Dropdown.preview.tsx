import { Dropdown } from "../../../components/Dropdown/index.js";
import type { Previews } from "./types.js";

const COUNTRIES = [
  { value: "au", label: "Australia" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "in", label: "India" },
  { value: "jp", label: "Japan" },
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
];

function Phone() {
  return <Dropdown label="Country" options={COUNTRIES} placeholder="Choose a country" defaultOpen />;
}

export default { phone: Phone } satisfies Previews;
