"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [shapeSquare, setShapeSquare] = useState(true);
  const [shapeRounded, setShapeRounded] = useState(true);
  const [shapeCircle, setShapeCircle] = useState(true);
  return (
    <>
      {
        [
          { sh: "square" as const, val: shapeSquare, set: setShapeSquare },
          { sh: "rounded" as const, val: shapeRounded, set: setShapeRounded },
          { sh: "circle" as const, val: shapeCircle, set: setShapeCircle }
        ].map(({ sh, val, set }) => (
          <div key={sh} className="text-center">
            <Checkbox
              aria-label={`Shape ${sh}`}
              checked={val}
              onCheckedChange={set}
              size="lg"
              shape={sh}
              classes={
                {
                  root: "",
                  label: "text-sm font-medium text-cl-text",
                  description: "text-xs text-cl-text-secondary"
                }
              }
            />
            <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
              {sh}
            </p>
          </div>
        ))
      }
    </>
  );
}
