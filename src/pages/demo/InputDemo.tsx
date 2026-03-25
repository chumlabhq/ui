import { useState, useRef } from "react";
import { Input, InputLabel } from "../../components/Input";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
} from "./components";

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = ({
  d,
  size = 16,
  className = "",
}: {
  d: string;
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {d.split("|").map((path, i) => (
      <path key={i} d={path} />
    ))}
  </svg>
);

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
const LinkIcon = ({ className = "" }: { className?: string }) => (
  <Icon
    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71|M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    className={className}
  />
);
const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M5 12h14|M12 5l7 7-7 7" className={className} />
);
const CloseIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M18 6 6 18|M6 6l12 12" className={className} />
);
const PhoneIcon = ({ className = "" }: { className?: string }) => (
  <Icon
    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
    className={className}
  />
);
const HashIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M4 9h16|M4 15h16|M10 3L8 21|M16 3l-2 18" className={className} />
);
const CalendarIcon = ({ className = "" }: { className?: string }) => (
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
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  // InputClasses object for the `classes` prop
  input: {
    root: "flex flex-col",
    input: `w-full bg-transparent outline-none text-sm ${dark ? "text-white placeholder:text-gray-500 [color-scheme:dark]" : "text-gray-900 placeholder:text-gray-400"}`,
    wrapper: `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${
      dark
        ? "text-gray-300 border-white/10 bg-white/4 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400/50"
        : "text-gray-700 border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04] focus-within:ring-2 focus-within:ring-indigo-500/15 focus-within:border-indigo-400"
    }`,
    label: `text-[13px] font-medium mb-1.5 block ${dark ? "text-gray-300" : "text-gray-700"}`,
    error: `text-xs mt-1.5 flex items-center gap-1.5 ${dark ? "text-red-400" : "text-red-500"}`,
    success: `text-xs mt-1.5 flex items-center gap-1.5 ${dark ? "text-emerald-400" : "text-emerald-600"}`,
    description: `text-xs mt-1 mb-1.5 ${dark ? "text-gray-500" : "text-gray-400"}`,
    prefix: `text-sm select-none ${dark ? "text-gray-500" : "text-gray-400"}`,
    suffix: `text-sm select-none ${dark ? "text-gray-500" : "text-gray-400"}`,
    count: `text-[11px] mt-1 text-right tabular-nums ${dark ? "text-gray-500" : "text-gray-400"}`,
  },
  // Variant wrapper overrides
  wrapperError: `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${
    dark
      ? "border-red-400/40 bg-red-500/[0.06] focus-within:ring-2 focus-within:ring-red-500/25"
      : "border-red-300 bg-red-50/40 shadow-sm shadow-red-900/[0.04] focus-within:ring-2 focus-within:ring-red-500/15"
  }`,
  wrapperSuccess: `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${
    dark
      ? "border-emerald-400/40 bg-emerald-500/[0.06] focus-within:ring-2 focus-within:ring-emerald-500/25"
      : "border-emerald-300 bg-emerald-50/40 shadow-sm shadow-emerald-900/[0.04] focus-within:ring-2 focus-within:ring-emerald-500/15"
  }`,
  wrapperDisabled: `px-3.5 py-2.5 rounded-xl border gap-2.5 opacity-50 cursor-not-allowed ${dark ? "border-white/5 bg-white/[0.02]" : "border-gray-200 bg-gray-50"}`,
  disabledInput: `w-full bg-transparent outline-none text-sm cursor-not-allowed ${dark ? "text-gray-500 placeholder:text-gray-600" : "text-gray-400 placeholder:text-gray-300"}`,
  icon: dark ? "text-gray-500" : "text-gray-400",
  iconHover: dark
    ? "text-gray-400 hover:text-gray-300"
    : "text-gray-400 hover:text-gray-600",
  // Demo UI classes
  badge: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${dark ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-400/20" : "bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-600/10"}`,
  sectionLabel: `text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-gray-600" : "text-gray-300"}`,
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  cardDense: `rounded-xl border p-4 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  propName: `font-mono text-xs ${dark ? "text-indigo-400" : "text-indigo-600"}`,
  propType: `font-mono text-[11px] ${dark ? "text-gray-500" : "text-gray-400"}`,
  propDefault: `font-mono text-[11px] ${dark ? "text-gray-600" : "text-gray-350"}`,
  propDesc: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
  code: `px-1.5 py-0.5 rounded-md text-[11px] font-mono font-medium ${dark ? "bg-white/6 text-gray-300" : "bg-gray-100 text-gray-600"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  tableHead: `text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`,
  tableCell: `py-2.5 px-4`,
  divider: `border-t ${dark ? "border-white/[0.06]" : "border-gray-100"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const InputDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const [showPw, setShowPw] = useState(false);
  const [search, setSearch] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const [amount, setAmount] = useState("");

  // Validation
  const emailOk = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailBad = email.length > 0 && !emailOk;
  const userOk = username.length >= 3;
  const userBad = username.length > 0 && username.length < 3;

  const wrapperFor = (err: boolean, ok: boolean) =>
    err ? c.wrapperError : ok ? c.wrapperSuccess : c.input.wrapper;

  return (
    <div className="space-y-10">
      {/* ─── Header with glow ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        {/* Gradient background glow */}
        <div
          className={`absolute inset-0 ${
            dark
              ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50"
              : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"
          }`}
        />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`}
        />

        <div className="relative space-y-3">
          <h1
            className={`text-3xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
          >
            Input
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            A production-grade, fully accessible text input. Supports icons,
            prefix/suffix addons, clearable, character counts, validation
            states, loading, and complete styling control through the classes
            prop.
          </p>
          <div className="pt-1">
            <CodeBlock
              isDarkMode={dark}
              code={`import { Input, InputLabel } from "@kern-ui/input";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Examples ─────────────────────────────────────────────────── */}
      <div className="space-y-8">
        <h2
          className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
        >
          Examples
        </h2>

        {/* Basic */}
        <Section
          title="Basic Input"
          description="Minimal usage with just a placeholder."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-sm">
              <Input
                aria-label="Basic input"
                placeholder="Enter text..."
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Size Variants */}
        <Section
          title="Size Variants"
          description="The size prop emits data-size on the container for CSS targeting."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Small</span>
                <Input
                  aria-label="Small"
                  placeholder="Small size"
                  size="sm"
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Medium (default)</span>
                <Input
                  aria-label="Medium"
                  placeholder="Medium size"
                  size="md"
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Large</span>
                <Input
                  aria-label="Large"
                  placeholder="Large size"
                  size="lg"
                  classes={c.input}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Label, Description, Required */}
        <Section
          title="Label, Description & Required"
          description="Semantic labels with helper text and required indicators."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <Input
                label="Email address"
                description="We'll never share your email."
                placeholder="you@example.com"
                type="email"
                classes={c.input}
              />
              <Input
                label="Full name"
                placeholder="John Doe"
                required
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Icons */}
        <Section
          title="Icons"
          description="Static leading/trailing icons. Add a click handler to make them interactive buttons."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              {(
                [
                  [
                    "Leading icon",
                    <SearchIcon className={c.icon} />,
                    undefined,
                    "Search...",
                  ],
                  [
                    "Trailing icon",
                    undefined,
                    <ArrowRightIcon className={c.icon} />,
                    "Submit",
                  ],
                  [
                    "Both icons",
                    <SearchIcon className={c.icon} />,
                    <ArrowRightIcon className={c.icon} />,
                    "Search & submit",
                  ],
                ] as const
              ).map(([label, leading, trailing, ph]) => (
                <div key={String(label)} className="space-y-1.5">
                  <span className={c.sectionLabel}>{label}</span>
                  <Input
                    aria-label={String(label)}
                    placeholder={ph as string}
                    startIcon={leading}
                    endIcon={trailing}
                    classes={c.input}
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Clickable icons</span>
                <Input
                  aria-label="Search with clear"
                  placeholder="Type to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startIcon={<SearchIcon className={c.icon} />}
                  onStartIconClick={() => alert("Search!")}
                  startIconLabel="Submit search"
                  endIcon={
                    search ? <CloseIcon className={c.iconHover} /> : undefined
                  }
                  onEndIconClick={search ? () => setSearch("") : undefined}
                  endIconLabel="Clear"
                  classes={c.input}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Prefix & Suffix */}
        <Section
          title="Prefix & Suffix"
          description="Inline text addons for context — currency, domains, units, handles."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <Input
                label="Price"
                placeholder="0.00"
                type="number"
                prefix="$"
                suffix="USD"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                classes={c.input}
              />
              <Input
                label="Website"
                placeholder="yoursite"
                prefix="https://"
                suffix=".com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                classes={c.input}
              />
              <Input
                label="Weight"
                placeholder="0"
                type="number"
                suffix="kg"
                classes={c.input}
              />
              <Input
                label="Twitter handle"
                placeholder="username"
                prefix="@"
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Clearable */}
        <Section
          title="Clearable"
          description="Built-in clear button appears when the field has a value. Works in both controlled and uncontrolled modes."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <Input
                label="Controlled"
                placeholder="Type something..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                clearable
                onClear={() => setSearch("")}
                startIcon={<SearchIcon className={c.icon} />}
                classes={c.input}
              />
              <Input
                label="Uncontrolled"
                placeholder="Type and clear..."
                clearable
                defaultValue=""
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Character Count */}
        <Section
          title="Character Count"
          description="Show remaining characters with showCount + maxLength."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <Input
                label="Bio"
                placeholder="Tell us about yourself..."
                maxLength={100}
                showCount
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                classes={c.input}
              />
              <Input
                label="Username"
                placeholder="max 20 chars"
                maxLength={20}
                showCount
                clearable
                onClear={() => setUsername("")}
                prefix="@"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                success={userOk}
                successMessage={
                  <>
                    <CheckIcon /> Username available
                  </>
                }
                error={userBad}
                errorMessage="Minimum 3 characters"
                classes={{ ...c.input, wrapper: wrapperFor(userBad, userOk) }}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Validation States */}
        <Section
          title="Validation States"
          description="Error and success feedback with proper ARIA attributes."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <Input
                label="Default"
                placeholder="Normal state"
                classes={c.input}
              />
              <Input
                label="Error"
                value="invalid-email"
                error
                errorMessage={
                  <>
                    <AlertIcon /> Please enter a valid email
                  </>
                }
                classes={{ ...c.input, wrapper: c.wrapperError }}
              />
              <Input
                label="Success"
                value="john@example.com"
                success
                successMessage={
                  <>
                    <CheckIcon /> Email is valid
                  </>
                }
                classes={{ ...c.input, wrapper: c.wrapperSuccess }}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Live Validation */}
        <Section
          title="Live Validation"
          description="Real-time feedback as you type. Try entering an email."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-sm">
              <Input
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                clearable
                onClear={() => setEmail("")}
                startIcon={<MailIcon className={c.icon} />}
                error={emailBad}
                errorMessage={
                  <>
                    <AlertIcon /> Enter a valid email address
                  </>
                }
                success={emailOk}
                successMessage={
                  <>
                    <CheckIcon /> Looks good!
                  </>
                }
                classes={{ ...c.input, wrapper: wrapperFor(emailBad, emailOk) }}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Password Toggle */}
        <Section
          title="Password Toggle"
          description="Show/hide password with a clickable trailing icon."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-sm">
              <Input
                label="Password"
                type={showPw ? "text" : "password"}
                placeholder="Enter password"
                required
                startIcon={<LockIcon className={c.icon} />}
                endIcon={
                  showPw ? (
                    <EyeOffIcon className={c.iconHover} />
                  ) : (
                    <EyeIcon className={c.iconHover} />
                  )
                }
                onEndIconClick={() => setShowPw(!showPw)}
                endIconLabel={showPw ? "Hide password" : "Show password"}
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* onValueChange */}
        <Section
          title="onValueChange Callback"
          description="Convenience callback that gives you the string value directly."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-sm space-y-3">
              <Input
                label="Type anything"
                placeholder="Watch the value below..."
                value={search}
                onValueChange={setSearch}
                clearable
                onClear={() => setSearch("")}
                classes={c.input}
              />
              <div
                className={`rounded-lg px-3 py-2 text-xs font-mono ${dark ? "bg-white/4 text-gray-400" : "bg-gray-50 text-gray-500"}`}
              >
                value: {JSON.stringify(search)}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Loading */}
        <Section
          title="Loading State"
          description="Disables input and shows a spinner. Supports custom loaders."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Default</span>
                <Input
                  aria-label="Loading"
                  placeholder="Loading..."
                  loading
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>With icon</span>
                <Input
                  aria-label="Searching"
                  placeholder="Searching..."
                  loading
                  startIcon={<SearchIcon className={c.icon} />}
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Custom loader</span>
                <Input
                  aria-label="Validating"
                  placeholder="Validating..."
                  loading
                  loader={
                    <span
                      className={`text-[11px] font-medium animate-pulse ${dark ? "text-indigo-400" : "text-indigo-500"}`}
                    >
                      Checking...
                    </span>
                  }
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Custom loader size</span>
                <Input
                  aria-label="Custom loader size"
                  placeholder="Loading..."
                  loading
                  loaderSize={24}
                  classes={c.input}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Disabled & Read-Only */}
        <Section
          title="Disabled & Read-Only"
          description="Disabled prevents all interaction. Read-only allows selection/copy but not editing."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <Input
                label="Disabled"
                value="Cannot edit"
                disabled
                startIcon={
                  <LockIcon
                    className={dark ? "text-gray-600" : "text-gray-300"}
                  />
                }
                classes={{
                  ...c.input,
                  input: c.disabledInput,
                  wrapper: c.wrapperDisabled,
                }}
              />
              <Input
                label="Disabled empty"
                placeholder="Disabled placeholder"
                disabled
                classes={{
                  ...c.input,
                  input: c.disabledInput,
                  wrapper: c.wrapperDisabled,
                }}
              />
              <Input
                label="Read-only"
                value="Read-only value"
                readOnly
                classes={{
                  ...c.input,
                  wrapper: `${c.input.wrapper} cursor-default`,
                }}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Input Types */}
        <Section
          title="Input Types"
          description="All standard HTML input types work out of the box."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {(
                [
                  ["Text", "text", "Enter text", undefined],
                  [
                    "Email",
                    "email",
                    "you@example.com",
                    <MailIcon className={c.icon} />,
                  ],
                  [
                    "Password",
                    "password",
                    "Enter password",
                    <LockIcon className={c.icon} />,
                  ],
                  ["Number", "number", "0", <HashIcon className={c.icon} />],
                  [
                    "Phone",
                    "tel",
                    "+1 (555) 000-0000",
                    <PhoneIcon className={c.icon} />,
                  ],
                  [
                    "URL",
                    "url",
                    "https://example.com",
                    <LinkIcon className={c.icon} />,
                  ],
                  [
                    "Date",
                    "date",
                    undefined,
                    <CalendarIcon className={c.icon} />,
                  ],
                  ["Time", "time", undefined, undefined],
                  [
                    "Search",
                    "search",
                    "Search...",
                    <SearchIcon className={c.icon} />,
                  ],
                ] as const
              ).map(([label, type, ph, icon]) => (
                <Input
                  key={String(label)}
                  label={String(label)}
                  type={type as string}
                  placeholder={ph as string | undefined}
                  startIcon={icon}
                  classes={c.input}
                />
              ))}
            </div>
          </DemoWrapper>
        </Section>

        {/* Native HTML Features */}
        <Section
          title="Native HTML Attributes"
          description="All native input attributes (pattern, min, max, autoComplete, autoFocus) pass through."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <Input
                label="Zip code (pattern)"
                placeholder="12345"
                pattern="[0-9]{5}"
                title="Five digit zip code"
                classes={c.input}
              />
              <Input
                label="Age (min/max)"
                type="number"
                placeholder="18-99"
                min={18}
                max={99}
                classes={c.input}
              />
              <Input
                label="With autoComplete"
                placeholder="Start typing..."
                autoComplete="given-name"
                classes={c.input}
              />
              <Input
                label="Spellcheck disabled"
                placeholder="Code or IDs..."
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Full Width */}
        <Section
          title="Full Width"
          description="Spans the full container width."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full space-y-4">
              <Input
                aria-label="Full width"
                placeholder="Full width input"
                fullWidth
                classes={c.input}
              />
              <Input
                label="Full width, all features"
                placeholder="Enter your message..."
                fullWidth
                startIcon={<MailIcon className={c.icon} />}
                clearable
                maxLength={200}
                showCount
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Ref Forwarding */}
        <Section
          title="Ref Forwarding"
          description="Access the native input for programmatic focus, selection, or value reads."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-4 w-full max-w-sm">
              <Input
                ref={inputRef}
                aria-label="Ref demo"
                placeholder="Click buttons below"
                classes={c.input}
              />
              <div className="flex gap-2 flex-wrap">
                {(["Focus", "Select All", "Get Value"] as const).map((lbl) => (
                  <button
                    key={lbl}
                    onClick={() => {
                      if (lbl === "Focus") inputRef.current?.focus();
                      else if (lbl === "Select All") {
                        inputRef.current?.focus();
                        inputRef.current?.select();
                      } else if (lbl === "Get Value")
                        alert(`"${inputRef.current?.value}"`);
                    }}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                      dark
                        ? "bg-white/4 text-gray-400 hover:bg-white/8 ring-1 ring-inset ring-white/6"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 ring-1 ring-inset ring-gray-200"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Standalone Label */}
        <Section
          title="InputLabel Standalone"
          description="Use InputLabel independently for custom field layouts."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-4 w-full max-w-sm">
              <div>
                <InputLabel
                  label="Custom Layout"
                  htmlFor="custom-input"
                  className={c.input.label}
                />
                <input
                  id="custom-input"
                  type="text"
                  placeholder="Native input with InputLabel"
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all duration-150 ${
                    dark
                      ? "bg-white/4 border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50"
                      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400"
                  }`}
                />
              </div>
              <div>
                <InputLabel
                  label="Required Field"
                  htmlFor="req"
                  required
                  className={c.input.label}
                />
                <p
                  className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Required indicator (*) is automatically added
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Custom Theme Variations */}
        <Section
          title="Custom Themes"
          description="Full visual control through the classes prop. Here are creative variations."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {(
                [
                  [
                    "Pill shape",
                    `px-5 py-2.5 rounded-full border gap-2.5 transition-all duration-150 ${
                      dark
                        ? "border-white/10 bg-white/4 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400/50"
                        : "border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/15 focus-within:border-indigo-400 focus-within:bg-white"
                    }`,
                    "Search...",
                    <SearchIcon className={c.icon} />,
                  ],
                  [
                    "Underline",
                    `px-0.5 py-2.5 border-b-2 gap-2.5 transition-all duration-150 ${
                      dark
                        ? "border-white/10 focus-within:border-indigo-400"
                        : "border-gray-200 focus-within:border-indigo-500"
                    }`,
                    "Enter text...",
                    undefined,
                  ],
                  [
                    "Purple accent",
                    `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${
                      dark
                        ? "border-blue-400/30 bg-blue-500/[0.06] focus-within:ring-2 focus-within:ring-blue-500/25 focus-within:border-blue-400"
                        : "border-blue-200 bg-blue-50/30 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:border-blue-400"
                    }`,
                    "Purple theme...",
                    undefined,
                  ],
                  [
                    "Elevated shadow",
                    `px-3.5 py-2.5 rounded-xl border-0 gap-2.5 transition-all duration-150 ${
                      dark
                        ? "bg-white/6 shadow-lg shadow-black/20 focus-within:ring-1 focus-within:ring-white/10"
                        : "bg-white shadow-md shadow-gray-900/[0.08] focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-200"
                    }`,
                    "Floating...",
                    undefined,
                  ],
                  [
                    "Green money",
                    `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${
                      dark
                        ? "border-emerald-400/30 bg-emerald-500/[0.06] focus-within:ring-2 focus-within:ring-emerald-500/25"
                        : "border-emerald-200 bg-emerald-50/30 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/15"
                    }`,
                    "0.00",
                    <Icon
                      d="M12 2v20|M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                      className={dark ? "text-emerald-400" : "text-emerald-600"}
                    />,
                  ],
                  [
                    "Large size",
                    `px-4 py-4 rounded-2xl border gap-3 transition-all duration-150 ${
                      dark
                        ? "border-white/10 bg-white/4 focus-within:ring-2 focus-within:ring-indigo-500/30"
                        : "border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/15"
                    }`,
                    "Large input...",
                    undefined,
                  ],
                ] as const
              ).map(([label, wCls, ph, icon]) => (
                <div key={String(label)} className="space-y-1.5">
                  <span className={c.sectionLabel}>{label}</span>
                  <Input
                    aria-label={String(label)}
                    placeholder={ph as string}
                    startIcon={icon}
                    classes={{
                      ...c.input,
                      input:
                        String(label) === "Large size"
                          ? `w-full bg-transparent outline-none text-lg ${dark ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`
                          : c.input.input,
                      wrapper: wCls as string,
                    }}
                  />
                </div>
              ))}
            </div>
          </DemoWrapper>
        </Section>

        {/* ─── Composed Forms ─────────────────────────────────────────── */}

        {/* Login Form */}
        <Section
          title="Login Form"
          description="Real-world composition with multiple features."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Signed in!");
              }}
              className="w-full max-w-sm space-y-5"
            >
              <div className="text-center space-y-1 mb-8">
                <h3
                  className={`text-xl font-semibold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
                >
                  Welcome back
                </h3>
                <p
                  className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Sign in to continue
                </p>
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                startIcon={<MailIcon className={c.icon} />}
                classes={c.input}
              />
              <Input
                label="Password"
                type={showPw ? "text" : "password"}
                placeholder="Enter password"
                required
                startIcon={<LockIcon className={c.icon} />}
                endIcon={
                  showPw ? (
                    <EyeOffIcon className={c.iconHover} />
                  ) : (
                    <EyeIcon className={c.iconHover} />
                  )
                }
                onEndIconClick={() => setShowPw(!showPw)}
                endIconLabel={showPw ? "Hide" : "Show"}
                classes={c.input}
              />
              <div className="flex items-center justify-between">
                <label
                  className={`flex items-center gap-2 text-sm cursor-pointer ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 accent-indigo-500"
                  />{" "}
                  Remember me
                </label>
                <button
                  type="button"
                  className={`text-sm font-medium ${dark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}
                >
                  Forgot?
                </button>
              </div>
              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-medium text-sm text-white transition-all ${dark ? "bg-indigo-500 hover:bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-500"} shadow-lg shadow-indigo-500/20`}
              >
                Sign In
              </button>
            </form>
          </DemoWrapper>
        </Section>

        {/* Registration Form */}
        <Section
          title="Registration Form"
          description="Combines prefix, suffix, clearable, showCount, and live validation."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Created!");
              }}
              className="w-full max-w-md space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  placeholder="John"
                  required
                  classes={c.input}
                />
                <Input
                  label="Last name"
                  placeholder="Doe"
                  required
                  classes={c.input}
                />
              </div>
              <Input
                label="Username"
                placeholder="johndoe"
                required
                prefix="@"
                clearable
                maxLength={20}
                showCount
                onClear={() => setUsername("")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                success={userOk}
                successMessage={
                  <>
                    <CheckIcon /> Available
                  </>
                }
                error={userBad}
                errorMessage="Min 3 characters"
                classes={{ ...c.input, wrapper: wrapperFor(userBad, userOk) }}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                startIcon={<MailIcon className={c.icon} />}
                clearable
                onClear={() => setEmail("")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                success={emailOk}
                successMessage={
                  <>
                    <CheckIcon /> Valid
                  </>
                }
                error={emailBad}
                errorMessage={
                  <>
                    <AlertIcon /> Invalid format
                  </>
                }
                classes={{ ...c.input, wrapper: wrapperFor(emailBad, emailOk) }}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 characters"
                required
                startIcon={<LockIcon className={c.icon} />}
                classes={c.input}
              />
              <Input
                label="Website"
                placeholder="yoursite"
                prefix="https://"
                suffix=".com"
                classes={c.input}
              />
              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-medium text-sm text-white transition-all ${dark ? "bg-indigo-500 hover:bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-500"} shadow-lg shadow-indigo-500/20`}
              >
                Create Account
              </button>
            </form>
          </DemoWrapper>
        </Section>
      </div>

      {/* ─── Props Tables ───────────────────────────────────────────────── */}
      <Section title="Input Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="label"
              type="ReactNode"
              description="Label above the input"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="ReactNode"
              description="Helper text below the label"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="boolean"
              defaultVal="false"
              description="Error state (sets aria-invalid)"
              isDarkMode={dark}
            />
            <PropRow
              name="errorMessage"
              type="ReactNode"
              description="Error text below input (role=alert)"
              isDarkMode={dark}
            />
            <PropRow
              name="success"
              type="boolean"
              defaultVal="false"
              description="Success validation state"
              isDarkMode={dark}
            />
            <PropRow
              name="successMessage"
              type="ReactNode"
              description="Success text below input (role=status)"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type='"sm"|"md"|"lg"'
              description="Size variant (emits data-size)"
              isDarkMode={dark}
            />
            <PropRow
              name="prefix"
              type="ReactNode"
              description='Inline addon before input (e.g. "$")'
              isDarkMode={dark}
            />
            <PropRow
              name="suffix"
              type="ReactNode"
              description='Inline addon after input (e.g. "USD")'
              isDarkMode={dark}
            />
            <PropRow
              name="startIcon"
              type="ReactNode"
              description="Icon before input"
              isDarkMode={dark}
            />
            <PropRow
              name="endIcon"
              type="ReactNode"
              description="Icon after input"
              isDarkMode={dark}
            />
            <PropRow
              name="onStartIconClick"
              type="() => void"
              description="Makes leading icon a button"
              isDarkMode={dark}
            />
            <PropRow
              name="onEndIconClick"
              type="() => void"
              description="Makes trailing icon a button"
              isDarkMode={dark}
            />
            <PropRow
              name="startIconLabel"
              type="string"
              description="Accessible label for leading icon button"
              isDarkMode={dark}
            />
            <PropRow
              name="endIconLabel"
              type="string"
              description="Accessible label for trailing icon button"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(val: string) => void"
              description="Convenience callback with string value"
              isDarkMode={dark}
            />
            <PropRow
              name="clearable"
              type="boolean"
              defaultVal="false"
              description="Shows clear button when input has value"
              isDarkMode={dark}
            />
            <PropRow
              name="onClear"
              type="() => void"
              description="Callback when clear button clicked"
              isDarkMode={dark}
            />
            <PropRow
              name="showCount"
              type="boolean"
              defaultVal="false"
              description="Show character count (needs maxLength)"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="boolean"
              defaultVal="false"
              description="Shows loader, disables input"
              isDarkMode={dark}
            />
            <PropRow
              name="loader"
              type="ReactNode"
              description="Custom loader component"
              isDarkMode={dark}
            />
            <PropRow
              name="loaderSize"
              type="number"
              defaultVal="16"
              description="Default loader size in px"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Spans full container width"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="InputClasses"
              description="Slot-based class overrides for internal elements"
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
              description="CSS class for the root container element"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="InputClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root container (label + input row + error/success)"
              isDarkMode={dark}
            />
            <PropRow
              name="wrapper"
              type="string"
              description="Input row wrapper (icons + input)"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Label element"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="string"
              description="Helper/description text"
              isDarkMode={dark}
            />
            <PropRow
              name="input"
              type="string"
              description="Native <input> element"
              isDarkMode={dark}
            />
            <PropRow
              name="prefix"
              type="string"
              description="Prefix addon"
              isDarkMode={dark}
            />
            <PropRow
              name="suffix"
              type="string"
              description="Suffix addon"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="string"
              description="Error message"
              isDarkMode={dark}
            />
            <PropRow
              name="success"
              type="string"
              description="Success message"
              isDarkMode={dark}
            />
            <PropRow
              name="count"
              type="string"
              description="Character count display"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-disabled"
              type="container, input"
              description="Present when disabled or loading"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="container, input"
              description="Present when error = true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-success"
              type="container, input"
              description="Present when success = true (without error)"
              isDarkMode={dark}
            />
            <PropRow
              name="data-loading"
              type="container"
              description="Present when loading = true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-size"
              type="container"
              description="Present when size is set"
              isDarkMode={dark}
            />
            <PropRow
              name="data-readonly"
              type="container, input"
              description="Present when readOnly = true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-slot"
              type="every sub-element"
              description="Always present — identifies structural parts"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              "Label auto-associated via htmlFor",
              'Required inputs set aria-required="true"',
              "Error state sets aria-invalid",
              "Error connected via aria-describedby",
              'Error messages use role="alert"',
              'Success messages use role="status"',
              'Loading state sets aria-busy="true"',
              'Clear button has aria-label="Clear input"',
              'Character count uses aria-live="polite"',
              "Clickable icons are <button> with aria-label",
              "Dev warnings fire for missing accessible names",
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
              [
                "Tab",
                "Move focus to/from input, icon buttons, and clear button",
              ],
              ["Enter", "Activate focused icon or clear button"],
              ["Space", "Activate focused icon or clear button"],
              ["Esc", "Browser default (no custom behavior)"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default InputDemo;
