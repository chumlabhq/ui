import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  return (
    <div className="w-full sm:max-w-xs">
                <DatePicker
                  label="Checking availability..."
                  loading
                  placeholder="Pick a date"
                />
              </div>
  );
}
