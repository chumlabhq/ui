import type { InputClasses } from "../../components/Input/index.js";
import {
  useState,
  useRef } from "react";
import { Input,
  InputLabel } from "../../components/Input/index.js";
import { Checkbox } from "../../components/Checkbox/index.js";
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

const getClasses = () => ({
  input: {
    root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
    input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
    label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
    description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
    prefix: `text-sm select-none text-cl-text-tertiary`,
    suffix: `text-sm select-none text-cl-text-tertiary`,
    count: `text-[11px] mt-1 text-end tabular-nums text-cl-text-tertiary`,
  } satisfies InputClasses,

  /* Class strings this page reuses in its own markup. Not `classes`
     keys — Input has no such slots, and passing them there styled
     nothing. */
  inputExtra: {
    wrapper: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus`,
  },
  /* The one native field this page renders, for the InputLabel section where
     pairing with a non-Chumlab control is the point. Written once rather than
     inline, so it cannot drift from the component's own look. */
  nativeField: `w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm transition-all duration-150 bg-cl-bg-input border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus`,
  wrapperError: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-error shadow-sm shadow-danger/0.04 focus-within:ring-2 focus-within:ring-cl-error/15`,
  wrapperSuccess: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-success shadow-sm shadow-success/0.04 focus-within:ring-2 focus-within:ring-cl-success/15`,
  wrapperDisabled: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 opacity-50 cursor-not-allowed border-cl-border bg-cl-bg-hover`,
  disabledInput: `w-full bg-transparent outline-none text-sm cursor-not-allowed text-cl-text-tertiary placeholder:text-cl-text-tertiary`,
  icon: "text-cl-text-tertiary",
  iconHover: "text-cl-text-tertiary hover:text-cl-text-secondary",
  badge: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-cl-md text-[11px] font-semibold uppercase tracking-wider bg-cl-accent-bg text-cl-accent-hover ring-1 ring-inset ring-cl-accent/10`,
  sectionLabel: `text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary`,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 cardDense: `rounded-cl-lg p-4 bg-cl-bg-elevated`,
  propName: `font-mono text-xs text-cl-accent`,
  propType: `font-mono text-[11px] text-cl-text-tertiary`,
  propDefault: `font-mono text-[11px] text-cl-text-tertiary`,
  propDesc: `text-xs text-cl-text-secondary`,
  code: `px-1.5 py-0.5 rounded-cl-md text-[11px] font-mono font-medium bg-cl-bg-elevated text-cl-text-secondary`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  tableHead: `text-start py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary`,
  tableCell: `py-2.5 px-4`,
  divider: `border-t border-cl-border`,
});

const InputDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPw, setShowPw] = useState(false);
  const [search, setSearch] = useState("");
  const [callbackValue, setCallbackValue] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [search2, setSearch2] = useState("");
  // An alert() here blocks the page and every automated check with it.
  const [lastAction, setLastAction] = useState("");
  const [refReadValue, setRefReadValue] = useState("not fired yet");
  const [loginSubmit, setLoginSubmit] = useState("not fired yet");
  const [forgotNote, setForgotNote] = useState<string | null>(null);
  const [registrationSubmit, setRegistrationSubmit] = useState("not fired yet");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [username, setUsername] = useState("");
  const [username2, setUsername2] = useState("");
  const [url, setUrl] = useState("");
  const [amount, setAmount] = useState("");

  const emailOk = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailBad = email.length > 0 && !emailOk;
  const userOk = username.length >= 3;
  const userBad = username.length > 0 && username.length < 3;

  const wrapperFor = (err: boolean, ok: boolean) =>
    err ? c.wrapperError : ok ? c.wrapperSuccess : c.inputExtra.wrapper;

  return (
    <div className="space-y-10">
      <DocsHero
        title="Input"
        description="A production-grade, fully accessible text input. Supports icons, prefix/suffix addons, clearable, character counts, validation states, loading, and complete styling control through the classes prop."
        code={`import { Input, InputLabel } from "@chumlab/ui/input";`}
      />

      <SetupNote />

      <ComponentAnatomy name="Input" />

      <div className="space-y-8">
        <Section
          title="Basic Usage"
          description="Works out-of-the-box with built-in styles, dark mode, and focus states. No custom classes needed."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark} layout="block">
            <div className="flex flex-col gap-4 w-full sm:max-w-sm">
              {}
              <Input
                label="Full Name"
                placeholder="Enter your name..."
              />
              <Input
                label="Email"
                placeholder="you@example.com"
                description="We'll never share your email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password..."
                required
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Size Variants"
          description="The size prop emits data-size on the container for CSS targeting."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="space-y-1.5">
                <span id="input-size-sm" className={c.sectionLabel}>Small</span>
                <Input
                  aria-labelledby="input-size-sm"
                  placeholder="Small size"
                  size="sm"
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span id="input-size-md" className={c.sectionLabel}>Medium (default)</span>
                <Input
                  aria-labelledby="input-size-md"
                  placeholder="Medium size"
                  size="md"
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span id="input-size-lg" className={c.sectionLabel}>Large</span>
                <Input
                  aria-labelledby="input-size-lg"
                  placeholder="Large size"
                  size="lg"
                  classes={c.input}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Label, Description & Required"
          description="Semantic labels with helper text and required indicators."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
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

        <Section
          title="Icons"
          description="Static leading/trailing icons. Add a click handler to make them interactive buttons."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
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
                <span id="input-icons-clickable" className={c.sectionLabel}>Clickable icons</span>
                <span className={c.sectionLabel} data-demo-action>
                  {lastAction}
                </span>
                <Input
                  aria-labelledby="input-icons-clickable"
                  placeholder="Type to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startIcon={<SearchIcon className={c.icon} />}
                  onStartIconClick={() => setLastAction("Search submitted")}
                  startIconAriaLabel="Submit search"
                  endIcon={
                    search ? <CloseIcon className={c.iconHover} /> : undefined
                  }
                  onEndIconClick={search ? () => setSearch("") : undefined}
                  endIconAriaLabel="Clear"
                  classes={c.input}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Prefix & Suffix"
          description="Inline text addons for context — currency, domains, units, handles."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
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

        <Section
          title="Clearable"
          description="Built-in clear button appears when the field has a value. Works in both controlled and uncontrolled modes."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
              <Input
                label="Search"
                placeholder="Type something..."
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
                clearable
                onClear={() => setSearch2("")}
                startIcon={<SearchIcon className={c.icon} />}
                classes={c.input}
              />
              <Input
                label="Note"
                placeholder="Type and clear..."
                clearable
                defaultValue=""
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Character Count"
          description="Show remaining characters with showCount + maxLength."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
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
                classes={{ ...c.input, control: wrapperFor(userBad, userOk) }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Validation States"
          description="Error and success feedback with proper ARIA attributes."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <Input
                label="Email"
                placeholder="Normal state"
                classes={c.input}
              />
              <Input
                label="Email"
                value="invalid-email"
                error
                errorMessage={
                  <>
                    <AlertIcon /> Please enter a valid email
                  </>
                }
                classes={{ ...c.input, control: c.wrapperError }}
              />
              <Input
                label="Email"
                value="john@example.com"
                success
                successMessage={
                  <>
                    <CheckIcon /> Email is valid
                  </>
                }
                classes={{ ...c.input, control: c.wrapperSuccess }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Live Validation"
          description="Real-time feedback as you type. Try entering an email."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-sm">
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
                classes={{ ...c.input, control: wrapperFor(emailBad, emailOk) }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Password Toggle"
          description="Show/hide password with a clickable trailing icon."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-sm">
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
                endIconAriaLabel={showPw ? "Hide password" : "Show password"}
                classes={c.input}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="onValueChange Callback"
          description="Convenience callback that gives you the string value directly."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-sm space-y-3">
              <Input
                label="Name"
                placeholder="Watch the value below..."
                value={callbackValue}
                onValueChange={setCallbackValue}
                clearable
                onClear={() => setCallbackValue("")}
                classes={c.input}
              />
              <div
                className={`rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary`}
                data-demo-action
              >
                value: {JSON.stringify(callbackValue)}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Loading State"
          description="Disables input and shows a spinner. Supports custom loaders."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
              <div className="space-y-1.5">
                <span id="input-loading-default" className={c.sectionLabel}>Default</span>
                <Input
                  aria-labelledby="input-loading-default"
                  placeholder="Loading..."
                  loading
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span id="input-loading-icon" className={c.sectionLabel}>With icon</span>
                <Input
                  aria-labelledby="input-loading-icon"
                  placeholder="Searching..."
                  loading
                  startIcon={<SearchIcon className={c.icon} />}
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span id="input-loading-custom" className={c.sectionLabel}>Custom loader</span>
                <Input
                  aria-labelledby="input-loading-custom"
                  placeholder="Validating..."
                  loading
                  loader={
                    <span
                      className={`text-[11px] font-medium animate-pulse text-cl-accent`}
                    >
                      Checking...
                    </span>
                  }
                  classes={c.input}
                />
              </div>
              <div className="space-y-1.5">
                <span id="input-loading-size" className={c.sectionLabel}>Custom loader size</span>
                <Input
                  aria-labelledby="input-loading-size"
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
                label="Username"
                value="Cannot edit"
                disabled
                startIcon={
                  <LockIcon
                    className={"text-cl-text-secondary"}
                  />
                }
                classes={{
                  ...c.input,
                  input: c.disabledInput,
                  control: c.wrapperDisabled,
                }}
              />
              <Input
                label="Nickname"
                placeholder="Disabled placeholder"
                disabled
                classes={{
                  ...c.input,
                  input: c.disabledInput,
                  control: c.wrapperDisabled,
                }}
              />
              <Input
                label="Account ID"
                value="Read-only value"
                readOnly
                classes={{
                  ...c.input,
                  control: `${c.inputExtra.wrapper} cursor-default`,
                }}
              />
            </div>
          </DemoWrapper>
        </Section>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
              <Input
                label="Zip code"
                placeholder="12345"
                pattern="[0-9]{5}"
                title="Five digit zip code"
                classes={c.input}
              />
              <Input
                label="Age"
                type="number"
                placeholder="18-99"
                min={18}
                max={99}
                classes={c.input}
              />
              <Input
                label="First name"
                placeholder="Start typing..."
                autoComplete="given-name"
                classes={c.input}
              />
              <Input
                label="Reference code"
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
                aria-label="Subject"
                placeholder="Full width input"
                fullWidth
                classes={c.input}
              />
              <Input
                label="Message"
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
            <div className="space-y-4 w-full sm:max-w-sm">
              <Input
                ref={inputRef}
                aria-label="Note"
                placeholder="Click buttons below"
                classes={c.input}
              />
              <div className="flex gap-2 flex-wrap">
                {(["Focus", "Select All", "Get Value"] as const).map((lbl) => (
                  <Button
                    key={lbl}
                    size="sm"
                    onClick={() => {
                      if (lbl === "Focus") inputRef.current?.focus();
                      else if (lbl === "Select All") {
                        inputRef.current?.focus();
                        inputRef.current?.select();
                      } else if (lbl === "Get Value")
                        setRefReadValue(JSON.stringify(inputRef.current?.value));
                    }}
                    className="rounded-cl-md bg-cl-text/4 text-cl-text-tertiary hover:bg-cl-bg-hover ring-1 ring-inset ring-border-soft"
                  >
                    {lbl}
                  </Button>
                ))}
              </div>
              <div className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
                ref.current.value: {refReadValue}
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
            <div className="space-y-4 w-full sm:max-w-md">
              {/* Beside the field, not above it: `Input`'s own `label` prop
                  stacks, so a row is the arrangement that needs the label
                  standalone. Paired with a native input on purpose — with
                  `Input` you would pass `label` and not reach for this at
                  all. */}
              <div className="flex items-center gap-3">
                <InputLabel
                  label="Display name"
                  htmlFor="custom-input"
                  className={`${c.input.label} mb-0 shrink-0 w-32`}
                />
                <input
                  id="custom-input"
                  type="text"
                  placeholder="Label sits beside this field"
                  className={c.nativeField}
                />
              </div>
              <div className="flex items-center gap-3">
                <InputLabel
                  label="Company"
                  htmlFor="req"
                  required
                  className={`${c.input.label} mb-0 shrink-0 w-32`}
                />
                <input
                  id="req"
                  type="text"
                  required
                  placeholder="The * comes from `required`"
                  className={c.nativeField}
                />
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
 `px-5 rounded-full gap-2.5 transition-all duration-150 border border-cl-text/10 bg-cl-text/4 shadow-sm focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus focus-within:bg-cl-bg-elevated`,
                    "Search...",
                    <SearchIcon className={c.icon} />,
                  ],
                  [
                    "Underline",
                    `px-0 gap-2.5 transition-all duration-150 rounded-none border-0 border-b-2 bg-transparent shadow-none border-cl-border focus-within:ring-0 focus-within:border-cl-border-input-focus`,
                    "Enter text...",
                    undefined,
                  ],
                  [
                    "Purple accent",
                    `px-3.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-border-input-focus shadow-sm focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus`,
                    "Purple theme...",
                    undefined,
                  ],
                  [
                    "Elevated shadow",
                    `px-3.5 rounded-cl-lg border border-transparent gap-2.5 transition-all duration-150 bg-cl-bg-input shadow-cl-md focus-within:shadow-lg focus-within:ring-1 focus-within:ring-border-soft`,
                    "Floating...",
                    undefined,
                  ],
                  [
                    "Green money",
                    `px-3.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-success shadow-sm focus-within:ring-2 focus-within:ring-cl-success/15`,
                    "0.00",
                    <Icon
                      d="M12 2v20|M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                      className={"text-cl-success"}
                    />,
                  ],
                  [
                    "Large size",
                    `px-4 rounded-cl-lg border gap-3 transition-all duration-150 border-cl-text/10 bg-cl-bg-input shadow-sm focus-within:ring-2 focus-within:ring-cl-accent-halo`,
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
                    size={String(label) === "Large size" ? "lg" : undefined}
                    classes={{
                      ...c.input,
                      control: wCls as string,
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
          <DemoWrapper isDarkMode={dark} className="sm:w-fit">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoginSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
              }}
              className="w-full sm:max-w-sm space-y-5"
            >
              <div className="text-center space-y-1 mb-8">
                <h3
                  className={`text-xl font-semibold tracking-tight text-cl-text`}
                >
                  Welcome back
                </h3>
                <p
                  className={`text-sm text-cl-text-tertiary`}
                >
                  Sign in to continue
                </p>
              </div>
              <Input
                name="email"
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
                endIconAriaLabel={showPw ? "Hide" : "Show"}
                classes={c.input}
              />
              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  size="sm"
                />
                <Button
                  type="button"
                  size="sm"
                  className="bg-transparent text-cl-accent hover:bg-cl-accent-bg hover:text-cl-accent-hover"
                  onClick={() => setForgotNote("Password reset link sent (demo)")}
                >
                  Forgot?
                </Button>
              </div>
              <Button
                type="submit"
                fullWidth
                className="bg-cl-text text-cl-bg hover:opacity-90"
              >
                Sign In
              </Button>
            </form>
            <div className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
              onSubmit: {loginSubmit}
              {forgotNote && <div role="status">Forgot?: {forgotNote}</div>}
            </div>
          </DemoWrapper>
        </Section>

        {/* Registration Form */}
        <Section
          title="Registration Form"
          description="Combines prefix, suffix, clearable, showCount, and live validation."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark} className="sm:w-fit">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRegistrationSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
              }}
              className="w-full sm:max-w-md space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  label="First name"
                  placeholder="John"
                  required
                  classes={c.input}
                />
                <Input
                  name="lastName"
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
                name="username"
                onClear={() => setUsername2("")}
                value={username2}
                onChange={(e) => setUsername2(e.target.value)}
                success={userOk}
                successMessage={
                  <>
                    <CheckIcon /> Available
                  </>
                }
                error={userBad}
                errorMessage="Min 3 characters"
                classes={{ ...c.input, control: wrapperFor(userBad, userOk) }}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                startIcon={<MailIcon className={c.icon} />}
                clearable
                name="email"
                onClear={() => setEmail2("")}
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
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
                classes={{ ...c.input, control: wrapperFor(emailBad, emailOk) }}
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
                name="website"
                label="Website"
                placeholder="yoursite"
                prefix="https://"
                suffix=".com"
                classes={c.input}
              />
              <Button
                type="submit"
                fullWidth
                className="bg-cl-text text-cl-bg hover:opacity-90 shadow-lg shadow-accent/20"
              >
                Create Account
              </Button>
            </form>
            <div className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
              onSubmit: {registrationSubmit}
            </div>
          </DemoWrapper>
        </Section>
      </div>

      {/* ─── In a form ───────────────────────────────────────────────────── */}
      <Section
        title="In a form"
        description="A real form: the field with name and required, Submit and Reset, and the FormData the browser built, read back."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <FormDemo onEmpty="Submit empty: the browser blocks the submit and focuses the field. A malformed address is blocked the same way.">
            <Input name="email" type="email" label="Email" required />
          </FormDemo>
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="Input" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onChange` and/or `onValueChange` for controlled text. `onValueChange` receives the string only; `onChange` receives the native event (including clear). Use `defaultValue` for uncontrolled."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Autofill and password managers may bypass React—test real browsers.",
          "Icon buttons need `startIconAriaLabel` / `endIconAriaLabel` when they perform actions.",
          "`clearable` should sync with form libraries that track touched state.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `label` or `aria-label` / `aria-labelledby`.",
          "Pair `error` with visible `errorMessage` and ids for `aria-describedby`.",
          "Use `maxLength` with `showCount` when you enforce limits.",
        ]}
        donts={[
          "Do not use both conflicting `value` and uncontrolled defaults without intent.",
          "Do not remove visible labels and rely on placeholder alone.",
          "Do not block paste for arbitrary security—prefer server validation.",
        ]}
      />

      <CopyPasteBlock name="Input" />
    </div>
  );
};

export default InputDemo;
