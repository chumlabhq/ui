import { useState, useRef } from "react";
import { OtpInput } from "../../components/OtpInput";
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

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  otp: {
    wrapper: "flex items-center gap-2",
    group: "flex items-center gap-2",
    input: `w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all focus:outline-none ${
      dark
        ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
        : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
    }`,
    label: `block text-sm font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`,
    error: `text-xs mt-2 ${dark ? "text-red-400" : "text-red-500"}`,
    success: `text-sm mt-2 ${dark ? "text-green-400" : "text-green-600"}`,
    separator: `text-lg select-none ${dark ? "text-gray-600" : "text-gray-300"}`,
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600",
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const OtpInputDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const otpRef = useRef<HTMLInputElement>(null);

  const [basic, setBasic] = useState("");
  const [controlled, setControlled] = useState("123");
  const [completed, setCompleted] = useState<string | null>(null);
  const [grouped, setGrouped] = useState("");
  const [errorVal, setErrorVal] = useState("");
  const [custom, setCustom] = useState("");

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
            OTP Input
          </h1>
          <p
            className={`text-sm leading-relaxed w-full sm:max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A one-time password input with per-character fields, keyboard
            navigation, paste support, grouping, validation, and fully
            customizable styling.
          </p>
          <div className="mt-5">
            <pre className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>
              <code>{`import { OtpInput } from "@chumlab/ui/otp-input";`}</code>
            </pre>
          </div>
        </div>
      </header>

      {/* ─── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles, dark mode, and keyboard navigation. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-4">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <OtpInput
              label="Verification Code"
              description="Enter the 6-digit code sent to your phone"
              value={basic}
              onValueChange={setBasic}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Label ─────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Accessible labeling via the label prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput label="Verification Code" classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── With Description ────────────────────────────────────────── */}
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

      {/* ─── Required ───────────────────────────────────────────────────── */}
      <Section
        title="Required"
        description="Shows asterisk and sets aria-required."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <OtpInput label="Enter OTP" required classes={c.otp} />
        </DemoWrapper>
      </Section>

      {/* ─── Lengths ────────────────────────────────────────────────────── */}
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
              className={`mt-3 px-3 py-2 rounded-lg text-sm font-mono ${dark ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
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
        <div
          className={`mb-3 p-3 rounded-lg flex flex-wrap items-center gap-3 ${dark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <span
            className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Value:
          </span>
          <span
            className={`text-sm font-mono ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            &quot;{controlled}&quot;
          </span>
          <button
            className={`ml-auto ${c.btn}`}
            onClick={() => setControlled("")}
          >
            Clear
          </button>
          <button
            className={c.btnPrimary}
            onClick={() => setControlled("123456")}
          >
            Set 123456
          </button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
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
            classes={{
              ...c.otp,
              input: `${c.otp.input} ${errorVal.length > 0 && errorVal.length < 6 ? (dark ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-red-500 focus:border-red-500 focus:ring-red-500/20") : ""}`,
            }}
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
          <OtpInput autoFocusFirst label="Auto-focused" classes={c.otp} />
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
          <button
            className={c.btnPrimary}
            onClick={() => otpRef.current?.focus()}
          >
            Focus First Input
          </button>
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
                className={`w-14 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all focus:outline-none ${
                  filled
                    ? dark
                      ? "border-indigo-400 bg-indigo-500/10 text-indigo-300"
                      : "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : dark
                      ? "border-gray-600 bg-gray-800 text-gray-200"
                      : "border-gray-300 bg-white text-gray-900"
                } ${dark ? "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" : "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"}`}
              />
            )}
            classes={{ wrapper: "flex items-center gap-3" }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Classes System ─────────────────────────────────────────────── */}
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
                  input: `w-14 h-14 text-center text-xl font-bold rounded-full border-2 transition-all focus:outline-none ${dark ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"}`,
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
                  wrapper: "flex items-center gap-1.5",
                  input: `w-9 h-9 text-center text-sm font-semibold rounded-lg border transition-all focus:outline-none ${dark ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"}`,
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
                  wrapper: "flex items-center gap-3",
                  input: `w-10 h-12 text-center text-lg font-semibold border-0 border-b-2 rounded-none bg-transparent transition-all focus:outline-none ${dark ? "border-gray-600 text-gray-100 focus:border-indigo-400" : "border-gray-300 text-gray-900 focus:border-indigo-500"}`,
                }}
              />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="unstyled=true strips all defaults. Provide your own styling via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-6">
            <OtpInput
              unstyled
              label="Rounded pill style"
              length={4}
              classes={{
                wrapper: "flex items-center gap-3",
                input: `w-14 h-14 text-center text-xl font-bold rounded-full border-2 transition-all focus:outline-none ${dark ? "bg-gray-800 border-violet-500 text-white focus:ring-2 focus:ring-violet-400/30" : "bg-white border-violet-500 text-gray-900 focus:ring-2 focus:ring-violet-500/20"}`,
                label: `block text-sm font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`,
              }}
            />
            <OtpInput
              unstyled
              label="Underline minimal"
              length={6}
              classes={{
                wrapper: "flex items-center gap-2",
                input: `w-10 h-12 text-center text-lg font-semibold border-0 border-b-2 rounded-none bg-transparent transition-all focus:outline-none ${dark ? "border-gray-600 text-gray-100 focus:border-teal-400" : "border-gray-300 text-gray-900 focus:border-teal-600"}`,
                label: `block text-sm font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`,
              }}
            />
          </div>
        </DemoWrapper>
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
              const fd = new FormData(e.currentTarget);
              alert(`OTP: ${fd.get("otp")}`);
            }}
          >
            <OtpInput name="otp" label="Enter OTP" classes={c.otp} />
            <button type="submit" className={`mt-3 ${c.btnPrimary}`}>
              Submit
            </button>
          </form>
        </DemoWrapper>
        <div className={c.note}>
          A hidden{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono ${dark ? "bg-white/6 text-gray-300" : "bg-gray-100 text-gray-600"}`}
          >
            &lt;input type=&quot;hidden&quot;&gt;
          </code>{" "}
          carries the full value.
        </div>
      </Section>

      {/* ─── Tel Input Type ────────────────────────────────────────────── */}
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
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all focus:outline-none ${dark ? "bg-gray-800 border-red-400 text-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" : "bg-white border-red-400 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"}`,
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all focus:outline-none ${dark ? "bg-gray-800 border-amber-400 text-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" : "bg-white border-amber-400 text-amber-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"}`,
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all focus:outline-none ${dark ? "bg-gray-800 border-emerald-400 text-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" : "bg-white border-emerald-400 text-emerald-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"}`,
              `w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all focus:outline-none ${dark ? "bg-gray-800 border-indigo-400 text-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" : "bg-white border-indigo-400 text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"}`,
            ]}
            classes={{ wrapper: "flex items-center gap-2" }}
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

      {/* ─── Props Table ────────────────────────────────────────────────── */}
      <Section title="OtpInput Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="length"
              type="number"
              defaultVal="6"
              description="Number of input fields"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="string"
              description="Controlled value"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="string"
              description="Initial value (uncontrolled)"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(value) => void"
              description="Value change callback"
              isDarkMode={dark}
            />
            <PropRow
              name="onComplete"
              type="(value) => void"
              description="Fires when all fields filled"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="ReactNode"
              description="Label text"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="ReactNode"
              description="Helper text below label"
              isDarkMode={dark}
            />
            <PropRow
              name="required"
              type="boolean"
              defaultVal="false"
              description="Required field"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="boolean"
              defaultVal="false"
              description="Error state"
              isDarkMode={dark}
            />
            <PropRow
              name="errorMessage"
              type="ReactNode"
              description="Error text"
              isDarkMode={dark}
            />
            <PropRow
              name="success"
              type="boolean"
              defaultVal="false"
              description="Success state"
              isDarkMode={dark}
            />
            <PropRow
              name="successMessage"
              type="ReactNode"
              description="Success text"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="boolean"
              defaultVal="false"
              description="Loading state"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable all inputs"
              isDarkMode={dark}
            />
            <PropRow
              name="groups"
              type="number[]"
              description="Split into groups"
              isDarkMode={dark}
            />
            <PropRow
              name="separator"
              type="ReactNode"
              description="Between groups"
              isDarkMode={dark}
            />
            <PropRow
              name="allowPaste"
              type="boolean"
              defaultVal="true"
              description="Allow paste"
              isDarkMode={dark}
            />
            <PropRow
              name="autoFocusFirst"
              type="boolean"
              defaultVal="false"
              description="Auto-focus first"
              isDarkMode={dark}
            />
            <PropRow
              name="inputType"
              type='"text"|"password"|"tel"'
              defaultVal='"text"'
              description="Input type"
              isDarkMode={dark}
            />
            <PropRow
              name="validate"
              type="(char) => boolean"
              description="Character validation"
              isDarkMode={dark}
            />
            <PropRow
              name="renderInput"
              type="(props) => ReactNode"
              description="Custom field render"
              isDarkMode={dark}
            />
            <PropRow
              name="name"
              type="string"
              description="Hidden input name"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Full width"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="OtpInputClasses"
              description="Slot overrides (8 slots)"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip defaults"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-index"
              type="input"
              description="Field index"
              isDarkMode={dark}
            />
            <PropRow
              name="data-filled"
              type="input"
              description="Has value"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="root, input"
              description="Disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="root, input"
              description="Error state"
              isDarkMode={dark}
            />
            <PropRow
              name="data-group"
              type="group div"
              description="Group index"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" isDarkMode={dark}>
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              'Each input has aria-label: "Digit N of M"',
              'Wrapper uses role="group" with aria-label',
              "aria-invalid and aria-required on each input",
              'Error message uses role="alert"',
              "Label auto-associated via htmlFor",
              'autoComplete="one-time-code" on first input',
              'inputMode="numeric" for mobile keyboards',
              "Provide `label` or `aria-label` / `aria-labelledby` for the group",
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
              ["0-9 / A-Z", "Type character, auto-advance"],
              ["Backspace", "Clear current, move to previous"],
              ["Delete", "Clear current field"],
              ["Arrow Left / Right", "Move between fields"],
              ["Home / End", "First / last field"],
              ["Ctrl+V", "Paste full OTP"],
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
