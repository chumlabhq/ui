import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";

export default function MultiSelectDropdownExample() {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      <div className="w-full sm:max-w-xs">
        <MultiSelectDropdown
          label="Toppings"
          options={
            [
              { value: "basil", label: "Basil" },
              { value: "olive", label: "Olive" },
              { value: "pepper", label: "Pepper" }
            ]
          }
          defaultValue={["olive", "basil"]}
        />
      </div>
      <div className="w-full sm:max-w-xs">
        <MultiSelectDropdown
          label="Sauces"
          options={
            [
              { value: "pesto", label: "Pesto" },
              { value: "tomato", label: "Tomato" },
              { value: "white", label: "White" }
            ]
          }
          defaultOpen
        />
      </div>
    </div>
  );
}
