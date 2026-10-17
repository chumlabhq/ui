import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";

export default function CascadingDropdownExample() {
  return (
    <div className="w-full sm:max-w-xs">
      <CascadingDropdown
        label="Category"
        options={
          [
            { value: "fruit", label: "Fruit", children: [{ value: "apple", label: "Apple" }, { value: "pear", label: "Pear" }] },
            { value: "veg", label: "Vegetables", children: [{ value: "carrot", label: "Carrot" }, { value: "leek", label: "Leek" }] }
          ]
        }
        defaultOpen
      />
    </div>
  );
}
