import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";

export default function SearchableDropdownExample() {
  return (
    <div className="w-full sm:max-w-xs">
      <SearchableDropdown
        label="Language"
        options={
          [
            { value: "en", label: "English" },
            { value: "fr", label: "French" },
            { value: "de", label: "German" }
          ]
        }
        defaultOpen
      />
    </div>
  );
}
