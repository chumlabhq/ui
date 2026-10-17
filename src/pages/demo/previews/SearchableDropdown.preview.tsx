import { SearchableDropdown } from "../../../components/SearchableDropdown/index.js";
import type { Previews } from "./types.js";

const CITIES = [
  { value: "ams", label: "Amsterdam" },
  { value: "bcn", label: "Barcelona" },
  { value: "ber", label: "Berlin" },
  { value: "lis", label: "Lisbon" },
  { value: "lon", label: "London" },
  { value: "par", label: "Paris" },
  { value: "rom", label: "Rome" },
  { value: "vie", label: "Vienna" },
];

function Phone() {
  return <SearchableDropdown label="City" options={CITIES} placeholder="Search cities" defaultOpen />;
}

export default { phone: Phone } satisfies Previews;
