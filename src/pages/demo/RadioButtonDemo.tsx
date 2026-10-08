import type { RadioButtonClasses, RadioGroupClasses } from "../../components/RadioButton/index.js";
import {
  useState } from "react";
import { RadioGroup,
  RadioButton } from "../../components/RadioButton/index.js";
import { Button } from "../../components/Button/index.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";
import { useTheme } from "./ThemeContext.js";

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const EmptyCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const ThumbsUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
  </svg>
);

const getClasses = (_dark: boolean) => ({
  group: {
    root: "",
    label: `text-sm font-medium text-cl-text`,
    description: `text-xs text-cl-text-secondary`,
  } satisfies RadioGroupClasses,
  radio: {
    root: "flex items-center gap-2",
    label: `text-sm font-medium text-cl-text`,
    description: `text-xs text-cl-text-secondary`,
  } satisfies RadioButtonClasses,
  // Outlined variant — border only, no fill
  radioOutlined: {
    root: "flex items-center gap-2",
    label: `text-sm font-medium text-cl-text`,
    description: `text-xs text-cl-text-secondary`,
  } satisfies RadioButtonClasses,
  radioGreen: {
    root: "flex items-center gap-2",
    label: `text-sm font-medium text-cl-text`,
    description: "",
  } satisfies RadioButtonClasses,
  radioAmber: {
    root: "flex items-center gap-2",
    label: `text-sm font-medium text-cl-text`,
    description: "",
  } satisfies RadioButtonClasses,
  radioRose: {
    root: "flex items-center gap-2",
    label: `text-sm font-medium text-cl-text`,
    description: "",
  } satisfies RadioButtonClasses,
  radioPurple: {
    root: "flex items-center gap-2",
    label: `text-sm font-medium text-cl-text`,
    description: "",
  } satisfies RadioButtonClasses,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  sectionLabel: `text-xs font-medium text-cl-text-secondary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const RadioButtonDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [controlled, setControlled] = useState("option-a");

  return (
    <div className="space-y-10">
      <DocsHero
        title="Radio Button"
        description="A customizable radio button group component with support for labels, descriptions, custom icons, sizes, color variants, orientations, error and success states, loading, and fully accessible via native radio inputs."
        code={`import { RadioGroup, RadioButton } from "@chumlab/ui/radio-button";`}
      />

      <SetupNote />

      <CopyPasteBlock name="RadioButton" />

      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {}
          <RadioGroup
            name="basic"
            defaultValue="email"
            label="Notification preference"
            description="Choose how you'd like to receive updates"
          >
            <RadioButton value="email" label="Email" description="Receive updates via email" />
            <RadioButton value="sms" label="SMS" description="Text messages to your phone" />
            <RadioButton value="push" label="Push notifications" description="In-app and browser alerts" />
            <RadioButton value="none" label="None" description="Opt out of all notifications" disabled />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      <Section
        title="With Labels and Descriptions"
        description="Add context using the label and description props on each radio button."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <RadioGroup
            name="with-desc"
            defaultValue="email"
            size="md"
            classes={c.group}
          >
            <RadioButton
              value="email"
              label="Email notifications"
              description="Receive updates via email"
              classes={c.radio}
            />
            <RadioButton
              value="sms"
              label="SMS notifications"
              description="Receive updates via text message"
              classes={c.radio}
            />
            <RadioButton
              value="none"
              label="No notifications"
              description="Opt out of all notifications"
              classes={c.radio}
            />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      <Section
        title="Required"
        description="Shows asterisk on the group label and sets aria-required."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <RadioGroup
            name="required"
            label="Select a plan"
            required
            defaultValue=""
            size="md"
            classes={c.group}
          >
            <RadioButton value="free" label="Free" classes={c.radio} />
            <RadioButton value="pro" label="Pro" classes={c.radio} />
            <RadioButton value="enterprise" label="Enterprise" classes={c.radio} />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      <Section
        title="Horizontal Layout"
        description='Use orientation="horizontal" for inline radio buttons.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <RadioGroup
            name="horizontal"
            defaultValue="left"
            orientation="horizontal"
            size="md"
            classes={c.group}
          >
            <RadioButton value="left" label="Left" classes={c.radio} />
            <RadioButton value="center" label="Center" classes={c.radio} />
            <RadioButton value="right" label="Right" classes={c.radio} />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      <Section
        title="Sizes"
        description="Presets: xs, sm, md, lg, xl. Also supports a custom number."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <div key={s} className="text-center">
              <RadioGroup
                name={`size-${s}`}
                defaultValue="selected"
                size={s}
                classes={c.group}
              >
                <RadioButton value="selected" classes={c.radio} />
              </RadioGroup>
              <p className={`text-xs mt-2 ${c.label}`}>{s}</p>
            </div>
          ))}
          <div className="text-center">
            <RadioGroup
              name="size-custom"
              defaultValue="selected"
              size={28}
              classes={c.group}
            >
              <RadioButton value="selected" classes={c.radio} />
            </RadioGroup>
            <p className={`text-xs mt-2 ${c.label}`}>28px</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Filled vs Outlined ───────────────────────────────────────── */}
      <Section
        title="Filled vs Outlined"
        description="The default style fills the indicator on selection. Use classes to create an outlined variant where only the inner dot and border change."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <span className={c.sectionLabel}>Filled (default)</span>
              <RadioGroup
                name="filled"
                defaultValue="a"
                size="lg"
                classes={c.group}
              >
                <RadioButton value="a" label="Option A" classes={c.radio} />
                <RadioButton value="b" label="Option B" classes={c.radio} />
              </RadioGroup>
            </div>
            <div className="space-y-1.5">
              <span className={c.sectionLabel}>Outlined</span>
              <RadioGroup
                name="outlined"
                defaultValue="a"
                size="lg"
                classes={c.group}
              >
                <RadioButton
                  value="a"
                  label="Option A"
                  classes={c.radioOutlined}
                  checkedIcon={
                    <span
                      style={{ width: 10, height: 10, borderRadius: "50%", display: "block" }}
                      className={dark ? "bg-cl-accent" : "bg-cl-accent"}
                    />
                  }
                />
                <RadioButton
                  value="b"
                  label="Option B"
                  classes={c.radioOutlined}
                  checkedIcon={
                    <span
                      style={{ width: 10, height: 10, borderRadius: "50%", display: "block" }}
                      className={dark ? "bg-cl-accent" : "bg-cl-accent"}
                    />
                  }
                />
              </RadioGroup>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Colors ────────────────────────────────────────────── */}
      <Section
        title="Custom Colors"
        description="Override the checked class to use any color."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="space-y-1.5 text-center">
            <RadioGroup name="color-green" defaultValue="a" size="lg" classes={c.group}>
              <RadioButton value="a" label="Green" classes={c.radioGreen} />
            </RadioGroup>
          </div>
          <div className="space-y-1.5 text-center">
            <RadioGroup name="color-amber" defaultValue="a" size="lg" classes={c.group}>
              <RadioButton value="a" label="Amber" classes={c.radioAmber} />
            </RadioGroup>
          </div>
          <div className="space-y-1.5 text-center">
            <RadioGroup name="color-rose" defaultValue="a" size="lg" classes={c.group}>
              <RadioButton value="a" label="Rose" classes={c.radioRose} />
            </RadioGroup>
          </div>
          <div className="space-y-1.5 text-center">
            <RadioGroup name="color-purple" defaultValue="a" size="lg" classes={c.group}>
              <RadioButton value="a" label="Purple" classes={c.radioPurple} />
            </RadioGroup>
          </div>
          <div className="space-y-1.5 text-center">
            <RadioGroup name="color-default" defaultValue="a" size="lg" classes={c.group}>
              <RadioButton value="a" label="Indigo" classes={c.radio} />
            </RadioGroup>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Icons ─────────────────────────────────────────────── */}
      <Section
        title="Custom Icons"
        description="Replace the default inner dot with custom icons using checkedIcon and uncheckedIcon."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="space-y-4">
            <div>
              <span className={c.sectionLabel}>Checkmark icon</span>
              <RadioGroup
                name="icon-check"
                defaultValue="a"
                size="lg"
                classes={c.group}
              >
                <RadioButton
                  value="a"
                  label="Selected with checkmark"
                  checkedIcon={<CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
                  uncheckedIcon={<EmptyCircleIcon className="w-3.5 h-3.5 text-cl-text-tertiary" />}
                  classes={c.radio}
                />
                <RadioButton
                  value="b"
                  label="Another option"
                  checkedIcon={<CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
                  uncheckedIcon={<EmptyCircleIcon className="w-3.5 h-3.5 text-cl-text-tertiary" />}
                  classes={c.radio}
                />
              </RadioGroup>
            </div>
            <div>
              <span className={c.sectionLabel}>Heart icon with rose color</span>
              <RadioGroup
                name="icon-heart"
                defaultValue="a"
                size="lg"
                classes={c.group}
              >
                <RadioButton
                  value="a"
                  label="Favorite option"
                  checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
                  classes={c.radioRose}
                />
                <RadioButton
                  value="b"
                  label="Alternative"
                  checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
                  classes={c.radioRose}
                />
              </RadioGroup>
            </div>
            <div>
              <span className={c.sectionLabel}>Star icon with amber color</span>
              <RadioGroup
                name="icon-star"
                defaultValue="b"
                size="lg"
                classes={c.group}
              >
                <RadioButton
                  value="a"
                  label="Basic"
                  checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
                  classes={c.radioAmber}
                />
                <RadioButton
                  value="b"
                  label="Premium"
                  checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
                  classes={c.radioAmber}
                />
              </RadioGroup>
            </div>
            <div>
              <span className={c.sectionLabel}>Thumbs up icon with green color</span>
              <RadioGroup
                name="icon-thumb"
                defaultValue="yes"
                size="xl"
                classes={c.group}
                orientation="horizontal"
              >
                <RadioButton
                  value="yes"
                  label="Yes"
                  checkedIcon={<ThumbsUpIcon className="w-4 h-4 text-white" />}
                  classes={c.radioGreen}
                />
                <RadioButton
                  value="maybe"
                  label="Maybe"
                  checkedIcon={<ThumbsUpIcon className="w-4 h-4 text-white" />}
                  classes={c.radioAmber}
                />
                <RadioButton
                  value="no"
                  label="No"
                  checkedIcon={<ThumbsUpIcon className="w-4 h-4 text-white rotate-180" />}
                  classes={c.radioRose}
                />
              </RadioGroup>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Classes System"
        description="Override individual slots (root, label, description, radio, checked, unchecked, icon) for full control."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <span className={c.sectionLabel}>Card-style selection</span>
              <RadioGroup
                name="classes-card"
                defaultValue="monthly"
                size="md"
                classes={c.group}
              >
                {[
                  { value: "monthly", label: "Monthly", desc: "$9/mo" },
                  { value: "yearly", label: "Yearly", desc: "$89/yr — save 17%" },
                ].map((opt) => (
                  <RadioButton
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    description={opt.desc}
                    classes={{
                      root: `flex items-center gap-3 px-4 py-3 rounded-cl-lg border-2 transition-colors border-cl-border hover:border-cl-border-input dark:border dark:border-cl-border dark:hover:border-cl-border`,
                      label: `text-sm font-semibold text-cl-text`,
                      description: `text-xs text-cl-text-secondary`,
                      control: `inline-flex items-center justify-center rounded-full border-2 transition-colors`,
                      itemIndicator: "",
                    }}
                  />
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-1.5">
              <span className={c.sectionLabel}>Minimal / underline</span>
              <RadioGroup
                name="classes-minimal"
                defaultValue="light"
                size="sm"
                classes={c.group}
              >
                {["Light", "Dark", "System"].map((t) => (
                  <RadioButton
                    key={t}
                    value={t.toLowerCase()}
                    label={t}
                    classes={{
                      root: `flex items-center gap-2 pb-2 border-b border-cl-border dark:border dark:border-cl-border`,
                      label: `text-sm text-cl-text-secondary`,
                      description: "",
                      control: `inline-flex items-center justify-center rounded-full border-2 transition-colors`,
                      itemIndicator: "",
                    }}
                  />
                ))}
              </RadioGroup>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Disable the entire group or individual radio buttons."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="space-y-4">
            <div>
              <p className={`text-xs font-medium mb-2 text-cl-text-secondary`}>
                Group disabled
              </p>
              <RadioGroup
                name="disabled-group"
                defaultValue="option-a"
                disabled
                size="md"
                classes={c.group}
              >
                <RadioButton
                  value="option-a"
                  label="Option A"
                  classes={c.radio}
                />
                <RadioButton
                  value="option-b"
                  label="Option B"
                  classes={c.radio}
                />
              </RadioGroup>
            </div>
            <div>
              <p className={`text-xs font-medium mb-2 text-cl-text-secondary`}>
                Individual disabled
              </p>
              <RadioGroup
                name="disabled-individual"
                defaultValue="enabled"
                size="md"
                classes={c.group}
              >
                <RadioButton
                  value="enabled"
                  label="Enabled option"
                  classes={c.radio}
                />
                <RadioButton
                  value="disabled"
                  label="Disabled option"
                  disabled
                  classes={c.radio}
                />
              </RadioGroup>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Error State ────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Show validation errors with error and errorMessage props on the group."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <RadioGroup
            name="error"
            label="Select a role"
            defaultValue=""
            error
            errorMessage="You must select a role to continue"
            size="md"
            classes={c.group}
          >
            <RadioButton value="admin" label="Admin" classes={c.radio} />
            <RadioButton value="editor" label="Editor" classes={c.radio} />
            <RadioButton value="viewer" label="Viewer" classes={c.radio} />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      {/* ─── Success State ──────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Display a success message when validation passes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <RadioGroup
            name="success"
            label="Preferred contact"
            defaultValue="email"
            success
            successMessage="Contact preference saved"
            size="md"
            classes={c.group}
          >
            <RadioButton value="email" label="Email" classes={c.radio} />
            <RadioButton value="phone" label="Phone" classes={c.radio} />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      {/* ─── Loading State ──────────────────────────────────────────────── */}
      <Section
        title="Loading State"
        description="Display a loading state while processing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <RadioGroup
            name="loading"
            defaultValue="option-a"
            loading
            size="md"
            classes={c.group}
          >
            <RadioButton value="option-a" label="Option A" classes={c.radio} />
            <RadioButton value="option-b" label="Option B" classes={c.radio} />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled Mode ────────────────────────────────────────────── */}
      <Section
        title="Controlled Mode"
        description="External state control via value + onValueChange."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div
            className={`w-full mb-3 p-3 rounded-cl-md flex items-center gap-3 bg-cl-bg-elevated`}
          >
            <span
              className={`text-xs font-medium text-cl-text-secondary`}
            >
              Selected:
            </span>
            <span
              className={`text-sm font-mono text-cl-text-secondary`}
            >
              {controlled}
            </span>
            <Button
              size="sm"
              className={`ml-auto rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover`}
              onClick={() =>
                setControlled((prev) =>
                  prev === "option-a"
                    ? "option-b"
                    : prev === "option-b"
                      ? "option-c"
                      : "option-a",
                )
              }
            >
              Cycle Externally
            </Button>
          </div>
          <RadioGroup
            name="controlled"
            value={controlled}
            onValueChange={setControlled}
            size="md"
            classes={c.group}
          >
            <RadioButton value="option-a" label="Option A" classes={c.radio} />
            <RadioButton value="option-b" label="Option B" classes={c.radio} />
            <RadioButton value="option-c" label="Option C" classes={c.radio} />
          </RadioGroup>
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="RadioButton" />

      {/* ─── RadioButton Props Table ─────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` on RadioGroup for controlled mode, or `defaultValue` for uncontrolled. Each RadioButton must have a unique `value` prop."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "RadioButton must always be rendered inside a RadioGroup or it will throw an error.",
          "If no defaultValue or value is provided, no option is selected initially.",
          "Disabled on the group overrides individual RadioButton disabled props (group takes precedence).",
          "Custom icons via checkedIcon/uncheckedIcon fully replace the default inner dot.",
          "Colors are controlled entirely through the `checked` and `unchecked` class slots — there is no built-in `color` prop.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Use radio buttons for mutually exclusive options where only one can be selected.",
          "Provide a group `label` or `aria-label` for accessibility.",
          "Use `description` on individual options to clarify choices.",
          "Use the `classes` system to create outlined, card-style, or color variants.",
          "Use `checkedIcon` to replace the inner dot with a checkmark, star, or any icon.",
        ]}
        donts={[
          "Do not use radio buttons when multiple selections are allowed—use checkboxes instead.",
          "Do not use radio buttons for binary toggles—use a switch or checkbox.",
          "Do not rely on color alone for error state—always include an error message.",
          "Do not mix different color variants in the same radio group without clear purpose.",
        ]}
      />
    </div>
  );
};

export default RadioButtonDemo;
