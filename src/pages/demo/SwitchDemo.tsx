import { useState, useRef } from "react";
import { Switch } from "../../components/Switch";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";

const CheckIcon = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <svg
    className={`w-2.5 h-2.5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <svg
    className={`w-2.5 h-2.5 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}
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
    className="w-2.5 h-2.5 text-amber-500"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-indigo-400"
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
  const { isDarkMode } = useTheme();
  const switchRef = useRef<HTMLButtonElement>(null);

  const [basicSwitch, setBasicSwitch] = useState(false);
  const [labelSwitch, setLabelSwitch] = useState(true);
  const [descSwitch, setDescSwitch] = useState(false);
  const [iconSwitch, setIconSwitch] = useState(true);
  const [customSwitch, setCustomSwitch] = useState(false);
  const [themeSwitch, setThemeSwitch] = useState(false);
  const [animationSwitch, setAnimationSwitch] = useState(false);
  const [renderPropsSwitch, setRenderPropsSwitch] = useState(false);
  const [focusBlurSwitch, setFocusBlurSwitch] = useState(false);
  const [focusLog, setFocusLog] = useState<string[]>([]);

  const getClassNames = () => ({
    label: `text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`,
    disabledLabel: isDarkMode ? "text-gray-400" : "text-gray-400",
    description: `text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
    tracker: `h-5 w-9 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      isDarkMode
        ? "focus:ring-blue-400 focus:ring-offset-gray-900"
        : "focus:ring-blue-500"
    }`,
    disabledTracker: "opacity-50",
    thumb:
      "h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
    checkedTracker: isDarkMode ? "bg-blue-500" : "bg-blue-600",
    uncheckedTracker: isDarkMode ? "bg-gray-600" : "bg-gray-300",
    checkedThumb: "translate-x-4.5",
    uncheckedThumb: "translate-x-0.5",
  });

  const classes = getClassNames();

  return (
    <div className="space-y-16">
      <header>
        <h1
          className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Switch
        </h1>
        <p
          className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          A toggle switch component for binary on/off states. Fully accessible
          with WAI-ARIA support, keyboard navigation, form semantics, and
          customizable styling through className props.
        </p>

        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { Switch } from "@kern-ui/switch";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Examples
        </h2>

        <Section
          title="Basic Switch"
          description="A simple switch with no label. Use aria-label for accessibility when no visible label is provided."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Switch
              aria-label="Toggle feature"
              checked={basicSwitch}
              onCheckedChange={setBasicSwitch}
              trackerClassName={classes.tracker}
              thumbClassName={classes.thumb}
              checkedTrackerClassName={classes.checkedTracker}
              uncheckedTrackerClassName={classes.uncheckedTracker}
              checkedThumbClassName={classes.checkedThumb}
              uncheckedThumbClassName={classes.uncheckedThumb}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Uncontrolled Switch"
          description="Use defaultChecked for uncontrolled mode - no state management needed."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Switch
              label="Uncontrolled switch"
              defaultChecked={true}
              labelClassName={classes.label}
              trackerClassName={classes.tracker}
              thumbClassName={classes.thumb}
              checkedTrackerClassName={classes.checkedTracker}
              uncheckedTrackerClassName={classes.uncheckedTracker}
              checkedThumbClassName={classes.checkedThumb}
              uncheckedThumbClassName={classes.uncheckedThumb}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="With Label"
          description="Use the label prop to add an accessible label next to the switch."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Switch
              label="Enable notifications"
              checked={labelSwitch}
              onCheckedChange={setLabelSwitch}
              labelClassName={classes.label}
              trackerClassName={classes.tracker}
              thumbClassName={classes.thumb}
              checkedTrackerClassName={classes.checkedTracker}
              uncheckedTrackerClassName={classes.uncheckedTracker}
              checkedThumbClassName={classes.checkedThumb}
              uncheckedThumbClassName={classes.uncheckedThumb}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="With Label and Description"
          description="Add additional context using the description prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Switch
              label="Dark mode"
              description="Enable dark theme for the application"
              checked={descSwitch}
              onCheckedChange={setDescSwitch}
              containerClassName="gap-4"
              labelClassName={classes.label}
              descriptionClassName={classes.description}
              trackerClassName={classes.tracker}
              thumbClassName={classes.thumb}
              checkedTrackerClassName={classes.checkedTracker}
              uncheckedTrackerClassName={classes.uncheckedTracker}
              checkedThumbClassName={classes.checkedThumb}
              uncheckedThumbClassName={classes.uncheckedThumb}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="With Icons"
          description="Add icons inside the thumb using checkedIcon and uncheckedIcon props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                label="Feature enabled"
                checked={iconSwitch}
                onCheckedChange={setIconSwitch}
                checkedIcon={<CheckIcon isDarkMode={isDarkMode} />}
                uncheckedIcon={<CrossIcon isDarkMode={isDarkMode} />}
                labelClassName={classes.label}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
              <Switch
                label="Theme"
                description={
                  themeSwitch ? "Dark mode enabled" : "Light mode enabled"
                }
                checked={themeSwitch}
                onCheckedChange={setThemeSwitch}
                checkedIcon={<MoonIcon />}
                uncheckedIcon={<SunIcon />}
                labelClassName={classes.label}
                descriptionClassName={classes.description}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={
                  isDarkMode ? "bg-indigo-500" : "bg-indigo-600"
                }
                uncheckedTrackerClassName={
                  isDarkMode ? "bg-amber-500" : "bg-amber-400"
                }
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled States"
          description="Disable the switch with the disabled prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                label="Disabled (off)"
                checked={false}
                disabled
                labelClassName={classes.label}
                disabledLabelClassName={classes.disabledLabel}
                trackerClassName={classes.tracker}
                disabledTrackerClassName={classes.disabledTracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
              <Switch
                label="Disabled (on)"
                checked={true}
                disabled
                labelClassName={classes.label}
                disabledLabelClassName={classes.disabledLabel}
                trackerClassName={classes.tracker}
                disabledTrackerClassName={classes.disabledTracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Error State"
          description="Use error and errorMessage props to display validation errors."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                label="Accept terms of service"
                checked={false}
                error
                errorMessage="You must accept the terms to continue"
                labelClassName={`text-sm font-medium ${isDarkMode ? "text-red-400" : "text-red-700"}`}
                trackerClassName={`${classes.tracker} ${isDarkMode ? "ring-red-400" : "ring-red-500"}`}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={isDarkMode ? "bg-red-800" : "bg-red-200"}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
                errorClassName={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
              />
              <Switch
                label="Enable notifications"
                checked={true}
                error
                errorMessage="Notification service is currently unavailable"
                labelClassName={classes.label}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
                errorClassName={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="classes Record (Alternative)"
          description="Use the classes record prop as a cleaner alternative to individual className props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Switch
              label="Using classes record"
              description="All styles via a single classes prop"
              defaultChecked
              classes={{
                root: "",
                labelContainer: "flex flex-col",
                label: `text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`,
                description: `text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
                tracker: `h-6 w-11 rounded-full transition-colors duration-200`,
                checkedTracker: isDarkMode ? "bg-blue-500" : "bg-blue-600",
                uncheckedTracker: isDarkMode ? "bg-gray-600" : "bg-gray-200",
                thumb: `h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200`,
                checkedThumb: "translate-x-5",
                uncheckedThumb: "translate-x-0.5",
              }}
            />
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Switch
  label="Styled via classes"
  classes={{
    tracker: "h-6 w-11 rounded-full",
    checkedTracker: "bg-blue-600",
    uncheckedTracker: "bg-gray-200",
    thumb: "h-5 w-5 rounded-full bg-white shadow",
    checkedThumb: "translate-x-5",
    uncheckedThumb: "translate-x-0.5",
  }}
/>`}
          />
        </Section>

        <Section
          title="Custom Colors"
          description="Customize colors using checkedTrackerClassName and uncheckedTrackerClassName props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                label="Purple theme"
                checked={customSwitch}
                onCheckedChange={setCustomSwitch}
                labelClassName={`text-sm font-medium ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={
                  isDarkMode ? "bg-purple-500" : "bg-purple-600"
                }
                uncheckedTrackerClassName={
                  isDarkMode ? "bg-purple-800" : "bg-purple-200"
                }
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
              <Switch
                label="Green theme"
                checked={!customSwitch}
                onCheckedChange={(checked) => setCustomSwitch(!checked)}
                labelClassName={`text-sm font-medium ${isDarkMode ? "text-green-300" : "text-green-700"}`}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={
                  isDarkMode ? "bg-green-500" : "bg-green-600"
                }
                uncheckedTrackerClassName={
                  isDarkMode ? "bg-green-800" : "bg-green-200"
                }
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Sizes"
          description="Override default sizes using trackerClassName and thumbClassName props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                label="Small switch"
                checked={customSwitch}
                onCheckedChange={setCustomSwitch}
                labelClassName={`text-xs font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                trackerClassName={`h-4 w-7 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? "focus:ring-blue-400 focus:ring-offset-gray-900"
                    : "focus:ring-blue-500"
                }`}
                thumbClassName="h-3 w-3 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName="translate-x-3.5"
                uncheckedThumbClassName="translate-x-0.5"
              />
              <Switch
                label="Large switch"
                checked={customSwitch}
                onCheckedChange={setCustomSwitch}
                labelClassName={`text-base font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                trackerClassName={`h-7 w-12 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? "focus:ring-blue-400 focus:ring-offset-gray-900"
                    : "focus:ring-blue-500"
                }`}
                thumbClassName="h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName="translate-x-6"
                uncheckedThumbClassName="translate-x-1"
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="CSS Custom Properties (Theming)"
          description="Use CSS custom properties to theme switches globally or per-instance via inline styles."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <div
                style={{
                  ["--switch-tracker-checked-bg" as string]: "#7c3aed",
                  ["--switch-tracker-unchecked-bg" as string]: "#ddd6fe",
                  ["--switch-thumb-bg" as string]: "#fff",
                  ["--switch-focus-ring" as string]: "#7c3aed",
                }}
              >
                <Switch
                  label="Purple theme via CSS vars"
                  checked={customSwitch}
                  onCheckedChange={setCustomSwitch}
                  labelClassName={`text-sm font-medium ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                  trackerClassName={classes.tracker}
                  thumbClassName={classes.thumb}
                  checkedThumbClassName={classes.checkedThumb}
                  uncheckedThumbClassName={classes.uncheckedThumb}
                />
              </div>
              <div
                style={{
                  ["--switch-tracker-checked-bg" as string]: "#059669",
                  ["--switch-tracker-unchecked-bg" as string]: "#d1fae5",
                  ["--switch-thumb-bg" as string]: "#fff",
                  ["--switch-focus-ring" as string]: "#059669",
                }}
              >
                <Switch
                  label="Green theme via CSS vars"
                  checked={!customSwitch}
                  onCheckedChange={(checked) => setCustomSwitch(!checked)}
                  labelClassName={`text-sm font-medium ${isDarkMode ? "text-green-300" : "text-green-700"}`}
                  trackerClassName={classes.tracker}
                  thumbClassName={classes.thumb}
                  checkedThumbClassName={classes.checkedThumb}
                  uncheckedThumbClassName={classes.uncheckedThumb}
                />
              </div>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<div style={{
  "--switch-tracker-checked-bg": "#7c3aed",
  "--switch-tracker-unchecked-bg": "#ddd6fe",
  "--switch-thumb-bg": "#fff",
  "--switch-focus-ring": "#7c3aed",
}}>
  <Switch label="Purple theme" checked={value} onCheckedChange={setValue} />
</div>

Available CSS custom properties:
  --switch-tracker-checked-bg    (default: #2563eb)
  --switch-tracker-unchecked-bg  (default: #d1d5db)
  --switch-thumb-bg              (default: white)
  --switch-focus-ring            (default: #3b82f6)
  --switch-thumb-size            (default: 1rem)
  --switch-tracker-width         (default: 2.25rem)
  --switch-tracker-height        (default: 1.25rem)`}
          />
        </Section>

        <Section
          title="Custom Animation Timing"
          description="Use transitionDuration and transitionTimingFunction props for custom animations."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                label="Slow transition (500ms)"
                checked={animationSwitch}
                onCheckedChange={setAnimationSwitch}
                transitionDuration={500}
                transitionTimingFunction="ease-in-out"
                labelClassName={classes.label}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
              <Switch
                label="Bouncy transition"
                checked={animationSwitch}
                onCheckedChange={setAnimationSwitch}
                transitionDuration={300}
                transitionTimingFunction="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                labelClassName={classes.label}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Render Props"
          description="Use renderLabel and renderDescription for dynamic content based on switch state."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Switch
              checked={renderPropsSwitch}
              onCheckedChange={setRenderPropsSwitch}
              aria-label="Toggle feature status"
              renderLabel={({ checked }) => (
                <span
                  className={`font-bold ${checked ? (isDarkMode ? "text-green-400" : "text-green-600") : isDarkMode ? "text-red-400" : "text-red-600"}`}
                >
                  {checked ? "Active" : "Inactive"}
                </span>
              )}
              renderDescription={({ checked }) => (
                <span
                  className={`text-xs italic ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Status:{" "}
                  {checked ? "Feature is enabled" : "Feature is disabled"}
                </span>
              )}
              trackerClassName={classes.tracker}
              thumbClassName={classes.thumb}
              checkedTrackerClassName={classes.checkedTracker}
              uncheckedTrackerClassName={classes.uncheckedTracker}
              checkedThumbClassName={classes.checkedThumb}
              uncheckedThumbClassName={classes.uncheckedThumb}
            />
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Switch
  checked={isActive}
  onCheckedChange={setIsActive}
  aria-label="Toggle feature status"
  renderLabel={({ checked }) => (
    <span className={checked ? "text-green-600" : "text-red-600"}>
      {checked ? "Active" : "Inactive"}
    </span>
  )}
  renderDescription={({ checked, disabled }) => (
    <span>Status: {checked ? "Enabled" : "Disabled"}</span>
  )}
/>`}
          />
        </Section>

        <Section
          title="Focus and Blur Events"
          description="Native button events are forwarded via the spread operator."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                label="Focus me to see events"
                checked={focusBlurSwitch}
                onCheckedChange={setFocusBlurSwitch}
                onFocus={() => {
                  setFocusLog((prev) => [
                    ...prev.slice(-4),
                    `Focus: ${new Date().toLocaleTimeString()}`,
                  ]);
                }}
                onBlur={() => {
                  setFocusLog((prev) => [
                    ...prev.slice(-4),
                    `Blur: ${new Date().toLocaleTimeString()}`,
                  ]);
                }}
                labelClassName={classes.label}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
              <div
                className={`p-3 rounded-lg text-sm font-mono ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                <p
                  className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Event Log:
                </p>
                {focusLog.length === 0 ? (
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-400"}
                  >
                    Focus or blur the switch to see events...
                  </span>
                ) : (
                  focusLog.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Form Semantics"
          description="Use name and value props for HTML form integration. A hidden input is automatically rendered."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              alert(`Form data: notifications=${formData.get("notifications")}`);
            }}>
              <Switch
                id="notifications-switch"
                name="notifications"
                label="Enable notifications"
                checked={labelSwitch}
                onCheckedChange={setLabelSwitch}
                labelClassName={classes.label}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
              <button
                type="submit"
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Submit Form
              </button>
            </form>
          </DemoWrapper>
        </Section>

        <Section
          title="Ref Forwarding"
          description="Access the underlying button element using React refs."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Switch
                ref={switchRef}
                label="Click the button to focus me"
                checked={basicSwitch}
                onCheckedChange={setBasicSwitch}
                labelClassName={classes.label}
                trackerClassName={classes.tracker}
                thumbClassName={classes.thumb}
                checkedTrackerClassName={classes.checkedTracker}
                uncheckedTrackerClassName={classes.uncheckedTracker}
                checkedThumbClassName={classes.checkedThumb}
                uncheckedThumbClassName={classes.uncheckedThumb}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => switchRef.current?.focus()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Focus Switch
                </button>
                <button
                  type="button"
                  onClick={() => switchRef.current?.click()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Toggle Switch
                </button>
              </div>
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <Section
        title="Data Attributes"
        description="The Switch component applies data attributes for CSS-based styling."
        isDarkMode={isDarkMode}
      >
        <CodeBlock
          isDarkMode={isDarkMode}
          code={`data-disabled="true"   // Container + button: when disabled
data-checked="true"    // Container + button: when checked
data-error="true"      // Container: when in error state`}
        />
      </Section>

      <div className="space-y-8">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          API Reference
        </h2>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Switch Props
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checked</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Controlled checked state</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">defaultChecked</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Initial checked state (uncontrolled)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onCheckedChange</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(checked: boolean) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Callback when checked state changes</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">name</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Form field name (renders hidden input)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">value</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>"on"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Value submitted with form when checked</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Whether the switch is disabled</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">required</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Whether the switch is required (sets aria-required)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">label</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Label text for the switch</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">description</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Description text below the label</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">error</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Whether the switch is in error state</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorMessage</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Error message displayed below the switch</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the error message element</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">id</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Custom ID for the switch (auto-generated if not provided)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the root container element</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checkedIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Icon displayed inside the thumb when checked</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">uncheckedIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Icon displayed inside the thumb when unchecked</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">transitionDuration</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Custom transition duration in milliseconds</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">transitionTimingFunction</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Custom CSS timing function for transitions</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">renderLabel</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(props: SwitchRenderProps) =&gt; ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Render function for custom label content</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">renderDescription</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(props: SwitchRenderProps) =&gt; ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Render function for custom description content</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Styling Props
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">classes</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>SwitchClasses</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Record of class names for all internal elements (root, tracker, thumb, label, etc.)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">containerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the outer container div</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">labelContainerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the label/description container</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">labelClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the label element</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabledLabelClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for label when disabled</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">descriptionClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the description element</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">trackerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the track/slider element</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabledTrackerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for track when disabled</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">thumbClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the thumb (handle) element</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checkedTrackerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for track when checked</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">uncheckedTrackerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for track when unchecked</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checkedThumbClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for thumb when checked</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">uncheckedThumbClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for thumb when unchecked</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSS class for the error message element</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`type SwitchRenderProps = {
  checked: boolean;
  disabled: boolean;
  switchId: string;
  descriptionId?: string;
};`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Accessibility
        </h2>
        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Features
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              Uses native{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="switch"
              </code>{" "}
              for proper screen reader announcement
            </li>
            <li>
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-checked
              </code>{" "}
              reflects the current state
            </li>
            <li>Label is automatically associated with switch via htmlFor</li>
            <li>Description text is linked via aria-describedby</li>
            <li>Hidden input for form submission when name prop is provided</li>
            <li>Supports both controlled and uncontrolled modes</li>
            <li>Respects prefers-reduced-motion media query</li>
            <li>Supports ref forwarding for programmatic focus management</li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Keyboard Navigation
          </h3>
          <ul
            className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Tab
              </kbd>{" "}
              - Move focus to/from switch
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Space
              </kbd>{" "}
              /{" "}
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Enter
              </kbd>{" "}
              - Toggle switch state when focused
            </li>
          </ul>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${isDarkMode ? "border-blue-800 bg-blue-950/30 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
        <p className="text-sm">
          <strong>Note:</strong> The Switch component accepts all standard HTML button attributes (except onClick, role, aria-checked, type, id).
          These are spread onto the underlying button element via the rest operator.
        </p>
      </div>
    </div>
  );
};

export default SwitchDemo;
