import { Dropdown } from "@chumlab/ui/dropdown";

export default function DropdownExample() {
  return (
    <div className="w-full sm:max-w-xs">
      <Dropdown
        label="Size"
        options={
          [
            { value: "s", label: "Small" },
            { value: "m", label: "Medium" },
            { value: "l", label: "Large" }
          ]
        }
        defaultOpen
      />
    </div>
  );
}
