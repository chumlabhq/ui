import { MultiSelectDropdown } from "../../../components/MultiSelectDropdown/index.js";
import type { Previews } from "./types.js";

const TOPPINGS = [
  { value: "basil", label: "Basil" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive" },
  { value: "onion", label: "Onion" },
  { value: "pepper", label: "Pepper" },
  { value: "pineapple", label: "Pineapple" },
  { value: "spinach", label: "Spinach" },
  { value: "tomato", label: "Tomato" },
];

function Phone() {
  return (
    <MultiSelectDropdown label="Toppings" options={TOPPINGS} defaultValue={["mushroom", "olive", "pepper"]} defaultOpen />
  );
}

export default { phone: Phone } satisfies Previews;
