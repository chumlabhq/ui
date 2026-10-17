import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";

export default function SearchableDropdownExample() {
  const [languageMounts, setLanguageMounts] = useState(0);
  return (
    <div className="w-full sm:max-w-xs space-y-3">
      <Button
        className="border border-cl-border bg-cl-bg-elevated text-cl-text"
        onClick={() => setLanguageMounts((n) => n + 1)}
      >
        Show it open
      </Button>
      {
        languageMounts > 0 && (
          <SearchableDropdown
            key={languageMounts}
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
        )
      }
    </div>
  );
}
