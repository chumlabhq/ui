import { useState } from "react";
import { TimePicker, TimePickerClasses } from "@chumlab/ui/time-picker";

const getMinimalTheme = (): TimePickerClasses => ({
  root: "inline-flex flex-col gap-1 text-cl-text",
  control: "relative",
  trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 border-b bg-transparent cursor-text border border-cl-border-input text-cl-text hover:border-cl-border focus-within:border-cl-border dark:border dark:border-cl-border dark:text-white dark:hover:border-cl-border-input dark:focus-within:border-cl-text",
  input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text dark:placeholder:text-cl-text-tertiary dark:text-white",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
  content: "rounded shadow-sm overflow-hidden border bg-white border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
  list: "max-h-60 overflow-y-auto",
  item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors text-cl-text hover:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-elevated",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-text-secondary",
  empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary",
});

const coolTheme: TimePickerClasses = {
  root: "inline-flex flex-col gap-1 text-cl-accent",
  control: "relative",
  trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 border border-cl-border-input-focus rounded-cl-md bg-cl-accent/10 text-cl-text hover:bg-cl-accent/10 focus-within:ring-2 focus-within:ring-cl-accent cursor-text",
  input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-accent text-cl-accent",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
  content: "border rounded-cl-md shadow-lg overflow-hidden bg-cl-accent/10 border-cl-border-input-focus",
  list: "max-h-60 overflow-y-auto",
  item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-accent hover:bg-cl-accent/10 transition-colors",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
  empty: "px-3 py-4 text-sm text-cl-accent text-center",
};

const warmTheme: TimePickerClasses = {
  root: "inline-flex flex-col gap-1 text-cl-warning",
  control: "relative",
  trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 border border-cl-warning rounded-cl-md bg-cl-warning/15 text-cl-text hover:bg-cl-warning/15 focus-within:ring-2 focus-within:ring-cl-warning cursor-text",
  input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-warning text-cl-warning",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-warning",
  content: "border rounded-cl-md shadow-lg overflow-hidden bg-cl-warning/15 border-cl-warning",
  list: "max-h-60 overflow-y-auto",
  item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-warning hover:bg-cl-warning/15 transition-colors",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-warning",
  empty: "px-3 py-4 text-sm text-cl-warning text-center",
};

const darkTheme: TimePickerClasses = {
  root: "inline-flex flex-col gap-1 text-cl-text",
  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
  control: "relative",
 trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 border-cl-border rounded-cl-md bg-cl-bg-elevated text-white hover:bg-cl-bg-elevated focus-within:ring-2 focus-within:ring-border-active cursor-text",
  input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
  content: "border rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-elevated border-cl-border",
  list: "max-h-60 overflow-y-auto",
  item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text hover:bg-cl-bg-elevated transition-colors",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
  empty: "px-3 py-4 text-sm text-cl-text-tertiary text-center",
};

export default function TimePickerExample() {
  const [darkThemeVal, setDarkThemeVal] = useState<string | null>(null);
  const [warmThemeVal, setWarmThemeVal] = useState<string | null>(null);
  const [coolThemeVal, setCoolThemeVal] = useState<string | null>(null);
  const [minimalThemeVal, setMinimalThemeVal] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <TimePicker
          value={darkThemeVal}
          onValueChange={(v) => setDarkThemeVal(v)}
          placeholder="Select time..."
          classes={darkTheme}
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {darkThemeVal ?? "none"}
        </span>
      </div>
      <div>
        <TimePicker
          value={warmThemeVal}
          onValueChange={(v) => setWarmThemeVal(v)}
          placeholder="Select time..."
          classes={warmTheme}
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {warmThemeVal ?? "none"}
        </span>
      </div>
      <div>
        <TimePicker
          value={coolThemeVal}
          onValueChange={(v) => setCoolThemeVal(v)}
          placeholder="Select time..."
          classes={coolTheme}
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {coolThemeVal ?? "none"}
        </span>
      </div>
      <div>
        <TimePicker
          value={minimalThemeVal}
          onValueChange={(v) => setMinimalThemeVal(v)}
          placeholder="Select time..."
          showSelectedIcon={false}
          classes={getMinimalTheme()}
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {minimalThemeVal ?? "none"}
        </span>
      </div>
    </div>
  );
}
