import { useState, useRef } from "react";
import { OtpInput, OtpInputLabel } from "../../components/OtpInput";
import type { OtpInputRenderProps } from "../../components/OtpInput";
import { useTheme } from "./ThemeContext";

// ============================================================================
// SECTION COMPONENT
// ============================================================================

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const Section: React.FC<SectionProps> = ({ title, description, children, isDarkMode }) => (
  <section className="space-y-4">
    <div>
      <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      )}
    </div>
    {children}
  </section>
);

// ============================================================================
// CODE BLOCK COMPONENT
// ============================================================================

interface CodeBlockProps {
  code: string;
  isDarkMode: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, isDarkMode }) => (
  <pre
    className={`p-4 rounded-lg text-sm overflow-x-auto ${
      isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-100"
    }`}
  >
    <code>{code}</code>
  </pre>
);

// ============================================================================
// DEMO WRAPPER COMPONENT
// ============================================================================

interface DemoWrapperProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  className?: string;
}

const DemoWrapper: React.FC<DemoWrapperProps> = ({ children, isDarkMode, className = "" }) => (
  <div
    className={`border rounded-lg ${
      isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
    } ${className}`}
  >
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

// ============================================================================
// MAIN OTP INPUT DEMO COMPONENT
// ============================================================================

const OtpInputDemo = () => {
  const { isDarkMode } = useTheme();
  const otpRef = useRef<HTMLInputElement>(null);

  // State for demos
  const [basicValue, setBasicValue] = useState("");
  const [fourDigitValue, setFourDigitValue] = useState("");
  const [eightDigitValue, setEightDigitValue] = useState("");
  const [groupedValue, setGroupedValue] = useState("");
  const [customGroupValue, setCustomGroupValue] = useState("");
  const [unevenGroupValue, setUnevenGroupValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [requiredValue, setRequiredValue] = useState("");
  const [errorValue, setErrorValue] = useState("");
  const [disabledValue] = useState("123456");
  const [passwordValue, setPasswordValue] = useState("");
  const [noPasteValue, setNoPasteValue] = useState("");
  const [darkThemeValue, setDarkThemeValue] = useState("");
  const [roundedValue, setRoundedValue] = useState("");
  const [underlineValue, setUnderlineValue] = useState("");
  const [gradientValue, setGradientValue] = useState("");
  const [individualStyleValue, setIndividualStyleValue] = useState("");
  const [completedValue, setCompletedValue] = useState("");
  const [lastCompleted, setLastCompleted] = useState("");
  const [layoutValue1, setLayoutValue1] = useState("");
  const [layoutValue2, setLayoutValue2] = useState("");
  const [layoutValue3, setLayoutValue3] = useState("");
  const [layoutValue4, setLayoutValue4] = useState("");
  const [refDemoValue, setRefDemoValue] = useState("");
  const [renderInputValue, setRenderInputValue] = useState("");
  const [idNameValue, setIdNameValue] = useState("");

  // Dark mode aware class names
  const getInputClassNames = () => ({
    base: `w-12 h-12 text-center text-lg font-medium border rounded-lg outline-none transition-all ${
      isDarkMode
        ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-500"
        : "border-gray-300 bg-white text-gray-900"
    }`,
    focus: isDarkMode
      ? "focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    error: `w-12 h-12 text-center text-lg font-medium border rounded-lg outline-none transition-all ${
      isDarkMode
        ? "border-red-400 bg-gray-700 text-white focus:ring-2 focus:ring-red-400"
        : "border-red-500 bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
    }`,
    disabled: `w-12 h-12 text-center text-lg font-medium border rounded-lg cursor-not-allowed ${
      isDarkMode
        ? "border-gray-600 bg-gray-600 text-gray-400"
        : "border-gray-200 bg-gray-100 text-gray-400"
    }`,
    label: `block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`,
    errorMessage: `text-sm mt-2 ${isDarkMode ? "text-red-400" : "text-red-500"}`,
    container: "flex flex-col",
    wrapper: "flex gap-2",
  });

  const classes = getInputClassNames();

  return (
    <div className="space-y-16">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          OTP Input
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A flexible, accessible OTP input component with customizable length, grouping, 
          separators, and styling. Supports paste functionality, custom renderers, and 
          keyboard navigation.
        </p>

        {/* Quick Install */}
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import OtpInput, { OtpInputLabel } from "@kern-ui/otp-input";`}
          />
        </div>
      </header>

      {/* ================================================================== */}
      {/* EXAMPLES SECTION */}
      {/* ================================================================== */}
      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Examples
        </h2>

        {/* ---------------------------------------------------------------- */}
        {/* Basic OTP Input */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Basic OTP Input"
          description="A simple 6-digit OTP input with default configuration."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <OtpInput
                value={basicValue}
                onChange={setBasicValue}
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
              />
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Value: {basicValue || "(empty)"}
              </p>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Different Lengths */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Different Lengths"
          description="Use the length prop to set the number of input boxes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  4-digit OTP (length=4)
                </p>
                <OtpInput
                  length={4}
                  value={fourDigitValue}
                  onChange={setFourDigitValue}
                  inputClassName={classes.base}
                  focusClassName={classes.focus}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  8-digit OTP (length=8)
                </p>
                <OtpInput
                  length={8}
                  value={eightDigitValue}
                  onChange={setEightDigitValue}
                  inputClassName={`w-10 h-10 text-center text-base font-medium border rounded-lg outline-none transition-all ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                  focusClassName={classes.focus}
                  wrapperClassName="flex gap-1.5"
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Layout Variations */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Layout Variations"
          description="Different grouping and spacing configurations using groups and separator props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-medium ${isDarkMode ? "bg-purple-500" : "bg-purple-600"}`}>
                    1
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Individual boxes with equal spacing
                  </span>
                </div>
                <OtpInput
                  value={layoutValue1}
                  onChange={setLayoutValue1}
                  autoFocusFirst={false}
                  inputClassName={`w-10 h-10 text-center text-lg font-medium border rounded outline-none transition-all ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex gap-2"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-medium ${isDarkMode ? "bg-purple-500" : "bg-purple-600"}`}>
                    2
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Groups (2-2-2) with separator
                  </span>
                </div>
                <OtpInput
                  value={layoutValue2}
                  onChange={setLayoutValue2}
                  autoFocusFirst={false}
                  groups={[2, 2, 2]}
                  separator={<span className={`text-xl font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>-</span>}
                  inputClassName={`w-10 h-10 text-center text-lg font-medium border rounded outline-none transition-all ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex items-center gap-2"
                  groupClassName="flex gap-2"
                  separatorClassName="mx-1"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-medium ${isDarkMode ? "bg-purple-500" : "bg-purple-600"}`}>
                    3
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Connected groups, space between
                  </span>
                </div>
                <OtpInput
                  value={layoutValue3}
                  onChange={setLayoutValue3}
                  autoFocusFirst={false}
                  groups={[2, 2, 2]}
                  inputClassName={`w-10 h-10 text-center text-lg font-medium border-y border-r outline-none transition-all first:border-l first:rounded-l last:rounded-r focus:ring-2 focus:z-10 relative ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex items-center gap-4"
                  groupClassName="flex"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-medium ${isDarkMode ? "bg-purple-500" : "bg-purple-600"}`}>
                    4
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Connected with separator
                  </span>
                </div>
                <OtpInput
                  value={layoutValue4}
                  onChange={setLayoutValue4}
                  autoFocusFirst={false}
                  groups={[2, 2, 2]}
                  separator={<span className={`text-xl font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>-</span>}
                  inputClassName={`w-10 h-10 text-center text-lg font-medium border-y border-r outline-none transition-all first:border-l first:rounded-l last:rounded-r focus:ring-2 focus:z-10 relative ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex items-center gap-2"
                  groupClassName="flex"
                  separatorClassName="mx-1"
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Grouped OTP Variations */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Grouped OTP Variations"
          description="More examples of grouping with different configurations."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Groups (3-3) with dash separator
                </p>
                <OtpInput
                  value={groupedValue}
                  onChange={setGroupedValue}
                  autoFocusFirst={false}
                  groups={[3, 3]}
                  separator={<span className={`text-2xl ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>-</span>}
                  inputClassName={classes.base}
                  focusClassName={classes.focus}
                  wrapperClassName="flex items-center gap-3"
                  groupClassName="flex gap-2"
                  separatorClassName="mx-1"
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Groups (3-3) connected within groups
                </p>
                <OtpInput
                  value={customGroupValue}
                  onChange={setCustomGroupValue}
                  autoFocusFirst={false}
                  groups={[3, 3]}
                  separator={<span className="w-4" />}
                  inputClassName={`w-12 h-12 text-center text-lg font-medium border-y border-r outline-none transition-all first:border-l first:rounded-l-lg last:rounded-r-lg focus:ring-2 focus:z-10 relative ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex items-center"
                  groupClassName="flex"
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Uneven groups (2-2-2) with slash separator
                </p>
                <OtpInput
                  value={unevenGroupValue}
                  onChange={setUnevenGroupValue}
                  autoFocusFirst={false}
                  groups={[2, 2, 2]}
                  separator={<span className={`text-xl ${isDarkMode ? "text-gray-500" : "text-gray-300"}`}>/</span>}
                  inputClassName={classes.base}
                  focusClassName={classes.focus}
                  wrapperClassName="flex items-center gap-2"
                  groupClassName="flex gap-1"
                  separatorClassName="mx-1"
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* With Label */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="With Label"
          description="Use the label prop to add an accessible label above the input."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <OtpInput
                label="Verification Code"
                value={labelValue}
                onChange={setLabelValue}
                autoFocusFirst={false}
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Required Field */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Required Field"
          description="Add required prop to show an asterisk (*) indicator and set aria-required."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <OtpInput
              label="Enter OTP"
              required
              length={4}
              value={requiredValue}
              onChange={setRequiredValue}
              autoFocusFirst={false}
              inputClassName={classes.base}
              focusClassName={classes.focus}
              wrapperClassName={classes.wrapper}
              labelClassName={classes.label}
              containerClassName={classes.container}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Error State */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Error State"
          description="Use error and errorMessage props to display validation errors."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <OtpInput
              label="Invalid Code"
              value={errorValue}
              onChange={setErrorValue}
              autoFocusFirst={false}
              error
              errorMessage="The code you entered is incorrect. Please try again."
              inputClassName={classes.error}
              wrapperClassName={classes.wrapper}
              labelClassName={classes.label}
              errorClassName={classes.errorMessage}
              containerClassName={classes.container}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Disabled State */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Disabled State"
          description="Disable the input with the disabled prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <OtpInput
              value={disabledValue}
              disabled
              inputClassName={classes.disabled}
              wrapperClassName={classes.wrapper}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Password Type */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Password Type (Masked)"
          description='Use inputType="password" to mask the input values.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <OtpInput
                value={passwordValue}
                onChange={setPasswordValue}
                autoFocusFirst={false}
                inputType="password"
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
              />
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Value: {passwordValue || "(empty)"}
              </p>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Paste Disabled */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Paste Disabled"
          description="Set allowPaste={false} to disable paste functionality."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <OtpInput
                value={noPasteValue}
                onChange={setNoPasteValue}
                autoFocusFirst={false}
                allowPaste={false}
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
              />
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Try pasting - it won't work!
              </p>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* onComplete Callback */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="onComplete Callback"
          description="Use onComplete to trigger an action when all digits are filled."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <OtpInput
                value={completedValue}
                onChange={setCompletedValue}
                onComplete={(val: string) => setLastCompleted(val)}
                autoFocusFirst={false}
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
              />
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Last completed value:{" "}
                <span className={`font-mono ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  {lastCompleted || "(none yet)"}
                </span>
              </p>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<OtpInput
  value={value}
  onChange={setValue}
  onComplete={(val) => {
    // Called when all digits are filled
    console.log('OTP completed:', val);
    submitOtp(val);
  }}
/>`}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* No Auto Focus */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="No Auto Focus"
          description="Set autoFocusFirst={false} to prevent auto-focusing the first input on mount."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <OtpInput
                value={basicValue}
                onChange={setBasicValue}
                autoFocusFirst={false}
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
              />
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                First input is not auto-focused on mount
              </p>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Ref Forwarding */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Ref Forwarding"
          description="Access the first input element using React refs for programmatic focus management."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <OtpInput
                ref={otpRef}
                value={refDemoValue}
                onChange={setRefDemoValue}
                autoFocusFirst={false}
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => otpRef.current?.focus()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Focus First Input
                </button>
                <button
                  type="button"
                  onClick={() => alert(`First input value: "${otpRef.current?.value || ""}"`)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Get First Value
                </button>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom ID and Name */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom ID and Name"
          description="Set custom id and name attributes for form handling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Form submitted with OTP: ${idNameValue}`);
              }}
              className="space-y-4"
            >
              <OtpInput
                id="verification-code"
                name="otp"
                label="Verification Code"
                value={idNameValue}
                onChange={setIdNameValue}
                autoFocusFirst={false}
                inputClassName={classes.base}
                focusClassName={classes.focus}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Submit
              </button>
            </form>
          </DemoWrapper>
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>Note:</strong> The input ID is auto-generated if not provided. It uses{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>
                id || name || useId()
              </code>{" "}
              fallback chain.
            </p>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Render Input */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Render Input"
          description="Use renderInput prop for complete control over how each input is rendered."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <OtpInput
                value={renderInputValue}
                onChange={setRenderInputValue}
                autoFocusFirst={false}
                wrapperClassName="flex gap-3"
                renderInput={(props: OtpInputRenderProps) => (
                  <div key={props.index} className="relative">
                    <input
                      {...props.inputProps}
                      className={`w-14 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all ${
                        props.filled
                          ? isDarkMode
                            ? "border-green-400 bg-green-900/30 text-green-400"
                            : "border-green-500 bg-green-50 text-green-700"
                          : isDarkMode
                            ? "border-gray-600 bg-gray-700 text-white"
                            : "border-gray-300 bg-white text-gray-900"
                      } ${
                        props.error
                          ? isDarkMode
                            ? "border-red-400"
                            : "border-red-500"
                          : ""
                      } ${
                        props.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : "focus:ring-2 focus:ring-blue-500"
                      }`}
                    />
                    {props.filled && (
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${isDarkMode ? "bg-green-500" : "bg-green-500"}`}>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              />
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Custom rendered inputs with filled indicators
              </p>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<OtpInput
  value={value}
  onChange={setValue}
  renderInput={(props) => (
    <div key={props.index} className="relative">
      <input
        {...props.inputProps}
        className={\`custom-input \${props.filled ? "filled" : ""}\`}
      />
      {props.filled && <CheckIcon />}
    </div>
  )}
/>`}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* OtpInputLabel Standalone */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="OtpInputLabel Standalone"
          description="Use OtpInputLabel separately for custom layouts."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <div>
                <OtpInputLabel
                  label="Standalone Label"
                  inputId="custom-otp"
                  className={classes.label}
                />
                <OtpInput
                  id="custom-otp"
                  value={basicValue}
                  onChange={setBasicValue}
                  autoFocusFirst={false}
                  inputClassName={classes.base}
                  focusClassName={classes.focus}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <OtpInputLabel
                  label="Required Field"
                  inputId="required-otp"
                  required
                  className={classes.label}
                />
                <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Required indicator (*) is added automatically
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Theme Examples */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Theme Examples"
          description="Customize the input appearance using className props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-8">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Dark theme (works in both modes)
                </p>
                <div className="bg-gray-900 p-6 rounded-xl">
                  <OtpInput
                    value={darkThemeValue}
                    onChange={setDarkThemeValue}
                    autoFocusFirst={false}
                    inputClassName="w-12 h-12 text-center text-lg font-medium border border-gray-600 rounded-lg bg-gray-800 text-white outline-none transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    wrapperClassName="flex gap-3"
                  />
                </div>
              </div>

              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Rounded/Pill style
                </p>
                <OtpInput
                  value={roundedValue}
                  onChange={setRoundedValue}
                  autoFocusFirst={false}
                  inputClassName={`w-14 h-14 text-center text-xl font-bold border-2 rounded-full outline-none transition-all ${
                    isDarkMode
                      ? "border-purple-400 bg-purple-900/30 text-purple-300 focus:ring-2 focus:ring-purple-400 focus:bg-purple-900/50"
                      : "border-purple-300 bg-purple-50 text-purple-900 focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  }`}
                  wrapperClassName="flex gap-4"
                />
              </div>

              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Underline style
                </p>
                <OtpInput
                  value={underlineValue}
                  onChange={setUnderlineValue}
                  autoFocusFirst={false}
                  inputClassName={`w-12 h-12 text-center text-2xl font-medium border-b-2 bg-transparent outline-none transition-all ${
                    isDarkMode
                      ? "border-gray-600 text-white focus:border-blue-400"
                      : "border-gray-300 text-gray-900 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex gap-4"
                />
              </div>

              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Gradient border effect
                </p>
                <OtpInput
                  value={gradientValue}
                  onChange={setGradientValue}
                  autoFocusFirst={false}
                  inputClassName={`w-12 h-12 text-center text-lg font-medium rounded-lg outline-none border-2 border-transparent bg-clip-padding transition-all focus:ring-2 focus:ring-pink-500 ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  wrapperClassName="flex gap-2"
                  containerClassName={`${isDarkMode ? "[&_input]:bg-gradient-to-r [&_input]:from-purple-600 [&_input]:to-pink-600" : "[&_input]:bg-gradient-to-r [&_input]:from-purple-500 [&_input]:to-pink-500"} [&_input]:[background-origin:border-box] [&_input]:[background-clip:padding-box,border-box]`}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Individual Input Styling */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Individual Input Styling"
          description="Use inputClassNames array to style each input individually."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <OtpInput
                value={individualStyleValue}
                onChange={setIndividualStyleValue}
                autoFocusFirst={false}
                inputClassName={`w-12 h-12 text-center text-lg font-medium border rounded-lg outline-none transition-all ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                }`}
                inputClassNames={[
                  `border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500`,
                  `border-orange-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`,
                  `border-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`,
                  `border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500`,
                  `border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`,
                  `border-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500`,
                ]}
                wrapperClassName="flex gap-2"
              />
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Rainbow colors using inputClassNames array
              </p>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Size Variations */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Size Variations"
          description="Customize input sizes using className props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Large inputs
                </p>
                <OtpInput
                  length={4}
                  value={fourDigitValue}
                  onChange={setFourDigitValue}
                  autoFocusFirst={false}
                  inputClassName={`w-16 h-16 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex gap-4"
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Small inputs
                </p>
                <OtpInput
                  length={8}
                  value={eightDigitValue}
                  onChange={setEightDigitValue}
                  autoFocusFirst={false}
                  inputClassName={`w-8 h-8 text-center text-sm font-medium border rounded outline-none transition-all ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  wrapperClassName="flex gap-1"
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Full Width */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Full Width"
          description="Use fullWidth prop to make the container span full width."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full max-w-md">
              <OtpInput
                length={6}
                value={basicValue}
                onChange={setBasicValue}
                autoFocusFirst={false}
                fullWidth
                inputClassName={`flex-1 h-12 text-center text-lg font-medium border rounded-lg outline-none transition-all ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
                wrapperClassName="flex gap-2 w-full"
                containerClassName="w-full"
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Credit Card Style */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Credit Card Style (16 digits)"
          description="Example of a longer input with groups for credit card-like input."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <OtpInput
              length={16}
              value=""
              onChange={() => {}}
              autoFocusFirst={false}
              groups={[4, 4, 4, 4]}
              separator={<span className={isDarkMode ? "text-gray-500" : "text-gray-300"}>-</span>}
              inputClassName={`w-8 h-10 text-center text-sm font-mono border rounded outline-none transition-all ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              }`}
              wrapperClassName="flex items-center gap-2"
              groupClassName="flex gap-0.5"
              separatorClassName="mx-1"
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Data Attributes */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Data Attributes"
          description="The OtpInput component applies data attributes for CSS-based styling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto">
              <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                <thead>
                  <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <th className="text-left py-3 pr-4 font-semibold">Attribute</th>
                    <th className="text-left py-3 pr-4 font-semibold">Applied To</th>
                    <th className="text-left py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-disabled</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      container, inputs
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when input is disabled
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-error</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      container, inputs
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when input has an error
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-filled</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      input
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when input has a value
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-index</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      input
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      The index of the input (0-based)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-group</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      group wrapper
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      The index of the group (when using groups)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Example usage:{" "}
              <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                data-[disabled]:opacity-50
              </code>
              ,{" "}
              <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                data-[filled]:border-green-500
              </code>
            </p>
          </DemoWrapper>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* API REFERENCE SECTION */}
      {/* ================================================================== */}
      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        {/* OtpInput Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            OtpInput
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">length</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>6</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Number of input boxes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">value</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>""</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Current OTP value
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onChange</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(value: string) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when value changes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onComplete</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(value: string) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when all digits are filled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">label</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Label text displayed above the input
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">required</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Show required indicator (*) and set aria-required
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">error</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Show error styling (sets aria-invalid)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorMessage</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Error message displayed below the input
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Disables all inputs
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">groups</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number[]</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Array defining input grouping (e.g., [3, 3])
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">separator</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Element rendered between groups
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">allowPaste</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>true</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Enable/disable paste functionality
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">autoFocusFirst</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>true</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Auto-focus first input on mount
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">inputType</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>"text" | "password"</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"text"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Input type (text or password for masking)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">inputClassNames</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(string | undefined)[]</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>[]</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Individual class names per input index
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">fullWidth</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Take full width of container
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">renderInput</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(props: OtpInputRenderProps) =&gt; ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom render function for each input
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">id</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>auto-generated</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    HTML id attribute for the first input
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">name</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    HTML name attribute for form submission
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Styling Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
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
                  <td className="py-3 pr-4 font-mono text-blue-500">containerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for outer container (includes label and error)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">wrapperClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for inputs wrapper (contains all inputs/groups)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">groupClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for group containers (when using groups)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">inputClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for all input elements
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">focusClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for focus states (appended to inputClassName)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">labelClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for label element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for error message element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">separatorClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for separator elements
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">inputClassNames</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(string | undefined)[]</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Array of classes for individual inputs by index
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* OtpInputLabel Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            OtpInputLabel
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">label</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>required</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Label content to display
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">required</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether to show required indicator (*)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">inputId</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    ID of the input element (for htmlFor attribute)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>""</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the label element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* OtpInputRenderProps */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            OtpInputRenderProps (for renderInput)
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Property</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">index</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Index of the current input (0-based)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">value</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Current value of this input
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the input is disabled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">error</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the input has an error
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">filled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the input has a value
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">inputProps</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>InputHTMLAttributes & {`{ ref }`}</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Props to spread onto the input element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Type Definitions */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface OtpInputLabelProps {
  label: ReactNode;
  required?: boolean;
  inputId?: string;
  className?: string;
}

interface OtpInputRenderProps {
  index: number;
  value: string;
  disabled: boolean;
  error: boolean;
  filled: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement> & {
    ref: (el: HTMLInputElement | null) => void;
  };
}

interface OtpInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "maxLength"
  > {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: ReactNode;
  required?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  disabled?: boolean;
  groups?: number[];
  separator?: ReactNode;
  allowPaste?: boolean;
  autoFocusFirst?: boolean;
  inputType?: "text" | "password";
  inputClassNames?: (string | undefined)[];
  fullWidth?: boolean;
  renderInput?: (props: OtpInputRenderProps) => ReactNode;
  // Styling props
  containerClassName?: string;
  wrapperClassName?: string;
  groupClassName?: string;
  inputClassName?: string;
  focusClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  separatorClassName?: string;
}`}
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* ACCESSIBILITY SECTION */}
      {/* ================================================================== */}
      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Accessibility
        </h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Features
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              Label is automatically associated with first input via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                htmlFor
              </code>
            </li>
            <li>
              Required inputs have{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-required="true"
              </code>
            </li>
            <li>
              Error state sets{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-invalid="true"
              </code>{" "}
              and connects error message via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-describedby
              </code>
            </li>
            <li>
              Error messages use{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="alert"
              </code>{" "}
              for screen reader announcements
            </li>
            <li>
              Each input has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-label="OTP digit N"
              </code>{" "}
              for screen readers
            </li>
            <li>
              First input has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                autoComplete="one-time-code"
              </code>{" "}
              for autofill support
            </li>
            <li>
              Wrapper uses{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="group"
              </code>{" "}
              with{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-roledescription="One-time password input"
              </code>
            </li>
            <li>Supports ref forwarding for programmatic focus management</li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Keyboard Navigation
          </h3>
          <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Tab
              </kbd>{" "}
              - Move focus to/from OTP inputs
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                ←
              </kbd>{" "}
              /{" "}
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                →
              </kbd>{" "}
              - Navigate between inputs
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Backspace
              </kbd>{" "}
              - Delete current digit and move to previous input
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Delete
              </kbd>{" "}
              - Delete current digit without moving
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Home
              </kbd>{" "}
              - Jump to first input
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                End
              </kbd>{" "}
              - Jump to last input
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Ctrl/Cmd + V
              </kbd>{" "}
              - Paste OTP (when allowPaste is true)
            </li>
          </ul>
        </div>
      </div>

      {/* ================================================================== */}
      {/* NATIVE PROPS NOTE */}
      {/* ================================================================== */}
      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Note:</strong> OtpInput extends native{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            InputHTMLAttributes
          </code>{" "}
          (excluding value, onChange, type, and maxLength) and accepts all standard input props such as{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>autoFocus</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>tabIndex</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onFocus</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onBlur</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>data-*</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>aria-*</code>, etc.
          These props are spread to all individual input elements.
        </p>
      </div>
    </div>
  );
};

export default OtpInputDemo;
