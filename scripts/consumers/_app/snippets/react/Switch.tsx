import { Switch } from "@chumlab/ui/switch";
import { useState } from "react";

export default function Example() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Switch
      label="Email notifications"
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  );
}
