"use client";

import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [basic, setBasic] = useState(50);
  return (
    <div className="flex flex-col gap-6 w-full sm:max-w-sm">
      <Slider label="Volume" value={basic} onValueChange={(v) => setBasic(v as number)} />
      <Slider label="Brightness" defaultValue={75} description="Adjust screen brightness" />
    </div>
  );
}
