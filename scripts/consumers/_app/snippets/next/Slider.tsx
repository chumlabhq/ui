"use client";

import { Slider } from "@chumlab/ui/slider";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(50);
  return (
    <Slider
      label="Volume"
      value={value}
      onValueChange={(v) => setValue(v as number)}
    />
  );
}
