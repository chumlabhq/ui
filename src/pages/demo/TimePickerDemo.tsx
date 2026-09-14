import {
  useState } from "react";
import { TimePicker } from "../../components/TimePicker/index.js";
import type { TimePickerClasses } from "../../components/TimePicker/index.js";
import { Button } from "../../components/Button/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DemoLabel,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";

const getClasses = (dark: boolean) => ({
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
  btnPrimary:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer",
  text: dark ? "text-cl-text-secondary" : "text-cl-text-secondary",
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  label: `text-xs font-medium text-cl-text-tertiary`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  timepicker: {
    root: `inline-flex flex-col gap-1 text-cl-text`,
    label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
    control: "relative",
 trigger: `flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input bg-white hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:hover:border-cl-border dark:focus-within:ring-2 dark:focus-within:ring-cl-accent dark:focus-within:border-transparent`,
    input: `flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text`,
    icon: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary`,
    clearTrigger: `shrink-0 w-4 h-4 cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary dark:text-cl-text-tertiary dark:hover:text-cl-text`,
    content: `border rounded-cl-md shadow-lg overflow-hidden bg-white border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    list: "max-h-60 overflow-y-auto",
    item: `flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text hover:bg-black/5 dark:text-cl-text dark:hover:bg-white/10`,
    itemIndicator: `w-4 h-4 shrink-0 text-cl-accent`,
    empty: `px-3 py-4 text-sm text-center text-cl-text-tertiary`,
    message: `text-sm mt-1 text-cl-error`,
 clockContent: `p-4 rounded-cl-lg shadow-lg bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    clockDisplay: "flex items-center justify-center gap-1 mb-4",
    clockHours: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10`,
    clockMinutes: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10`,
    clockSeparator: `text-2xl font-semibold text-cl-text-tertiary`,
    clockFace: `relative w-52 h-52 mx-auto rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated`,
    clockHand: "absolute inset-0",
    clockHandLine: dark ? "stroke-cl-accent" : "stroke-cl-accent",
    clockHandDot: `w-3 h-3 rounded-full bg-cl-accent dark:bg-cl-accent/90`,
    clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text dark:text-cl-text-secondary dark:hover:text-white text-xs text-cl-text-tertiary",
    clockCenter: dark ? "fill-cl-accent" : "fill-cl-accent",
    footer: "flex items-center justify-end gap-2 mt-4",
    cancelButton: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10`,
    confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90",
    row: "flex flex-col gap-1 ml-3",
    periodButton: `px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-black/5 dark:text-cl-text-tertiary dark:hover:bg-white/10`,
  } satisfies TimePickerClasses,
});

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

const getMinimalTheme = (): TimePickerClasses => ({
  root: `inline-flex flex-col gap-1 text-cl-text`,
  control: "relative",
  trigger: `flex items-center gap-2 w-full sm:w-56 px-3 py-2 border-b bg-transparent cursor-text border border-cl-border-input text-cl-text hover:border-cl-border focus-within:border-cl-border dark:border dark:border-cl-border dark:text-white dark:hover:border-cl-border-input dark:focus-within:border-cl-text`,
  input: `flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text dark:placeholder:text-cl-text-tertiary dark:text-white`,
  icon: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary`,
  content: `rounded shadow-sm overflow-hidden border bg-white border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
  list: "max-h-60 overflow-y-auto",
  item: `flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors text-cl-text hover:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-elevated`,
  itemIndicator: `w-4 h-4 shrink-0 text-cl-text-secondary`,
  empty: `px-3 py-4 text-sm text-center text-cl-text-tertiary`,
});

const getEmeraldClockTheme = (dark: boolean): TimePickerClasses => ({
  root: `inline-flex flex-col gap-1 text-cl-text`,
  control: "relative",
 trigger: `flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-success bg-white hover:border-cl-success focus-within:ring-2 focus-within:ring-cl-success dark:border dark:border-cl-success dark:bg-cl-bg-elevated dark:hover:border-cl-success dark:focus-within:ring-2 dark:focus-within:ring-cl-success`,
  input: `flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text`,
  icon: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-success dark:text-cl-success`,
 clockContent: `p-4 rounded-cl-lg shadow-lg bg-white border border-cl-success dark:bg-cl-bg-elevated dark:border dark:border-cl-success`,
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockHours: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  clockMinutes: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  clockSeparator: `text-2xl font-semibold text-cl-text-tertiary`,
  clockFace: `relative w-52 h-52 mx-auto rounded-full bg-cl-success/15 dark:bg-cl-success/30`,
  clockHand: "absolute inset-0",
  clockHandLine: dark ? "stroke-cl-success" : "stroke-cl-success",
  clockHandDot: `w-3 h-3 rounded-full bg-cl-success/30`,
  clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary",
  clockCenter: dark ? "fill-cl-success" : "fill-cl-success",
  footer: "flex items-center justify-end gap-2 mt-4",
  cancelButton: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-success text-white hover:bg-cl-success",
  row: "flex flex-col gap-1 ml-3",
  periodButton: `px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-elevated`,
});

const getRoseClockTheme = (dark: boolean): TimePickerClasses => ({
  root: `inline-flex flex-col gap-1 text-cl-text`,
  control: "relative",
 trigger: `flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input-focus bg-white hover:border-cl-border-input-focus focus-within:ring-2 focus-within:ring-cl-accent dark:border dark:border-cl-border-input-focus dark:bg-cl-bg-elevated dark:hover:border-cl-border-input-focus dark:focus-within:ring-2 dark:focus-within:ring-cl-accent`,
  input: `flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text`,
  icon: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent dark:text-cl-accent`,
 clockContent: `p-4 rounded-cl-lg shadow-lg bg-white border border-cl-border-input-focus dark:bg-cl-bg-elevated dark:border dark:border-cl-border-input-focus`,
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockHours: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  clockMinutes: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  clockSeparator: `text-2xl font-semibold text-cl-text-tertiary`,
  clockFace: `relative w-52 h-52 mx-auto rounded-full bg-cl-accent/10 dark:bg-cl-accent/30`,
  clockHand: "absolute inset-0",
  clockHandLine: dark ? "stroke-cl-accent" : "stroke-cl-accent",
  clockHandDot: `w-3 h-3 rounded-full bg-cl-accent dark:bg-cl-accent/90`,
  clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary",
  clockCenter: dark ? "fill-cl-accent" : "fill-cl-accent",
  footer: "flex items-center justify-end gap-2 mt-4",
  cancelButton: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent",
  row: "flex flex-col gap-1 ml-3",
  periodButton: `px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-elevated`,
});

const getVioletClockTheme = (dark: boolean): TimePickerClasses => ({
  root: `inline-flex flex-col gap-1 text-cl-text`,
  control: "relative",
 trigger: `flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input-focus bg-white hover:border-cl-border-input-focus focus-within:ring-2 focus-within:ring-cl-accent dark:border dark:border-cl-border-input-focus dark:bg-cl-bg-elevated dark:hover:border-cl-border-input-focus dark:focus-within:ring-2 dark:focus-within:ring-cl-accent`,
  input: `flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text`,
  icon: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent dark:text-cl-accent`,
 clockContent: `p-4 rounded-cl-lg shadow-lg bg-white border border-cl-border-input-focus dark:bg-cl-bg-elevated dark:border dark:border-cl-border-input-focus`,
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockHours: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  clockMinutes: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  clockSeparator: `text-2xl font-semibold text-cl-text-tertiary`,
  clockFace: `relative w-52 h-52 mx-auto rounded-full bg-cl-accent/10 dark:bg-cl-accent/30`,
  clockHand: "absolute inset-0",
  clockHandLine: dark ? "stroke-cl-accent" : "stroke-cl-accent",
  clockHandDot: `w-3 h-3 rounded-full bg-cl-accent dark:bg-cl-accent/90`,
  clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary",
  clockCenter: dark ? "fill-cl-accent" : "fill-cl-accent",
  footer: "flex items-center justify-end gap-2 mt-4",
  cancelButton: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated`,
  confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent",
  row: "flex flex-col gap-1 ml-3",
  periodButton: `px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-elevated`,
});

const ClockEndIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true" width={16} height={16}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
  </svg>
);

const StarCheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true" width={16} height={16}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TimePickerDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [basic24, setBasic24] = useState<string | null>(null);
  const [twelve, setTwelve] = useState<string | null>(null);
  const [step5, setStep5] = useState<string | null>(null);
  const [step15, setStep15] = useState<string | null>(null);
  const [step30, setStep30] = useState<string | null>(null);
  const [step1, setStep1] = useState<string | null>(null);
  const [minMax, setMinMax] = useState<string | null>(null);
  const [clock24, setClock24] = useState<string | null>(null);
  const [clock12, setClock12] = useState<string | null>(null);
  const [labeled, setLabeled] = useState<string | null>(null);
  const [errored, setErrored] = useState<string | null>(null);
  const [disabledVal] = useState<string | null>("09:30");
  const [fullWidthVal, setFullWidthVal] = useState<string | null>(null);
  const [controlled, setControlled] = useState<string | null>(null);
  const [successTime, setSuccessTime] = useState<string | null>("14:00");
  const [controlledOpen, setControlledOpen] = useState(false);
  const [scrollLockDefault, setScrollLockDefault] = useState<string | null>(null);
  const [scrollLockEnabled, setScrollLockEnabled] = useState<string | null>(null);
  const [reduceMotionVal, setReduceMotionVal] = useState<string | null>(null);
  const [customRender, setCustomRender] = useState<string | null>(null);
  const [classesVal, setClassesVal] = useState<string | null>(null);
  const [smartParse, setSmartParse] = useState<string | null>(null);
  const [dropdownTopVal, setDropdownTopVal] = useState<string | null>(null);
  const [keepMountedVal, setKeepMountedVal] = useState<string | null>(null);
  const [zIndexVal, setZIndexVal] = useState<string | null>(null);
  const [formTime, setFormTime] = useState<string | null>("14:30");
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [clearableClearCount, setClearableClearCount] = useState(0);
  const [eventsTime, setEventsTime] = useState<string | null>(null);

  const [darkThemeVal, setDarkThemeVal] = useState<string | null>(null);
  const [warmThemeVal, setWarmThemeVal] = useState<string | null>(null);
  const [coolThemeVal, setCoolThemeVal] = useState<string | null>(null);
  const [minimalThemeVal, setMinimalThemeVal] = useState<string | null>(null);

  const [customEndIconVal, setCustomEndIconVal] = useState<string | null>(null);
  const [noEndIconVal, setNoEndIconVal] = useState<string | null>(null);
  const [customCheckVal, setCustomCheckVal] = useState<string | null>(null);
  const [noCheckVal, setNoCheckVal] = useState<string | null>(null);

  const [gapLargeVal, setGapLargeVal] = useState<string | null>(null);

  const [forceBotVal, setForceBotVal] = useState<string | null>(null);
  const [forceTopVal, setForceTopVal] = useState<string | null>(null);
  const [forceLockVal, setForceLockVal] = useState<string | null>(null);

  const [blurFocusVal, setBlurFocusVal] = useState<string | null>(null);
  const [focusMessage, setFocusMessage] = useState("");

  const [styleVal, setStyleVal] = useState<string | null>(null);

  const [clearableVal, setClearableVal] = useState<string | null>("14:30");

  const [clockStep5, setClockStep5] = useState<string | null>(null);
  const [clockStep1, setClockStep1] = useState<string | null>(null);
  const [clockMinMax, setClockMinMax] = useState<string | null>(null);
  const [clockError, setClockError] = useState<string | null>(null);
  const [clockDisabled] = useState<string | null>("10:30");
  const [clockFullWidth, setClockFullWidth] = useState<string | null>(null);
  const [clockLabeled, setClockLabeled] = useState<string | null>(null);
  const [clockEmerald, setClockEmerald] = useState<string | null>(null);
  const [clockRose, setClockRose] = useState<string | null>(null);
  const [clockViolet, setClockViolet] = useState<string | null>(null);
  const [clockUnstyled, setClockUnstyled] = useState<string | null>(null);
  const [clockI18n, setClockI18n] = useState<string | null>(null);

  const log = (msg: string) => setEventLog((prev) => [msg, ...prev.slice(0, 4)]);

  return (
    <div className="space-y-10">
      <DocsHero
        title="TimePicker"
        description="A time input with dropdown or clock variant, smart time parsing, 12/24-hour formats, min/max constraints, clearable, keyboard navigation, and full accessibility."
      />

      <SetupNote />

      <CopyPasteBlock name="TimePicker" />

      <Section
        title="Basic Usage"
        description="Default dropdown variant with 24-hour format and 15-minute steps."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          {}
          <TimePicker
            value={basic24}
            onValueChange={(v) => setBasic24(v)}
          />
        </DemoWrapper>
      </Section>

      <Section
        title="12-Hour Format"
        description="AM/PM time format with smart period detection."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={twelve}
              onValueChange={(v) => setTwelve(v)}
              format="12h"
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {twelve ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 3. Minute Steps ─────────────────────────────────────────────── */}
      <Section
        title="Minute Steps"
        description="Control the granularity of time options with minuteStep."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>1 min steps</DemoLabel>
              <TimePicker
                value={step1}
                onValueChange={(v) => setStep1(v)}
                minuteStep={1}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {step1 ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>5 min steps</DemoLabel>
              <TimePicker
                value={step5}
                onValueChange={(v) => setStep5(v)}
                minuteStep={5}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {step5 ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>15 min steps</DemoLabel>
              <TimePicker
                value={step15}
                onValueChange={(v) => setStep15(v)}
                minuteStep={15}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {step15 ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>30 min steps</DemoLabel>
              <TimePicker
                value={step30}
                onValueChange={(v) => setStep30(v)}
                minuteStep={30}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {step30 ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 4. Min/Max Time ─────────────────────────────────────────────── */}
      <Section
        title="Min / Max Time"
        description="Constrain selectable times to a specific range (09:00 - 17:00)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={minMax}
              onValueChange={(v) => setMinMax(v)}
              minTime="09:00"
              maxTime="17:00"
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {minMax ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 5. Clearable ────────────────────────────────────────────────── */}
      <Section
        title="Clearable"
        description="Show a clear button when a value is selected. Use onClear for custom clear logic."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={clearableVal}
              onValueChange={(v) => setClearableVal(v)}
              clearable
              onClear={() => setClearableClearCount((n) => n + 1)}
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {clearableVal ?? "none"}
            </span>
          </div>
          <div
            className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
            data-demo-action
          >
            onClear: {clearableClearCount ? `fired ${clearableClearCount}×` : "not fired yet"}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 6. Label, Required & Error ──────────────────────────────────── */}
      <Section
        title="Label, Required & Error States"
        description="Built-in label, required indicator, and error messaging."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>With label + required</DemoLabel>
              <TimePicker
                value={labeled}
                onValueChange={(v) => setLabeled(v)}
                label="Meeting Time"
                required
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {labeled ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Error state</DemoLabel>
              <TimePicker
                value={errored}
                onValueChange={(v) => setErrored(v)}
                label="Deadline"
                error
                errorMessage="Please select a valid time."
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {errored ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section title="With Description" description="Add helper text below the label." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <TimePicker
            label="Meeting Time"
            description="Select a time during business hours"
            placeholder="Pick a time"
            minTime="09:00"
            maxTime="17:00"
            classes={c.timepicker}
          />
        </DemoWrapper>
      </Section>

      <Section title="Success State" description="Display a success message when a valid time is selected." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <TimePicker
            label="Appointment Time"
            value={successTime}
            onValueChange={(t) => setSuccessTime(t)}
            success={!!successTime}
            successMessage="Time slot is available"
            classes={c.timepicker}
          />
        </DemoWrapper>
      </Section>

      <Section title="Loading State" description="Show a loading state while checking availability." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <TimePicker label="Checking slots..." loading placeholder="Pick a time" classes={c.timepicker} />
        </DemoWrapper>
      </Section>

      {/* ─── 7. Disabled ─────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Prevents interaction and visually dims the component."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={disabledVal}
              onValueChange={() => {}}
              disabled
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Value: {disabledVal ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 8. Full Width ───────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Expands the picker to fill its container. The fullWidth prop applies to both root and trigger."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <TimePicker
            value={fullWidthVal}
            onValueChange={(v) => setFullWidthVal(v)}
            fullWidth
            classes={c.timepicker}
          />
          <span className={`text-xs mt-2 block ${c.text}`}>Selected: {fullWidthVal ?? "none"}</span>
        </DemoWrapper>
      </Section>

      {/* ─── 9. Uncontrolled (defaultValue) ──────────────────────────────── */}
      <Section
        title="Uncontrolled (defaultValue)"
        description="Use defaultValue for simple forms that do not need external state. The component manages its own value internally."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>defaultValue=&quot;09:30&quot;</DemoLabel>
              <TimePicker
                defaultValue="09:30"
                classes={c.timepicker}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>No default (empty)</DemoLabel>
              <TimePicker
                classes={c.timepicker}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 10. Controlled Open ─────────────────────────────────────────── */}
      <Section
        title="Controlled Open"
        description="Externally control the dropdown open state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <Button
              className={c.btnPrimary}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setControlledOpen((o) => !o)}
            >
              {controlledOpen ? "Close" : "Open"} Dropdown
            </Button>
            <TimePicker
              value={controlled}
              onValueChange={(v) => setControlled(v)}
              open={controlledOpen}
              onOpenChange={setControlledOpen}
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Open: {String(controlledOpen)} | Selected: {controlled ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom End Icon & No End Icon ──────────────────────────── */}
      <Section
        title="Custom End Icon & No End Icon"
        description="Replace the default chevron icon or hide it entirely."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-8">
            <div>
              <DemoLabel isDarkMode={dark}>Custom icon (clock)</DemoLabel>
              <TimePicker
                value={customEndIconVal}
                onValueChange={(v) => setCustomEndIconVal(v)}
                endIcon={<ClockEndIcon className={`w-4 h-4 text-cl-accent`} />}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {customEndIconVal ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>No end icon</DemoLabel>
              <TimePicker
                value={noEndIconVal}
                onValueChange={(v) => setNoEndIconVal(v)}
                showEndIcon={false}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {noEndIconVal ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 13. Custom Check Icon & No Check Icon ──────────────────────── */}
      <Section
        title="Custom Check Icon & No Check Icon"
        description="Replace the default checkmark on selected options, or hide it entirely."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-8">
            <div>
              <DemoLabel isDarkMode={dark}>Star icon</DemoLabel>
              <TimePicker
                value={customCheckVal}
                onValueChange={(v) => setCustomCheckVal(v)}
                selectedIcon={<StarCheckIcon className={`w-4 h-4 shrink-0 text-cl-text`} />}
                classes={{
                  ...c.timepicker,
                  itemIndicator: `w-4 h-4 shrink-0 text-cl-warning`,
                }}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {customCheckVal ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>No check icon</DemoLabel>
              <TimePicker
                value={noCheckVal}
                onValueChange={(v) => setNoCheckVal(v)}
                showSelectedIcon={false}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {noCheckVal ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 14. Dropdown Theme Examples ──────────────────────────────────── */}
      <Section
        title="Dropdown Theme Examples"
        description="Complete theme overrides for different visual styles."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>Dark</DemoLabel>
              <TimePicker
                value={darkThemeVal}
                onValueChange={(v) => setDarkThemeVal(v)}
                placeholder="Select time..."
                classes={darkTheme}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {darkThemeVal ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Warm</DemoLabel>
              <TimePicker
                value={warmThemeVal}
                onValueChange={(v) => setWarmThemeVal(v)}
                placeholder="Select time..."
                classes={warmTheme}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {warmThemeVal ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Cool</DemoLabel>
              <TimePicker
                value={coolThemeVal}
                onValueChange={(v) => setCoolThemeVal(v)}
                placeholder="Select time..."
                classes={coolTheme}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {coolThemeVal ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Minimal</DemoLabel>
              <TimePicker
                value={minimalThemeVal}
                onValueChange={(v) => setMinimalThemeVal(v)}
                placeholder="Select time..."
                showSelectedIcon={false}
                classes={getMinimalTheme()}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {minimalThemeVal ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CLOCK VARIANT                                                     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* ─── 15. Clock 24h ──────────────────────────────────────────────── */}
      <Section
        title="Clock Variant (24h)"
        description="Analog clock face for visual time selection with 24-hour format and inner/outer rings."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={clock24}
              onValueChange={(v) => setClock24(v)}
              variant="clock"
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {clock24 ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 16. Clock 12h ──────────────────────────────────────────────── */}
      <Section
        title="Clock Variant (12h)"
        description="Analog clock face with AM/PM toggle."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={clock12}
              onValueChange={(v) => setClock12(v)}
              variant="clock"
              format="12h"
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {clock12 ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 17. Clock Minute Steps ──────────────────────────────────────── */}
      <Section
        title="Clock Minute Steps"
        description="Different minuteStep values change the snapping behavior and visible labels on the clock face."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>1 min steps</DemoLabel>
              <TimePicker
                value={clockStep1}
                onValueChange={(v) => setClockStep1(v)}
                variant="clock"
                minuteStep={1}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {clockStep1 ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>5 min steps</DemoLabel>
              <TimePicker
                value={clockStep5}
                onValueChange={(v) => setClockStep5(v)}
                variant="clock"
                minuteStep={5}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {clockStep5 ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 18. Clock Min/Max ───────────────────────────────────────────── */}
      <Section
        title="Clock Min / Max Time"
        description="Min/max constraints apply to the clock variant too. Out-of-range numbers are dimmed, and OK is disabled if the current selection falls outside the range."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={clockMinMax}
              onValueChange={(v) => setClockMinMax(v)}
              variant="clock"
              minTime="09:00"
              maxTime="17:00"
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {clockMinMax ?? "none"} (09:00 - 17:00)
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 19. Clock Label, Required & Error ───────────────────────────── */}
      <Section
        title="Clock Label, Required & Error"
        description="Label, required indicator, and error states on the clock variant."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>Label + required</DemoLabel>
              <TimePicker
                value={clockLabeled}
                onValueChange={(v) => setClockLabeled(v)}
                variant="clock"
                label="Alarm Time"
                required
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {clockLabeled ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Error state</DemoLabel>
              <TimePicker
                value={clockError}
                onValueChange={(v) => setClockError(v)}
                variant="clock"
                label="Check-in"
                error
                errorMessage="Time is outside business hours."
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {clockError ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 20. Clock Disabled ──────────────────────────────────────────── */}
      <Section
        title="Clock Disabled"
        description="Disabled state on the clock variant prevents all interaction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={clockDisabled}
              onValueChange={() => {}}
              variant="clock"
              disabled
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>Value: {clockDisabled ?? "none"}</span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 21. Clock Full Width ────────────────────────────────────────── */}
      <Section
        title="Clock Full Width"
        description="Full width with clock variant."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <TimePicker
            value={clockFullWidth}
            onValueChange={(v) => setClockFullWidth(v)}
            variant="clock"
            fullWidth
            classes={c.timepicker}
          />
          <span className={`text-xs mt-2 block ${c.text}`}>Selected: {clockFullWidth ?? "none"}</span>
        </DemoWrapper>
      </Section>

      {/* ─── 22. Clock Color Themes ──────────────────────────────────────── */}
      <Section
        title="Clock Color Themes"
        description="Full clock face customization with different color schemes via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-wrap gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>Emerald</DemoLabel>
              <TimePicker
                value={clockEmerald}
                onValueChange={(v) => setClockEmerald(v)}
                variant="clock"
                format="12h"
                classes={getEmeraldClockTheme(dark)}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {clockEmerald ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Rose</DemoLabel>
              <TimePicker
                value={clockRose}
                onValueChange={(v) => setClockRose(v)}
                variant="clock"
                format="12h"
                classes={getRoseClockTheme(dark)}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {clockRose ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Violet</DemoLabel>
              <TimePicker
                value={clockViolet}
                onValueChange={(v) => setClockViolet(v)}
                variant="clock"
                format="12h"
                classes={getVioletClockTheme(dark)}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {clockViolet ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 23. Clock Unstyled ──────────────────────────────────────────── */}
      <Section
        title="Clock Unstyled"
        description="Strip all default layout helpers and apply your own styling to the clock variant."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={clockUnstyled}
              onValueChange={(v) => setClockUnstyled(v)}
              variant="clock"
              unstyled
              classes={{
                root: "inline-flex flex-col gap-1",
                trigger: `flex items-center gap-2 px-3 py-2 border-2 border-dashed rounded-cl-lg border-cl-border-input-focus bg-cl-accent/10 text-cl-text dark:border dark:border-cl-border-input-focus dark:bg-cl-bg dark:text-cl-text`,
                input: "bg-transparent outline-none text-sm flex-1",
                icon: `w-4 h-4 text-cl-accent`,
                clockContent: `p-4 border-2 border-dashed rounded-cl-lg border-cl-border-input-focus bg-cl-accent/10 dark:border dark:border-cl-border-input-focus dark:bg-cl-bg`,
                clockDisplay: "flex items-center justify-center gap-1 mb-4",
                clockHours: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer text-cl-text-secondary`,
                clockMinutes: `px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer text-cl-text-secondary`,
                clockSeparator: `text-2xl font-semibold text-cl-text-tertiary`,
                clockFace: `relative w-52 h-52 mx-auto rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated`,
                clockHand: "absolute inset-0",
                clockHandLine: "stroke-cl-accent",
                clockHandDot: "w-3 h-3 rounded-full bg-cl-accent",
                clockNumber: "absolute text-sm font-medium cursor-pointer select-none text-cl-text-secondary text-xs text-cl-text-tertiary",
                clockCenter: "fill-cl-accent",
                footer: "flex items-center justify-end gap-2 mt-4",
                cancelButton: `px-3 py-1.5 text-xs font-medium rounded-cl-md text-cl-text-secondary`,
                confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md bg-cl-accent text-cl-on-accent",
                row: "flex flex-col gap-1 ml-3",
                periodButton: `px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer text-cl-text-secondary`,
              }}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {clockUnstyled ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 24. Clock i18n (Custom Button Text) ─────────────────────────── */}
      <Section
        title="Clock i18n (Custom Button Text)"
        description="Override Cancel/OK button text for localization using cancelText and okText props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={clockI18n}
              onValueChange={(v) => setClockI18n(v)}
              variant="clock"
              cancelText="Abbrechen"
              okText="Fertig"
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {clockI18n ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SHARED FEATURES                                                   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* ─── 25. Scroll Behavior ────────────────────────────────────────── */}
      <Section
        title="Scroll Behavior"
        description="By default the dropdown follows the trigger on scroll. Set lockScroll to lock body scroll while the dropdown is open."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col" className="overflow-visible">
          <div className="w-full space-y-6">
            <div>
              <DemoLabel isDarkMode={dark}>Default — dropdown repositions on scroll</DemoLabel>
              <TimePicker
                value={scrollLockDefault}
                onValueChange={(v) => setScrollLockDefault(v)}
                placeholder="Scroll the page..."
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {scrollLockDefault ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>lockScroll=true — body scroll disabled while open</DemoLabel>
              <TimePicker
                value={scrollLockEnabled}
                onValueChange={(v) => setScrollLockEnabled(v)}
                placeholder="Open me, then try scrolling..."
                lockScroll
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {scrollLockEnabled ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 26. Dropdown Placement, Z-Index, Keep Mounted ──────────────── */}
      <Section
        title="Dropdown Position"
        description="Control whether the dropdown opens above or below the trigger. Auto-flips when there isn't enough space."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <DemoLabel isDarkMode={dark}>dropdownPosition=&quot;bottom&quot; (default, auto-flips)</DemoLabel>
            <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
              <TimePicker
                value={dropdownTopVal}
                onValueChange={(v) => setDropdownTopVal(v)}
                dropdownPosition="bottom"
                placeholder="Opens below..."
                classes={c.timepicker}
              />
            </DemoWrapper>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>dropdownPosition=&quot;top&quot; (auto-flips)</DemoLabel>
            <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
              <TimePicker
                dropdownPosition="top"
                placeholder="Opens above..."
                classes={c.timepicker}
              />
            </DemoWrapper>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>forceDropdownPosition (forced bottom, no auto-flip)</DemoLabel>
            <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
              <TimePicker
                value={forceBotVal}
                onValueChange={(v) => setForceBotVal(v)}
                dropdownPosition="bottom"
                forceDropdownPosition
                placeholder="Always opens below..."
                classes={c.timepicker}
              />
            </DemoWrapper>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>forceDropdownPosition (forced top, no auto-flip)</DemoLabel>
            <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
              <TimePicker
                value={forceTopVal}
                onValueChange={(v) => setForceTopVal(v)}
                dropdownPosition="top"
                forceDropdownPosition
                placeholder="Always opens above..."
                classes={c.timepicker}
              />
            </DemoWrapper>
          </div>
          <p className={`text-xs ${c.text}`}>
            When <code className="font-mono">forceDropdownPosition</code> is true, the dropdown will always open in the specified direction regardless of available viewport space.
          </p>
          <div>
            <DemoLabel isDarkMode={dark}>forceDropdownPosition + lockScroll</DemoLabel>
            <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
              <TimePicker
                value={forceLockVal}
                onValueChange={(v) => setForceLockVal(v)}
                dropdownPosition="bottom"
                forceDropdownPosition
                lockScroll
                placeholder="Forced bottom + scroll locked"
                classes={c.timepicker}
              />
            </DemoWrapper>
          </div>
          <p className={`text-xs ${c.text}`}>
            Combining <code className="font-mono">forceDropdownPosition</code> with <code className="font-mono">lockScroll</code> prevents the page from scrolling while the dropdown is open, ensuring the menu stays anchored in place.
          </p>
        </div>
      </Section>

      {/* ─── 26b. Z-Index & keepMounted ────────────────────────────────── */}
      <Section
        title="Z-Index & keepMounted"
        description="Control z-index and whether the list stays mounted when closed (dropdown variant only)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col" className="overflow-visible">
          <div className="w-full space-y-6">
            <div>
              <DemoLabel isDarkMode={dark}>dropdownZIndex=100</DemoLabel>
              <TimePicker
                value={zIndexVal}
                onValueChange={(v) => setZIndexVal(v)}
                dropdownZIndex={100}
                placeholder="Higher z-index"
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {zIndexVal ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>keepMounted — list stays in DOM when closed</DemoLabel>
              <TimePicker
                value={keepMountedVal}
                onValueChange={(v) => setKeepMountedVal(v)}
                keepMounted
                placeholder="Close and inspect DOM"
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {keepMountedVal ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 27. Custom Dropdown Gap ────────────────────────────────────── */}
      <Section
        title="Custom Dropdown Gap"
        description="Control the gap between the trigger and dropdown with the dropdownGap prop (in pixels). Default is 4px."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col" className="overflow-visible">
          <div className="w-full space-y-6">
            <div>
              <DemoLabel isDarkMode={dark}>No gap (0px)</DemoLabel>
              <TimePicker
                defaultValue={null}
                dropdownGap={0}
                placeholder="No gap..."
                classes={c.timepicker}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Large gap (16px)</DemoLabel>
              <TimePicker
                value={gapLargeVal}
                onValueChange={(v) => setGapLargeVal(v)}
                dropdownGap={16}
                placeholder="Large gap..."
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {gapLargeVal ?? "none"}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 28. Native Form & Lifecycle Callbacks ──────────────────────── */}
      <Section
        title="Native Form Field & Lifecycle Callbacks"
        description="Use name for a hidden input in standard forms. onOpenChange, onConfirm, and onCancel fire at the appropriate lifecycle points."
        isDarkMode={dark}
      >
        <div className="space-y-6">
          <div>
            <DemoLabel isDarkMode={dark}>Hidden input + form submit</DemoLabel>
            <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
              <form
                className="flex flex-col sm:flex-row sm:items-end gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  log(`submit: meetingTime=${String(fd.get("meetingTime") ?? "")}`);
                }}
              >
                <TimePicker
                  name="meetingTime"
                  id="demo-meeting-time"
                  label="Meeting time"
                  value={formTime}
                  onValueChange={(v) => setFormTime(v)}
                  classes={c.timepicker}
                />
                <Button type="submit" className={c.btnPrimary}>
                  Log to event list
                </Button>
              </form>
            </DemoWrapper>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>Clock variant — onConfirm / onCancel / onOpenChange</DemoLabel>
            <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
              <div className="flex flex-wrap items-center gap-4">
                <TimePicker
                  value={eventsTime}
                  onValueChange={(v) => setEventsTime(v)}
                  variant="clock"
                  onOpenChange={(open) => log(`onOpenChange: ${open}`)}
                  onConfirm={() => log("onConfirm")}
                  onCancel={() => log("onCancel")}
                  classes={c.timepicker}
                />
                <div className={`min-w-48 text-xs font-mono space-y-1 ${c.text}`}>
                  {eventLog.length === 0 ? (
                    <span className="opacity-70">Open the clock and use OK / Cancel.</span>
                  ) : (
                    eventLog.map((line, i) => (
                      <div key={`${i}-${line}`}>{line}</div>
                    ))
                  )}
                </div>
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── 29. Form Integration (onBlur) ──────────────────────────────── */}
      <Section
        title="Form Integration (onBlur)"
        description="Use onBlur for integration with form libraries like React Hook Form or Formik."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={blurFocusVal}
              onValueChange={(v) => setBlurFocusVal(v)}
              placeholder="Focus, then blur me..."
              onBlur={() => setFocusMessage("onBlur fired")}
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {blurFocusVal ?? "none"}
            </span>
          </div>
          {focusMessage && (
            <p className={`text-sm mt-2 text-cl-accent`} data-demo-action>
              {focusMessage}
            </p>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── 30. className, style & aria-label ──────────────────────────── */}
      <Section
        title="className, style & aria-label"
        description="Use className as a fallback for classes.root, style for inline styles, and aria-label when no visible label is provided. HTML attributes like data-testid pass through automatically."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col" className="overflow-visible">
          <div className="w-full space-y-6">
            <div>
              <DemoLabel isDarkMode={dark}>className (opacity override)</DemoLabel>
              <TimePicker
                defaultValue={null}
                placeholder="Select a time..."
                className={`opacity-90`}
                classes={c.timepicker}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>style (inline styles on root)</DemoLabel>
              <TimePicker
                value={styleVal}
                onValueChange={(v) => setStyleVal(v)}
                placeholder="Select a time..."
                style={{ maxWidth: "300px" }}
                classes={c.timepicker}
              />
              <span className={`text-xs mt-1 block ${c.text}`}>Selected: {styleVal ?? "none"}</span>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>aria-label + data-testid</DemoLabel>
              <TimePicker
                defaultValue={null}
                placeholder="Select a time..."
                aria-label="Appointment time"
                data-testid="appointment-picker"
                classes={c.timepicker}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 31. Reduce Motion ──────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description='Disables animations for accessibility or preference. Set to true to force, or "auto" to respect OS setting.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={reduceMotionVal}
              onValueChange={(v) => setReduceMotionVal(v)}
              reduceMotion
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {reduceMotionVal ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 32. Custom Option Rendering ────────────────────────────────── */}
      <Section
        title="Custom Option Rendering"
        description="Use renderOptionContent to customize how time options are displayed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={customRender}
              onValueChange={(v) => setCustomRender(v)}
              format="12h"
              minuteStep={60}
              renderOptionContent={(time, isSelected) => (
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${isSelected ? "bg-cl-accent" : dark ? "bg-cl-text/10" : "bg-cl-bg-hover"}`}
                  />
                  <span className={isSelected ? "font-semibold" : ""}>{time}</span>
                  {(() => {
                    const [h, rest] = time.split(":");
                    const m = parseInt(rest, 10) || 0;
                    const isPM = time.includes("PM");
                    const h24 = isPM && +h !== 12 ? +h + 12 : !isPM && +h === 12 ? 0 : +h;
                    const mins = h24 * 60 + m;
                    const business = mins >= 9 * 60 && mins < 17 * 60;
                    return business ? (
                      <span className={`text-xs text-cl-text-tertiary`}>
                        business
                      </span>
                    ) : null;
                  })()}
                </span>
              )}
              classes={c.timepicker}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {customRender ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Classes System"
        description="Override individual slots with the classes prop for targeted styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex items-center gap-4">
            <TimePicker
              value={classesVal}
              onValueChange={(v) => setClassesVal(v)}
              classes={{
                ...c.timepicker,
                trigger: `flex items-center gap-2 w-full sm:w-56 px-3 py-2 border-2 rounded-full transition-colors border-cl-success bg-cl-success/15 text-cl-text dark:border dark:border-cl-success dark:bg-cl-bg-elevated dark:text-cl-text`,
              }}
            />
            <span className={`text-sm ${c.text}`}>
              Selected: {classesVal ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 35. Smart Parsing ───────────────────────────────────────────── */}
      <Section
        title="Smart Parsing"
        description='Type shorthand like "2p", "14", "930a", or "1:5" and the parser resolves it to a valid time.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block" className="overflow-visible">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <TimePicker
                value={smartParse}
                onValueChange={(v) => setSmartParse(v)}
                format="12h"
                classes={c.timepicker}
              />
              <span className={`text-sm ${c.text}`}>
                Selected: {smartParse ?? "none"}
              </span>
            </div>
            <div className={`text-sm ${c.text}`}>
              <p className="mb-1 font-medium">Try typing:</p>
              <ul className="list-disc pl-5 space-y-0.5 text-xs">
                <li><code className="font-mono">2p</code> &rarr; 02:00 PM</li>
                <li><code className="font-mono">930a</code> &rarr; 09:30 AM</li>
                <li><code className="font-mono">14</code> &rarr; 02:00 PM</li>
                <li><code className="font-mono">1:5</code> &rarr; 01:05 AM</li>
              </ul>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="TimePicker" />

      {/* ─── 39. Controlled Pattern ──────────────────────────────────────── */}
      <DocControlledPattern
        isDarkMode={dark}
        summary="Use value + onValueChange for controlled mode, or defaultValue for uncontrolled mode. For popover state, omit open so the component manages it, or pass open + onOpenChange for external control. Clock variant: OK commits the displayed time (including the default 'now' when value was empty); Cancel closes without changing value; onConfirm / onCancel fire after those actions. When minTime/maxTime are set on the clock variant, the OK button is disabled if the current selection falls outside the range."
      />

      {/* ─── 40. Edge Cases ──────────────────────────────────────────────── */}
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Typing a non-matching string filters the dropdown to zero results and shows 'No matching times'.",
          "Clock variant with minuteStep > 1 snaps to the nearest allowed minute; dial labels match the step.",
          "Clock variant with minTime/maxTime dims out-of-range numbers and disables OK when selection is outside bounds.",
          "Pasting a time string triggers the same smart parser as typing.",
          "Setting value to null clears the input; the clock preview still shows the current time until you change it, and OK commits that preview.",
          "Changing format (12h / 24h) re-formats the displayed string from the same controlled value when not mid-edit.",
          "minuteStep <= 0 or NaN is clamped to a safe interval (at least 1 minute).",
          "Dropdown portal uses aria-controls + id; clock portal uses role=dialog with a matching id.",
          "The dropdown closes on outside click, Escape, or Tab. Blur uses a focus pass so clicks on portal content still count as inside.",
          "When both value and defaultValue are omitted the component starts empty and manages its own state.",
          "fullWidth applies width: 100% to both root and trigger automatically, even when classes specify a fixed width.",
          "clearable shows a clear button only when a value is present and the component is not disabled.",
          "HTML attributes like data-testid, aria-describedby, etc. pass through to the root element.",
        ]}
      />

      {/* ─── 41. Do / Don't ──────────────────────────────────────────────── */}
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Use onValueChange to capture both the formatted string and the TimeValue object.",
          "Set minTime/maxTime to prevent users from selecting invalid business-hour times.",
          "Use the classes prop for theming instead of wrapping with extra styled divs.",
          "Provide a label or aria-label for accessibility.",
          "Use format='12h' for consumer-facing UIs and '24h' for technical/admin UIs.",
          "Use defaultValue for simple uncontrolled forms that don't need external state.",
          "Use cancelText/okText for i18n instead of wrapping the component.",
          "Use clearable for optional time fields where users may want to reset.",
          "Use portalContainer to render the dropdown inside a specific container (e.g. a modal).",
        ]}
        donts={[
          "Don't pass a separate onChange prop — use onValueChange for time updates.",
          "Don't pass individual className props (e.g. triggerClassName) — use the classes object.",
          "Don't rely on clamping as validation — still validate on form submit.",
          "Don't mix controlled (value) and uncontrolled (defaultValue) in the same instance.",
          "Don't mix controlled open and uncontrolled open patterns in the same instance.",
          "Don't assume clock variant allows out-of-range times — minTime/maxTime are enforced on both variants.",
        ]}
      />
    </div>
  );
};

export default TimePickerDemo;
