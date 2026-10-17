import { CascadingDropdown } from "../../../components/CascadingDropdown/index.js";
import type { Previews } from "./types.js";

const DEPARTMENTS = [
  { value: "design", label: "Design", children: [{ value: "brand", label: "Brand" }, { value: "product", label: "Product design" }] },
  { value: "engineering", label: "Engineering", children: [{ value: "web", label: "Web" }, { value: "mobile", label: "Mobile" }] },
  { value: "sales", label: "Sales", children: [{ value: "emea", label: "EMEA" }, { value: "americas", label: "Americas" }] },
];

function Phone() {
  return <CascadingDropdown label="Team" options={DEPARTMENTS} placeholder="Choose a team" defaultOpen />;
}

export default { phone: Phone } satisfies Previews;
