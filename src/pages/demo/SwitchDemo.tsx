import type { SwitchClasses } from "../../components/Switch/index.js";
import {
  useState,
  useRef } from "react";
import { Switch } from "../../components/Switch/index.js";
import { Button } from "../../components/Button/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  ComponentAnatomy,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";
import { FormDemo } from "./components/FormDemo.js";

const getClasses = () => ({
  switch: {
    label: `text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed`,
    description: `text-xs text-cl-text-secondary`,
    thumb:
      "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
  } satisfies SwitchClasses,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer`,
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
  const c = getClasses();
  const switchRef = useRef<HTMLButtonElement>(null);

  const [basicSwitch, setBasicSwitch] = useState(false);
  const [labelSwitch, setLabelSwitch] = useState(true);
  const [descSwitch, setDescSwitch] = useState(false);
  const [iconSwitch, setIconSwitch] = useState(true);
  const [themeSwitch, setThemeSwitch] = useState(false);
  const [colorSwitch, setColorSwitch] = useState(false);
  const [sizeSwitch, setSizeSwitch] = useState(false);
  const [sizeSwitchSmall, setSizeSwitchSmall] = useState(false);
  const [sizeSwitchLarge, setSizeSwitchLarge] = useState(false);
  const [cssVarSwitch, setCssVarSwitch] = useState(false);
  const [animationSwitch, setAnimationSwitch] = useState(false);
  const [animationSwitchBouncy, setAnimationSwitchBouncy] = useState(false);
  const [renderPropsSwitch, setRenderPropsSwitch] = useState(false);
  const [focusBlurSwitch, setFocusBlurSwitch] = useState(false);
  const [focusLog, setFocusLog] = useState<string[]>([]);
  const [formSwitch, setFormSwitch] = useState(false);
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  const [requiredSwitch, setRequiredSwitch] = useState(false);
  const [refSwitch, setRefSwitch] = useState(false);
  const [successSwitch, setSuccessSwitch] = useState(true);
  /* Controlled with no handler before, so neither could be toggled: a switch
     in a section about validation that does not switch. The error state is
     unconditional here — it is what the section shows — and the control is
     live underneath it. */
  const [termsSwitch, setTermsSwitch] = useState(false);
  const [notifySwitch, setNotifySwitch] = useState(true);
  const [callbackSwitch, setCallbackSwitch] = useState(false);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Switch"
        description="A toggle switch for binary on/off states. Fully accessible with WAI-ARIA support, keyboard navigation, form semantics, and customizable via the classes slot system."
        code={`import { Switch } from "@chumlab/ui/switch";`}
      />

      <SetupNote />

      <ComponentAnatomy name="Switch" />

      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-4">
            {}
            <Switch
              label="Email notifications"
              checked={basicSwitch}
              onCheckedChange={setBasicSwitch}
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

      <Section
        title="Uncontrolled Switch"
        description="Use defaultChecked for uncontrolled mode — no state management needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Auto-save"
            defaultChecked
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      <Section
        title="With Label"
        description="The label prop adds an accessible label linked via htmlFor."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Enable notifications"
            checked={labelSwitch}
            onCheckedChange={setLabelSwitch}
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

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
            onCheckedChange={setDescSwitch}
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

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
            onCheckedChange={setRequiredSwitch}
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

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
              onCheckedChange={setIconSwitch}
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
              onCheckedChange={setThemeSwitch}
              checkedIcon={<MoonIcon />}
              uncheckedIcon={<SunIcon />}
              classes={{
                ...c.switch,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Disabled States"
        description="Disable the switch with the disabled prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Location sharing"
              checked={false}
              disabled
              classes={c.switch}
            />
            <Switch
              label="Two-factor authentication"
              checked={true}
              disabled
              classes={c.switch}
            />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Error State"
        description="Use error and errorMessage props to display validation errors."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Accept terms of service"
              checked={termsSwitch}
              onCheckedChange={setTermsSwitch}
              error
              errorMessage="You must accept the terms to continue"
              classes={{
                ...c.switch,
                label: `text-sm font-medium text-cl-error cursor-pointer`,
              }}
            />
            <Switch
              label="Enable notifications"
              checked={notifySwitch}
              onCheckedChange={setNotifySwitch}
              error
              errorMessage="Notification service is currently unavailable"
              classes={c.switch}
            />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Success State"
        description="Display a success message when validation passes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            label="Email notifications"
            checked={successSwitch}
            onCheckedChange={setSuccessSwitch}
            success={successSwitch}
            successMessage="Notifications are enabled"
            classes={c.switch}
          />
        </DemoWrapper>
      </Section>

      <Section
        title="Loading State"
        description="Display a loading indicator while an async action is pending."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-4">
            <Switch label="Sync" loading checked classes={c.switch} />
            {/* The comparison: an idle switch toggles; the one above, loading, does not. */}
            <Switch label="Backups" defaultChecked classes={c.switch} />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="onCheckedChange Callback"
        description="Primary event handler for checked state changes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-2">
            <Switch label="Notifications" onCheckedChange={setCallbackSwitch} checked={callbackSwitch} classes={c.switch} />
            <p className={`text-sm text-cl-text-chrome-quiet`} data-demo-action>Value: {String(callbackSwitch)}</p>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Custom Colors"
        description="Override tracker colors via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Notifications"
              checked={colorSwitch}
              onCheckedChange={setColorSwitch}
              classes={{
                ...c.switch,
                label: `text-sm font-medium text-cl-accent cursor-pointer`,
              }}
            />
            <Switch
              label="Auto-save"
              checked={!colorSwitch}
              onCheckedChange={(checked) => setColorSwitch(!checked)}
              classes={{
                ...c.switch,
                label: `text-sm font-medium text-cl-success cursor-pointer`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Custom Sizes"
        description="Override tracker and thumb sizes via classes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Notifications"
              checked={sizeSwitchSmall}
              onCheckedChange={setSizeSwitchSmall}
              classes={{
                ...c.switch,
                label: `text-xs font-medium text-cl-text cursor-pointer`,
                control: `relative inline-flex items-center h-4 w-7 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg`,
                thumb:
                  "inline-flex items-center justify-center transform h-3 w-3 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
              }}
            />
            <Switch
              label="Notifications"
              checked={sizeSwitch}
              onCheckedChange={setSizeSwitch}
              classes={c.switch}
            />
            <Switch
              label="Notifications"
              checked={sizeSwitchLarge}
              onCheckedChange={setSizeSwitchLarge}
              classes={{
                ...c.switch,
                label: `text-base font-medium text-cl-text cursor-pointer`,
                control: `relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg`,
                thumb:
                  "inline-flex items-center justify-center transform h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

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
                label="Notifications"
                checked={cssVarSwitch}
                onCheckedChange={setCssVarSwitch}
                classes={{
                  ...c.switch,
                  label: `text-sm font-medium text-cl-accent cursor-pointer`,
                }}
              />
            </div>
            <div
              style={{
                ["--switch-tracker-checked-bg" as string]: "#047857",
                ["--switch-tracker-unchecked-bg" as string]: "#d1fae5",
                ["--switch-focus-ring" as string]: "#047857",
              }}
            >
              <Switch
                label="Auto-save"
                checked={!cssVarSwitch}
                onCheckedChange={(checked) => setCssVarSwitch(!checked)}
                classes={{
                  ...c.switch,
                  label: `text-sm font-medium text-cl-success cursor-pointer`,
                }}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Custom Animation Timing"
        description="Use transitionDuration and transitionTimingFunction for custom animations."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-4">
            <Switch
              label="Notifications"
              checked={animationSwitch}
              onCheckedChange={setAnimationSwitch}
              animationDuration={500}
              transitionTimingFunction="ease-in-out"
              classes={c.switch}
            />
            <Switch
              label="Auto-save"
              checked={animationSwitchBouncy}
              onCheckedChange={setAnimationSwitchBouncy}
              animationDuration={300}
              transitionTimingFunction="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
              classes={c.switch}
            />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Render Props"
        description="Use renderLabel and renderDescription for dynamic content based on switch state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Switch
            checked={renderPropsSwitch}
            onCheckedChange={setRenderPropsSwitch}
            aria-label="Toggle feature status"
            renderLabel={({ checked }) => (
              <span
                className={`font-bold ${checked ? ("text-cl-success") : "text-cl-error"}`}
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
              label="Notifications"
              checked={focusBlurSwitch}
              onCheckedChange={setFocusBlurSwitch}
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
              className={`p-3 rounded-cl-md text-sm font-mono bg-cl-bg-recessed text-cl-text-chrome`}
            >
              <p
                className={`text-xs mb-2 text-cl-text-secondary`}
              >
                Event Log:
              </p>
              {focusLog.length === 0 ? (
                <span className={"text-cl-text-tertiary"}>
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
              setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
            }}
          >
            <Switch
              id="notifications-switch"
              name="notifications"
              label="Enable notifications"
              checked={formSwitch}
              onCheckedChange={setFormSwitch}
              classes={c.switch}
            />
            <Button type="submit" className={c.btnPrimary}>
              Submit Form
            </Button>
            <div className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
              onSubmit: {formSubmit}
            </div>
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
              label="Notifications"
              checked={refSwitch}
              onCheckedChange={setRefSwitch}
              classes={c.switch}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => switchRef.current?.focus()}
                className="rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
              >
                Focus Switch
              </Button>
              <Button
                size="sm"
                onClick={() => switchRef.current?.click()}
                className="rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
              >
                Toggle Switch
              </Button>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── In a form ───────────────────────────────────────────────────── */}
      <Section
        title="In a form"
        description="A real form: the field with name and required, Submit and Reset, and the FormData the browser built, read back."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <FormDemo onEmpty="Submit with the switch off: a required switch must be on, like a required checkbox, so the submit is blocked and focus moves to the switch.">
            <Switch name="terms" label="Accept the terms" required />
          </FormDemo>
        </DemoWrapper>
      </Section>

      {/* ─── Long labels ─────────────────────────────────────────────────── */}
      <Section
        title="Long labels"
        description="The label wraps beside the track, and the track keeps its 36 px width, here and on a 360 px screen."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full max-w-sm space-y-3">
            <Switch label="Pause all notifications outside working hours, including mentions and direct messages" />
          </div>
        </DemoWrapper>
      </Section>

      <ComponentDocs name="Switch" />

      {/* ── Accessibility ──────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `checked` with `onCheckedChange` for controlled mode, or `defaultChecked` for uncontrolled. Keep boolean state in the parent for forms and analytics."
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

      <CopyPasteBlock name="Switch" />
    </div>
  );
};

export default SwitchDemo;
