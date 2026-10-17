# DatePicker

> A full-featured date picker supporting single, range, and multiple date selection with calendar popover, presets, markers, locale support, and keyboard navigation.

**Category:** Form Input
**Keywords:** datepicker, date, calendar, range, date-range, multiple-dates, presets, markers, locale, form, input

---

## Quick Answer

Use `<DatePicker />` for single date selection (default). Use `mode="range"` for date ranges and `mode="multiple"` for selecting several individual dates. Works out-of-the-box with built-in styles and sensible defaults.

---

## Import

```tsx
import { DatePicker } from "@chumlab/ui/date-picker";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { DatePicker } from "@chumlab/ui/date-picker";

export default function MyForm() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      value={date}
      onValueChange={(d) => setDate(d)}
      label="Select a date"
      placeholder="Pick a date..."
    />
  );
}
```

This renders correctly with no additional props, classes, or setup.

---

## Prop Constraints (critical for correct usage)

These props have dependencies -- using them wrong causes silent bugs:

| Prop | Constraint |
|------|-----------|
| `selectionMode` | Determines `value` and `onValueChange` types. `"single"` = `Date \| null`, `"range"` = `DateRange \| null`, `"multiple"` = `Date[] \| null`. |
| `showPresets` | Only shows presets panel if `true`. Uses built-in presets unless `presets` is provided. |
| `presets` | Must match the mode. Single presets return `Date`, range presets return `DateRange`, multiple return `Date[]`. |
| `markers` | Only visible when `showMarkerIndicator` is `true` (default). Tooltips require `showMarkerTooltip`. |
| `clearable` | Shows the clear button in the trigger when a value is set. Defaults to `true`. |
| `open` + `onOpenChange` | Controlled open state -- both are needed together. |
| `outsideDaysSelectable` | Only works when `showOutsideDays` is `true` (default). |
| `dropdownSide` | Set to `"top"` or `"bottom"`. Use `forceDropdownSide` to prevent auto-flipping. |

---

## Data Attributes (for CSS selectors and testing)

### Root element
- `data-disabled` -- when picker is disabled
- `data-error` -- when error state is active
- `data-open` -- when calendar is open
- `data-loading` -- when loading state is active
- `data-valid` -- when success state is active

### Day cells
- `data-selected` -- selected day
- `data-today` -- today's date
- `data-disabled` -- disabled day
- `data-outside` -- day outside current month
- `data-range-start` -- first day of range
- `data-range-end` -- last day of range
- `data-in-range` -- day within selected range
- `data-highlighted` -- keyboard-focused day
- `data-marked` -- day with a marker
- `data-marker-type` -- marker type string (e.g. `"meeting"`, `"deadline"`)

### Preset buttons
- `data-active` -- active preset

**DOM nesting:** root `<div>` -> trigger `<button>` -> calendar popover `<div>` -> month grid -> day grid `<div role="grid">`

---

## All Props

<!-- generated from DatePicker.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectionMode` | `"single"` \| `"range"` \| `"multiple"` | `"single"` | Selection mode: single date, date range, or multiple dates. |
| `value` | — | — | Controlled selected value. Type depends on `selectionMode`: Date \| null (single), DateRange \| null (range), Date[] \| null (multiple). |
| `onValueChange` | object | — | Callback when the selected value changes. Signature depends on `selectionMode`. |
| `onClear` | object | — | () => void — Called when the clear button is clicked. |
| `onMonthChange` | object | — | (month: Date) => void — Called when the displayed month changes. |
| `open` | boolean | — | Controlled open state of the calendar popup. |
| `defaultOpen` | boolean | `false` | Initial open state for uncontrolled usage. |
| `defaultValue` | — | — | Initial selection for uncontrolled usage. Type depends on `selectionMode`: Date \| null (single), DateRange \| null (range), Date[] \| null (multiple). Use `value` instead for controlled usage. |
| `onOpenChange` | object | — | (open: boolean) => void |
| `minDate` | object | — | Date — Earliest selectable date. |
| `maxDate` | object | — | Date — Latest selectable date. |
| `disabledDates` | object | — | Configuration for disabling specific dates. |
| `weekStartsOn` | `0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` | `0` | First day of the week (0=Sunday, 1=Monday, etc.). |
| `locale` | object | — | date-fns Locale object for internationalization. |
| `numberOfMonths` | number | `1` | Number of months to display simultaneously. |
| `dateFormat` | string | `"MMM d, yyyy"` | Date format string (date-fns format). |
| `showTodayIndicator` | boolean | `true` | Highlights today's date in the calendar. |
| `showTodayButton` | boolean | `false` | Shows a 'Today' button in the calendar footer. |
| `todayAction` | boolean | `false` | Whether clicking 'Today' selects today's date. |
| `showWeekNumbers` | boolean | `false` | Shows week numbers in the calendar. |
| `showOutsideDays` | boolean | `true` | Shows days from adjacent months. |
| `outsideDaysSelectable` | boolean | `true` | Whether outside days can be selected. |
| `fixedWeeks` | boolean | `false` | Always shows 6 weeks per month for consistent height. |
| `showPresets` | boolean | `false` | Shows preset date selection buttons. |
| `presets` | array | — | Array of date presets. |
| `markers` | array | — | Array of date markers to display on the calendar. |
| `showMarkerIndicator` | boolean | `true` | Shows dots on marked dates. |
| `showMarkerTooltip` | boolean | `true` | Shows tooltips on marked dates. |
| `id` | string | — | HTML id attribute. |
| `name` | string | — | Form field name. Submits the selection through hidden inputs: a single date as `YYYY-MM-DD`; a range as one ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, with an unpicked side left empty; multiple dates as one entry per date under this name, in date order. With nothing selected, single and range submit `""` and multiple submits no entry, as a native `<select multiple>` does. Nothing is submitted while disabled. |
| `placeholder` | string | — | Placeholder text for the trigger input. |
| `disabled` | boolean | `false` | Disables the date picker. |
| `error` | boolean | `false` | Displays error state. |
| `errorMessage` | object | — | React.ReactNode — Error message. |
| `label` | object | — | React.ReactNode — Label above the trigger. |
| `description` | object | — | React.ReactNode — Description text. |
| `success` | boolean | `false` | Displays success state. |
| `successMessage` | object | — | React.ReactNode — Success message. |
| `loading` | boolean | `false` | Shows loading state. |
| `clearable` | boolean | `true` | Shows a clear button. |
| `required` | boolean | `false` | Marks the field as required. |
| `fullWidth` | boolean | `false` | Stretches the date picker to fill its container width. |
| `showCalendarIcon` | boolean | `true` | Shows the calendar icon in the trigger. |
| `calendarIcon` | object | — | React.ReactNode — Custom calendar icon. |
| `clearIcon` | object | — | React.ReactNode — Custom clear icon. |
| `prevMonthIcon` | object | — | React.ReactNode — Custom previous month icon. |
| `nextMonthIcon` | object | — | React.ReactNode — Custom next month icon. |
| `prevYearIcon` | object | — | React.ReactNode — Custom previous year icon. |
| `nextYearIcon` | object | — | React.ReactNode — Custom next year icon. |
| `todayIcon` | object | — | React.ReactNode — Custom today button icon. |
| `monthDropdownSelectedIcon` | object | — | React.ReactNode — Icon for selected month in dropdown. |
| `yearDropdownSelectedIcon` | object | — | React.ReactNode — Icon for selected year in dropdown. |
| `classes` | object | — | CSS class overrides for date picker sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `portalContainer` | object | — | HTMLElement \| null — Portal container for the calendar popup. |
| `lockScroll` | boolean | `false` | Locks body scroll when the calendar is open. |
| `dropdownZIndex` | number | `50` | Z-index of the calendar popup. |
| `dropdownSide` | `"top"` \| `"bottom"` | `"bottom"` | Vertical placement of the calendar popup. |
| `forceDropdownSide` | boolean | `false` | Locks the calendar to the specified dropdownSide without auto-flipping. |
| `dropdownOffset` | number | `4` | Gap in pixels between trigger and calendar popup. |
| `keepMounted` | boolean | `false` | Keep the calendar DOM mounted when closed. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects OS setting. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

The component has three styling modes:

1. **Default** (`unstyled=false`, no `classes`): Uses `DEFAULT_DATEPICKER_CLASSES` -- fully styled with dark mode support.
2. **Partial override** (`unstyled=false`, partial `classes`): Your values **replace** the default for that slot. Unspecified slots keep their defaults. This is NOT additive.

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled=true`): All slots start as empty strings. You must provide everything via `classes`.

```tsx
// This REPLACES the default trigger classes entirely:
<DatePicker classes={{ trigger: "my-custom-trigger" }} />

// The other slots (content, item, etc.) still use their defaults.
```

```tsx
// `item` carries the base AND 9 state variants. Overriding it
// replaces all of them, so write them together:
<DatePicker
  classes={{
    item:
      "rounded-cl-md px-2 py-1 " +           // base
      "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed " +
      "data-[highlighted]:bg-cl-bg-hover " +
      "data-[marked]:underline " +
      "data-[outside]:opacity-40 " +
      "data-[range=end]:rounded-r-full " +
      "data-[range=middle]:rounded-none " +
      "data-[range=start]:rounded-l-full " +
      "data-[selected]:bg-cl-accent/15 data-[selected]:text-cl-accent " +
      "data-[today]:font-semibold ",
  }}
/>

// Passing only `item: "data-[disabled]:…"` drops the base and the other
// 8 states.
```

### Slot overview

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Trigger button appearance | `trigger` | The clickable input area |
| Trigger text | `input` | Text display inside trigger |
| Calendar/clear icons | `icon`, `clearTrigger` | Icons inside trigger |
| Label, description, error text | `label`, `description`, `message`, `message` | Form field elements |
| Calendar popover | `content` | Outer container of calendar |
| Month/year navigation | `header`, `row`, `navTrigger` | Calendar header area |
| Month/year dropdowns | `monthSelect`, `yearSelect`, `subContent`, `subItem` | Month/year selectors — the selected option carries `data-selected` |
| Weekday headers | `listHeader`, `weekday` | Day-of-week labels |
| Day cells | `item` | Individual calendar days |
| Range highlighting | `dayRangeStart`, `dayRangeEnd`, `dayRangeMiddle` | Range mode visual |
| Keyboard focus | — | The focused day carries `data-highlighted` |
| Marked days | `markerIndicator` | Marker visuals |
| Week numbers | `weekNumber` | Week number column |
| Presets | `presetGroup`, `presetTrigger` | Preset buttons panel |
| Footer / today button | `footer`, `todayTrigger` | Calendar footer |
| Multi-month layout | `listRow`, `list` | Side-by-side months |

### Dark mode

Default classes use Tailwind `dark:` prefix. When overriding, always provide both light and dark variants:

```tsx
<DatePicker classes={{
  trigger: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
  item: "data-selected:bg-indigo-600 data-selected:text-white dark:data-selected:bg-indigo-500",
}} />
```

### Styling via data attributes

```tsx
// Tailwind arbitrary variants on item cells:
<DatePicker classes={{
  item: "[&[data-selected]]:bg-purple-600 [&[data-today]]:ring-purple-500 [&[data-disabled]]:opacity-30",
}} />
```

Or in plain CSS:

```css
[data-selected] { background-color: #7c3aed; color: white; }
[data-today] { box-shadow: inset 0 0 0 2px #8b5cf6; }
[data-marker-type="deadline"] { font-weight: bold; }
```

---

## Patterns

### Range selection

```tsx
const [range, setRange] = useState<DateRange | null>(null);

<DatePicker
  selectionMode="range"
  value={range}
  onValueChange={(r) => setRange(r)}
  placeholder="Start date - End date"
  clearable
/>
```

### Multiple dates

```tsx
const [dates, setDates] = useState<Date[] | null>(null);

<DatePicker
  selectionMode="multiple"
  value={dates}
  onValueChange={(d) => setDates(d)}
  placeholder="Pick multiple dates..."
  clearable
/>
```

### With presets

```tsx
<DatePicker
  selectionMode="range"
  value={range}
  onValueChange={(r) => setRange(r)}
  showPresets
/>
```

### Custom presets

```tsx
const presets = [
  { label: "Today", getValue: () => new Date() },
  { label: "Yesterday", getValue: () => subDays(new Date(), 1) },
  { label: "Start of Month", getValue: () => startOfMonth(new Date()) },
];

<DatePicker presets={presets} showPresets />
```

### With markers

```tsx
const markers = [
  { date: addDays(new Date(), 2), label: "Meeting", type: "meeting", color: "#6366f1" },
  { date: addDays(new Date(), 5), label: "Deadline", description: "Project due", color: "#ef4444" },
];

<DatePicker markers={markers} showMarkerIndicator showMarkerTooltip />
```

### Controlled open state

```tsx
const [open, setOpen] = useState(false);

<DatePicker open={open} onOpenChange={setOpen} />
```

### Disabled dates

```tsx
<DatePicker
  disabledDates={{
    disablePast: true,
    daysOfWeek: [0, 6], // disable weekends
    dates: [specificDate],
    custom: (date) => date.getDate() === 13,
  }}
/>
```

### Locale support

```tsx
import { fr } from "date-fns/locale";

<DatePicker locale={fr} weekStartsOn={1} dateFormat="d MMMM yyyy" />
```

### Multiple months

```tsx
<DatePicker selectionMode="range" numberOfMonths={2} />
```

### Form field with validation

```tsx
<DatePicker
  label="Start date"
  description="When should the project begin?"
  required
  error={!date}
  errorMessage="Please select a date"
/>
```

---

## Forms

- **Submitted value.** With `name`, it submits the formats in the `name` row above: `YYYY-MM-DD` for a single date, one `YYYY-MM-DD/YYYY-MM-DD` interval for a range, one entry per date (sorted) for multiple dates, and, with nothing picked, an empty string for a single date or a range and no entry at all for multiple dates, as a native `<select multiple>` does.
- **Reset.** A form reset — a `type="reset"` button or `form.reset()` — restores an uncontrolled selection to `defaultValue` (or no date), and the submitted value with it. Like a native input it fires no change callback: `onValueChange` is not called. A controlled DatePicker is left alone: it keeps the `value` you pass and calls nothing, as a controlled React `<input>` does. Reset your own state in the form's `onReset` if you want the field cleared.
- **Required.** An empty `required` DatePicker blocks the form's submit, and the browser's validation moves focus to the trigger. Multiple-date mode needs at least one date. The field shows an error state only when you pass `error` and `errorMessage`.
- **Disabled.** A disabled DatePicker submits nothing.

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Enter`, `Space` | Opens the calendar from the trigger, and selects the focused day. |
| `ArrowLeft`, `ArrowRight` | Moves a day. `ArrowUp`/`ArrowDown` move a week. Disabled days are stepped over rather than focused. |
| `Home`, `End` | Jumps to the start or end of the week, honouring `weekStartsOn`. |
| `PageUp`, `PageDown` | Changes month. With `Shift`, changes year. |
| `Escape` | Closes the calendar and returns focus to the trigger. Always: there is no prop to turn it off, because the APG date picker dialog pattern requires Escape to close the calendar. |
| `Tab` | Cycles within the panel, which is `role="dialog" aria-modal="true"` and traps focus in both directions. |

---

## Ref API

The ref lands on the trigger, the `<button role="combobox">` a keyboard user tabs to, so `ref.current.focus()` focuses the field — which is what a form library calls on the first invalid field.

```tsx
const ref = useRef<HTMLButtonElement>(null);
<DatePicker ref={ref} label="Date" />
// ref.current is the trigger <button>
```

## Accessibility

- **Keyboard:** Arrow keys navigate days, Home/End jump to the bounds of the week (honouring `weekStartsOn`), PageUp/PageDown change months, Shift+PageUp/PageDown change years, Enter/Space selects a day, Escape closes the calendar. Disabled days are stepped over rather than focused. The month and year menus are listboxes: arrows, Home/End, Enter to choose, Escape to close.
- **Naming:** the trigger is named by `label`, and falls back to the element showing the
  selected date or placeholder — `combobox` is not a name-from-content role. The clear
  control is a real `<button>` beside the trigger, not a `role="button"` span inside it.
- **ARIA:** Trigger has `aria-expanded` + `aria-haspopup`, calendar grid uses `role="grid"`, day cells use `role="gridcell"` with `aria-selected`/`aria-disabled`/`aria-current="date"`
- **Focus management:** Focus moves to the selected day (or today) when the reader opens the calendar, follows the roving tabindex as you navigate, and returns to the trigger on close without scrolling the page. The panel is `role="dialog"`, `aria-modal="true"` once it holds the focus, and traps Tab in both directions. A calendar open at mount (`defaultOpen`, or `open` already true) takes no focus and does not scroll the page, like a native `<select>`; focus moves in the next time the reader opens it.
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Wrong `onValueChange` type | Selection mode mismatch | Ensure `value` and `onValueChange` types match the `selectionMode` |
| Presets not showing | `showPresets` not set | Add `showPresets` to the component |
| Outside days not clickable | `outsideDaysSelectable` set to `false` | Set `outsideDaysSelectable={true}` |
| Calendar flips position unexpectedly | Auto-flip behavior | Set `forceDropdownSide={true}` |
| Markers not visible | `showMarkerIndicator` is `false` | Set `showMarkerIndicator={true}` (it defaults to `true`) |
| Clear button missing | `clearable={false}` or no value | Ensure `clearable` is `true` and a value is selected |
| Styles wrong after overriding one slot | `classes` replaces, not merges | Include all needed classes in your override string |
| Full control needed | Size/variant defaults still apply | Use `unstyled` for full control |

---

## Demo Reference

**File:** `src/pages/demo/DatePickerDemo.tsx`

To find a specific demo implementation, search for these `title=` strings in the demo file:

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Single date, zero config |
| Range selection | `title="Date Range Selection"` | `mode="range"` pattern |
| Multiple dates | `title="Multiple Date Selection"` | `mode="multiple"` pattern |
| Presets | `title="Date Presets"` | Built-in range presets |
| Markers and tooltips | `title="Date Markers"` | `markers`, `showMarkerIndicator`, `showMarkerTooltip` |
| Disabled dates | `title="Disabled Dates"` | `disabledDates` options |
| Multiple months | `title="Multiple Months"` | `numberOfMonths={2}` |
| Week numbers | `title="Week Numbers"` | `showWeekNumbers` |
| Today button | `title="Today Button & Indicator"` | `showTodayButton`, `showTodayIndicator` |
| Week start day | `title="Week Starts On Monday"` | `weekStartsOn={1}` |
| Error state | `title="Error State"` | `message`, `errorMessage` |
| Description text | `title="With Description"` | `description` prop |
| Success state | `title="Success State"` | `message`, `successMessage` |
| Loading state | `title="Loading State"` | `loading` prop |
| Clearable | `title="Clearable (Unified API)"` | `clearable` |
| Disabled | `title="Disabled"` | `disabled` prop |
| Controlled mode | `title="Controlled Mode"` | `value` + `onValueChange` |
| Controlled open | `title="Controlled Open"` | `open` + `onOpenChange` |
| Default open | `title="Default Open"` | `defaultOpen` prop |
| Full width | `title="Full Width"` | `fullWidth` prop |
| Events calendar | `title="Events Calendar (Holidays, Absences, Deadlines)"` | Rich marker examples |
| Custom presets (single) | `title="Custom Presets (Single)"` | Custom single-date presets |
| Custom range presets | `title="Custom Range Presets"` | Custom range presets |
| Locale support | `title="Locale Support"` | `locale`, `weekStartsOn` |
| Custom date format | `title="Custom Date Format"` | `dateFormat` prop |
| Outside days | `title="Outside Days"` | `showOutsideDays`, `outsideDaysSelectable` |
| Fixed weeks | `title="Fixed Weeks"` | `fixedWeeks` prop |
| Disable specific dates | `title="Disable Specific Dates"` | Granular `disabledDates` |
| Event callbacks | `title="Event Callbacks"` | `onValueChange`, `onMonthChange`, `onOpenChange`, `onClear` |
| Classes system | `title="Classes System"` | Per-slot class customization |
| Scroll behavior | `title="Scroll Behavior"` | `lockScroll` prop |
| Dropdown position | `title="Dropdown Position"` | `dropdownSide`, `forceDropdownSide` |
| Custom icons | `title="Custom Icons"` | Icon override props |
| Reduce motion | `title="Reduce Motion"` | `reduceMotion` prop |

**Source files:**

| File | Contains |
|------|----------|
| `DatePicker.tsx` | Main component, DayCell, PresetsPanel, CustomDropdown |
| `useDatePicker.ts` | Core hook: calendar generation, selection logic, keyboard handling |
| `utils/types.ts` | All TypeScript interfaces |
| `constants.ts` | Default and unstyled class maps |
| `utils/index.ts` | Date formatting, parsing, and utility functions |
| `icons.tsx` | Built-in SVG icons |
