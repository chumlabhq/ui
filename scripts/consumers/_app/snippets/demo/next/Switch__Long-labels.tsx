import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <Switch
        label="Pause all notifications outside working hours, including mentions and direct messages"
      />
    </div>
  );
}
