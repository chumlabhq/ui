import type { TimeFormat, TimeValue } from "./types";

const pad = (n: number): string => n.toString().padStart(2, "0");

export function generateTimeOptions(
  format: TimeFormat,
  minuteStep: number = 15,
  minTime?: string,
  maxTime?: string
): string[] {
  const options: string[] = [];
  const minMinutes = minTime ? parseTimeToMinutes(minTime, format) : 0;
  const maxMinutes = maxTime ? parseTimeToMinutes(maxTime, format) : 24 * 60 - 1;

  for (let totalMinutes = 0; totalMinutes < 24 * 60; totalMinutes += minuteStep) {
    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) continue;

    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (format === "24h") {
      options.push(`${pad(hours24)}:${pad(minutes)}`);
    } else {
      const period = hours24 >= 12 ? "PM" : "AM";
      const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
      options.push(`${pad(hours12)}:${pad(minutes)} ${period}`);
    }
  }

  return options;
}

export function parseTimeToMinutes(time: string, format: TimeFormat): number {
  const parsed = parseTimeInput(time, format);
  if (!parsed) return 0;

  let hours24 = parsed.hours;
  if (format === "12h" && parsed.period) {
    if (parsed.period === "PM" && parsed.hours !== 12) {
      hours24 = parsed.hours + 12;
    } else if (parsed.period === "AM" && parsed.hours === 12) {
      hours24 = 0;
    }
  }

  return hours24 * 60 + parsed.minutes;
}

export function parseTimeInput(raw: string, format: TimeFormat): TimeValue | null {
  if (!raw || !raw.trim()) return null;

  const cleaned = raw.trim().toUpperCase();

  let period: "AM" | "PM" | undefined;
  let timeStr = cleaned;

  if (format === "12h") {
    if (cleaned.includes("PM") || cleaned.includes("P")) {
      period = "PM";
      timeStr = cleaned.replace(/\s*(PM|P)\s*/gi, "").trim();
    } else if (cleaned.includes("AM") || cleaned.includes("A")) {
      period = "AM";
      timeStr = cleaned.replace(/\s*(AM|A)\s*/gi, "").trim();
    }
  }

  const digitsOnly = timeStr.replace(/[^\d]/g, "");

  if (timeStr.includes(":")) {
    const [hStr, mStr] = timeStr.split(":");
    const hours = parseInt(hStr || "0", 10);
    const minutes = parseInt(mStr?.replace(/\D/g, "") || "0", 10);

    if (isNaN(hours) || isNaN(minutes)) return null;

    return validateAndNormalize(hours, minutes, period, format);
  }

  if (!digitsOnly) return null;

  const numericValue = parseInt(digitsOnly, 10);

  switch (digitsOnly.length) {
    case 1:
    case 2: {
      const hours = numericValue;
      return validateAndNormalize(hours, 0, period, format);
    }
    case 3: {
      const hours = parseInt(digitsOnly.slice(0, 1), 10);
      const minutes = parseInt(digitsOnly.slice(1), 10);
      return validateAndNormalize(hours, minutes, period, format);
    }
    case 4: {
      const hours = parseInt(digitsOnly.slice(0, 2), 10);
      const minutes = parseInt(digitsOnly.slice(2), 10);
      return validateAndNormalize(hours, minutes, period, format);
    }
    default:
      return null;
  }
}

function validateAndNormalize(
  hours: number,
  minutes: number,
  period: "AM" | "PM" | undefined,
  format: TimeFormat
): TimeValue | null {
  if (minutes < 0 || minutes > 59) return null;

  if (format === "24h") {
    if (hours < 0 || hours > 23) return null;
    return { hours, minutes };
  }

  if (hours < 0 || hours > 23) return null;

  if (hours === 0) {
    return { hours: 12, minutes, period: period || "AM" };
  }

  if (hours > 12) {
    return { hours: hours - 12, minutes, period: "PM" };
  }

  if (hours === 12) {
    return { hours: 12, minutes, period: period || "PM" };
  }

  return { hours, minutes, period: period || "AM" };
}

export function formatTimeValue(timeValue: TimeValue, format: TimeFormat): string {
  if (format === "24h") {
    let hours24 = timeValue.hours;
    if (timeValue.period === "PM" && timeValue.hours !== 12) {
      hours24 = timeValue.hours + 12;
    } else if (timeValue.period === "AM" && timeValue.hours === 12) {
      hours24 = 0;
    }
    return `${pad(hours24)}:${pad(timeValue.minutes)}`;
  }

  return `${pad(timeValue.hours)}:${pad(timeValue.minutes)} ${timeValue.period || "AM"}`;
}

export function convertTimeFormat(time: string, fromFormat: TimeFormat, toFormat: TimeFormat): string | null {
  const parsed = parseTimeInput(time, fromFormat);
  if (!parsed) return null;
  return formatTimeValue(parsed, toFormat);
}

export function timeValueFromString(time: string, format: TimeFormat): TimeValue | null {
  return parseTimeInput(time, format);
}
