import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [basicSwitch, setBasicSwitch] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Switch
        label="Email notifications"
        checked={basicSwitch}
        onCheckedChange={setBasicSwitch}
      />
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Maintenance mode" disabled />
    </div>
  );
}
