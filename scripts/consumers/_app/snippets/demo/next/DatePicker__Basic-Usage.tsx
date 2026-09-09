"use client";

import { useState } from "react";
import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  return (
    <div className="w-full sm:max-w-xs">
      <DatePicker
        value={singleDate}
        onValueChange={(date) => setSingleDate(date)}
        label="Select a date"
        placeholder="Pick a date..."
      />
    </div>
  );
}
