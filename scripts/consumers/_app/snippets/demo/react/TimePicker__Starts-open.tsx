import { TimePicker } from "@chumlab/ui/time-picker";

export default function TimePickerExample() {
  return (
    <div className="w-full sm:max-w-xs">
      <TimePicker label="Meeting time" defaultOpen />
    </div>
  );
}
