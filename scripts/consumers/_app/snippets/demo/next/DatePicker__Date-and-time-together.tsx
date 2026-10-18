"use client";

import { useState } from "react";
import { DatePicker } from "@chumlab/ui/date-picker";
import { TimePicker } from "@chumlab/ui/time-picker";

export default function DatePickerExample() {
  const [appointmentDay, setAppointmentDay] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  return (
    <div data-demo-recipe="date-and-time" className="w-full space-y-4">
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <div className="w-full sm:max-w-xs">
          <DatePicker
            label="Day"
            value={appointmentDay}
            onValueChange={(day) => setAppointmentDay(day)}
          />
        </div>
        <div className="w-full sm:max-w-xs">
          <TimePicker
            label="Time"
            value={appointmentTime}
            onValueChange={(time) => setAppointmentTime(time)}
          />
        </div>
      </div>
      <p aria-live="polite" data-demo-appointment="" className="text-sm text-cl-text">
        {
          appointmentDay && appointmentTime
          ? `Appointment: ${appointmentDay.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} at ${appointmentTime}`
          : "Pick a day and a time."
        }
      </p>
    </div>
  );
}
