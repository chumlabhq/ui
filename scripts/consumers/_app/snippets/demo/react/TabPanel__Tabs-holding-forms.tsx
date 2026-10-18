import { useState } from "react";
import { Input } from "@chumlab/ui/input";
import { TabPanel } from "@chumlab/ui/tab-panel";

export default function TabPanelExample() {
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  return (
    <div data-demo-recipe="tabs-forms" className="w-full sm:max-w-md space-y-4">
      <TabPanel
        tabs={
          [
            { id: "profile", label: "Profile" },
            { id: "contact", label: "Contact" }
          ]
        }
      >
        {
          (tab) =>
          tab.id === "profile" ? (
            <Input label="Display name" value={profileName} onValueChange={setProfileName} />
          ) : (
            <Input label="Email" type="email" value={profileEmail} onValueChange={setProfileEmail} />
          )
        }
      </TabPanel>
      <p data-demo-tabs-readout="" className="text-sm text-cl-text-secondary">
        {`Name: ${profileName || "—"} · Email: ${profileEmail || "—"}`}
      </p>
    </div>
  );
}
