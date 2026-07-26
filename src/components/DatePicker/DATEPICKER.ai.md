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
| `mode` | Determines `value` and `onValueChange` types. `"single"` = `Date \| null`, `"range"` = `DateRange \| null`, `"multiple"` = `Date[] \| null`. |
| `showPresets` | Only shows presets panel if `true`. Uses built-in presets unless `presets` prop is provided. |
| `presets` | Must match the mode. Single presets return `Date`, range presets return `DateRange`, multiple return `Date[]`. |
| `markers` | Only visible when `showMarkerIndicator` is `true` (default). Tooltips require `showMarkerTooltip`. |
| `clearable` / `showClearButton` | Both control the clear button. `showClearButton` takes precedence if both are set. |
| `open` + `onOpenChange` | Controlled open state -- both are needed together. |
| `outsideDaysSelectable` | Only works when `showOutsideDays` is `true` (default). |
| `dropdownPosition` | Set to `"top"` or `"bottom"`. Use `forceDropdownPosition` to prevent auto-flipping. |

---

## Data Attributes (for CSS selectors and testing)

### Root element
- `data-disabled` -- when picker is disabled
- `data-error` -- when error state is active
- `data-open` -- when calendar is open
- `data-loading` -- when loading state is active
- `data-success` -- when success state is active

### Day cells
- `data-selected` -- selected day
- `data-today` -- today's date
- `data-disabled` -- disabled day
- `data-outside` -- day outside current month
- `data-range-start` -- first day of range
- `data-range-end` -- last day of range
- `data-in-range` -- day within selected range
- `data-focused` -- keyboard-focused day
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
| `mode` | `"single"` \| `"range"` \| `"multiple"` | `"single"` | Selection mode: single date, date range, or multiple dates. |
| `value` | — | — | Controlled selected value. Type depends on mode: Date \| null (single), DateRange \| null (range), Date[] \| null (multiple). |
| `onValueChange` | object | — | Callback when the selected value changes. Signature depends on mode. |
| `onClear` | object | — | () => void — Called when the clear button is clicked. |
| `onMonthChange` | object | — | (month: Date) => void — Called when the displayed month changes. |
| `open` | boolean | — | Controlled open state of the calendar popup. |
| `defaultOpen` | boolean | `false` | Initial open state for uncontrolled usage. |
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
| `name` | string | — | Form field name. |
| `placeholder` | string | — | Placeholder text for the trigger input. |
| `disabled` | boolean | `false` | Disables the date picker. |
| `error` | boolean | `false` | Displays error state. |
| `errorMessage` | object | — | React.ReactNode — Error message. |
| `label` | object | — | React.ReactNode — Label above the trigger. |
| `description` | object | — | React.ReactNode — Description text. |
| `success` | boolean | `false` | Displays success state. |
| `successMessage` | object | — | React.ReactNode — Success message. |
| `loading` | boolean | `false` | Shows loading state. |
| `clearable` | boolean | — | Shows a clear button. |
| `required` | boolean | `false` | Marks the field as required. |
| `fullWidth` | boolean | `false` | Stretches the date picker to fill its container width. |
| `showClearButton` | boolean | `true` | Shows the clear button in the trigger. |
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
| `dropdownPosition` | `"top"` \| `"bottom"` | `"bottom"` | Vertical placement of the calendar popup. |
| `forceDropdownPosition` | boolean | `false` | Locks the calendar to the specified dropdownPosition without auto-flipping. |
| `dropdownGap` | number | `4` | Gap in pixels between trigger and calendar popup. |
| `keepMounted` | boolean | `false` | Keep the calendar DOM mounted when closed. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects OS setting. |

## Styling Guide

### How class merging works

The component has three styling modes:

1. **Default** (`unstyled=false`, no `classes`): Uses `DEFAULT_DATEPICKER_CLASSES` -- fully styled with dark mode support.
2. **Partial override** (`unstyled=false`, partial `classes`): Your values **replace** the default for that slot. Unspecified slots keep their defaults. This is NOT additive.
3. **Unstyled** (`unstyled=true`): All slots start as empty strings. You must provide everything via `classes`.

```tsx
// This REPLACES the default trigger classes entirely:
<DatePicker classes={{ trigger: "my-custom-trigger" }} />

// The other slots (calendar, day, etc.) still use their defaults.
```

### Slot overview

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Trigger button appearance | `trigger` | The clickable input area |
| Trigger text | `input` | Text display inside trigger |
| Calendar/clear icons | `calendarIcon`, `clearButton` | Icons inside trigger |
| Label, description, error text | `label`, `description`, `error`, `success` | Form field elements |
| Calendar popover | `calendar` | Outer container of calendar |
| Month/year navigation | `header`, `monthNav`, `navButton`, `navButtonDisabled` | Calendar header area |
| Month/year dropdowns | `monthSelect`, `yearSelect`, `dropdownMenu`, `dropdownItem`, `dropdownItemSelected` | Month/year selectors |
| Weekday headers | `weekdayHeader`, `weekday` | Day-of-week labels |
| Day cells | `day`, `daySelected`, `dayToday`, `dayDisabled`, `dayOutside` | Individual calendar days |
| Range highlighting | `dayRangeStart`, `dayRangeEnd`, `dayRangeMiddle` | Range mode visual |
| Keyboard focus | `dayFocused` | Focused day ring |
| Marked days | `dayMarked`, `markerIndicator`, `markerTooltip` | Marker visuals |
| Week numbers | `weekNumber` | Week number column |
| Presets | `presets`, `presetButton`, `presetActive` | Preset buttons panel |
| Footer / today button | `footer`, `todayButton` | Calendar footer |
| Multi-month layout | `monthGrid`, `grid` | Side-by-side months |

### Dark mode

Default classes use Tailwind `dark:` prefix. When overriding, always provide both light and dark variants:

```tsx
<DatePicker classes={{
  trigger: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
  daySelected: "bg-indigo-600 dark:bg-indigo-500 text-white",
}} />
```

### Styling via data attributes

```tsx
// Tailwind arbitrary variants on day cells:
<DatePicker classes={{
  day: "[&[data-selected]]:bg-purple-600 [&[data-today]]:ring-purple-500 [&[data-disabled]]:opacity-30",
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
  mode="range"
  value={range}
  onValueChange={(r) => setRange(r)}
  placeholder="Start date - End date"
  showClearButton
/>
```

### Multiple dates

```tsx
const [dates, setDates] = useState<Date[] | null>(null);

<DatePicker
  mode="multiple"
  value={dates}
  onValueChange={(d) => setDates(d)}
  placeholder="Pick multiple dates..."
  showClearButton
/>
```

### With presets

```tsx
<DatePicker
  mode="range"
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
<DatePicker mode="range" numberOfMonths={2} />
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

## Accessibility

- **Keyboard:** Arrow keys navigate days, Home/End jump to start/end of week, PageUp/PageDown change months, Enter/Space selects a day, Escape closes calendar
- **ARIA:** Trigger has `aria-expanded` + `aria-haspopup`, calendar grid uses `role="grid"`, day cells use `role="gridcell"` with `aria-selected`/`aria-disabled`/`aria-current="date"`
- **Focus management:** Focus moves into calendar on open and returns to trigger on close
- **Reduced motion:** `reduceMotion="auto"` respects OS `prefers-reduced-motion` setting

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Wrong `onValueChange` type | Mode mismatch | Ensure `value` and `onValueChange` types match the `mode` |
| Presets not showing | `showPresets` not set | Add `showPresets` to the component |
| Outside days not clickable | `outsideDaysSelectable` set to `false` | Set `outsideDaysSelectable={true}` |
| Calendar flips position unexpectedly | Auto-flip behavior | Set `forceDropdownPosition={true}` |
| Markers not visible | `showMarkerIndicator` is `false` | Set `showMarkerIndicator={true}` (it defaults to `true`) |
| Clear button missing | `showClearButton={false}` or no value | Ensure `showClearButton` is `true` and a value is selected |
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
| Error state | `title="Error State"` | `error`, `errorMessage` |
| Description text | `title="With Description"` | `description` prop |
| Success state | `title="Success State"` | `success`, `successMessage` |
| Loading state | `title="Loading State"` | `loading` prop |
| Clearable | `title="Clearable (Unified API)"` | `clearable` / `showClearButton` |
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
| Dropdown position | `title="Dropdown Position"` | `dropdownPosition`, `forceDropdownPosition` |
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
