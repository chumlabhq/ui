"use client";

import { useState } from "react";
import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const getMinimalTheme = (dark: boolean) => ({
  wrapper: "relative",
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border-b bg-transparent focus:outline-none border border-cl-border-input text-cl-text hover:border-cl-border-input-hover focus:border-cl-text",
  triggerText: "flex-1 truncate",
  content: "rounded shadow-sm overflow-hidden border bg-cl-bg-panel border-cl-border",
  optionList: "max-h-60 overflow-y-auto",
  option: "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-cl-text hover:bg-cl-bg-hover",
  optionSelected: "font-medium",
  optionFocused: "bg-black/5",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
  checkIcon: "w-4 h-4 shrink-0 text-cl-text-secondary",
  noResults: "px-3 py-4 text-sm text-center text-cl-text-tertiary",
});

const minimalTheme = getMinimalTheme(false);

const coolTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cl-border-input-focus rounded-cl-md bg-cl-accent/10 text-cl-text hover:bg-cl-accent/10 focus:outline-none focus:ring-2 focus:ring-cl-accent",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-accent hover:bg-cl-accent/20 transition-colors",
  optionSelected: "bg-cl-accent/25",
  optionFocused: "bg-cl-accent/20",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
  checkIcon: "w-4 h-4 shrink-0 text-cl-accent",
  noResults: "px-3 py-4 text-sm text-cl-accent text-center",
};

const warmTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cl-warning rounded-cl-md bg-cl-warning/15 text-cl-text hover:bg-cl-warning/15 focus:outline-none focus:ring-2 focus:ring-cl-warning",
  triggerText: "flex-1 truncate",
  // The menu floats over page content, so its background has to be opaque -
  // a translucent tint lets the text underneath bleed through. color-mix keeps
  // the warm wash while compositing it onto the elevated surface.
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-warning)_15%,var(--color-cl-bg-elevated))] border border-cl-warning",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-warning hover:bg-cl-warning/25 transition-colors",
  optionSelected: "bg-cl-warning/30",
  optionFocused: "bg-cl-warning/25",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-warning",
  checkIcon: "w-4 h-4 shrink-0 text-cl-warning",
  noResults: "px-3 py-4 text-sm text-cl-warning text-center",
};

const darkTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-[#2a2f3a] bg-[#0a0d12] text-white hover:bg-[#11151c] focus:outline-none focus:ring-2 focus:ring-cl-accent",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[#0a0d12] border border-[#2a2f3a]",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-white hover:bg-white/[0.08] transition-colors",
  optionSelected: "bg-white/[0.12] font-medium",
  optionFocused: "bg-white/[0.08]",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-white/60",
  checkIcon: "w-4 h-4 shrink-0 text-cl-accent",
  noResults: "px-3 py-4 text-sm text-white/60 text-center",
};

const fruitOptions: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

export default function DropdownExample() {
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  const [coolThemeValue, setCoolThemeValue] = useState<string | null>(null);
  const [minimalThemeValue, setMinimalThemeValue] = useState<string | null>(
    null,
  );
  return (
    <div className="w-full flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <Dropdown
          options={fruitOptions}
          value={darkThemeValue}
          onValueChange={(v) => setDarkThemeValue(v)}
          placeholder="Select a fruit..."
          classes={darkTheme}
        />
      </div>
      <div className="w-full sm:max-w-64">
        <Dropdown
          options={fruitOptions}
          value={warmThemeValue}
          onValueChange={(v) => setWarmThemeValue(v)}
          placeholder="Select a fruit..."
          classes={warmTheme}
        />
      </div>
      <div className="w-full sm:max-w-64">
        <Dropdown
          options={fruitOptions}
          value={coolThemeValue}
          onValueChange={(v) => setCoolThemeValue(v)}
          placeholder="Select a fruit..."
          classes={coolTheme}
        />
      </div>
      <div className="w-full sm:max-w-64">
        <Dropdown
          options={fruitOptions}
          value={minimalThemeValue}
          onValueChange={(v) => setMinimalThemeValue(v)}
          placeholder="Select a fruit..."
          showSelectedIcon={false}
          classes={minimalTheme}
        />
      </div>
    </div>
  );
}
