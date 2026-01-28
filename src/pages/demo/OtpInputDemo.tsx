import { useState } from "react";
import { OtpInput } from "../../components/OtpInput";
import { Section, ComponentHeader } from "./components";

const OtpInputDemo = () => {
  const [basicValue, setBasicValue] = useState("");
  const [fourDigitValue, setFourDigitValue] = useState("");
  const [eightDigitValue, setEightDigitValue] = useState("");
  const [groupedValue, setGroupedValue] = useState("");
  const [customGroupValue, setCustomGroupValue] = useState("");
  const [unevenGroupValue, setUnevenGroupValue] = useState("");
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

  const baseInputStyles = `
    w-12 h-12 text-center text-lg font-medium
    border border-gray-300 rounded-lg
    bg-white text-gray-900
    outline-none transition-all
  `;

  const focusStyles = "focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const errorInputStyles = `
    w-12 h-12 text-center text-lg font-medium
    border border-red-500 rounded-lg
    bg-white text-gray-900
    outline-none transition-all
    focus:ring-2 focus:ring-red-500 focus:border-red-500
  `;

  const disabledInputStyles = `
    w-12 h-12 text-center text-lg font-medium
    border border-gray-200 rounded-lg
    bg-gray-100 text-gray-400
    cursor-not-allowed
  `;

  return (
    <>
      <ComponentHeader
        title="OTP Input"
        description="A flexible, accessible OTP input component with customizable length, grouping, and styling."
      />

      <Section title="Layout Variations">
        <p className="text-sm text-gray-600 mb-6">
          Different grouping and spacing configurations for OTP inputs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">
                1
              </span>
              <span className="text-sm font-medium text-gray-700">
                Individual boxes with equal spacing
              </span>
            </div>
            <OtpInput
              value={layoutValue1}
              onChange={setLayoutValue1}
              autoFocusFirst={false}
              inputClassName="w-10 h-10 text-center text-lg font-medium border border-gray-300 rounded bg-white text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              wrapperClassName="flex gap-2"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">
                2
              </span>
              <span className="text-sm font-medium text-gray-700">
                Groups (2-2-2) with separator, gaps within
              </span>
            </div>
            <OtpInput
              value={layoutValue2}
              onChange={setLayoutValue2}
              autoFocusFirst={false}
              groups={[2, 2, 2]}
              separator={
                <span className="text-gray-400 text-xl font-medium">-</span>
              }
              inputClassName="w-10 h-10 text-center text-lg font-medium border border-gray-300 rounded bg-white text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              wrapperClassName="flex items-center gap-2"
              groupClassName="flex gap-2"
              separatorClassName="mx-1"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">
                3
              </span>
              <span className="text-sm font-medium text-gray-700">
                Groups (2-2-2) connected, space between groups
              </span>
            </div>
            <OtpInput
              value={layoutValue3}
              onChange={setLayoutValue3}
              autoFocusFirst={false}
              groups={[2, 2, 2]}
              inputClassName="w-10 h-10 text-center text-lg font-medium border-y border-r border-gray-300 bg-white text-gray-900 outline-none transition-all first:border-l first:rounded-l last:rounded-r focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 relative"
              wrapperClassName="flex items-center gap-4"
              groupClassName="flex"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">
                4
              </span>
              <span className="text-sm font-medium text-gray-700">
                Groups (2-2-2) connected with separator
              </span>
            </div>
            <OtpInput
              value={layoutValue4}
              onChange={setLayoutValue4}
              autoFocusFirst={false}
              groups={[2, 2, 2]}
              separator={
                <span className="text-gray-400 text-xl font-medium">-</span>
              }
              inputClassName="w-10 h-10 text-center text-lg font-medium border-y border-r border-gray-300 bg-white text-gray-900 outline-none transition-all first:border-l first:rounded-l last:rounded-r focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 relative"
              wrapperClassName="flex items-center gap-2"
              groupClassName="flex"
              separatorClassName="mx-1"
            />
          </div>
        </div>
      </Section>

      <Section title="Basic OTP Input (6 digits)">
        <OtpInput
          value={basicValue}
          onChange={setBasicValue}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          Value: {basicValue || "(empty)"}
        </p>
      </Section>

      <Section title="4-Digit OTP">
        <OtpInput
          length={4}
          value={fourDigitValue}
          onChange={setFourDigitValue}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          Value: {fourDigitValue || "(empty)"}
        </p>
      </Section>

      <Section title="8-Digit OTP">
        <OtpInput
          length={8}
          value={eightDigitValue}
          onChange={setEightDigitValue}
          inputClassName="w-10 h-10 text-center text-base font-medium border border-gray-300 rounded-lg bg-white text-gray-900 outline-none transition-all"
          focusClassName={focusStyles}
          wrapperClassName="flex gap-1.5"
        />
        <p className="text-sm text-gray-500 mt-2">
          Value: {eightDigitValue || "(empty)"}
        </p>
      </Section>

      <Section title="Grouped OTP (3-3 with separator)">
        <OtpInput
          value={groupedValue}
          onChange={setGroupedValue}
          groups={[3, 3]}
          separator={<span className="text-gray-400 text-2xl">-</span>}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex items-center gap-3"
          groupClassName="flex gap-2"
          separatorClassName="mx-1"
        />
        <p className="text-sm text-gray-500 mt-2">
          Value: {groupedValue || "(empty)"}
        </p>
      </Section>

      <Section title="Grouped OTP (3-3 no gap within groups)">
        <OtpInput
          value={customGroupValue}
          onChange={setCustomGroupValue}
          groups={[3, 3]}
          separator={<span className="w-4" />}
          inputClassName="w-12 h-12 text-center text-lg font-medium border-y border-r border-gray-300 bg-white text-gray-900 outline-none transition-all first:border-l first:rounded-l-lg last:rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 relative"
          wrapperClassName="flex items-center"
          groupClassName="flex"
        />
        <p className="text-sm text-gray-500 mt-2">
          Value: {customGroupValue || "(empty)"}
        </p>
      </Section>

      <Section title="Uneven Groups (2-2-2)">
        <OtpInput
          value={unevenGroupValue}
          onChange={setUnevenGroupValue}
          groups={[2, 2, 2]}
          separator={<span className="text-gray-300 text-xl">/</span>}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex items-center gap-2"
          groupClassName="flex gap-1"
          separatorClassName="mx-1"
        />
        <p className="text-sm text-gray-500 mt-2">
          Value: {unevenGroupValue || "(empty)"}
        </p>
      </Section>

      <Section title="With Label">
        <OtpInput
          label="Verification Code"
          value={basicValue}
          onChange={setBasicValue}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
          labelClassName="block text-sm font-medium text-gray-700 mb-2"
          containerClassName="flex flex-col"
        />
      </Section>

      <Section title="Required with Label">
        <OtpInput
          label="Enter OTP"
          required
          length={4}
          value={fourDigitValue}
          onChange={setFourDigitValue}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
          labelClassName="block text-sm font-medium text-gray-700 mb-2"
          containerClassName="flex flex-col"
        />
      </Section>

      <Section title="Error State">
        <OtpInput
          label="Invalid Code"
          value={errorValue}
          onChange={setErrorValue}
          error
          errorMessage="The code you entered is incorrect. Please try again."
          inputClassName={errorInputStyles}
          wrapperClassName="flex gap-2"
          labelClassName="block text-sm font-medium text-gray-700 mb-2"
          errorClassName="text-sm text-red-500 mt-2"
          containerClassName="flex flex-col"
        />
      </Section>

      <Section title="Disabled State">
        <OtpInput
          value={disabledValue}
          disabled
          inputClassName={disabledInputStyles}
          wrapperClassName="flex gap-2"
        />
      </Section>

      <Section title="Password Type (masked)">
        <OtpInput
          value={passwordValue}
          onChange={setPasswordValue}
          inputType="password"
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          Value: {passwordValue || "(empty)"}
        </p>
      </Section>

      <Section title="Paste Disabled">
        <OtpInput
          value={noPasteValue}
          onChange={setNoPasteValue}
          allowPaste={false}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          Try pasting - it won't work!
        </p>
      </Section>

      <Section title="onComplete Callback">
        <OtpInput
          value={completedValue}
          onChange={setCompletedValue}
          onComplete={(val) => setLastCompleted(val)}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          Last completed value: {lastCompleted || "(none yet)"}
        </p>
      </Section>

      <Section title="No Auto Focus">
        <OtpInput
          value={basicValue}
          onChange={setBasicValue}
          autoFocusFirst={false}
          inputClassName={baseInputStyles}
          focusClassName={focusStyles}
          wrapperClassName="flex gap-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          First input is not auto-focused
        </p>
      </Section>

      <Section title="Custom Theme - Dark">
        <div className="bg-gray-900 p-6 rounded-xl">
          <OtpInput
            value={darkThemeValue}
            onChange={setDarkThemeValue}
            inputClassName="w-12 h-12 text-center text-lg font-medium border border-gray-600 rounded-lg bg-gray-800 text-white outline-none transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            wrapperClassName="flex gap-3"
          />
        </div>
      </Section>

      <Section title="Custom Theme - Rounded/Pill">
        <OtpInput
          value={roundedValue}
          onChange={setRoundedValue}
          inputClassName="w-14 h-14 text-center text-xl font-bold border-2 border-purple-300 rounded-full bg-purple-50 text-purple-900 outline-none transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white"
          wrapperClassName="flex gap-4"
        />
      </Section>

      <Section title="Custom Theme - Underline Style">
        <OtpInput
          value={underlineValue}
          onChange={setUnderlineValue}
          inputClassName="w-12 h-12 text-center text-2xl font-medium border-b-2 border-gray-300 bg-transparent text-gray-900 outline-none transition-all focus:border-blue-500"
          wrapperClassName="flex gap-4"
        />
      </Section>

      <Section title="Custom Theme - Gradient Border">
        <OtpInput
          value={gradientValue}
          onChange={setGradientValue}
          inputClassName="w-12 h-12 text-center text-lg font-medium rounded-lg bg-white text-gray-900 outline-none border-2 border-transparent bg-clip-padding transition-all focus:ring-2 focus:ring-pink-500"
          wrapperClassName="flex gap-2"
          containerClassName="[&_input]:bg-gradient-to-r [&_input]:from-purple-500 [&_input]:to-pink-500 [&_input]:[background-origin:border-box] [&_input]:[background-clip:padding-box,border-box]"
        />
      </Section>

      <Section title="Individual Input Styling">
        <p className="text-sm text-gray-600 mb-4">
          Each input can have different styles using inputClassNames array
        </p>
        <OtpInput
          value={individualStyleValue}
          onChange={setIndividualStyleValue}
          inputClassName="w-12 h-12 text-center text-lg font-medium border rounded-lg bg-white text-gray-900 outline-none transition-all focus:ring-2"
          inputClassNames={[
            "border-red-300 focus:ring-red-500 focus:border-red-500",
            "border-orange-300 focus:ring-orange-500 focus:border-orange-500",
            "border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500",
            "border-green-300 focus:ring-green-500 focus:border-green-500",
            "border-blue-300 focus:ring-blue-500 focus:border-blue-500",
            "border-purple-300 focus:ring-purple-500 focus:border-purple-500",
          ]}
          wrapperClassName="flex gap-2"
        />
      </Section>

      <Section title="Large Inputs">
        <OtpInput
          length={4}
          value={fourDigitValue}
          onChange={setFourDigitValue}
          inputClassName="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl bg-white text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          wrapperClassName="flex gap-4"
        />
      </Section>

      <Section title="Small Inputs">
        <OtpInput
          length={8}
          value={eightDigitValue}
          onChange={setEightDigitValue}
          inputClassName="w-8 h-8 text-center text-sm font-medium border border-gray-300 rounded bg-white text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          wrapperClassName="flex gap-1"
        />
      </Section>

      <Section title="Full Width">
        <div className="w-full max-w-md">
          <OtpInput
            length={6}
            value={basicValue}
            onChange={setBasicValue}
            fullWidth
            inputClassName="flex-1 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg bg-white text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            wrapperClassName="flex gap-2 w-full"
            containerClassName="w-full"
          />
        </div>
      </Section>

      <Section title="Credit Card Style (4-4-4-4)">
        <OtpInput
          length={16}
          value=""
          onChange={() => {}}
          groups={[4, 4, 4, 4]}
          separator={<span className="text-gray-300">-</span>}
          inputClassName="w-8 h-10 text-center text-sm font-mono border border-gray-300 rounded bg-white text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          wrapperClassName="flex items-center gap-2"
          groupClassName="flex gap-0.5"
          separatorClassName="mx-1"
        />
      </Section>

      <Section title="Data Attributes">
        <p className="text-sm text-gray-600 mb-4">
          The OtpInput component applies data attributes for CSS styling:
        </p>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Attribute
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Applied To
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  data-disabled
                </td>
                <td className="py-2 pr-4 text-gray-600">container, inputs</td>
                <td className="py-2 text-gray-600">
                  Present when input is disabled
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  data-error
                </td>
                <td className="py-2 pr-4 text-gray-600">container, inputs</td>
                <td className="py-2 text-gray-600">
                  Present when input has an error
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  data-filled
                </td>
                <td className="py-2 pr-4 text-gray-600">input</td>
                <td className="py-2 text-gray-600">
                  Present when input has a value
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  data-index
                </td>
                <td className="py-2 pr-4 text-gray-600">input</td>
                <td className="py-2 text-gray-600">
                  The index of the input (0-based)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  data-group
                </td>
                <td className="py-2 pr-4 text-gray-600">group wrapper</td>
                <td className="py-2 text-gray-600">
                  The index of the group (when using groups)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="OtpInput Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">length</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">6</td>
                <td className="py-2 text-gray-600">Number of input boxes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Current OTP value</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">
                  (value: string) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when value changes
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onComplete
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (value: string) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when all digits are filled
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">groups</td>
                <td className="py-2 pr-4 text-gray-600">number[]</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Array defining input grouping (e.g., [3,3])
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">separator</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Element to render between groups
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  allowPaste
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Enable/disable paste functionality
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  autoFocusFirst
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Auto-focus first input on mount
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">inputType</td>
                <td className="py-2 pr-4 text-gray-600">"text" | "password"</td>
                <td className="py-2 pr-4 text-gray-500">"text"</td>
                <td className="py-2 text-gray-600">
                  Input type (text or password for masking)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  inputClassNames
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (string | undefined)[]
                </td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">
                  Individual class names per input index
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Label text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show required indicator</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Error state</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Disabled state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  HTML id attribute for the input
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  HTML name attribute for the input
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Take full width of container
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
                <td className="py-2 pr-4 font-mono text-blue-600">
                  containerClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for outer container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  wrapperClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for inputs wrapper
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  groupClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for group containers
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  inputClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for all input elements
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  focusClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for focus states
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for label element
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  errorClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for error message
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  separatorClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for separator elements
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  inputClassNames
                </td>
                <td className="py-2 text-gray-600">
                  Array of classes for individual inputs by index
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default OtpInputDemo;
