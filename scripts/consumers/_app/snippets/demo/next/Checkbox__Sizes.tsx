"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [sizeXs, setSizeXs] = useState(true);
  const [sizeSm, setSizeSm] = useState(true);
  const [sizeMd, setSizeMd] = useState(true);
  const [sizeLg, setSizeLg] = useState(true);
  const [sizeXl, setSizeXl] = useState(true);
  return (
    <>
      {
        [
          { s: "xs" as const, val: sizeXs, set: setSizeXs },
          { s: "sm" as const, val: sizeSm, set: setSizeSm },
          { s: "md" as const, val: sizeMd, set: setSizeMd },
          { s: "lg" as const, val: sizeLg, set: setSizeLg },
          { s: "xl" as const, val: sizeXl, set: setSizeXl }
        ].map(({ s, val, set }) => (
          <div key={s} className="text-center">
            <Checkbox
              aria-label={`Size ${s}`}
              checked={val}
              onCheckedChange={set}
              size={s}
              shape="rounded"
              classes={
                {
                  root: "",
                  label: "text-sm font-medium text-cl-text",
                  description: "text-xs text-cl-text-secondary"
                }
              }
            />
            <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
              {s}
            </p>
          </div>
        ))
      }
      <div className="text-center">
        <Checkbox
          aria-label="Size 28px"
          checked={true}
          size={28}
          shape="rounded"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">28px</p>
      </div>
    </>
  );
}
