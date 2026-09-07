import { useState } from "react";
import { DatePicker } from "@chumlab/ui/date-picker";

export default function MyForm() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      value={date}
      onValueChange={(d) => setDate(d)}
      label="Select a date"
      placeholder="Pick a date..."
    />
  );
}
