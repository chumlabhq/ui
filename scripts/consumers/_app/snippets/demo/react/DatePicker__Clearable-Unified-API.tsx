import { useState } from "react";
import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  const [clearableDate, setClearableDate] = useState<Date | null>(new Date());
  return (
    <div className="w-full sm:max-w-xs">
                <DatePicker
                  label="Clearable Date"
                  value={clearableDate}
                  onValueChange={(d) => setClearableDate(d)}
                  clearable
                />
              </div>
  );
}
