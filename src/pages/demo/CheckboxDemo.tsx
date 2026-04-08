import { useState, useRef } from "react";
import { Checkbox } from "../../components/Checkbox";
import { useTheme } from "./ThemeContext";
import {
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Icons ───────────────────────────────────────────────────────────────────

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const EmptyHeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  checkbox: {
    root: "",
    labelContainer: "flex flex-col",
    label: `text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`,
    description: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
    checkbox: `inline-flex items-center justify-center border-2 transition-colors cursor-pointer ${dark ? "focus-within:ring-2 focus-within:ring-indigo-400 focus-within:ring-offset-gray-900" : "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"}`,
    checked: `${dark ? "bg-indigo-500 border-indigo-500" : "bg-indigo-600 border-indigo-600"} text-white`,
    unchecked: `${dark ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"}`,
    indeterminate: `${dark ? "bg-indigo-500 border-indigo-500" : "bg-indigo-600 border-indigo-600"} text-white`,
    icon: "",
    error: `text-xs mt-1 ${dark ? "text-red-400" : "text-red-500"}`,
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const CheckboxDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const [basic, setBasic] = useState(false);
  const [withLabel, setWithLabel] = useState(true);
  const [withDesc, setWithDesc] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [customHeart, setCustomHeart] = useState(false);
  const [customStar, setCustomStar] = useState(true);
  const [errorDemo, setErrorDemo] = useState(false);
  const [successDemo, setSuccessDemo] = useState(true);
  const [onValueChangeDemo, setOnValueChangeDemo] = useState(false);
  const [controlled, setControlled] = useState(false);

  const [sizeXs, setSizeXs] = useState(true);
  const [sizeSm, setSizeSm] = useState(true);
  const [sizeMd, setSizeMd] = useState(true);
  const [sizeLg, setSizeLg] = useState(true);
  const [sizeXl, setSizeXl] = useState(true);

  const [shapeSquare, setShapeSquare] = useState(true);
  const [shapeRounded, setShapeRounded] = useState(true);
  const [shapeCircle, setShapeCircle] = useState(true);

  const [focusLog, setFocusLog] = useState<string[]>([]);

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Checkbox
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A customizable checkbox component with support for labels,
            descriptions, custom icons, indeterminate state, sizes, shapes,
            error handling, and fully accessible via native input.
          </p>
          <div className="mt-5">
            <pre className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>
              <code>{`import { Checkbox } from "@chumlab/ui/checkbox";`}</code>
            </pre>
          </div>
        </div>
      </header>

      {/* ─── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="A simple checkbox with built-in styles. Works out-of-the-box with proper sizing, dark mode, and keyboard support (Space to toggle)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Basic usage — works out-of-the-box with built-in styles */}
          <div className="flex flex-col gap-3">
            <Checkbox
              label="Accept terms and conditions"
              checked={basic}
              onValueChange={setBasic}
            />
            <Checkbox
              label="Subscribe to newsletter"
              description="Get weekly updates about new features"
            />
            <Checkbox
              label="Remember me"
              defaultChecked
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Label ─────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Use the label prop to add an accessible label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="Accept terms and conditions"
            checked={withLabel}
            onValueChange={setWithLabel}
            size="md"
            shape="rounded"
            classes={c.checkbox}
          />
        </DemoWrapper>
      </Section>

      {/* ─── With Description ───────────────────────────────────────────── */}
      <Section
        title="With Label and Description"
        description="Add context using the description prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="Email notifications"
            description="Receive email updates about your account activity"
            checked={withDesc}
            onValueChange={setWithDesc}
            size="md"
            shape="rounded"
            classes={c.checkbox}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Required ───────────────────────────────────────────────────── */}
      <Section
        title="Required"
        description="Shows asterisk and sets aria-required."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="I agree to the privacy policy"
            required
            checked={false}
            size="md"
            shape="rounded"
            classes={c.checkbox}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Indeterminate ──────────────────────────────────────────────── */}
      <Section
        title="Indeterminate State"
        description='Use indeterminate for "select all" scenarios where some items are selected.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="Select all items"
            indeterminate={indeterminate}
            checked={false}
            onValueChange={() => setIndeterminate(!indeterminate)}
            size="md"
            shape="rounded"
            classes={c.checkbox}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Sizes ──────────────────────────────────────────────────────── */}
      <Section
        title="Sizes"
        description="Presets: xs, sm, md, lg, xl, or any custom number."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {[
            { s: "xs" as const, val: sizeXs, set: setSizeXs },
            { s: "sm" as const, val: sizeSm, set: setSizeSm },
            { s: "md" as const, val: sizeMd, set: setSizeMd },
            { s: "lg" as const, val: sizeLg, set: setSizeLg },
            { s: "xl" as const, val: sizeXl, set: setSizeXl },
          ].map(({ s, val, set }) => (
            <div key={s} className="text-center">
              <Checkbox
                aria-label={`Size ${s}`}
                checked={val}
                onValueChange={set}
                size={s}
                shape="rounded"
                classes={c.checkbox}
              />
              <p className={`text-xs mt-2 ${c.label}`}>{s}</p>
            </div>
          ))}
          <div className="text-center">
            <Checkbox
              aria-label="Size 28px"
              checked={true}
              size={28}
              shape="rounded"
              classes={c.checkbox}
            />
            <p className={`text-xs mt-2 ${c.label}`}>28px</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Shapes ─────────────────────────────────────────────────────── */}
      <Section
        title="Shapes"
        description="square, rounded (default), and circle."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {[
            { sh: "square" as const, val: shapeSquare, set: setShapeSquare },
            { sh: "rounded" as const, val: shapeRounded, set: setShapeRounded },
            { sh: "circle" as const, val: shapeCircle, set: setShapeCircle },
          ].map(({ sh, val, set }) => (
            <div key={sh} className="text-center">
              <Checkbox
                aria-label={`Shape ${sh}`}
                checked={val}
                onValueChange={set}
                size="lg"
                shape={sh}
                classes={c.checkbox}
              />
              <p className={`text-xs mt-2 ${c.label}`}>{sh}</p>
            </div>
          ))}
        </DemoWrapper>
      </Section>

      {/* ─── Custom Icons ───────────────────────────────────────────────── */}
      <Section
        title="Custom Icons"
        description="Replace default checkmark with custom icons."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Checkbox
            label="Add to favorites"
            checked={customHeart}
            onValueChange={setCustomHeart}
            checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
            uncheckedIcon={<EmptyHeartIcon className="w-3 h-3 text-gray-400" />}
            size="md"
            shape="rounded"
            classes={{
              ...c.checkbox,
              checked: `${dark ? "bg-red-500 border-red-500" : "bg-red-500 border-red-500"} text-white`,
            }}
          />
          <Checkbox
            label="Star this item"
            checked={customStar}
            onValueChange={setCustomStar}
            checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
            size="md"
            shape="rounded"
            classes={{
              ...c.checkbox,
              checked: `${dark ? "bg-amber-500 border-amber-500" : "bg-amber-500 border-amber-500"} text-white`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Use disabled to prevent interaction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Checkbox
            label="Disabled unchecked"
            disabled
            size="md"
            shape="rounded"
            classes={{
              ...c.checkbox,
              checkbox: `${c.checkbox.checkbox} opacity-50`,
            }}
          />
          <Checkbox
            label="Disabled checked"
            disabled
            checked
            size="md"
            shape="rounded"
            classes={{
              ...c.checkbox,
              checkbox: `${c.checkbox.checkbox} opacity-50`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Error ──────────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Show validation errors with error and errorMessage props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="I accept the terms"
            checked={errorDemo}
            onValueChange={setErrorDemo}
            error={!errorDemo}
            errorMessage={
              !errorDemo ? "You must accept the terms to continue" : undefined
            }
            size="md"
            shape="rounded"
            classes={{
              ...c.checkbox,
              checkbox: `${c.checkbox.checkbox} ${!errorDemo ? (dark ? "border-red-400" : "border-red-500") : ""}`,
              label: !errorDemo
                ? `text-sm font-medium ${dark ? "text-red-400" : "text-red-600"}`
                : c.checkbox.label,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Success State ──────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Display a success message when validation passes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="I agree to the terms"
            checked={successDemo}
            onValueChange={setSuccessDemo}
            success={successDemo}
            successMessage="Terms accepted"
            size="md"
            shape="rounded"
            classes={c.checkbox}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Loading State ───────────────────────────────────────────────── */}
      <Section
        title="Loading State"
        description="Display a loading state while processing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-4">
            <Checkbox
              label="Processing..."
              loading
              checked
              size="md"
              shape="rounded"
              classes={c.checkbox}
            />
            <Checkbox
              label="Normal checkbox"
              checked
              size="md"
              shape="rounded"
              classes={c.checkbox}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── onValueChange Callback ──────────────────────────────────────── */}
      <Section
        title="onValueChange Callback"
        description="Primary event handler for checked state changes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-2">
            <Checkbox
              label="Using onValueChange"
              onValueChange={setOnValueChangeDemo}
              checked={onValueChangeDemo}
              size="md"
              shape="rounded"
              classes={c.checkbox}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              Checked: {String(onValueChangeDemo)}
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled ─────────────────────────────────────────────────── */}
      <Section
        title="Controlled Mode"
        description="External state control via checked + onValueChange."
        isDarkMode={dark}
      >
        <div
          className={`mb-3 p-3 rounded-lg flex items-center gap-3 ${dark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <span
            className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            State:
          </span>
          <span
            className={`text-sm font-mono ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            {String(controlled)}
          </span>
          <button
            className={`ml-auto px-3 py-1 text-xs font-medium rounded-lg ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setControlled(!controlled)}
          >
            Toggle Externally
          </button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="Controlled checkbox"
            checked={controlled}
            onValueChange={setControlled}
            size="md"
            shape="rounded"
            classes={c.checkbox}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Keyboard Navigation ──────────────────────────────────────── */}
      <Section
        title="Keyboard Navigation"
        description="Tab to focus, Space to toggle. Native <input> provides full keyboard support out-of-the-box."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-3">
            <p className={`text-xs mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
              Try: Tab into the checkboxes below, then press Space to toggle them.
            </p>
            <Checkbox
              label="First option"
              defaultChecked
              classes={c.checkbox}
            />
            <Checkbox
              label="Second option"
              classes={c.checkbox}
            />
            <Checkbox
              label="Third option (disabled)"
              disabled
              classes={c.checkbox}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Ref ────────────────────────────────────────────────────────── */}
      <Section
        title="Ref Forwarding"
        description="Access the native input element via ref."
        isDarkMode={dark}
      >
        <div className={`mb-3 flex gap-2`}>
          <button
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => checkboxRef.current?.focus()}
          >
            Focus Checkbox
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => checkboxRef.current?.click()}
          >
            Toggle via ref.click()
          </button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            ref={checkboxRef}
            label="Controlled via ref"
            size="md"
            shape="rounded"
            classes={c.checkbox}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Focus/Blur ─────────────────────────────────────────────────── */}
      <Section
        title="Focus & Blur Events"
        description="onFocus and onBlur callbacks."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Checkbox
            label="Focus me and check the log"
            size="md"
            shape="rounded"
            classes={c.checkbox}
            onFocus={() =>
              setFocusLog((prev) => ["Focused", ...prev.slice(0, 4)])
            }
            onBlur={() =>
              setFocusLog((prev) => ["Blurred", ...prev.slice(0, 4)])
            }
          />
          {focusLog.length > 0 && (
            <div
              className={`mt-3 text-xs font-mono space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              {focusLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled=true to strip all default classes. Provide your own styling via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-3">
            <Checkbox
              label="Custom styled checkbox"
              unstyled
              checked={basic}
              onValueChange={setBasic}
              classes={{
                checkbox: `inline-flex items-center justify-center border-2 rounded cursor-pointer ${dark ? "border-gray-500" : "border-gray-400"}`,
                checked: `${dark ? "bg-violet-500 border-violet-500" : "bg-violet-600 border-violet-600"} text-white`,
                unchecked: `${dark ? "bg-gray-800" : "bg-white"}`,
                label: `text-sm ${dark ? "text-gray-200" : "text-gray-700"}`,
                description: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
              }}
            />
            <Checkbox
              label="Another unstyled variant"
              description="With description text"
              unstyled
              defaultChecked
              classes={{
                checkbox: `inline-flex items-center justify-center border rounded-full cursor-pointer ${dark ? "border-gray-500" : "border-gray-400"}`,
                checked: `${dark ? "bg-teal-500 border-teal-500" : "bg-teal-600 border-teal-600"} text-white`,
                unchecked: `${dark ? "bg-gray-800" : "bg-white"}`,
                label: `text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`,
                description: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
                labelContainer: "flex flex-col",
              }}
              shape="circle"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Classes System ─────────────────────────────────────────────── */}
      <Section
        title="Classes System"
        description="Override any internal element with the classes prop. 10 slots available."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Checkbox
            label="Green theme"
            checked
            classes={{
              ...c.checkbox,
              checked: `${dark ? "bg-emerald-500 border-emerald-500" : "bg-emerald-600 border-emerald-600"} text-white`,
              label: `text-sm font-medium ${dark ? "text-emerald-300" : "text-emerald-700"}`,
            }}
            size="md"
            shape="rounded"
          />
          <Checkbox
            label="Pink theme"
            checked
            classes={{
              ...c.checkbox,
              checked: `${dark ? "bg-pink-500 border-pink-500" : "bg-pink-600 border-pink-600"} text-white`,
              label: `text-sm font-medium ${dark ? "text-pink-300" : "text-pink-700"}`,
            }}
            size="md"
            shape="circle"
          />
        </DemoWrapper>
      </Section>

      {/* ─── Props Tables ───────────────────────────────────────────────── */}
      <Section title="Checkbox Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="label"
              type="ReactNode"
              description="Label text next to checkbox"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="ReactNode"
              description="Helper text below label"
              isDarkMode={dark}
            />
            <PropRow
              name="checked"
              type="boolean"
              description="Controlled checked state"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultChecked"
              type="boolean"
              defaultVal="false"
              description="Initial checked state (uncontrolled)"
              isDarkMode={dark}
            />
            <PropRow
              name="indeterminate"
              type="boolean"
              defaultVal="false"
              description="Indeterminate visual state"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(checked: boolean) => void"
              description="Callback when checked changes"
              isDarkMode={dark}
            />
            <PropRow
              name="onCheckedChange"
              type="(checked: boolean) => void"
              description="Deprecated — use onValueChange instead"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable the checkbox"
              isDarkMode={dark}
            />
            <PropRow
              name="required"
              type="boolean"
              defaultVal="false"
              description="Mark as required (shows * and aria-required)"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="boolean"
              defaultVal="false"
              description="Error state (sets aria-invalid)"
              isDarkMode={dark}
            />
            <PropRow
              name="errorMessage"
              type="ReactNode"
              description="Error text (role=alert, linked via aria-describedby)"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type='"xs"|"sm"|"md"|"lg"|"xl"|number'
              description="Checkbox size"
              isDarkMode={dark}
            />
            <PropRow
              name="shape"
              type='"square"|"rounded"|"circle"'
              description="Checkbox shape"
              isDarkMode={dark}
            />
            <PropRow
              name="checkedIcon"
              type="ReactNode"
              description="Custom checked icon"
              isDarkMode={dark}
            />
            <PropRow
              name="uncheckedIcon"
              type="ReactNode"
              description="Custom unchecked icon"
              isDarkMode={dark}
            />
            <PropRow
              name="indeterminateIcon"
              type="ReactNode"
              description="Custom indeterminate icon"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="CheckboxClasses"
              description="Slot class overrides (10 slots)"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default classes"
              isDarkMode={dark}
            />
            <PropRow
              name="reduceMotion"
              type='boolean|"auto"'
              defaultVal='"auto"'
              description="Disable transition animations"
              isDarkMode={dark}
            />
            <PropRow
              name="onFocus"
              type="(e) => void"
              description="Focus event callback"
              isDarkMode={dark}
            />
            <PropRow
              name="onBlur"
              type="(e) => void"
              description="Blur event callback"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="CheckboxClasses" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root container div"
              isDarkMode={dark}
            />
            <PropRow
              name="labelContainer"
              type="string"
              description="Label + description wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Label text span"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="string"
              description="Description text span"
              isDarkMode={dark}
            />
            <PropRow
              name="checkbox"
              type="string"
              description="Checkbox visual container (always applied)"
              isDarkMode={dark}
            />
            <PropRow
              name="checked"
              type="string"
              description="Applied when checked"
              isDarkMode={dark}
            />
            <PropRow
              name="unchecked"
              type="string"
              description="Applied when unchecked"
              isDarkMode={dark}
            />
            <PropRow
              name="indeterminate"
              type="string"
              description="Applied when indeterminate"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="string"
              description="Icon element class"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="string"
              description="Error message container"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-checked"
              type="root, checkbox span"
              description="Present when checked"
              isDarkMode={dark}
            />
            <PropRow
              name="data-indeterminate"
              type="root, checkbox span"
              description="Present when indeterminate"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="root, checkbox span"
              description="Present when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="root, checkbox span"
              description="Present when error=true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-size"
              type="root"
              description="Size preset string value"
              isDarkMode={dark}
            />
            <PropRow
              name="data-shape"
              type="root"
              description="Shape value"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              'Native <input type="checkbox"> for full browser and screen reader support',
              "Label auto-associated via wrapping <label> element",
              'Required checkboxes set aria-required="true" with visual asterisk',
              "Error state sets aria-invalid and connects error message via aria-describedby",
              'Error messages use role="alert" for screen reader announcements',
              "Description text linked via aria-describedby",
              "Indeterminate state set via DOM property (input.indeterminate)",
              "Provide `label` or `aria-label` / `aria-labelledby` for standalone checkboxes",
              "Ref forwarding via callback ref pattern for programmatic focus",
              "Supports all native input attributes (tabIndex, autoFocus, form, value, etc.)",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              ["Tab", "Move focus to/from checkbox"],
              ["Space", "Toggle checked state"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `checked` with `onValueChange` for controlled mode, or `defaultChecked` for uncontrolled. The indeterminate state is set via the `indeterminate` prop and reflected on the native input."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Indeterminate is visual only for the mixed state—mirror your data model in the parent.",
          "Clicking the label should toggle the box; avoid duplicate handlers on both.",
          "Forms may need explicit `name` / `value` for serialization—test native submit.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Associate `label` or `aria-label` with every standalone checkbox.",
          "Use `description` for helper text that should not be the sole accessible name.",
          "Expose validation with `error` and `errorMessage` consistently with other fields.",
        ]}
        donts={[
          "Do not use checkboxes for mutually exclusive options—use radio or segmented control.",
          "Do not toggle controlled `checked` without updating the source of truth.",
          "Do not rely on color alone for error state.",
        ]}
      />
    </div>
  );
};

export default CheckboxDemo;
