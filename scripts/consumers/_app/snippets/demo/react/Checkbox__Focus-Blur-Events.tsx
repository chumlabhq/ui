import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [focusLog, setFocusLog] = useState<string[]>([]);
  return (
    <>
      <Checkbox
                  label="Focus me and check the log"
                  size="md"
                  shape="rounded"
                  classes={({
          root: "",
          label: `text-sm font-medium text-cl-text`,
          description: `text-xs text-cl-text-secondary`
        })}
                  onFocus={() =>
                    setFocusLog((prev) => ["Focused", ...prev.slice(0, 4)])
                  }
                  onBlur={() =>
                    setFocusLog((prev) => ["Blurred", ...prev.slice(0, 4)])
                  }
                />
      {focusLog.length > 0 && (
                  <div
                    className={`mt-3 text-xs font-mono space-y-1 text-cl-text-secondary`}
                  >
                    {focusLog.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                )}
    </>
  );
}
