import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  return (
    <div className="w-full sm:max-w-xs">
                <DatePicker
                  label="Start Date"
                  description="Select the project start date"
                  placeholder="Pick a date"
                />
              </div>
  );
}
