import type { OtpInputClasses } from "../../components/OtpInput/index.js";
import {
  useState,
  useRef } from "react";
import { OtpInput } from "../../components/OtpInput/index.js";
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
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";

const getClasses = () => ({
  otp: {
    group: "flex items-center gap-2",
    input: `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed data-[error]:border-cl-error data-[valid]:border-cl-success`,
    label: `block text-sm font-medium mb-2 text-cl-text-secondary`,
    separator: `text-lg select-none text-cl-text-tertiary`,
  } satisfies OtpInputClasses,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:bg-cl-bg-hover hover:border-cl-border-input-hover cursor-pointer`,
  btnPrimary:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer",
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const OtpInputDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();
  const otpRef = useRef<HTMLInputElement>(null);

  const [showAutoFocus, setShowAutoFocus] = useState(false);

  const [basic, setBasic] = useState("");
  const [controlled, setControlled] = useState("123");
  const [completed, setCompleted] = useState<string | null>(null);
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  const [grouped, setGrouped] = useState("");
  const [errorVal, setErrorVal] = useState("");
  const [custom, setCustom] = useState("");

  return (
    <div className="space-y-10">
      <DocsHero
        title="OTP Input"
        description="A one-time password input with per-character fields, keyboard navigation, paste support, grouping, validation, and fully customizable styling."
        code={`import { OtpInput } from "@chumlab/ui/otp-input";`}
      />

      <SetupNote />

      <CopyPasteBlock name="OtpInput" />

      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles, dark mode, and keyboard navigation. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-4">
            {}
            <OtpInput
              label="Verification Code"
              description="Enter the 6-digit code sent to your phone"
              value={basic}
              onValueChange={setBasic}
            />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="With Label"
        description="Accessible labeling via the label prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput label="Verification Code" classes={c.otp} />
        </DemoWrapper>
      </Section>

      <Section
        title="With Description"
        description="Add helper text below the label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            label="Verification Code"
            description="Enter the 6-digit code sent to your email"
            length={6}
            classes={c.otp}
          />
        </DemoWrapper>
      </Section>

      <Section
        title="Required"
        description="Shows asterisk and sets aria-required."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput label="Enter OTP" required classes={c.otp} />
        </DemoWrapper>
      </Section>

      <Section
        title="Custom Length"
        description="Control the number of fields."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {[4, 6, 8].map((len) => (
            <div key={len}>
              <p className={`text-xs font-medium mb-2 ${c.label}`}>
                length={len}
              </p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <OtpInput length={len} classes={c.otp} />
              </DemoWrapper>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Grouped ────────────────────────────────────────────────────── */}
      <Section
        title="Grouped with Separator"
        description="Split digits into visual groups."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              groups=[3,3] with dash
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <OtpInput
                value={grouped}
                onValueChange={setGrouped}
                groups={[3, 3]}
                separator={<span className={c.otp.separator}>—</span>}
                classes={c.otp}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              groups=[2,2,2] with dot
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <OtpInput
                groups={[2, 2, 2]}
                separator={<span className={c.otp.separator}>·</span>}
                classes={c.otp}
              />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Password ───────────────────────────────────────────────────── */}
      <Section
        title="Password Mask"
        description='inputType="password" masks characters.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput inputType="password" label="Masked PIN" classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── onComplete ─────────────────────────────────────────────────── */}
      <Section
        title="onComplete Callback"
        description="Fires when all fields are filled."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput onComplete={(val) => setCompleted(val)} classes={c.otp} />
          {completed && (
            <div
              className={`mt-3 px-3 py-2 rounded-cl-md text-sm font-mono bg-cl-success-bg text-cl-text border border-cl-success`}
              data-demo-action
            >
              Completed: {completed}
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Controlled ─────────────────────────────────────────────────── */}
      <Section
        title="Controlled Mode"
        description="External state via value + onValueChange."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div
            className={`w-full mb-3 p-3 rounded-cl-md flex flex-wrap items-center gap-3 bg-cl-bg-elevated`}
          >
            <span
              className={`text-xs font-medium text-cl-text-secondary`}
            >
              Value:
            </span>
            <span
              className={`text-sm font-mono text-cl-text-secondary`}
            >
              &quot;{controlled}&quot;
            </span>
            <Button
              className={`ml-auto ${c.btn}`}
              onClick={() => setControlled("")}
            >
              Clear
            </Button>
            <Button
              className={c.btnPrimary}
              onClick={() => setControlled("123456")}
            >
              Set 123456
            </Button>
          </div>
          <OtpInput
            value={controlled}
            onValueChange={setControlled}
            classes={c.otp}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Error ──────────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Validation with error + errorMessage."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            value={errorVal}
            onValueChange={setErrorVal}
            label="Verification Code"
            error={errorVal.length > 0 && errorVal.length < 6}
            errorMessage={
              errorVal.length > 0 && errorVal.length < 6
                ? "Please enter all 6 digits"
                : undefined
            }
            classes={c.otp}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Success State ───────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Display a success message when the code is verified."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            label="Verification Code"
            value="123456"
            success
            successMessage="Code verified successfully"
            length={6}
            classes={c.otp}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Loading State ────────────────────────────────────────────── */}
      <Section
        title="Loading State"
        description="Show a loading state while verifying the code."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            label="Verifying..."
            value="123456"
            loading
            length={6}
            classes={c.otp}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Disable all input fields."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput disabled defaultValue="123456" classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── Validation ─────────────────────────────────────────────────── */}
      <Section
        title="Custom Validation"
        description="Restrict characters with the validate function."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>Digits only</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <OtpInput
                validate={(char) => /\d/.test(char)}
                label="PIN (digits only)"
                classes={c.otp}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Letters only
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <OtpInput
                length={4}
                validate={(char) => /[a-zA-Z]/.test(char)}
                label="Code (letters only)"
                classes={c.otp}
              />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Auto Focus ─────────────────────────────────────────────────── */}
      <Section
        title="Auto Focus"
        description="Focus the first field on mount."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Mounted on demand. `autoFocusFirst` focuses on mount, and this
              section sits 5,500px down the page — so on load the browser
              scrolled the reader to it, the same shape as DatePicker's
              `defaultOpen`. Behind a button the prop still demonstrates itself,
              at the moment a reader asks for it. */}
          {showAutoFocus ? (
            <OtpInput autoFocusFirst label="Auto-focused" classes={c.otp} />
          ) : (
            <Button
              type="button"
              className={c.btn}
              onClick={() => setShowAutoFocus(true)}
            >
              Mount an auto-focused OtpInput
            </Button>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Paste Disabled ─────────────────────────────────────────────── */}
      <Section
        title="Paste Disabled"
        description="Block clipboard paste with allowPaste={false}."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput allowPaste={false} label="No paste" classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── Ref ────────────────────────────────────────────────────────── */}
      <Section
        title="Ref Forwarding"
        description="Access the first input via ref."
        isDarkMode={dark}
      >
        <div className="mb-3">
          <Button
            className={c.btnPrimary}
            onClick={() => otpRef.current?.focus()}
          >
            Focus First Input
          </Button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput ref={otpRef} label="Ref demo" classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── Custom Render ──────────────────────────────────────────────── */}
      <Section
        title="Custom Render Input"
        description="Use renderInput for complete control over each field."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            value={custom}
            onValueChange={setCustom}
            length={4}
            renderInput={({ inputProps, filled }) => (
              <input
                {...inputProps}
                className={`w-14 h-14 text-center text-xl font-bold rounded-cl-lg border-2 transition-all focus:outline-none ${
                  filled
                    ? "border-cl-border-input-focus bg-cl-accent/10 text-cl-text"
                    : "border-cl-border-input bg-cl-bg-input text-cl-text"
                } focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20`}
              />
            )}
            classes={{ control: "flex items-center gap-3" }}
          />
        </DemoWrapper>
      </Section>

      <Section
        title="Classes System"
        description="Override styling with the classes prop — 8 slots."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Rounded-full
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <OtpInput
                length={4}
                classes={{
                  ...c.otp,
                  input: `w-14 h-14 text-center text-xl font-bold rounded-full border-2 transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20`,
                }}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>Compact</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <OtpInput
                length={6}
                classes={{
                  ...c.otp,
                  control: "flex items-center gap-1.5",
 input: `w-9 h-9 text-center text-sm font-semibold rounded-cl-md transition-all focus:outline-none bg-cl-bg-panel border border-cl-border text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20`,
                }}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Underline style
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <OtpInput
                length={6}
                classes={{
                  ...c.otp,
                  control: "flex items-center gap-3",
                  input: `w-10 h-12 text-center text-lg font-semibold border-0 border-b-2 rounded-none bg-transparent transition-all focus:outline-none focus-visible:ring-0 border-cl-border-input text-cl-text focus:border-cl-border-input-focus`,
                }}
              />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Form Integration ───────────────────────────────────────────── */}
      <Section
        title="Form Integration"
        description="Hidden input with name prop for form submission."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
            }}
          >
            <OtpInput name="otp" label="Enter OTP" classes={c.otp} />
            <Button type="submit" className={`mt-3 ${c.btnPrimary}`}>
              Submit
            </Button>
          </form>
          <div className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
            onSubmit: {formSubmit}
          </div>
        </DemoWrapper>
        <div className={c.note}>
          A hidden{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono bg-cl-bg-elevated text-cl-text-secondary`}
          >
            &lt;input type=&quot;hidden&quot;&gt;
          </code>{" "}
          carries the full value.
        </div>
      </Section>

      <Section
        title="Telephone Input Type"
        description='inputType="tel" shows number pad on mobile devices.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput inputType="tel" label="Phone OTP (tel)" classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── Per-Field Styling ──────────────────────────────────────────── */}
      <Section
        title="Per-Field Styling"
        description="Use inputClassNames to apply different styles to individual fields."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            length={4}
            inputClassNames={[
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-error text-cl-error focus:border-cl-error focus:ring-2 focus:ring-cl-error/20`,
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-warning text-cl-warning focus:border-cl-warning focus:ring-2 focus:ring-cl-warning/20`,
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-success text-cl-success focus:border-cl-success focus:ring-2 focus:ring-cl-success/20`,
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input-focus text-cl-accent focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20`,
            ]}
            classes={{ control: "flex items-center gap-2" }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Full Width ─────────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Span the container width with fullWidth."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput fullWidth label="Full width OTP" classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── Custom Aria Labels ─────────────────────────────────────────── */}
      <Section
        title="Custom Aria Labels"
        description="Override per-field and group aria labels for i18n or custom screen reader text."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            length={4}
            inputAriaLabel={(index, len) =>
              `Code field ${index + 1} out of ${len}`
            }
            groupAriaLabel="Verification code entry"
            label="Custom a11y labels"
            classes={c.otp}
          />
        </DemoWrapper>
        <div className={c.note}>
          Open screen reader to hear &quot;Code field 1 out of 4&quot; instead
          of the default &quot;Digit 1 of 4&quot;.
        </div>
      </Section>

      {/* ─── Uncontrolled with Default Value ────────────────────────────── */}
      <Section
        title="Uncontrolled with Default Value"
        description="Use defaultValue for initial state without controlled mode."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput
            defaultValue="42"
            label="Pre-filled (uncontrolled)"
            classes={c.otp}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="OtpInput" />

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` (and `onComplete`) for controlled OTP entry, or `defaultValue` for uncontrolled. Length is fixed by the `length` prop."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Paste from SMS may include spaces—validate or normalize in the parent.",
          "Resend cooldown should disable submit, not only the OTP field.",
          "Rate limiting and fraud checks belong outside the component.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide a visible label or `aria-label` / `aria-labelledby` for the group.",
          "Mirror server errors with `error` and `errorMessage`.",
          "Test with password managers and OS OTP autofill where applicable.",
        ]}
        donts={[
          "Do not log OTP values to analytics or console.",
          "Do not block paste unless a security policy explicitly requires it.",
          "Do not shrink hit targets below accessible size on mobile.",
        ]}
      />
    </div>
  );
};

export default OtpInputDemo;
