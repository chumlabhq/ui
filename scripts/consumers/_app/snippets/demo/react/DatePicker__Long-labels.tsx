import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  return (
    <div className="w-full max-w-xs">
      <DatePicker
        label="The first day you can start working at the new office"
        description="Pick a weekday at least two weeks from today, so the equipment can be ordered."
      />
    </div>
  );
}
