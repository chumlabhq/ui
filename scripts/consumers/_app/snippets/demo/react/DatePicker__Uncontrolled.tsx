import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  const [checkoutMounts, setCheckoutMounts] = useState(0);
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      <div className="w-full sm:max-w-xs">
        <DatePicker label="Check-in" defaultValue={new Date(2026, 9, 20)} />
      </div>
      <div className="w-full sm:max-w-xs space-y-3">
        <Button
          className="border border-cl-border bg-cl-bg-elevated text-cl-text"
          onClick={() => setCheckoutMounts((n) => n + 1)}
        >
          Show it open
        </Button>
        {
          checkoutMounts > 0 && (
            <DatePicker key={checkoutMounts} label="Check-out" defaultOpen />
          )
        }
      </div>
    </div>
  );
}
