import { useState } from "react";
import { TimePicker, type TimeValue } from "../../components/TimePicker";
import { Section, ComponentHeader } from "./components";

const triggerStyle =
  "flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-text";
const inputStyle =
  "flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400";
const dropdownStyle =
  "absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden";
const optionListStyle = "max-h-60 overflow-y-auto";
const optionStyle =
  "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-sm";
const selectedOptionStyle = "bg-blue-50 font-medium";
const focusedOptionStyle = "bg-gray-100";
const endIconStyle =
  "w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200";
const selectedIconStyle = "w-4 h-4 shrink-0 text-blue-600";
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const errorStyle = "text-sm text-red-500 mt-1";
const noResultsStyle = "px-3 py-4 text-sm text-gray-500 text-center";

// Custom icons
const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CircleCheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    />
  </svg>
);

const BellIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </svg>
);

const TimePickerDemo = () => {
  const [basic24Value, setBasic24Value] = useState<string | null>(null);
  const [basic12Value, setBasic12Value] = useState<string | null>(null);
  const [labelValue, setLabelValue] = useState<string | null>("14:30");
  const [errorValue, setErrorValue] = useState<string | null>(null);
  const [customStepValue, setCustomStepValue] = useState<string | null>(null);
  const [rangeValue, setRangeValue] = useState<string | null>(null);
  const [lastTimeValue, setLastTimeValue] = useState<TimeValue | null>(null);

  // New state for enhanced features
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(
    null,
  );
  const [customIconValue, setCustomIconValue] = useState<string | null>(null);
  const [customIconValue2, setCustomIconValue2] = useState<string | null>(null);
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  const [customFocusPurpleValue, setCustomFocusPurpleValue] = useState<
    string | null
  >(null);
  const [customFocusGreenValue, setCustomFocusGreenValue] = useState<
    string | null
  >(null);
  const [customFocusOrangeValue, setCustomFocusOrangeValue] = useState<
    string | null
  >(null);
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  const [coolThemeValue, setCoolThemeValue] = useState<string | null>(null);
  const [minimalThemeValue, setMinimalThemeValue] = useState<string | null>(
    null,
  );
  const [contrastTheme1Value, setContrastTheme1Value] = useState<string | null>(
    null,
  );
  const [contrastTheme2Value, setContrastTheme2Value] = useState<string | null>(
    null,
  );
  const [contrastTheme3Value, setContrastTheme3Value] = useState<string | null>(
    null,
  );
  const [customContentValue, setCustomContentValue] = useState<string | null>(
    null,
  );
  const [clockIconValue, setClockIconValue] = useState<string | null>(null);
  const [calendarIconValue, setCalendarIconValue] = useState<string | null>(
    null,
  );
  const [bellIconValue, setBellIconValue] = useState<string | null>(null);
  const [noTrailingIconValue, setNoTrailingIconValue] = useState<string | null>(
    null,
  );
  const [customPlaceholderValue, setCustomPlaceholderValue] = useState<
    string | null
  >(null);
  const [fullWidthValue, setFullWidthValue] = useState<string | null>(null);
  const [idNameValue, setIdNameValue] = useState<string | null>(null);
  const [blurValue, setBlurValue] = useState<string | null>(null);
  const [blurCount, setBlurCount] = useState(0);
  const [containerClassValue, setContainerClassValue] = useState<string | null>(
    null,
  );

  // Clock variant state
  const [clock24Value, setClock24Value] = useState<string | null>(null);
  const [clock12Value, setClock12Value] = useState<string | null>(null);

  return (
    <>
      <ComponentHeader
        title="TimePicker"
        description="A flexible time picker with smart parsing, 12/24 hour format, and keyboard navigation."
      />

      <Section title="24-Hour Format (Default)">
        <div className="w-48">
          <TimePicker
            value={basic24Value}
            onChange={(time, timeValue) => {
              setBasic24Value(time);
              setLastTimeValue(timeValue);
            }}
            format="24h"
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
          {basic24Value && (
            <p className="text-sm text-gray-500 mt-2">
              Selected:{" "}
              <code className="bg-gray-100 px-1 rounded">{basic24Value}</code>
            </p>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-gray-500">
            <strong>Smart parsing:</strong> Type "1200" → 12:00, "930" → 09:30,
            "14" → 14:00
          </p>
          <p className="text-xs text-gray-400">
            Supports typing, selecting, and copy/paste
          </p>
        </div>
      </Section>

      <Section title="12-Hour Format">
        <div className="w-48">
          <TimePicker
            value={basic12Value}
            onChange={(time) => setBasic12Value(time)}
            format="12h"
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
          {basic12Value && (
            <p className="text-sm text-gray-500 mt-2">
              Selected:{" "}
              <code className="bg-gray-100 px-1 rounded">{basic12Value}</code>
            </p>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-gray-500">
            <strong>Smart parsing:</strong> Type "1pm" → 01:00 PM, "230a" →
            02:30 AM
          </p>
        </div>
      </Section>

      <Section title="Clock Variant (24-Hour)">
        <p className="text-sm text-gray-600 mb-4">
          Use <code className="bg-gray-100 px-1 rounded">variant="clock"</code>{" "}
          for a circular clock UI with dual rings for 24-hour format.
        </p>
        <div className="w-64">
          <TimePicker
            value={clock24Value}
            onChange={(time) => setClock24Value(time)}
            format="24h"
            variant="clock"
            minuteStep={5}
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            endIconClassName={endIconStyle}
            // Clock-specific styling
            clockContainerClassName="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-72"
            clockDisplayClassName="flex items-center justify-center gap-1 mb-4"
            clockDisplayHoursClassName="text-5xl font-light px-3 py-2 rounded-lg bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
            clockDisplayMinutesClassName="text-5xl font-light px-3 py-2 rounded-lg bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
            clockDisplayActiveClassName="!bg-teal-100 !text-teal-700"
            clockDisplaySeparatorClassName="text-5xl font-light text-gray-400"
            clockFaceClassName="relative w-56 h-56 mx-auto bg-gray-100 rounded-full cursor-pointer select-none overflow-hidden"
            clockHandClassName=""
            clockHandLineClassName="stroke-teal-600"
            clockHandDotClassName="w-10 h-10 bg-teal-600 rounded-full z-0"
            clockCenterClassName="fill-teal-600"
            clockNumberClassName="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-700 rounded-full z-10 transition-colors"
            clockNumberSelectedClassName="text-white"
            clockNumberInnerClassName="text-xs text-gray-500 w-7 h-7"
            clockActionsClassName="flex justify-end gap-4 mt-4 pt-3 border-t border-gray-100"
            clockCancelButtonClassName="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            clockOkButtonClassName="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          />
          {clock24Value && (
            <p className="text-sm text-gray-500 mt-2">
              Selected:{" "}
              <code className="bg-gray-100 px-1 rounded">{clock24Value}</code>
            </p>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">
            <strong>Features:</strong>
          </p>
          <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
            <li>Click hour/minute display to switch selection mode</li>
            <li>Outer ring: 0-11 hours, Inner ring: 12-23 hours</li>
            <li>Click and drag on the clock face to select</li>
          </ul>
        </div>
      </Section>

      <Section title="Clock Variant (12-Hour)">
        <p className="text-sm text-gray-600 mb-4">
          12-hour format includes AM/PM toggle with a single ring of hours.
        </p>
        <div className="w-64">
          <TimePicker
            value={clock12Value}
            onChange={(time) => setClock12Value(time)}
            format="12h"
            variant="clock"
            minuteStep={5}
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            endIconClassName={endIconStyle}
            // Clock-specific styling - Purple theme
            clockContainerClassName="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80"
            clockDisplayClassName="flex items-center justify-center gap-1 mb-4"
            clockDisplayHoursClassName="text-5xl font-light px-3 py-2 rounded-lg bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
            clockDisplayMinutesClassName="text-5xl font-light px-3 py-2 rounded-lg bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
            clockDisplayActiveClassName="!bg-purple-100 !text-purple-700"
            clockDisplaySeparatorClassName="text-5xl font-light text-gray-400"
            clockPeriodToggleClassName="flex flex-col gap-1 ml-3"
            clockPeriodButtonClassName="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            clockPeriodActiveClassName="!bg-purple-600 !text-white"
            clockFaceClassName="relative w-56 h-56 mx-auto bg-gray-100 rounded-full cursor-pointer select-none overflow-hidden"
            clockHandClassName=""
            clockHandLineClassName="stroke-purple-600"
            clockHandDotClassName="w-10 h-10 bg-purple-600 rounded-full z-0"
            clockCenterClassName="fill-purple-600"
            clockNumberClassName="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-700 rounded-full z-10 transition-colors"
            clockNumberSelectedClassName="text-white"
            clockActionsClassName="flex justify-end gap-4 mt-4 pt-3 border-t border-gray-100"
            clockCancelButtonClassName="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            clockOkButtonClassName="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          />
          {clock12Value && (
            <p className="text-sm text-gray-500 mt-2">
              Selected:{" "}
              <code className="bg-gray-100 px-1 rounded">{clock12Value}</code>
            </p>
          )}
        </div>
      </Section>

      <Section title="Custom Placeholder">
        <div className="flex flex-wrap gap-8">
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Custom placeholder:</p>
            <TimePicker
              value={customPlaceholderValue}
              onChange={(time) => setCustomPlaceholderValue(time)}
              format="24h"
              placeholder="Select a time..."
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIconClassName={endIconStyle}
              selectedIconClassName={selectedIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">placeholder</code> to
          customize the placeholder text. Defaults to "hh:mm" for 24h format and
          "hh:mm AM/PM" for 12h format.
        </p>
      </Section>

      <Section title="Full Width">
        <div className="max-w-md">
          <TimePicker
            value={fullWidthValue}
            onChange={(time) => setFullWidthValue(time)}
            format="24h"
            fullWidth
            label="Full Width TimePicker"
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">fullWidth</code> to
          make the picker take the full width of its container.
        </p>
      </Section>

      <Section title="With id and name Props">
        <div className="w-48">
          <TimePicker
            id="meeting-time-picker"
            name="meetingTime"
            value={idNameValue}
            onChange={(time) => setIdNameValue(time)}
            format="24h"
            label="Meeting Time"
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">id</code> and{" "}
          <code className="bg-gray-100 px-1 rounded">name</code> props for form
          integration and accessibility. The ID is used for ARIA attributes and
          label association.
        </p>
      </Section>

      <Section title="With onBlur Callback">
        <div className="w-48">
          <TimePicker
            value={blurValue}
            onChange={(time) => setBlurValue(time)}
            onBlur={() => setBlurCount((c) => c + 1)}
            format="24h"
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
          <p className="text-sm text-gray-500 mt-2">
            Blur count:{" "}
            <code className="bg-gray-100 px-1 rounded">{blurCount}</code>
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">onBlur</code> to handle
          blur events, useful for form validation.
        </p>
      </Section>

      <Section title="Container and Wrapper Styling">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              With containerClassName:
            </p>
            <TimePicker
              value={containerClassValue}
              onChange={(time) => setContainerClassValue(time)}
              format="24h"
              containerClassName="p-4 bg-gray-100 rounded-lg"
              className="w-48"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIconClassName={endIconStyle}
              selectedIconClassName={selectedIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">containerClassName</code>{" "}
          to style the root container (includes label and error), and{" "}
          <code className="bg-gray-100 px-1 rounded">className</code> to style
          the dropdown wrapper (relative positioned element containing trigger
          and dropdown).
        </p>
      </Section>

      <Section title="With Label">
        <div className="w-48">
          <TimePicker
            label="Meeting Time"
            required
            value={labelValue}
            onChange={(time) => setLabelValue(time)}
            format="24h"
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Custom Minute Step (30 min)">
        <div className="w-48">
          <TimePicker
            value={customStepValue}
            onChange={(time) => setCustomStepValue(time)}
            format="24h"
            minuteStep={30}
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Options shown in 30-minute intervals
        </p>
      </Section>

      <Section title="With Time Range (9:00 - 18:00)">
        <div className="w-48">
          <TimePicker
            value={rangeValue}
            onChange={(time) => setRangeValue(time)}
            format="24h"
            minTime="09:00"
            maxTime="18:00"
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Only shows options between 9:00 AM and 6:00 PM
        </p>
      </Section>

      <Section title="Custom Trailing Icon">
        <p className="text-sm text-gray-600 mb-4">
          Replace the default chevron icon with a custom icon using the{" "}
          <code className="bg-gray-100 px-1 rounded">endIcon</code> prop.
        </p>
        <div className="flex flex-wrap gap-8">
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Clock icon:</p>
            <TimePicker
              value={clockIconValue}
              onChange={(time) => setClockIconValue(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIcon={<ClockIcon className="w-4 h-4 text-gray-400" />}
              selectedIconClassName={selectedIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Calendar icon:</p>
            <TimePicker
              value={calendarIconValue}
              onChange={(time) => setCalendarIconValue(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIcon={<CalendarIcon className="w-4 h-4 text-gray-400" />}
              selectedIconClassName={selectedIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Bell icon:</p>
            <TimePicker
              value={bellIconValue}
              onChange={(time) => setBellIconValue(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIcon={<BellIcon className="w-4 h-4 text-gray-400" />}
              selectedIconClassName={selectedIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">No icon:</p>
            <TimePicker
              value={noTrailingIconValue}
              onChange={(time) => setNoTrailingIconValue(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              showEndIcon={false}
              selectedIconClassName={selectedIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Use <code className="bg-gray-100 px-1 rounded">endIcon</code> to
          provide a custom icon, or{" "}
          <code className="bg-gray-100 px-1 rounded">showEndIcon=false</code> to
          hide the icon entirely.
        </p>
      </Section>

      <Section title="Custom Selected State Styling">
        <div className="space-y-4">
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">
              With selectedOptionClassName:
            </p>
            <TimePicker
              value={customSelectedValue}
              onChange={(time) => setCustomSelectedValue(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName="!bg-green-100 border-l-4 border-green-500"
              focusedOptionClassName={focusedOptionStyle}
              endIconClassName={endIconStyle}
              selectedIconClassName={selectedIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
          <p className="text-sm text-gray-500">
            Use{" "}
            <code className="bg-gray-100 px-1 rounded">
              selectedOptionClassName
            </code>{" "}
            to add additional styles to the selected option.
          </p>
        </div>
      </Section>

      <Section title="Custom Selected Icon">
        <div className="flex flex-wrap gap-8">
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Star icon:</p>
            <TimePicker
              value={customIconValue}
              onChange={(time) => setCustomIconValue(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIconClassName={endIconStyle}
              selectedIcon={
                <StarIcon className="w-4 h-4 shrink-0 text-yellow-500" />
              }
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Circle check icon:</p>
            <TimePicker
              value={customIconValue2}
              onChange={(time) => setCustomIconValue2(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIconClassName={endIconStyle}
              selectedIcon={
                <CircleCheckIcon className="w-4 h-4 shrink-0 text-green-600" />
              }
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">No icon (hidden):</p>
            <TimePicker
              value={noIconValue}
              onChange={(time) => setNoIconValue(time)}
              format="24h"
              triggerClassName={triggerStyle}
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              focusedOptionClassName={focusedOptionStyle}
              endIconClassName={endIconStyle}
              showSelectedIcon={false}
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">selectedIcon</code> to
          provide a custom icon, or{" "}
          <code className="bg-gray-100 px-1 rounded">
            showSelectedIcon=false
          </code>{" "}
          to hide it entirely.
        </p>
      </Section>

      <Section title="Custom Focus State Styling">
        <div className="flex flex-wrap gap-8">
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Purple focus ring:</p>
            <TimePicker
              value={customFocusPurpleValue}
              onChange={(time) => setCustomFocusPurpleValue(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent cursor-text"
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-purple-50 text-sm"
              focusedOptionClassName="bg-purple-100"
              selectedOptionClassName="bg-purple-50"
              endIconClassName={endIconStyle}
              selectedIconClassName="w-4 h-4 shrink-0 text-purple-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Green focus ring:</p>
            <TimePicker
              value={customFocusGreenValue}
              onChange={(time) => setCustomFocusGreenValue(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent cursor-text"
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-green-50 text-sm"
              focusedOptionClassName="bg-green-100"
              selectedOptionClassName="bg-green-50"
              endIconClassName={endIconStyle}
              selectedIconClassName="w-4 h-4 shrink-0 text-green-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2">Orange focus ring:</p>
            <TimePicker
              value={customFocusOrangeValue}
              onChange={(time) => setCustomFocusOrangeValue(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent cursor-text"
              inputClassName={inputStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-orange-50 text-sm"
              focusedOptionClassName="bg-orange-100"
              selectedOptionClassName="bg-orange-50"
              endIconClassName={endIconStyle}
              selectedIconClassName="w-4 h-4 shrink-0 text-orange-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">
            focusedOptionClassName
          </code>{" "}
          to customize the keyboard/hover focus state, and{" "}
          <code className="bg-gray-100 px-1 rounded">triggerClassName</code> for
          the trigger focus ring.
        </p>
      </Section>

      <Section title="Custom Theme Examples">
        <p className="text-sm text-gray-600 mb-4">
          Customize the trigger, menu, and list item backgrounds to match your
          design system.
        </p>
        <div className="flex flex-wrap gap-8">
          {/* Dark Theme */}
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Dark Theme:
            </p>
            <TimePicker
              value={darkThemeValue}
              onChange={(time) => setDarkThemeValue(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 focus-within:ring-2 focus-within:ring-gray-500 cursor-text"
              inputClassName="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-gray-400"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 text-sm"
              focusedOptionClassName="bg-gray-700"
              selectedOptionClassName="bg-gray-600"
              endIconClassName="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200"
              selectedIconClassName="w-4 h-4 shrink-0 text-blue-400"
              noResultsClassName="px-3 py-4 text-sm text-gray-400 text-center"
            />
          </div>

          {/* Warm Theme */}
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Warm Theme:
            </p>
            <TimePicker
              value={warmThemeValue}
              onChange={(time) => setWarmThemeValue(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 border border-amber-300 rounded-lg bg-amber-50 hover:bg-amber-100 focus-within:ring-2 focus-within:ring-amber-400 cursor-text"
              inputClassName="flex-1 min-w-0 bg-transparent outline-none text-sm text-amber-900 placeholder:text-amber-400"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-amber-50 border border-amber-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-amber-900 hover:bg-amber-100 text-sm"
              focusedOptionClassName="bg-amber-100"
              selectedOptionClassName="bg-amber-200"
              endIconClassName="w-4 h-4 shrink-0 text-amber-600 transition-transform duration-200"
              selectedIconClassName="w-4 h-4 shrink-0 text-amber-700"
              noResultsClassName="px-3 py-4 text-sm text-amber-600 text-center"
            />
          </div>

          {/* Cool Theme */}
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Cool Theme:
            </p>
            <TimePicker
              value={coolThemeValue}
              onChange={(time) => setCoolThemeValue(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 border border-cyan-300 rounded-lg bg-cyan-50 hover:bg-cyan-100 focus-within:ring-2 focus-within:ring-cyan-400 cursor-text"
              inputClassName="flex-1 min-w-0 bg-transparent outline-none text-sm text-cyan-900 placeholder:text-cyan-400"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-cyan-50 border border-cyan-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-cyan-900 hover:bg-cyan-100 text-sm"
              focusedOptionClassName="bg-cyan-100"
              selectedOptionClassName="bg-cyan-200"
              endIconClassName="w-4 h-4 shrink-0 text-cyan-600 transition-transform duration-200"
              selectedIconClassName="w-4 h-4 shrink-0 text-cyan-700"
              noResultsClassName="px-3 py-4 text-sm text-cyan-600 text-center"
            />
          </div>

          {/* Minimal Theme */}
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Minimal Theme:
            </p>
            <TimePicker
              value={minimalThemeValue}
              onChange={(time) => setMinimalThemeValue(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 border-b border-gray-300 bg-transparent hover:border-gray-500 focus-within:border-gray-800 cursor-text"
              inputClassName="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded shadow-sm overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 text-sm"
              focusedOptionClassName="bg-gray-50"
              selectedOptionClassName="font-medium"
              endIconClassName="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200"
              showSelectedIcon={false}
              noResultsClassName="px-3 py-4 text-sm text-gray-400 text-center"
            />
          </div>
        </div>
      </Section>

      <Section title="Contrasting Trigger & Menu Colors">
        <p className="text-sm text-gray-600 mb-4">
          Use different colors for the trigger and dropdown menu to create
          visual contrast or match brand guidelines.
        </p>
        <div className="flex flex-wrap gap-8">
          {/* Blue trigger, White menu */}
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Blue Trigger + White Menu:
            </p>
            <TimePicker
              value={contrastTheme1Value}
              onChange={(time) => setContrastTheme1Value(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 cursor-text"
              inputClassName="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-blue-200"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 text-sm"
              focusedOptionClassName="bg-blue-50"
              selectedOptionClassName="bg-blue-50"
              endIconClassName="w-4 h-4 shrink-0 text-blue-200 transition-transform duration-200"
              selectedIconClassName="w-4 h-4 shrink-0 text-blue-600"
              noResultsClassName={noResultsStyle}
            />
          </div>

          {/* Dark trigger, Light menu */}
          <div className="w-48">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Dark Trigger + Light Menu:
            </p>
            <TimePicker
              value={contrastTheme2Value}
              onChange={(time) => setContrastTheme2Value(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 cursor-text"
              inputClassName="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-gray-400"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 text-sm"
              focusedOptionClassName="bg-gray-200"
              selectedOptionClassName="bg-gray-200 font-medium"
              endIconClassName="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200"
              selectedIconClassName="w-4 h-4 shrink-0 text-gray-700"
              noResultsClassName={noResultsStyle}
            />
          </div>

          {/* Gradient trigger, White menu */}
          <div className="w-52">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Gradient Trigger + White Menu:
            </p>
            <TimePicker
              value={contrastTheme3Value}
              onChange={(time) => setContrastTheme3Value(time)}
              format="24h"
              triggerClassName="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus-within:ring-2 focus-within:ring-purple-400 focus-within:ring-offset-2 cursor-text"
              inputClassName="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-purple-200"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-purple-100 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-700 hover:bg-purple-50 text-sm"
              focusedOptionClassName="bg-purple-50"
              selectedOptionClassName="bg-purple-100"
              endIconClassName="w-4 h-4 shrink-0 text-purple-200 transition-transform duration-200"
              selectedIconClassName="w-4 h-4 shrink-0 text-purple-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          The trigger and menu can be styled independently using{" "}
          <code className="bg-gray-100 px-1 rounded">triggerClassName</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">inputClassName</code>, and{" "}
          <code className="bg-gray-100 px-1 rounded">dropdownClassName</code>.
        </p>
      </Section>

      <Section title="Custom Option Content with Icons">
        <div className="w-48">
          <TimePicker
            value={customContentValue}
            onChange={(time) => setCustomContentValue(time)}
            format="24h"
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
            renderOptionContent={(time) => (
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span>{time}</span>
              </div>
            )}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">renderOptionContent</code>{" "}
          to customize how each time option is rendered, allowing you to add
          icons or other elements.
        </p>
      </Section>

      <Section title="Error State">
        <div className="w-48">
          <TimePicker
            label="Start Time"
            required
            value={errorValue}
            onChange={(time) => setErrorValue(time)}
            error
            errorMessage="Please select a valid time"
            format="24h"
            labelClassName={labelStyle}
            triggerClassName={`${triggerStyle} border-red-500 focus-within:ring-red-500`}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
            errorClassName={errorStyle}
          />
        </div>
      </Section>

      <Section title="Disabled State">
        <div className="w-48">
          <TimePicker
            value="10:30"
            onChange={() => {}}
            disabled
            format="24h"
            triggerClassName={`${triggerStyle} opacity-50 cursor-not-allowed`}
            inputClassName={`${inputStyle} cursor-not-allowed`}
            endIconClassName={endIconStyle}
          />
        </div>
      </Section>

      <Section title="TimeValue Object">
        <div className="w-48">
          <TimePicker
            value={basic24Value}
            onChange={(time, timeValue) => {
              setBasic24Value(time);
              setLastTimeValue(timeValue);
            }}
            format="24h"
            triggerClassName={triggerStyle}
            inputClassName={inputStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            endIconClassName={endIconStyle}
            selectedIconClassName={selectedIconStyle}
            noResultsClassName={noResultsStyle}
          />
          {lastTimeValue && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p className="font-medium text-gray-700">TimeValue:</p>
              <p>
                <span className="text-gray-500">hours:</span>{" "}
                {lastTimeValue.hours}
              </p>
              <p>
                <span className="text-gray-500">minutes:</span>{" "}
                {lastTimeValue.minutes}
              </p>
              {lastTimeValue.period && (
                <p>
                  <span className="text-gray-500">period:</span>{" "}
                  {lastTimeValue.period}
                </p>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          The <code className="bg-gray-100 px-1 rounded">onChange</code>{" "}
          callback provides both the formatted string and a parsed{" "}
          <code className="bg-gray-100 px-1 rounded">TimeValue</code> object.
        </p>
      </Section>

      <Section title="Smart Parsing Examples">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Input
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  24h Result
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  12h Result
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono">9</td>
                <td className="py-2 pr-4">09:00</td>
                <td className="py-2">09:00 AM</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">14</td>
                <td className="py-2 pr-4">14:00</td>
                <td className="py-2">02:00 PM</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">930</td>
                <td className="py-2 pr-4">09:30</td>
                <td className="py-2">09:30 AM</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">1430</td>
                <td className="py-2 pr-4">14:30</td>
                <td className="py-2">02:30 PM</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">2pm</td>
                <td className="py-2 pr-4">14:00</td>
                <td className="py-2">02:00 PM</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">230a</td>
                <td className="py-2 pr-4">02:30</td>
                <td className="py-2">02:30 AM</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">9:45</td>
                <td className="py-2 pr-4">09:45</td>
                <td className="py-2">09:45 AM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Props Reference">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">Custom ID for the picker</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Name attribute</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string | null</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Current time value (required)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">
                  (time, timeValue) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Change handler (required)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onBlur</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Blur event handler</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onCancel</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Cancel callback (clock variant)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onConfirm</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Confirm callback (clock variant)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Label for the picker</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether field is required
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  placeholder
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">
                  "hh:mm" / "hh:mm AM/PM"
                </td>
                <td className="py-2 text-gray-600">Input placeholder text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  errorMessage
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Error message to display</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Take full container width
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">format</td>
                <td className="py-2 pr-4 text-gray-600">"12h" | "24h"</td>
                <td className="py-2 pr-4 text-gray-500">"24h"</td>
                <td className="py-2 text-gray-600">Time format</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">variant</td>
                <td className="py-2 pr-4 text-gray-600">
                  "dropdown" | "clock"
                </td>
                <td className="py-2 pr-4 text-gray-500">"dropdown"</td>
                <td className="py-2 text-gray-600">
                  UI variant (list or circular clock)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  minuteStep
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">15</td>
                <td className="py-2 text-gray-600">Interval between options</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">minTime</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Minimum selectable time</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">maxTime</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Maximum selectable time</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Disable the picker</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show error state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showEndIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show end icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">endIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom end icon (default: chevron)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showSelectedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show icon for selected option
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  selectedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom icon for selected state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  renderOptionContent
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (time, isSelected) =&gt; ReactNode
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom render function for option content
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">
                  Dropdown wrapper (relative positioned)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  containerClassName
                </td>
                <td className="py-2 text-gray-600">Root container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelClassName
                </td>
                <td className="py-2 text-gray-600">Label element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  errorClassName
                </td>
                <td className="py-2 text-gray-600">Error message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  triggerClassName
                </td>
                <td className="py-2 text-gray-600">
                  Trigger container (input + chevron)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  inputClassName
                </td>
                <td className="py-2 text-gray-600">Text input element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dropdownClassName
                </td>
                <td className="py-2 text-gray-600">Dropdown container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  optionListClassName
                </td>
                <td className="py-2 text-gray-600">Options list wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  optionClassName
                </td>
                <td className="py-2 text-gray-600">Individual option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  selectedOptionClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional styles for selected option
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  focusedOptionClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional styles for focused option (keyboard/hover)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  endIconClassName
                </td>
                <td className="py-2 text-gray-600">Trailing icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  selectedIconClassName
                </td>
                <td className="py-2 text-gray-600">Selected icon styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  noResultsClassName
                </td>
                <td className="py-2 text-gray-600">No results message</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Clock Variant Styling Props">
        <p className="text-sm text-gray-600 mb-4">
          These props are used when{" "}
          <code className="bg-gray-100 px-1 rounded">variant="clock"</code> is
          set.
        </p>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockContainerClassName
                </td>
                <td className="py-2 text-gray-600">
                  Container for the clock popup
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockDisplayClassName
                </td>
                <td className="py-2 text-gray-600">
                  Hours:minutes display area
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockDisplayHoursClassName
                </td>
                <td className="py-2 text-gray-600">Hours button styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockDisplayMinutesClassName
                </td>
                <td className="py-2 text-gray-600">Minutes button styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockDisplayActiveClassName
                </td>
                <td className="py-2 text-gray-600">
                  Active state for hours/minutes
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockDisplaySeparatorClassName
                </td>
                <td className="py-2 text-gray-600">Colon separator styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockFaceClassName
                </td>
                <td className="py-2 text-gray-600">
                  Circular clock face container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockHandClassName
                </td>
                <td className="py-2 text-gray-600">Clock hand container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockHandLineClassName
                </td>
                <td className="py-2 text-gray-600">Hand line (from center)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockHandDotClassName
                </td>
                <td className="py-2 text-gray-600">Dot at end of hand</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockCenterClassName
                </td>
                <td className="py-2 text-gray-600">Center point of clock</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockNumberClassName
                </td>
                <td className="py-2 text-gray-600">Clock number styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockNumberSelectedClassName
                </td>
                <td className="py-2 text-gray-600">Selected number styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockNumberInnerClassName
                </td>
                <td className="py-2 text-gray-600">Inner ring numbers (24h)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockActionsClassName
                </td>
                <td className="py-2 text-gray-600">
                  Cancel/OK button container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockCancelButtonClassName
                </td>
                <td className="py-2 text-gray-600">Cancel button styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockOkButtonClassName
                </td>
                <td className="py-2 text-gray-600">OK button styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockPeriodToggleClassName
                </td>
                <td className="py-2 text-gray-600">
                  AM/PM toggle container (12h)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockPeriodButtonClassName
                </td>
                <td className="py-2 text-gray-600">AM/PM button styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clockPeriodActiveClassName
                </td>
                <td className="py-2 text-gray-600">
                  Active period button styling
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default TimePickerDemo;
