import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      <div className="w-full sm:max-w-xs">
        <DatePicker label="Check-in" defaultValue={new Date(2026, 9, 20)} />
      </div>
      <div className="w-full sm:max-w-xs">
        <DatePicker label="Check-out" defaultOpen />
      </div>
    </div>
  );
}
