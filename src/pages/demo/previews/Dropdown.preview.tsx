import { Dropdown } from "../../../components/Dropdown/index.js";

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

export function Phone() {
  return <Dropdown label="Country" options={COUNTRIES} placeholder="Choose a country" defaultOpen />;
}
