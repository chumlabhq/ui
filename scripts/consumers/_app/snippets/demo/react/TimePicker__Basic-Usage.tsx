import { useState } from "react";
import { TimePicker } from "@chumlab/ui/time-picker";

export default function TimePickerExample() {
  const [basic24, setBasic24] = useState<string | null>(null);
  return (
    <>
      {}
      <TimePicker
                  value={basic24}
                  onValueChange={(v) => setBasic24(v)}
                />
    </>
  );
}
