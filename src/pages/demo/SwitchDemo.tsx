import { useState, useRef } from "react";
import { Switch } from "../../components/Switch";
import { useTheme } from "./ThemeContext";
import {
  DocsHero,
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

const getClasses = (dark: boolean) => ({
  switch: {
    label: `text-sm font-medium text-cl-text cursor-pointer`,
    disabledLabel: `text-cl-text-tertiary cursor-not-allowed`,
    description: `text-xs text-cl-text-secondary`,
    tracker: `relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer focus-visible:ring-cl-accent dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg`,
    disabledTracker: "opacity-50 cursor-not-allowed",
    thumb:
      "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
    checkedTracker: dark ? "bg-cl-accent" : "bg-cl-accent",
    uncheckedTracker: dark ? "bg-cl-text/10" : "bg-cl-bg-hover",
    checkedThumb: "translate-x-4.5",
    uncheckedThumb: "translate-x-0.5",
    error: `text-sm mt-2 text-cl-error`,
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const CheckIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-cl-accent"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-cl-text-tertiary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-cl-warning"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-cl-accent"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      clipRule="evenodd"
    />
  </svg>
);

const SwitchDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const switchRef = useRef<HTMLButtonElement>(null);

  const [basicSwitch, setBasicSwitch] = useState(false);
  const [labelSwitch, setLabelSwitch] = useState(true);
  const [descSwitch, setDescSwitch] = useState(false);
  const [iconSwitch, setIconSwitch] = useState(true);
  const [themeSwitch, setThemeSwitch] = useState(false);
  const [colorSwitch, setColorSwitch] = useState(false);
  const [sizeSwitch, setSizeSwitch] = useState(false);
  const [cssVarSwitch, setCssVarSwitch] = useState(false);
  const [animationSwitch, setAnimationSwitch] = useState(false);
  const [renderPropsSwitch, setRenderPropsSwitch] = useState(false);
  const [focusBlurSwitch, setFocusBlurSwitch] = useState(false);
  const [focusLog, setFocusLog] = useState<string[]>([]);
  const [formSwitch, setFormSwitch] = useState(false);
  const [requiredSwitch, setRequiredSwitch] = useState(false);
  const [refSwitch, setRefSwitch] = useState(false);
  const [successSwitch, setSuccessSwitch] = useState(true);
  const [callbackSwitch, setCallbackSwitch] = useState(false);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Switch"
        description="A toggle switch for binary on/off states. Fully accessible with WAI-ARIA support, keyboard navigation, form semantics, and customizable via the classes slot system."
        code={`import { Switch } from "@chumlab/ui/switch";`}
      />

      {/* ── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-4">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <Switch
              label="Email notifications"
              checked={basicSwitch}
              onValueChange={setBasicSwitch}
            />
            <Switch
              label="Dark mode"
              defaultChecked
            />
            <Switch
              label="Maintenance mode"
              disabled
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Uncontrolled ───────────────────────────────────────────────── */}
      <Section
        title="Uncontrolled Switch"
        description="Use defaultChecked for uncontrolled mode — no state management needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Uncontrolled switch"
            defaultChecked
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      {/* ── With Label ─────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="The label prop adds an accessible label linked via htmlFor."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Enable notifications"
            checked={labelSwitch}
            onValueChange={setLabelSwitch}
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      {/* ── With Label and Description ─────────────────────────────────── */}
      <Section
        title="With Label and Description"
        description="Add additional context using the description prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Dark mode"
            description="Enable dark theme for the application"
            checked={descSwitch}
            onValueChange={setDescSwitch}
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      {/* ── Required ───────────────────────────────────────────────────── */}
      <Section
        title="Required"
        description="The required prop adds aria-required and shows an asterisk after the label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Accept terms of service"
            required
            checked={requiredSwitch}
            onValueChange={setRequiredSwitch}
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      {/* ── With Icons ─────────────────────────────────────────────────── */}
      <Section
        title="With Icons"
        description="Add icons inside the thumb using checkedIcon and uncheckedIcon."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Feature enabled"
              checked={iconSwitch}
              onValueChange={setIconSwitch}
              checkedIcon={<CheckIcon />}
              uncheckedIcon={<CrossIcon />}
              classes={c.switch}
            />
            <Switch
              label="Theme"
              description={
                themeSwitch ? "Dark mode enabled" : "Light mode enabled"
              }
              checked={themeSwitch}
              onValueChange={setThemeSwitch}
              checkedIcon={<MoonIcon />}
              uncheckedIcon={<SunIcon />}
              classes={{
                ...c.switch,
                checkedTracker: dark ? "bg-cl-accent" : "bg-cl-accent",
                uncheckedTracker: dark ? "bg-cl-warning" : "bg-cl-warning/30",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Disabled States ────────────────────────────────────────────── */}
      <Section
        title="Disabled States"
        description="Disable the switch with the disabled prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Disabled (off)"
              checked={false}
              disabled
              classes={c.switch}
            />
            <Switch
              label="Disabled (on)"
              checked={true}
              disabled
              classes={c.switch}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Error State ────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Use error and errorMessage props to display validation errors."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Accept terms of service"
              checked={false}
              error
              errorMessage="You must accept the terms to continue"
              classes={{
                ...c.switch,
                label: `text-sm font-medium text-cl-error dark:text-cl-error cursor-pointer`,
                uncheckedTracker: dark ? "bg-cl-error/20" : "bg-cl-error/15",
              }}
            />
            <Switch
              label="Enable notifications"
              checked={true}
              error
              errorMessage="Notification service is currently unavailable"
              classes={c.switch}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Success State ────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Display a success message when validation passes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Email notifications"
            checked={successSwitch}
            onValueChange={setSuccessSwitch}
            success={successSwitch}
            successMessage="Notifications are enabled"
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      {/* ── Loading State ────────────────────────────────────────────── */}
      <Section
        title="Loading State"
        description="Display a loading indicator while an async action is pending."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-4">
            <Switch label="Sync in progress" loading checked classes={c.switch} />
            <Switch label="Not loading" checked classes={c.switch} />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── onValueChange Callback ───────────────────────────────────── */}
      <Section
        title="onValueChange Callback"
        description="Primary event handler for checked state changes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-2">
            <Switch label="Using onValueChange" onValueChange={setCallbackSwitch} checked={callbackSwitch} classes={c.switch} />
            <p className={`text-sm text-cl-text-secondary dark:text-cl-text-tertiary`}>Value: {String(callbackSwitch)}</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Custom Colors ──────────────────────────────────────────────── */}
      <Section
        title="Custom Colors"
        description="Override tracker colors via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Purple theme"
              checked={colorSwitch}
              onValueChange={setColorSwitch}
              classes={{
                ...c.switch,
                label: `text-sm font-medium text-cl-accent cursor-pointer`,
                checkedTracker: dark ? "bg-cl-accent" : "bg-cl-accent",
                uncheckedTracker: dark ? "bg-cl-accent/20" : "bg-cl-accent/10",
              }}
            />
            <Switch
              label="Green theme"
              checked={!colorSwitch}
              onValueChange={(checked) => setColorSwitch(!checked)}
              classes={{
                ...c.switch,
                label: `text-sm font-medium text-cl-success cursor-pointer`,
                checkedTracker: dark ? "bg-cl-success" : "bg-cl-success",
                uncheckedTracker: dark ? "bg-cl-success/20" : "bg-cl-success/15",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Custom Sizes ───────────────────────────────────────────────── */}
      <Section
        title="Custom Sizes"
        description="Override tracker and thumb sizes via classes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Small switch"
              checked={sizeSwitch}
              onValueChange={setSizeSwitch}
              classes={{
                ...c.switch,
                label: `text-xs font-medium text-cl-text cursor-pointer`,
                tracker: `relative inline-flex items-center h-4 w-7 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer focus-visible:ring-cl-accent dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg`,
                thumb:
                  "inline-flex items-center justify-center transform h-3 w-3 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
                checkedThumb: "translate-x-3.5",
                uncheckedThumb: "translate-x-0.5",
              }}
            />
            <Switch
              label="Default switch"
              checked={sizeSwitch}
              onValueChange={setSizeSwitch}
              classes={c.switch}
            />
            <Switch
              label="Large switch"
              checked={sizeSwitch}
              onValueChange={setSizeSwitch}
              classes={{
                ...c.switch,
                label: `text-base font-medium text-cl-text cursor-pointer`,
                tracker: `relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer focus-visible:ring-cl-accent dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg`,
                thumb:
                  "inline-flex items-center justify-center transform h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
                checkedThumb: "translate-x-6",
                uncheckedThumb: "translate-x-1",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── CSS Custom Properties ──────────────────────────────────────── */}
      <Section
        title="CSS Custom Properties (Theming)"
        description="Use CSS custom properties to theme switches globally or per-instance."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <div
              style={{
                ["--switch-tracker-checked-bg" as string]: "#7c3aed",
                ["--switch-tracker-unchecked-bg" as string]: "#ddd6fe",
                ["--switch-focus-ring" as string]: "#7c3aed",
              }}
            >
              <Switch
                label="Purple theme via CSS vars"
                checked={cssVarSwitch}
                onValueChange={setCssVarSwitch}
                classes={{
                  ...c.switch,
                  label: `text-sm font-medium text-cl-accent cursor-pointer`,
                  checkedTracker: undefined,
                  uncheckedTracker: undefined,
                }}
              />
            </div>
            <div
              style={{
                ["--switch-tracker-checked-bg" as string]: "#059669",
                ["--switch-tracker-unchecked-bg" as string]: "#d1fae5",
                ["--switch-focus-ring" as string]: "#059669",
              }}
            >
              <Switch
                label="Green theme via CSS vars"
                checked={!cssVarSwitch}
                onValueChange={(checked) => setCssVarSwitch(!checked)}
                classes={{
                  ...c.switch,
                  label: `text-sm font-medium text-cl-success cursor-pointer`,
                  checkedTracker: undefined,
                  uncheckedTracker: undefined,
                }}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Custom Animation ───────────────────────────────────────────── */}
      <Section
        title="Custom Animation Timing"
        description="Use transitionDuration and transitionTimingFunction for custom animations."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Slow transition (500ms)"
              checked={animationSwitch}
              onValueChange={setAnimationSwitch}
              transitionDuration={500}
              transitionTimingFunction="ease-in-out"
              classes={c.switch}
            />
            <Switch
              label="Bouncy transition"
              checked={animationSwitch}
              onValueChange={setAnimationSwitch}
              transitionDuration={300}
              transitionTimingFunction="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
              classes={c.switch}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Render Props ───────────────────────────────────────────────── */}
      <Section
        title="Render Props"
        description="Use renderLabel and renderDescription for dynamic content based on switch state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            checked={renderPropsSwitch}
            onValueChange={setRenderPropsSwitch}
            aria-label="Toggle feature status"
            renderLabel={({ checked }) => (
              <span
                className={`font-bold ${checked ? (dark ? "text-cl-success" : "text-cl-success") : dark ? "text-cl-error" : "text-cl-error"}`}
              >
                {checked ? "Active" : "Inactive"}
              </span>
            )}
            renderDescription={({ checked }) => (
              <span
                className={`text-xs italic text-cl-text-secondary`}
              >
                Status: {checked ? "Feature is enabled" : "Feature is disabled"}
              </span>
            )}
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      {/* ── Focus and Blur Events ──────────────────────────────────────── */}
      <Section
        title="Focus and Blur Events"
        description="Native button events are forwarded via the spread operator."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Focus me to see events"
              checked={focusBlurSwitch}
              onValueChange={setFocusBlurSwitch}
              onFocus={() =>
                setFocusLog((prev) => [
                  ...prev.slice(-4),
                  `Focus: ${new Date().toLocaleTimeString()}`,
                ])
              }
              onBlur={() =>
                setFocusLog((prev) => [
                  ...prev.slice(-4),
                  `Blur: ${new Date().toLocaleTimeString()}`,
                ])
              }
              classes={c.switch}
            />
            <div
              className={`p-3 rounded-cl-md text-sm font-mono bg-cl-bg-hover text-cl-text dark:bg-cl-bg dark:text-cl-text-secondary`}
            >
              <p
                className={`text-xs mb-2 text-cl-text-secondary`}
              >
                Event Log:
              </p>
              {focusLog.length === 0 ? (
                <span className={dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary"}>
                  Focus or blur the switch to see events...
                </span>
              ) : (
                focusLog.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Form Semantics ─────────────────────────────────────────────── */}
      <Section
        title="Form Semantics"
        description="Use name and value props for HTML form integration. A hidden input is automatically rendered."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              alert(
                `Form data: notifications=${formData.get("notifications")}`,
              );
            }}
          >
            <Switch
              id="notifications-switch"
              name="notifications"
              label="Enable notifications"
              checked={formSwitch}
              onValueChange={setFormSwitch}
              classes={c.switch}
            />
            <button type="submit" className={c.btnPrimary}>
              Submit Form
            </button>
          </form>
        </DemoWrapper>
      </Section>

      {/* ── Ref Forwarding ─────────────────────────────────────────────── */}
      <Section
        title="Ref Forwarding"
        description="Access the underlying button element using React refs."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              ref={switchRef}
              label="Click the buttons below to control me"
              checked={refSwitch}
              onValueChange={setRefSwitch}
              classes={c.switch}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => switchRef.current?.focus()}
                className={c.btn}
              >
                Focus Switch
              </button>
              <button
                type="button"
                onClick={() => switchRef.current?.click()}
                className={c.btn}
              >
                Toggle Switch
              </button>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Data Attributes ────────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-checked"
              type="root, button"
              description="Present when checked"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="root, button"
              description="Present when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="root"
              description="Present when error=true"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── API Reference ──────────────────────────────────────────────── */}
      <Section title="API Reference" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
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
              name="onValueChange"
              type="(checked: boolean) => void"
              description="Callback when checked state changes"
              isDarkMode={dark}
            />
            <PropRow
              name="onCheckedChange"
              type="(checked: boolean) => void"
              description="Deprecated — use onValueChange instead"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="ReactNode"
              description="Label text for the switch"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="ReactNode"
              description="Description text below the label"
              isDarkMode={dark}
            />
            <PropRow
              name="name"
              type="string"
              description="Form field name (renders hidden input)"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="string"
              defaultVal='"on"'
              description="Value submitted with form when checked"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              description="Custom ID (auto-generated if omitted)"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Whether the switch is disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="required"
              type="boolean"
              defaultVal="false"
              description="Sets aria-required, shows asterisk on label"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="boolean"
              defaultVal="false"
              description="Whether the switch is in error state"
              isDarkMode={dark}
            />
            <PropRow
              name="errorMessage"
              type="ReactNode"
              description="Error message displayed below the switch"
              isDarkMode={dark}
            />
            <PropRow
              name="checkedIcon"
              type="ReactNode"
              description="Icon inside the thumb when checked"
              isDarkMode={dark}
            />
            <PropRow
              name="uncheckedIcon"
              type="ReactNode"
              description="Icon inside the thumb when unchecked"
              isDarkMode={dark}
            />
            <PropRow
              name="transitionDuration"
              type="number"
              description="Custom transition duration in ms"
              isDarkMode={dark}
            />
            <PropRow
              name="transitionTimingFunction"
              type="string"
              description="Custom CSS timing function"
              isDarkMode={dark}
            />
            <PropRow
              name="renderLabel"
              type="(props: SwitchRenderProps) => ReactNode"
              description="Render function for custom label content"
              isDarkMode={dark}
            />
            <PropRow
              name="renderDescription"
              type="(props: SwitchRenderProps) => ReactNode"
              description="Render function for custom description"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="SwitchClasses"
              description="Class overrides for all internal elements"
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
              name="className"
              type="string"
              description="Additional class merged onto root container"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── SwitchClasses ──────────────────────────────────────────────── */}
      <Section title="SwitchClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Outer container div"
              isDarkMode={dark}
            />
            <PropRow
              name="innerRow"
              type="string"
              description="Inner flex row (label + button)"
              isDarkMode={dark}
            />
            <PropRow
              name="labelContainer"
              type="string"
              description="Wrapper around label + description"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Label element"
              isDarkMode={dark}
            />
            <PropRow
              name="disabledLabel"
              type="string"
              description="Merged onto label when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="string"
              description="Description span element"
              isDarkMode={dark}
            />
            <PropRow
              name="tracker"
              type="string"
              description="Track/slider button element"
              isDarkMode={dark}
            />
            <PropRow
              name="disabledTracker"
              type="string"
              description="Merged onto tracker when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="checkedTracker"
              type="string"
              description="Merged onto tracker when checked"
              isDarkMode={dark}
            />
            <PropRow
              name="uncheckedTracker"
              type="string"
              description="Merged onto tracker when unchecked"
              isDarkMode={dark}
            />
            <PropRow
              name="thumb"
              type="string"
              description="Thumb (handle) span element"
              isDarkMode={dark}
            />
            <PropRow
              name="checkedThumb"
              type="string"
              description="Merged onto thumb when checked"
              isDarkMode={dark}
            />
            <PropRow
              name="uncheckedThumb"
              type="string"
              description="Merged onto thumb when unchecked"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="string"
              description="Error message div"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── Accessibility ──────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              'Uses native role="switch" for proper screen reader announcement',
              "aria-checked reflects the current state",
              "Label automatically associated with switch via htmlFor",
              "Description text linked via aria-describedby",
              "Provide `label` or `aria-label` / `aria-labelledby` for standalone switches",
              "Hidden input for form submission when name prop is provided",
              "Supports both controlled and uncontrolled modes",
              "Respects prefers-reduced-motion via motion-reduce:transition-none",
              "Supports ref forwarding for programmatic focus management",
              "Accepts all standard HTML button attributes (except onClick, role, aria-checked, type, id)",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 text-cl-success`}
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
            className={`text-xs font-semibold mb-3 text-cl-text-secondary`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              ["Tab", "Move focus to/from switch"],
              ["Space", "Toggle switch state"],
              ["Enter", "Toggle switch state"],
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
        summary="Use `checked` with `onValueChange` for controlled mode, or `defaultChecked` for uncontrolled. Keep boolean state in the parent for forms and analytics."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Async saves should disable the switch or show loading to prevent conflicting toggles.",
          "Server truth may disagree with optimistic UI—reconcile on error.",
          "Screen readers announce role and state; test with real SR + label pairings.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Pair every switch with a visible label or `aria-label`.",
          "Use for binary settings; prefer explicit Save when changes are destructive.",
          "Reflect validation with `error` and `errorMessage` like other fields.",
        ]}
        donts={[
          "Do not use a switch for navigation or opening URLs.",
          "Do not nest multiple switches without clear grouping.",
          "Do not omit focus styles when customizing.",
        ]}
      />
    </div>
  );
};

export default SwitchDemo;
