"use client";

import { TimePicker } from "@chumlab/ui/time-picker";
import { useState } from "react";

export default function Example() {
  const [time, setTime] = useState<string | null>(null);
  return <TimePicker value={time} onValueChange={(t) => setTime(t)} />;
}
