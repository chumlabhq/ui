import { TimePicker } from "@chumlab/ui/time-picker";

export default function TimePickerExample() {
  return (
    <div className="w-full max-w-xs">
      <TimePicker
        label="Latest time the courier may ring the doorbell"
        description="After this, the parcel is left with a neighbour or taken back to the depot."
      />
    </div>
  );
}
