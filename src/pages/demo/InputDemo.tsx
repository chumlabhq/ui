import { useState, useRef } from "react";
import { Input, InputLabel } from "../../components/Input";
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

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CloseIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const EyeIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ============================================================================
// MAIN INPUT DEMO COMPONENT
// ============================================================================

const InputDemo = () => {
  const { isDarkMode } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Dark mode aware class names
  const getInputClassNames = () => ({
    input: `w-full bg-transparent outline-none ${
      isDarkMode
        ? "text-white placeholder:text-gray-500"
        : "text-gray-900 placeholder:text-gray-400"
    }`,
    wrapper: `px-3 py-2 rounded-lg border gap-2 ${
      isDarkMode
        ? "border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400"
        : "border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
    }`,
    wrapperError: `px-3 py-2 rounded-lg border gap-2 ${
      isDarkMode
        ? "border-red-400 bg-gray-700 focus-within:ring-2 focus-within:ring-red-400"
        : "border-red-500 bg-white focus-within:ring-2 focus-within:ring-red-500"
    }`,
    label: `text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`,
    container: "flex flex-col gap-1",
    disabled: `w-full bg-transparent outline-none cursor-not-allowed ${
      isDarkMode
        ? "text-gray-500 placeholder:text-gray-600"
        : "text-gray-400 placeholder:text-gray-300"
    }`,
    wrapperDisabled: `px-3 py-2 rounded-lg border gap-2 opacity-60 ${
      isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-100"
    }`,
  });

  const classes = getInputClassNames();

  return (
    <div className="space-y-16">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Input
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A flexible, accessible input component for forms and data entry. Supports icons,
          loading states, error handling, and extensive customization through className props.
        </p>

        {/* Quick Install */}
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { Input, InputLabel } from "@kern-ui/input";`}
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
        {/* Basic Usage */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Basic Input"
          description="A simple text input with no additional props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full max-w-md">
              <Input
                placeholder="Enter text..."
                className={classes.input}
                wrapperClassName={classes.wrapper}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <Input
                label="Email"
                placeholder="you@example.com"
                type="email"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Username"
                placeholder="Enter username"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Required Fields */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Required Fields"
          description="Add required prop to show an asterisk (*) indicator and set aria-required."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                required
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* With Icons */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="With Icons"
          description="Add leading and trailing icons using the leadingIcon and trailingIcon props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Leading icon
                </p>
                <Input
                  placeholder="Search..."
                  leadingIcon={<SearchIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Trailing icon
                </p>
                <Input
                  placeholder="Enter amount"
                  trailingIcon={<ArrowRightIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Both icons
                </p>
                <Input
                  placeholder="Search and submit"
                  leadingIcon={<SearchIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  trailingIcon={<ArrowRightIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Clickable Icons */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Clickable Icons"
          description="Make icons interactive with onLeadingIconClick and onTrailingIconClick. Use leadingIconLabel and trailingIconLabel for accessibility."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Search with clear button
                </p>
                <Input
                  placeholder="Search..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leadingIcon={<SearchIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  onLeadingIconClick={() => alert("Search triggered!")}
                  leadingIconLabel="Search"
                  trailingIcon={inputValue ? <CloseIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} /> : undefined}
                  onTrailingIconClick={() => setInputValue("")}
                  trailingIconLabel="Clear input"
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Password visibility toggle
                </p>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  leadingIcon={<LockIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  trailingIcon={
                    showPassword
                      ? <EyeOffIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                      : <EyeIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                  }
                  onTrailingIconClick={() => setShowPassword(!showPassword)}
                  trailingIconLabel={showPassword ? "Hide password" : "Show password"}
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
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
            <div className="space-y-4 w-full max-w-md">
              <Input
                label="Email"
                placeholder="you@example.com"
                value="invalid-email"
                error
                errorMessage="Please enter a valid email address"
                className={classes.input}
                wrapperClassName={classes.wrapperError}
                labelClassName={classes.label}
                errorClassName={classes.error}
                containerClassName={classes.container}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value="123"
                error
                errorMessage={
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Password must be at least 8 characters
                  </span>
                }
                className={classes.input}
                wrapperClassName={classes.wrapperError}
                labelClassName={classes.label}
                errorClassName={classes.error}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Loading State */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Loading State"
          description="Use isLoading to show a loader and disable the input. Customize with loader and loaderSize props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Default loader
                </p>
                <Input
                  placeholder="Loading..."
                  isLoading
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Custom loader size (loaderSize=20)
                </p>
                <Input
                  placeholder="Loading..."
                  isLoading
                  loaderSize={20}
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Custom loader component
                </p>
                <Input
                  placeholder="Validating..."
                  isLoading
                  loader={
                    <span className={`text-xs animate-pulse ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
                      Checking...
                    </span>
                  }
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Loading with icon
                </p>
                <Input
                  placeholder="Searching..."
                  isLoading
                  leadingIcon={<SearchIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                />
              </div>
            </div>
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
            <div className="space-y-4 w-full max-w-md">
              <Input
                placeholder="Disabled input"
                disabled
                className={classes.disabled}
                wrapperClassName={classes.wrapperDisabled}
              />
              <Input
                label="Disabled with value"
                value="Cannot edit this"
                disabled
                className={classes.disabled}
                wrapperClassName={classes.wrapperDisabled}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                placeholder="Disabled with icon"
                disabled
                leadingIcon={<LockIcon className={isDarkMode ? "text-gray-500" : "text-gray-400"} />}
                className={classes.disabled}
                wrapperClassName={classes.wrapperDisabled}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Full Width */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Full Width"
          description="Use fullWidth prop to make the input span the full container width."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Input
                placeholder="Full width input"
                fullWidth
                className={classes.input}
                wrapperClassName={classes.wrapper}
              />
              <Input
                label="Full width with label"
                placeholder="Enter your message..."
                fullWidth
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
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
            <div className="max-w-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  alert(`Form submitted!\nUsername: ${formData.get("username")}\nEmail: ${formData.get("user-email")}`);
                }}
                className="space-y-4"
              >
                <Input
                  id="username-input"
                  name="username"
                  label="Username"
                  placeholder="Enter username"
                  className={classes.input}
                  wrapperClassName={classes.wrapper}
                  labelClassName={classes.label}
                  containerClassName={classes.container}
                />
                <Input
                  id="email-input"
                  name="user-email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  className={classes.input}
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
                  Submit Form
                </button>
              </form>
            </div>
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
        {/* Ref Forwarding */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Ref Forwarding"
          description="Access the underlying input element using React refs."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <Input
                ref={inputRef}
                placeholder="Click the button to focus me"
                className={classes.input}
                wrapperClassName={classes.wrapper}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => inputRef.current?.focus()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Focus Input
                </button>
                <button
                  onClick={() => inputRef.current?.select()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Select All
                </button>
                <button
                  onClick={() => alert(`Current value: "${inputRef.current?.value}"`)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Get Value
                </button>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Different Input Types */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Different Input Types"
          description="The component supports all HTML input types."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Text"
                type="text"
                placeholder="Enter text"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                leadingIcon={<MailIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                leadingIcon={<LockIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Number"
                type="number"
                placeholder="0"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="URL"
                type="url"
                placeholder="https://example.com"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Date"
                type="date"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Time"
                type="time"
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Search"
                type="search"
                placeholder="Search..."
                leadingIcon={<SearchIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* InputLabel Standalone */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="InputLabel Standalone"
          description="Use InputLabel separately for custom layouts."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <InputLabel
                  label="Standalone Label"
                  inputId="custom-input"
                  className={classes.label}
                />
                <div className="mt-1">
                  <input
                    id="custom-input"
                    type="text"
                    placeholder="Native input with InputLabel"
                    className={`w-full px-3 py-2 rounded-lg border outline-none ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>
              <div>
                <InputLabel
                  label="Required Field"
                  inputId="required-input"
                  required
                  className={classes.label}
                />
                <p className={`text-xs mt-0.5 mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Required indicator (*) is added automatically
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Styling */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Theme Examples"
          description="Customize the input appearance using className props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Rounded Pill
                </p>
                <Input
                  placeholder="Search..."
                  leadingIcon={<SearchIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  className={`w-full bg-transparent outline-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-4 py-2 rounded-full border gap-2 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-blue-400"
                      : "border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Underline Style
                </p>
                <Input
                  placeholder="Enter text..."
                  className={`w-full bg-transparent outline-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-1 py-2 border-b-2 gap-2 ${
                    isDarkMode
                      ? "border-gray-600 focus-within:border-blue-400"
                      : "border-gray-300 focus-within:border-blue-500"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Green Accent
                </p>
                <Input
                  placeholder="Enter text..."
                  className={`w-full bg-transparent outline-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-3 py-2 rounded-lg border gap-2 ${
                    isDarkMode
                      ? "border-green-700 bg-green-900/30 focus-within:ring-2 focus-within:ring-green-500"
                      : "border-green-300 bg-green-50 focus-within:ring-2 focus-within:ring-green-500"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Shadow Style
                </p>
                <Input
                  placeholder="Enter text..."
                  className={`w-full bg-transparent outline-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-3 py-2 rounded-lg border-0 shadow-md gap-2 ${
                    isDarkMode
                      ? "bg-gray-700 focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-600"
                      : "bg-white focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-200"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Using wrapperFocusClassName
                </p>
                <Input
                  placeholder="Focus me..."
                  className={`w-full bg-transparent outline-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-3 py-2 rounded-lg border gap-2 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"}`}
                  wrapperFocusClassName={isDarkMode
                    ? "focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 focus-within:bg-purple-900/20"
                    : "focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 focus-within:bg-purple-50"
                  }
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Large Input
                </p>
                <Input
                  placeholder="Large input..."
                  className={`w-full bg-transparent outline-none text-lg ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-4 py-3 rounded-lg border gap-3 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-blue-400"
                      : "border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500"
                  }`}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Data Attributes */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Data Attributes"
          description="The Input component applies data attributes for CSS-based styling."
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
                      container, input
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when input is disabled or loading
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-error</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      container, input
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when input has an error
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-loading</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      container
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when input is in loading state
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
                data-[error]:border-red-500
              </code>
            </p>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Combined Example */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Login Form Example"
          description="A practical example combining multiple input features."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Form submitted!");
              }}
              className="max-w-md space-y-4"
            >
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                leadingIcon={<MailIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                required
                leadingIcon={<LockIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                className={classes.input}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <div className="flex items-center justify-between">
                <label className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <a href="#" className={`text-sm ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"}`}>
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className={`w-full py-2 rounded-lg font-medium text-white transition-colors ${
                  isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Sign In
              </button>
            </form>
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

        {/* Input Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Input
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
                    Custom ID for the input element
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
                  <td className="py-3 pr-4 font-mono text-blue-500">type</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"text"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    HTML input type (text, email, password, etc.)
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
                    Whether the input is required (shows * and sets aria-required)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the input is disabled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">error</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the input is in error state (sets aria-invalid)
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
                  <td className="py-3 pr-4 font-mono text-blue-500">leadingIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Icon displayed before the input
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">trailingIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Icon displayed after the input
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onLeadingIconClick</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when leading icon is clicked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onTrailingIconClick</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when trailing icon is clicked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">leadingIconLabel</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Accessible label for clickable leading icon
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">trailingIconLabel</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Accessible label for clickable trailing icon
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">isLoading</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Show loading state (disables input and shows loader)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loader</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>CircularLoader</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom loader component
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loaderSize</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>16</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Size of the default loader in pixels
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">fullWidth</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the input spans full container width
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
                    CSS class for the input element itself
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">containerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the outer container (includes label and error)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">wrapperClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the input wrapper (contains icons and input)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">wrapperFocusClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for focus state (use focus-within: prefixed classes)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">labelClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the label element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the error message element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* InputLabel Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            InputLabel
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

        {/* Type Definitions */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface InputLabelProps {
  label: ReactNode;
  required?: boolean;
  inputId?: string;
  className?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onLeadingIconClick?: () => void;
  onTrailingIconClick?: () => void;
  leadingIconLabel?: string;
  trailingIconLabel?: string;
  isLoading?: boolean;
  loader?: ReactNode;
  loaderSize?: number;
  fullWidth?: boolean;
  containerClassName?: string;
  wrapperClassName?: string;
  wrapperFocusClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
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
              Label is automatically associated with input via{" "}
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
              Clickable icons are keyboard accessible (Enter/Space) and have{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="button"
              </code>
            </li>
            <li>
              Use{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                leadingIconLabel
              </code>{" "}
              and{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                trailingIconLabel
              </code>{" "}
              for accessible icon buttons
            </li>
            <li>
              Loader has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-hidden="true"
              </code>{" "}
              as it's decorative
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
              - Move focus to/from input
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Enter
              </kbd>{" "}
              /{" "}
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Space
              </kbd>{" "}
              - Activate clickable icons when focused
            </li>
          </ul>
        </div>
      </div>

      {/* ================================================================== */}
      {/* NATIVE PROPS NOTE */}
      {/* ================================================================== */}
      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Note:</strong> Input extends native{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            InputHTMLAttributes
          </code>{" "}
          and accepts all standard input props such as{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>value</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>defaultValue</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onChange</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onBlur</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onFocus</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>placeholder</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>maxLength</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>minLength</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>readOnly</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>autoFocus</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>autoComplete</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>pattern</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>min</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>max</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>step</code>, etc.
        </p>
      </div>
    </div>
  );
};

export default InputDemo;
