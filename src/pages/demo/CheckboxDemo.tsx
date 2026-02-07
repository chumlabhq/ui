import { useState, useRef } from "react";
import { Checkbox } from "../../components/Checkbox";
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
// ICONS
// ============================================================================

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const EmptyHeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

// ============================================================================
// MAIN CHECKBOX DEMO COMPONENT
// ============================================================================

const CheckboxDemo = () => {
  const { isDarkMode } = useTheme();
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Dark mode aware class names
  const getCheckboxClassNames = () => ({
    container: "flex items-start gap-3",
    labelContainer: "flex flex-col",
    label: `text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`,
    description: `text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
    checkboxBase: `inline-flex items-center justify-center border-2 transition-colors cursor-pointer ${
      isDarkMode ? "focus-within:ring-2 focus-within:ring-blue-400" : "focus-within:ring-2 focus-within:ring-blue-500"
    }`,
    checked: `${isDarkMode ? "bg-blue-500 border-blue-500" : "bg-blue-600 border-blue-600"} text-white`,
    unchecked: `${isDarkMode ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"}`,
    indeterminate: `${isDarkMode ? "bg-blue-500 border-blue-500" : "bg-blue-600 border-blue-600"} text-white`,
    icon: "w-3 h-3",
    error: `text-sm ${isDarkMode ? "text-red-400" : "text-red-500"}`,
    errorLabel: `text-sm font-medium ${isDarkMode ? "text-red-400" : "text-red-700"}`,
    errorCheckbox: `inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer ${
      isDarkMode ? "border-red-400" : "border-red-500"
    }`,
    disabled: `inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-not-allowed opacity-50 ${
      isDarkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100 border-gray-200"
    }`,
    disabledLabel: `text-sm font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`,
  });

  const classes = getCheckboxClassNames();

  // State management for demos
  const [stateNotSelected, setStateNotSelected] = useState(false);
  const [stateSelected, setStateSelected] = useState(true);
  const [stateIndeterminate, setStateIndeterminate] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(true);

  const [basic, setBasic] = useState(false);
  const [withLabel, setWithLabel] = useState(true);
  const [withDescription, setWithDescription] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [customIcon, setCustomIcon] = useState(false);
  const [customStar, setCustomStar] = useState(true);
  const [error, setError] = useState(false);
  const [purple, setPurple] = useState(false);
  const [green, setGreen] = useState(true);

  const [sizeXs, setSizeXs] = useState(true);
  const [sizeSm, setSizeSm] = useState(true);
  const [sizeMd, setSizeMd] = useState(true);
  const [sizeLg, setSizeLg] = useState(true);
  const [sizeXl, setSizeXl] = useState(true);
  const [sizeCustom28, setSizeCustom28] = useState(true);
  const [sizeCustom40, setSizeCustom40] = useState(true);

  const [shapeSquare, setShapeSquare] = useState(true);
  const [shapeRounded, setShapeRounded] = useState(true);
  const [shapeCircle, setShapeCircle] = useState(true);

  const [comboSmSquare, setComboSmSquare] = useState(true);
  const [comboMdRounded, setComboMdRounded] = useState(true);
  const [comboLgCircle, setComboLgCircle] = useState(true);
  const [comboXlCircle, setComboXlCircle] = useState(true);

  const [customRoundedLg, setCustomRoundedLg] = useState(true);
  const [customRoundedXl, setCustomRoundedXl] = useState(true);

  const [uncheckedIconDemo, setUncheckedIconDemo] = useState(false);
  const [indeterminateIconDemo, setIndeterminateIconDemo] = useState(false);
  const [isIndeterminateCustom, setIsIndeterminateCustom] = useState(true);

  const [sizeClassNameDemo, setSizeClassNameDemo] = useState(true);

  const [formCheckbox1, setFormCheckbox1] = useState(false);
  const [formCheckbox2, setFormCheckbox2] = useState(true);

  const [focusBlurDemo, setFocusBlurDemo] = useState(false);
  const [focusLog, setFocusLog] = useState<string[]>([]);

  const [nativePropsDemo, setNativePropsDemo] = useState(false);
  const readOnlyDemo = true;

  return (
    <div className="space-y-16">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Checkbox
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A customizable checkbox component with support for labels, descriptions, icons, 
          indeterminate state, and various sizes/shapes. Fully accessible with WAI-ARIA support.
        </p>

        {/* Quick Install */}
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { Checkbox } from "@kern-ui/checkbox";`}
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
        {/* Checkbox States */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Checkbox States"
          description="Demonstrates the three main visual states of a checkbox."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-center gap-3">
                <Checkbox
                  aria-label="Not selected state"
                  checked={stateNotSelected}
                  onCheckedChange={(checked) => setStateNotSelected(checked)}
                  size="xl"
                  shape="rounded"
                  checkboxClassName={classes.checkboxBase}
                  checkedClassName={classes.checked}
                  uncheckedClassName={classes.unchecked}
                />
                <span className={`text-base font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Not selected
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Checkbox
                  aria-label="Selected state"
                  checked={stateSelected}
                  onCheckedChange={(checked) => setStateSelected(checked)}
                  size="xl"
                  shape="rounded"
                  checkboxClassName={classes.checkboxBase}
                  checkedClassName={classes.checked}
                  uncheckedClassName={classes.unchecked}
                />
                <span className={`text-base font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Selected
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Checkbox
                  aria-label="Indeterminate state"
                  checked={stateIndeterminate}
                  indeterminate={isIndeterminate}
                  onCheckedChange={() => {
                    if (isIndeterminate) {
                      setIsIndeterminate(false);
                      setStateIndeterminate(true);
                    } else if (stateIndeterminate) {
                      setStateIndeterminate(false);
                    } else {
                      setIsIndeterminate(true);
                    }
                  }}
                  size="xl"
                  shape="rounded"
                  checkboxClassName={classes.checkboxBase}
                  checkedClassName={classes.checked}
                  uncheckedClassName={classes.unchecked}
                  indeterminateClassName={classes.indeterminate}
                />
                <span className={`text-base font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Indeterminate
                </span>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Basic Checkbox */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Basic Checkbox"
          description="A simple checkbox with no label."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Checkbox
              aria-label="Basic checkbox"
              checked={basic}
              onCheckedChange={(checked) => setBasic(checked)}
              checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
              checkedClassName={classes.checked}
              uncheckedClassName={classes.unchecked}
              iconClassName={classes.icon}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* With Label */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="With Label"
          description="Use the label prop to add an accessible label next to the checkbox."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Accept terms and conditions"
                checked={withLabel}
                onCheckedChange={(checked) => setWithLabel(checked)}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* With Label and Description */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="With Label and Description"
          description="Add additional context using the description prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Checkbox
              label="Email notifications"
              description="Receive email updates about your account activity"
              checked={withDescription}
              onCheckedChange={(checked) => setWithDescription(checked)}
              containerClassName={classes.container}
              labelContainerClassName={classes.labelContainer}
              labelClassName={classes.label}
              descriptionClassName={classes.description}
              checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
              checkedClassName={classes.checked}
              uncheckedClassName={classes.unchecked}
              iconClassName={classes.icon}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Required */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Required"
          description="Use the required prop to indicate mandatory fields. Shows an asterisk (*) and sets aria-required."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Checkbox
              label="I agree to the privacy policy"
              required
              checked={false}
              containerClassName={classes.container}
              labelContainerClassName={classes.labelContainer}
              labelClassName={classes.label}
              checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
              uncheckedClassName={classes.unchecked}
              iconClassName={classes.icon}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Indeterminate State */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Indeterminate State"
          description="Use the indeterminate prop for 'select all' scenarios where some items are selected."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Checkbox
              label="Select all items"
              indeterminate={indeterminate}
              checked={false}
              onCheckedChange={() => setIndeterminate(!indeterminate)}
              containerClassName={classes.container}
              labelContainerClassName={classes.labelContainer}
              labelClassName={classes.label}
              checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
              checkedClassName={classes.checked}
              uncheckedClassName={classes.unchecked}
              indeterminateClassName={classes.indeterminate}
              iconClassName={classes.icon}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Icons */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Icons"
          description="Replace the default checkmark with custom icons using the checkedIcon prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Add to favorites"
                checked={customIcon}
                onCheckedChange={(checked) => setCustomIcon(checked)}
                checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={`${isDarkMode ? "bg-red-500 border-red-500" : "bg-red-500 border-red-500"} text-white`}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
              <Checkbox
                label="Star this item"
                checked={customStar}
                onCheckedChange={(checked) => setCustomStar(checked)}
                checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={`${isDarkMode ? "bg-yellow-500 border-yellow-500" : "bg-yellow-500 border-yellow-500"} text-white`}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Unchecked Icon */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Unchecked Icon"
          description="Display an icon even when the checkbox is unchecked using the uncheckedIcon prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Checkbox
              label="Add to wishlist"
              checked={uncheckedIconDemo}
              onCheckedChange={(checked) => setUncheckedIconDemo(checked)}
              checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
              uncheckedIcon={<EmptyHeartIcon className={`w-3 h-3 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />}
              containerClassName={classes.container}
              labelContainerClassName={classes.labelContainer}
              labelClassName={classes.label}
              checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
              checkedClassName={`${isDarkMode ? "bg-red-500 border-red-500" : "bg-red-500 border-red-500"} text-white`}
              uncheckedClassName={classes.unchecked}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Indeterminate Icon */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Indeterminate Icon"
          description="Customize the indeterminate state icon using the indeterminateIcon prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Checkbox
              label="Partial selection (custom pause icon)"
              indeterminate={isIndeterminateCustom}
              checked={indeterminateIconDemo}
              onCheckedChange={() => {
                if (isIndeterminateCustom) {
                  setIsIndeterminateCustom(false);
                  setIndeterminateIconDemo(true);
                } else if (indeterminateIconDemo) {
                  setIndeterminateIconDemo(false);
                } else {
                  setIsIndeterminateCustom(true);
                }
              }}
              indeterminateIcon={<PauseIcon className="w-3 h-3 text-white" />}
              containerClassName={classes.container}
              labelContainerClassName={classes.labelContainer}
              labelClassName={classes.label}
              checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
              checkedClassName={classes.checked}
              uncheckedClassName={classes.unchecked}
              indeterminateClassName={`${isDarkMode ? "bg-amber-500 border-amber-500" : "bg-amber-500 border-amber-500"} text-white`}
              iconClassName={classes.icon}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Disabled States */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Disabled States"
          description="Disable the checkbox with the disabled prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Disabled unchecked"
                checked={false}
                disabled
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.disabledLabel}
                checkboxClassName={classes.disabled}
                uncheckedClassName={isDarkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100 border-gray-200"}
                iconClassName={classes.icon}
              />
              <Checkbox
                label="Disabled checked"
                checked={true}
                disabled
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.disabledLabel}
                checkboxClassName={classes.disabled}
                checkedClassName={`${isDarkMode ? "bg-blue-400 border-blue-400" : "bg-blue-400 border-blue-400"} text-white`}
                iconClassName={classes.icon}
              />
            </div>
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
            <Checkbox
              label="Accept terms to continue"
              checked={error}
              onCheckedChange={(checked) => setError(checked)}
              error
              errorMessage="You must accept the terms to continue"
              containerClassName="flex flex-col gap-1"
              className={classes.container}
              labelContainerClassName={classes.labelContainer}
              labelClassName={classes.errorLabel}
              checkboxClassName={classes.errorCheckbox}
              checkedClassName={`${isDarkMode ? "bg-red-500 border-red-500" : "bg-red-500 border-red-500"} text-white`}
              uncheckedClassName={isDarkMode ? "bg-gray-700" : "bg-white"}
              iconClassName={classes.icon}
              errorClassName={`${classes.error} ml-7`}
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Focus and Blur Events */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Focus and Blur Events"
          description="Use onFocus and onBlur props to handle focus events."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Focus me to see events"
                checked={focusBlurDemo}
                onCheckedChange={(checked) => setFocusBlurDemo(checked)}
                onFocus={() => {
                  setFocusLog((prev) => [...prev.slice(-4), `Focus: ${new Date().toLocaleTimeString()}`]);
                }}
                onBlur={() => {
                  setFocusLog((prev) => [...prev.slice(-4), `Blur: ${new Date().toLocaleTimeString()}`]);
                }}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
              <div className={`p-3 rounded-lg text-sm font-mono ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Event Log:</p>
                {focusLog.length === 0 ? (
                  <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>Focus or blur the checkbox to see events...</span>
                ) : (
                  focusLog.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Checkbox
  label="Focus me"
  onFocus={(e) => console.log('Focused!', e)}
  onBlur={(e) => console.log('Blurred!', e)}
  checked={checked}
  onCheckedChange={setChecked}
/>`}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Colors */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Colors"
          description="Customize colors using className props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Purple theme"
                checked={purple}
                onCheckedChange={(checked) => setPurple(checked)}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-sm font-medium ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={`${isDarkMode ? "bg-purple-500 border-purple-500" : "bg-purple-600 border-purple-600"} text-white`}
                uncheckedClassName={`${isDarkMode ? "bg-gray-700 border-purple-400" : "bg-white border-purple-300"}`}
                iconClassName={classes.icon}
              />
              <Checkbox
                label="Green theme"
                checked={green}
                onCheckedChange={(checked) => setGreen(checked)}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-sm font-medium ${isDarkMode ? "text-green-300" : "text-green-700"}`}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={`${isDarkMode ? "bg-green-500 border-green-500" : "bg-green-600 border-green-600"} text-white`}
                uncheckedClassName={`${isDarkMode ? "bg-gray-700 border-green-400" : "bg-white border-green-300"}`}
                iconClassName={classes.icon}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Sizes (Predefined) */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Sizes (Predefined)"
          description="Use the size prop with predefined values: xs, sm, md, lg, xl."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Extra Small (xs)"
                checked={sizeXs}
                onCheckedChange={(checked) => setSizeXs(checked)}
                size="xs"
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-xs font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Small (sm)"
                checked={sizeSm}
                onCheckedChange={(checked) => setSizeSm(checked)}
                size="sm"
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Medium (md)"
                checked={sizeMd}
                onCheckedChange={(checked) => setSizeMd(checked)}
                size="md"
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Large (lg)"
                checked={sizeLg}
                onCheckedChange={(checked) => setSizeLg(checked)}
                size="lg"
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-base font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Extra Large (xl)"
                checked={sizeXl}
                onCheckedChange={(checked) => setSizeXl(checked)}
                size="xl"
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Size (Numeric) */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Size (Numeric)"
          description="Pass a number to the size prop for custom pixel sizes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="28px custom size"
                checked={sizeCustom28}
                onCheckedChange={(checked) => setSizeCustom28(checked)}
                size={28}
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="40px custom size"
                checked={sizeCustom40}
                onCheckedChange={(checked) => setSizeCustom40(checked)}
                size={40}
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={`${isDarkMode ? "bg-indigo-500 border-indigo-500" : "bg-indigo-600 border-indigo-600"} text-white`}
                uncheckedClassName={classes.unchecked}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Size via sizeClassName */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Size via sizeClassName"
          description="Use sizeClassName prop to set size via Tailwind classes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Checkbox
              label="Size via Tailwind class (w-6 h-6)"
              checked={sizeClassNameDemo}
              onCheckedChange={(checked) => setSizeClassNameDemo(checked)}
              shape="rounded"
              sizeClassName="w-6 h-6"
              containerClassName={classes.container}
              labelContainerClassName={classes.labelContainer}
              labelClassName={classes.label}
              checkboxClassName={classes.checkboxBase}
              checkedClassName={classes.checked}
              uncheckedClassName={classes.unchecked}
              iconClassName="w-4 h-4"
            />
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Shapes */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Shapes"
          description="Use the shape prop to set border-radius: square, rounded, or circle."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap items-center gap-6">
              <Checkbox
                label="Square"
                checked={shapeSquare}
                onCheckedChange={(checked) => setShapeSquare(checked)}
                size="md"
                shape="square"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Rounded"
                checked={shapeRounded}
                onCheckedChange={(checked) => setShapeRounded(checked)}
                size="md"
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Circle"
                checked={shapeCircle}
                onCheckedChange={(checked) => setShapeCircle(checked)}
                size="md"
                shape="circle"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Shapes with Different Sizes */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Shapes with Different Sizes"
          description="Combine size and shape props for various checkbox styles."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Small Square"
                checked={comboSmSquare}
                onCheckedChange={(checked) => setComboSmSquare(checked)}
                size="sm"
                shape="square"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={`${isDarkMode ? "bg-teal-500 border-teal-500" : "bg-teal-600 border-teal-600"} text-white`}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Medium Rounded"
                checked={comboMdRounded}
                onCheckedChange={(checked) => setComboMdRounded(checked)}
                size="md"
                shape="rounded"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={`${isDarkMode ? "bg-orange-500 border-orange-500" : "bg-orange-600 border-orange-600"} text-white`}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Large Circle"
                checked={comboLgCircle}
                onCheckedChange={(checked) => setComboLgCircle(checked)}
                size="lg"
                shape="circle"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-base font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={`${isDarkMode ? "bg-pink-500 border-pink-500" : "bg-pink-600 border-pink-600"} text-white`}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="XL Circle"
                checked={comboXlCircle}
                onCheckedChange={(checked) => setComboXlCircle(checked)}
                size="xl"
                shape="circle"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={`${isDarkMode ? "bg-violet-500 border-violet-500" : "bg-violet-600 border-violet-600"} text-white`}
                uncheckedClassName={classes.unchecked}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Shape via shapeClassName */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Shape via shapeClassName"
          description="Use shapeClassName prop to override the shape with custom Tailwind classes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Custom rounded-lg"
                checked={customRoundedLg}
                onCheckedChange={(checked) => setCustomRoundedLg(checked)}
                size="lg"
                shapeClassName="rounded-lg"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-base font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={`${isDarkMode ? "bg-cyan-500 border-cyan-500" : "bg-cyan-600 border-cyan-600"} text-white`}
                uncheckedClassName={classes.unchecked}
              />
              <Checkbox
                label="Custom rounded-xl"
                checked={customRoundedXl}
                onCheckedChange={(checked) => setCustomRoundedXl(checked)}
                size="xl"
                shapeClassName="rounded-xl"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={`text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                checkboxClassName={classes.checkboxBase}
                checkedClassName={`${isDarkMode ? "bg-rose-500 border-rose-500" : "bg-rose-600 border-rose-600"} text-white`}
                uncheckedClassName={classes.unchecked}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* With id and name Props */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom ID and Name"
          description="Set custom id and name attributes for form handling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <form className="space-y-4">
              <Checkbox
                id="terms-checkbox"
                name="acceptTerms"
                label="I accept the terms and conditions"
                checked={formCheckbox1}
                onCheckedChange={(checked) => setFormCheckbox1(checked)}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
              <Checkbox
                id="newsletter-checkbox"
                name="subscribeNewsletter"
                label="Subscribe to newsletter"
                checked={formCheckbox2}
                onCheckedChange={(checked) => setFormCheckbox2(checked)}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
              <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Inspect the checkboxes to see custom{" "}
                <code className={`px-1 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>id</code> and{" "}
                <code className={`px-1 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>name</code> attributes
              </p>
            </form>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Ref Forwarding */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Ref Forwarding"
          description="Access the underlying input element using React refs."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                ref={checkboxRef}
                label="Click the button to focus me"
                checked={false}
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => checkboxRef.current?.focus()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Focus Checkbox
                </button>
                <button
                  type="button"
                  onClick={() => checkboxRef.current?.click()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Toggle Checkbox
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Checked: ${checkboxRef.current?.checked}`)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Get State
                </button>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Uncontrolled (defaultChecked) */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Uncontrolled (defaultChecked)"
          description="Use defaultChecked for uncontrolled checkboxes that manage their own state internally."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Starts unchecked"
                defaultChecked={false}
                onCheckedChange={(checked) => console.log("Uncontrolled 1:", checked)}
                checkboxClassName="inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer"
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
                labelClassName={classes.label}
              />
              <Checkbox
                label="Starts checked"
                defaultChecked={true}
                onCheckedChange={(checked) => console.log("Uncontrolled 2:", checked)}
                checkboxClassName="inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer"
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
                labelClassName={classes.label}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Native HTML Input Props */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Native HTML Input Props"
          description="Pass any native HTML input attribute via the spread operator (...rest). Supports autoFocus, tabIndex, data attributes, and more."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Checkbox
                label="Auto-focused checkbox"
                checked={nativePropsDemo}
                onCheckedChange={(checked) => setNativePropsDemo(checked)}
                autoFocus
                tabIndex={0}
                data-testid="autofocus-checkbox"
                aria-label="This checkbox receives focus automatically"
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
              <Checkbox
                label="Read-only checkbox (cannot be changed by user)"
                checked={readOnlyDemo}
                readOnly
                containerClassName={classes.container}
                labelContainerClassName={classes.labelContainer}
                labelClassName={classes.label}
                checkboxClassName={`inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer`}
                checkedClassName={classes.checked}
                uncheckedClassName={classes.unchecked}
                iconClassName={classes.icon}
              />
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`// Native HTML attributes are passed through to the input element
<Checkbox
  autoFocus
  tabIndex={0}
  data-testid="my-checkbox"
  aria-label="Custom accessible label"
  checked={checked}
  onCheckedChange={setChecked}
/>

// Read-only checkbox
<Checkbox
  readOnly
  checked={true}
  label="Cannot be changed"
/>`}
          />
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>Note:</strong> The Checkbox component extends native{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>
                InputHTMLAttributes
              </code>{" "}
              (excluding type, onChange, size, and defaultChecked) and accepts all standard input props.
            </p>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* API REFERENCE SECTION */}
      {/* ================================================================== */}
      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        {/* Checkbox Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Checkbox Props
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
                  <td className="py-3 pr-4 font-mono text-blue-500">id</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>auto-generated</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom ID for the checkbox element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">name</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Name attribute for form submission
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checked</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Controlled checked state
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">defaultChecked</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Initial checked state (uncontrolled)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">indeterminate</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the checkbox is in indeterminate state
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onCheckedChange</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(checked: boolean) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when checkbox state changes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onFocus</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(event: FocusEvent) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when checkbox receives focus
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onBlur</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(event: FocusEvent) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when checkbox loses focus
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">label</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Label text for the checkbox
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">description</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Description text below the label
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the checkbox is disabled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">required</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the checkbox is required (shows * and sets aria-required)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">error</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the checkbox is in error state (sets aria-invalid)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorMessage</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Error message to display below the checkbox
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>"xs" | "sm" | "md" | "lg" | "xl" | number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Checkbox size (predefined or custom pixel value)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shape</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>"square" | "rounded" | "circle"</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Checkbox shape (border-radius)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checkedIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>CheckIcon</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom icon when checked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">uncheckedIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>null</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom icon when unchecked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">indeterminateIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>MinusIcon</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom icon for indeterminate state
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
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the label wrapper (checkbox + label row)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">containerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the outer container (includes error message)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">labelContainerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the label/description wrapper
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">labelClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the label text
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">descriptionClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the description text
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checkboxClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Base CSS class for the checkbox box element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">checkedClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class applied when checkbox is checked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">uncheckedClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class applied when checkbox is unchecked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">indeterminateClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class applied when checkbox is indeterminate
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">iconClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the default icons
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the error message
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">sizeClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for custom size (overrides size prop styles)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shapeClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for custom shape (overrides shape prop)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Attributes */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Data Attributes
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            The Checkbox component applies data attributes for CSS-based styling and JavaScript selection.
          </p>
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
                  <td className="py-3 pr-4 font-mono text-blue-500">data-checked</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    container, checkbox span
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Present when checkbox is checked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-indeterminate</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    container, checkbox span
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Present when checkbox is indeterminate
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    container, checkbox span
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Present when checkbox is disabled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-error</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    container, checkbox span
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Present when checkbox has error
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-size</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    container, checkbox span
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Size value when using predefined sizes (xs, sm, md, lg, xl)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-shape</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    container, checkbox span
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Shape value (square, rounded, circle)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Example usage:{" "}
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
              data-[checked]:bg-blue-500
            </code>
            ,{" "}
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
              data-[disabled]:opacity-50
            </code>
          </p>
        </div>

        {/* Size Reference */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Size Reference
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Size</th>
                  <th className="text-left py-3 pr-4 font-semibold">Box Size</th>
                  <th className="text-left py-3 font-semibold">Icon Size</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">xs</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>14px</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>10px</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">sm</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>16px</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>12px</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">md</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>20px</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>14px</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">lg</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>24px</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>18px</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">xl</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>32px</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>24px</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Custom value</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>60% of box size</td>
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
            code={`type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
type CheckboxShape = "square" | "rounded" | "circle";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size" | "defaultChecked"> {
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: ReactNode;
  size?: CheckboxSize;
  shape?: CheckboxShape;
  checkedIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
  containerClassName?: string;
  labelContainerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  checkboxClassName?: string;
  checkedClassName?: string;
  uncheckedClassName?: string;
  indeterminateClassName?: string;
  iconClassName?: string;
  errorClassName?: string;
  sizeClassName?: string;
  shapeClassName?: string;
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
              Label is automatically associated with checkbox via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                htmlFor
              </code>
            </li>
            <li>
              Required checkboxes have{" "}
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
              Description text is linked via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-describedby
              </code>
            </li>
            <li>Supports ref forwarding for programmatic focus management</li>
            <li>Native checkbox element for full keyboard and screen reader support</li>
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
              - Move focus to/from checkbox
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Space
              </kbd>{" "}
              - Toggle checkbox state when focused
            </li>
          </ul>
        </div>
      </div>

      {/* ================================================================== */}
      {/* NATIVE PROPS NOTE */}
      {/* ================================================================== */}
      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Note:</strong> Checkbox extends native{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            InputHTMLAttributes
          </code>{" "}
          (excluding type, onChange, size, and defaultChecked) and accepts all standard input props such as{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>autoFocus</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>tabIndex</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>readOnly</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>form</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>value</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>data-*</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>aria-*</code>, etc.
        </p>
      </div>
    </div>
  );
};

export default CheckboxDemo;
