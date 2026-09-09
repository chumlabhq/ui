"use client";

import { useState } from "react";
import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  const [successDate, setSuccessDate] = useState<Date | null>(new Date());
  return (
    <div className="w-full sm:max-w-xs">
      <DatePicker
        label="Event Date"
        value={successDate}
        onValueChange={(d) => setSuccessDate(d)}
        success={!!successDate}
        successMessage="Date is available"
      />
    </div>
  );
}
