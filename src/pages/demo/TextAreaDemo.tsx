import { useState, useRef } from "react";
import { TextArea, TextAreaLabel } from "../../components/TextArea";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";

// ─── Icons ───────────────────────────────────────────────────────────────────

const MessageIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const SendIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);
const FileIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);
const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LockIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

// ─── Themed Classes (identical structure to InputDemo) ───────────────────────

const getClasses = (dark: boolean) => ({
  textarea: `w-full bg-transparent outline-none text-sm resize-y ${dark ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`,
  wrapper: `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${dark
    ? "text-gray-300 border-white/10 bg-white/[0.04] focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400/50"
    : "text-gray-700 border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04] focus-within:ring-2 focus-within:ring-indigo-500/15 focus-within:border-indigo-400"
  }`,
  wrapperError: `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${dark
    ? "text-gray-300 border-red-400/40 bg-red-500/[0.06] focus-within:ring-2 focus-within:ring-red-500/25"
    : "text-gray-700 border-red-300 bg-red-50/40 shadow-sm shadow-red-900/[0.04] focus-within:ring-2 focus-within:ring-red-500/15"
  }`,
  wrapperSuccess: `px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${dark
    ? "text-gray-300 border-emerald-400/40 bg-emerald-500/[0.06] focus-within:ring-2 focus-within:ring-emerald-500/25"
    : "text-gray-700 border-emerald-300 bg-emerald-50/40 shadow-sm shadow-emerald-900/[0.04] focus-within:ring-2 focus-within:ring-emerald-500/15"
  }`,
  wrapperDisabled: `px-3.5 py-2.5 rounded-xl border gap-2.5 opacity-50 cursor-not-allowed ${dark ? "border-white/5 bg-white/[0.02]" : "border-gray-200 bg-gray-50"}`,
  label: `text-[13px] font-medium mb-1.5 block ${dark ? "text-gray-300" : "text-gray-700"}`,
  error: `text-xs mt-1.5 flex items-center gap-1.5 ${dark ? "text-red-400" : "text-red-500"}`,
  success: `text-xs mt-1.5 flex items-center gap-1.5 ${dark ? "text-emerald-400" : "text-emerald-600"}`,
  description: `text-xs mt-1 mb-1.5 ${dark ? "text-gray-500" : "text-gray-400"}`,
  container: "flex flex-col",
  disabled: `w-full bg-transparent outline-none text-sm resize-none cursor-not-allowed ${dark ? "text-gray-500 placeholder:text-gray-600" : "text-gray-400 placeholder:text-gray-300"}`,
  count: `text-[11px] mt-1 text-right tabular-nums ${dark ? "text-gray-500" : "text-gray-400"}`,
  icon: dark ? "text-gray-500" : "text-gray-400",
  iconHover: dark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600",
  sectionLabel: `text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-gray-600" : "text-gray-300"}`,
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  cardDense: `rounded-xl border p-4 ${dark ? "border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  propName: `font-mono text-xs ${dark ? "text-indigo-400" : "text-indigo-600"}`,
  propType: `font-mono text-[11px] ${dark ? "text-gray-500" : "text-gray-400"}`,
  propDefault: `font-mono text-[11px] ${dark ? "text-gray-600" : "text-gray-350"}`,
  propDesc: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
  code: `px-1.5 py-0.5 rounded-md text-[11px] font-mono font-medium ${dark ? "bg-white/[0.06] text-gray-300" : "bg-gray-100 text-gray-600"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  tableHead: `text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`,
  tableCell: "py-2.5 px-4",
  divider: `border-t ${dark ? "border-white/[0.06]" : "border-gray-100"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const TextAreaDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");
  const [bio, setBio] = useState("");
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");

  const bioOk = bio.length >= 10;
  const bioBad = bio.length > 0 && bio.length < 10;

  const wrapperFor = (err: boolean, ok: boolean) =>
    err ? c.wrapperError : ok ? c.wrapperSuccess : c.wrapper;

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className={`absolute inset-0 ${dark
          ? "bg-gradient-to-br from-indigo-950/80 via-gray-900/60 to-purple-950/50"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50/80"
        }`} />
        <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`} />
        <div className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-purple-500/8" : "bg-purple-200/30"}`} />
        <div className="relative space-y-3">
          <h1 className={`text-3xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>TextArea</h1>
          <p className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-500"}`}>
            A production-grade, multi-line text input. Supports icons, validation states,
            character counts, clearable, loading states, description text, and complete
            styling control through className props.
          </p>
          <div className="pt-1">
            <CodeBlock isDarkMode={dark} code={`import { TextArea, TextAreaLabel } from "@kern-ui/textarea";`} />
          </div>
        </div>
      </header>

      {/* ─── Examples ───────────────────────────────────────────────── */}
      <div className="space-y-8">
        <h2 className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>Examples</h2>

        {/* Basic */}
        <Section title="Basic TextArea" description="Minimal usage with just a placeholder." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-md">
              <TextArea aria-label="Basic textarea" placeholder="Enter text..." textAreaClassName={c.textarea} wrapperClassName={c.wrapper} />
            </div>
          </DemoWrapper>
        </Section>

        {/* Label, Description, Required */}
        <Section title="Label, Description & Required" description="Semantic labels with helper text and required indicators." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <TextArea
                label="Message"
                description="Write your message here."
                placeholder="Type your message..."
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                descriptionClassName={c.description}
                className={c.container}
              />
              <TextArea
                label="Comment"
                placeholder="Leave a comment..."
                required
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Row Sizes */}
        <Section title="Row Sizes" description="Control the visible height with the rows prop." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {([["2 rows", 2], ["4 rows (default)", 4], ["8 rows", 8]] as const).map(([lbl, r]) => (
                <div key={String(lbl)} className="space-y-1.5">
                  <span className={c.sectionLabel}>{lbl}</span>
                  <TextArea aria-label={String(lbl)} placeholder="Resizable..." rows={r as number} textAreaClassName={c.textarea} wrapperClassName={c.wrapper} />
                </div>
              ))}
            </div>
          </DemoWrapper>
        </Section>

        {/* Resize Behavior */}
        <Section title="Resize Behavior" description="Control resize via textAreaClassName. No resize is hardcoded — you choose." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Vertical only (resize-y)</span>
                <TextArea aria-label="Resize vertical" placeholder="Drag the bottom edge..." rows={3} textAreaClassName={`${c.textarea} resize-y`} wrapperClassName={c.wrapper} />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Fixed height (resize-none)</span>
                <TextArea aria-label="Fixed height" placeholder="Cannot resize this..." rows={3} textAreaClassName={`${c.textarea} resize-none`} wrapperClassName={c.wrapper} />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Both axes (resize)</span>
                <TextArea aria-label="Resize both" placeholder="Drag any corner..." rows={3} textAreaClassName={`${c.textarea} resize`} wrapperClassName={c.wrapper} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Icons */}
        <Section title="Icons" description="Start and end icons. Add a click handler to make them interactive buttons." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Start icon</span>
                <TextArea aria-label="With start icon" placeholder="Write a message..." startIcon={<MessageIcon className={c.icon} />} textAreaClassName={c.textarea} wrapperClassName={c.wrapper} />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Clickable end icon</span>
                <TextArea
                  aria-label="With send button"
                  placeholder="Type and send..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  endIcon={<SendIcon className={c.iconHover} />}
                  onEndIconClick={() => { alert(`Sent: ${message}`); setMessage(""); }}
                  endIconLabel="Send message"
                  textAreaClassName={c.textarea}
                  wrapperClassName={c.wrapper}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Clearable */}
        <Section title="Clearable" description="Built-in clear button when the textarea has a value." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <TextArea
                label="Controlled"
                placeholder="Type something..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                clearable
                onClear={() => setNotes("")}
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
              />
              <TextArea
                label="Uncontrolled"
                placeholder="Type and clear..."
                clearable
                defaultValue=""
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Character Count */}
        <Section title="Character Count" description="Show remaining characters with showCount + maxLength." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                maxLength={200}
                showCount
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                success={bioOk}
                successMessage={<><CheckIcon /> Looks great!</>}
                error={bioBad}
                errorMessage="At least 10 characters required"
                textAreaClassName={c.textarea}
                wrapperClassName={wrapperFor(bioBad, bioOk)}
                labelClassName={c.label}
                className={c.container}
                countClassName={c.count}
                errorClassName={c.error}
                successClassName={c.success}
              />
              <TextArea
                label="Notes"
                placeholder="Quick notes..."
                maxLength={100}
                showCount
                clearable
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onClear={() => setNotes("")}
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
                countClassName={c.count}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Validation States */}
        <Section title="Validation States" description="Error and success feedback with proper ARIA attributes." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <TextArea label="Default" placeholder="Normal state" textAreaClassName={c.textarea} wrapperClassName={c.wrapper} labelClassName={c.label} className={c.container} />
              <TextArea
                label="Error"
                value="Too short"
                error
                errorMessage={<><AlertIcon /> Minimum 20 characters required</>}
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapperError}
                labelClassName={c.label}
                errorClassName={c.error}
                className={c.container}
              />
              <TextArea
                label="Success"
                value="This is a properly written description that meets the requirements."
                success
                successMessage={<><CheckIcon /> Content looks good</>}
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapperSuccess}
                labelClassName={c.label}
                successClassName={c.success}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Live Validation */}
        <Section title="Live Validation" description="Real-time feedback as you type. Try entering at least 10 characters." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-md">
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                maxLength={200}
                showCount
                clearable
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onClear={() => setBio("")}
                error={bioBad}
                errorMessage={<><AlertIcon /> At least 10 characters required</>}
                success={bioOk}
                successMessage={<><CheckIcon /> Looks great!</>}
                textAreaClassName={c.textarea}
                wrapperClassName={wrapperFor(bioBad, bioOk)}
                labelClassName={c.label}
                className={c.container}
                countClassName={c.count}
                errorClassName={c.error}
                successClassName={c.success}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* onValueChange */}
        <Section title="onValueChange Callback" description="Convenience callback that gives you the string value directly." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-md space-y-3">
              <TextArea
                label="Type anything"
                placeholder="Watch the value below..."
                value={feedback}
                onValueChange={setFeedback}
                clearable
                onClear={() => setFeedback("")}
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
              />
              <div className={`rounded-lg px-3 py-2 text-xs font-mono ${dark ? "bg-white/[0.04] text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                value: {JSON.stringify(feedback)}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Loading */}
        <Section title="Loading State" description="Disables textarea and shows a spinner. Supports custom loaders." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Default loader</span>
                <TextArea aria-label="Loading" placeholder="Loading..." loading textAreaClassName={c.textarea} wrapperClassName={c.wrapper} />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Custom loader</span>
                <TextArea
                  aria-label="Saving"
                  placeholder="Saving..."
                  loading
                  loader={<span className={`text-[11px] font-medium animate-pulse ${dark ? "text-indigo-400" : "text-indigo-500"}`}>Saving...</span>}
                  textAreaClassName={c.textarea}
                  wrapperClassName={c.wrapper}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Disabled & Read-Only */}
        <Section title="Disabled & Read-Only" description="Disabled prevents interaction. Read-only allows selection but not editing." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <TextArea label="Disabled" value="Cannot edit this content" disabled startIcon={<LockIcon className={dark ? "text-gray-600" : "text-gray-300"} />} textAreaClassName={c.disabled} wrapperClassName={c.wrapperDisabled} labelClassName={c.label} className={c.container} />
              <TextArea label="Disabled empty" placeholder="Disabled placeholder" disabled textAreaClassName={c.disabled} wrapperClassName={c.wrapperDisabled} labelClassName={c.label} className={c.container} />
              <TextArea label="Read-only" value="This content can be selected and copied but not edited." readOnly textAreaClassName={c.textarea} wrapperClassName={`${c.wrapper} cursor-default`} labelClassName={c.label} className={c.container} />
            </div>
          </DemoWrapper>
        </Section>

        {/* Native HTML Attributes */}
        <Section title="Native HTML Attributes" description="All native textarea attributes (wrap, spellCheck, autoComplete) pass through." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <TextArea
                label="Spellcheck disabled"
                placeholder="Code snippets, IDs..."
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                rows={3}
                textAreaClassName={`${c.textarea} resize-none`}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
              />
              <TextArea
                label="Hard wrap"
                placeholder="Text wraps at width..."
                wrap="hard"
                cols={40}
                rows={3}
                textAreaClassName={`${c.textarea} resize-none`}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Full Width */}
        <Section title="Full Width" description="Spans the full container width." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full space-y-4">
              <TextArea
                label="Full width with all features"
                placeholder="Enter your message..."
                fullWidth
                clearable
                maxLength={500}
                showCount
                startIcon={<MessageIcon className={c.icon} />}
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
                countClassName={c.count}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Ref Forwarding */}
        <Section title="Ref Forwarding" description="Access the native textarea for programmatic control." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-4 w-full max-w-md">
              <TextArea ref={textAreaRef} aria-label="Ref demo" placeholder="Click buttons below" textAreaClassName={c.textarea} wrapperClassName={c.wrapper} />
              <div className="flex gap-2 flex-wrap">
                {([
                  ["Focus", () => textAreaRef.current?.focus()],
                  ["Select All", () => { textAreaRef.current?.focus(); textAreaRef.current?.select(); }],
                  ["Get Value", () => alert(`"${textAreaRef.current?.value}"`)],
                ] as const).map(([lbl, fn]) => (
                  <button key={String(lbl)} onClick={fn as () => void} className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${dark
                    ? "bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] ring-1 ring-inset ring-white/[0.06]"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 ring-1 ring-inset ring-gray-200"
                  }`}>{lbl}</button>
                ))}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Standalone Label */}
        <Section title="TextAreaLabel Standalone" description="Use TextAreaLabel independently for custom field layouts." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <TextAreaLabel label="Custom Layout" htmlFor="custom-ta" className={c.label} />
                <textarea
                  id="custom-ta"
                  placeholder="Native textarea with TextAreaLabel"
                  rows={3}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm resize-y transition-all duration-150 ${dark
                    ? "bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400"
                  }`}
                />
              </div>
              <div>
                <TextAreaLabel label="Required Field" htmlFor="req-ta" required className={c.label} />
                <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Required indicator (*) is automatically added</p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Custom Themes */}
        <Section title="Custom Themes" description="Full visual control through className props." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Underline</span>
                <TextArea
                  aria-label="Underline theme"
                  placeholder="Enter text..."
                  rows={3}
                  textAreaClassName={c.textarea}
                  wrapperClassName={`px-0.5 py-2.5 border-b-2 gap-2.5 transition-all duration-150 ${dark ? "border-white/10 focus-within:border-indigo-400" : "border-gray-200 focus-within:border-indigo-500"}`}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Purple accent</span>
                <TextArea
                  aria-label="Purple theme"
                  placeholder="Purple theme..."
                  rows={3}
                  textAreaClassName={c.textarea}
                  wrapperClassName={`px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 ${dark
                    ? "border-purple-400/30 bg-purple-500/[0.06] focus-within:ring-2 focus-within:ring-purple-500/25"
                    : "border-purple-200 bg-purple-50/30 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/15"
                  }`}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Contact Form */}
        <Section title="Contact Form" description="Real-world composition with multiple features." isDarkMode={dark}>
          <DemoWrapper isDarkMode={dark}>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }} className="w-full max-w-md space-y-4">
              <div className="text-center space-y-1 mb-6">
                <h3 className={`text-xl font-semibold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>Get in touch</h3>
                <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>We'd love to hear from you</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={c.container}>
                  <label htmlFor="contact-name" className={c.label}>Name</label>
                  <input id="contact-name" placeholder="John Doe" required className={`px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all duration-150 ${dark
                    ? "bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/30"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-500/15"
                  }`} />
                </div>
                <div className={c.container}>
                  <label htmlFor="contact-email" className={c.label}>Email</label>
                  <input id="contact-email" type="email" placeholder="you@example.com" required className={`px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all duration-150 ${dark
                    ? "bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/30"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-500/15"
                  }`} />
                </div>
              </div>
              <TextArea
                label="Message"
                placeholder="How can we help?"
                required
                rows={5}
                maxLength={500}
                showCount
                clearable
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                onClear={() => setFeedback("")}
                startIcon={<MailIcon className={c.icon} />}
                textAreaClassName={c.textarea}
                wrapperClassName={c.wrapper}
                labelClassName={c.label}
                className={c.container}
                countClassName={c.count}
              />
              <button type="submit" className={`w-full py-2.5 rounded-xl font-medium text-sm text-white transition-all ${dark ? "bg-indigo-500 hover:bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-500"} shadow-lg shadow-indigo-500/20`}>
                Send Message
              </button>
            </form>
          </DemoWrapper>
        </Section>
      </div>

      {/* ─── API Reference ────────────────────────────────────────────── */}
      <div className="space-y-6">
        <h2 className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>API Reference</h2>

        <div className={c.card}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Props</h3>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="min-w-full">
              <thead>
                <tr className={c.divider}>
                  <th className={c.tableHead}>Prop</th>
                  <th className={c.tableHead}>Type</th>
                  <th className={c.tableHead}>Default</th>
                  <th className={c.tableHead}>Description</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["label", "ReactNode", "-", "Label above the textarea"],
                  ["description", "ReactNode", "-", "Helper text below the label"],
                  ["required", "boolean", "false", "Shows * and sets aria-required"],
                  ["disabled", "boolean", "false", "Disables the textarea"],
                  ["readOnly", "boolean", "false", "Makes textarea read-only"],
                  ["rows", "number", "4", "Visible row count"],
                  ["error", "boolean", "false", "Error state (sets aria-invalid)"],
                  ["errorMessage", "ReactNode", "-", "Error text (role=alert)"],
                  ["success", "boolean", "false", "Success validation state"],
                  ["successMessage", "ReactNode", "-", "Success text (role=status)"],
                  ["startIcon", "ReactNode", "-", "Icon before textarea"],
                  ["endIcon", "ReactNode", "-", "Icon after textarea"],
                  ["onStartIconClick", "() => void", "-", "Makes start icon a button"],
                  ["onEndIconClick", "() => void", "-", "Makes end icon a button"],
                  ["startIconLabel", "string", "-", "Accessible label for start icon button"],
                  ["endIconLabel", "string", "-", "Accessible label for end icon button"],
                  ["clearable", "boolean", "false", "Shows clear button when has value"],
                  ["onClear", "() => void", "-", "Callback when clear clicked"],
                  ["showCount", "boolean", "false", "Show character count (needs maxLength)"],
                  ["onValueChange", "(val: string) => void", "-", "Convenience callback with string value"],
                  ["loading", "boolean", "false", "Shows loader, disables textarea"],
                  ["loader", "ReactNode", "CircularLoader", "Custom loader component"],
                  ["loaderSize", "number", "16", "Default loader size in px"],
                  ["fullWidth", "boolean", "false", "Spans full container width"],
                  ["size", '"sm" | "md" | "lg"', "-", "Size variant (emits data-size)"],
                ] as const).map(([prop, type, def, desc], i) => (
                  <tr key={prop} className={i > 0 ? c.divider : ""}>
                    <td className={`${c.tableCell} ${c.propName}`}>{prop}</td>
                    <td className={`${c.tableCell} ${c.propType}`}>{type}</td>
                    <td className={`${c.tableCell} ${c.propDefault}`}>{def}</td>
                    <td className={`${c.tableCell} ${c.propDesc}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={c.card}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Styling Props</h3>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="min-w-full">
              <thead>
                <tr className={c.divider}>
                  <th className={c.tableHead}>Prop</th>
                  <th className={c.tableHead}>Targets</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["className", "Root container (label + textarea row + error/success)"],
                  ["wrapperClassName", "Textarea row wrapper (icons + textarea)"],
                  ["textAreaClassName", "Native <textarea> element"],
                  ["labelClassName", "Label element"],
                  ["errorClassName", "Error message"],
                  ["successClassName", "Success message"],
                  ["descriptionClassName", "Helper/description text"],
                  ["countClassName", "Character count display"],
                ] as const).map(([prop, target], i) => (
                  <tr key={prop} className={i > 0 ? c.divider : ""}>
                    <td className={`${c.tableCell} ${c.propName}`}>{prop}</td>
                    <td className={`${c.tableCell} ${c.propDesc}`}>{target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={c.card}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Data Attributes</h3>
          <p className={`text-xs mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>
            Use for CSS-based state styling, e.g. <code className={c.code}>data-[error]:border-red-500</code>
          </p>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="min-w-full">
              <thead>
                <tr className={c.divider}>
                  <th className={c.tableHead}>Attribute</th>
                  <th className={c.tableHead}>On</th>
                  <th className={c.tableHead}>When</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["data-disabled", "container, textarea", "disabled or loading"],
                  ["data-error", "container, textarea", "error = true"],
                  ["data-success", "container, textarea", "success = true (without error)"],
                  ["data-loading", "container", "loading = true"],
                  ["data-size", "container", "size is set"],
                  ["data-readonly", "container, textarea", "readOnly = true"],
                  ["data-slot", "every sub-element", "Always — identifies structural parts"],
                ] as const).map(([attr, on, when], i) => (
                  <tr key={attr} className={i > 0 ? c.divider : ""}>
                    <td className={`${c.tableCell} ${c.propName}`}>{attr}</td>
                    <td className={`${c.tableCell} ${c.propType}`}>{on}</td>
                    <td className={`${c.tableCell} ${c.propDesc}`}>{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={c.card}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Type Exports</h3>
          <p className={`text-xs mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>
            <code className={c.code}>TextAreaProps</code> extends <code className={c.code}>TextareaHTMLAttributes&lt;HTMLTextAreaElement&gt;</code> — all native textarea attributes are inherited.
          </p>
          <div className={`flex flex-wrap gap-3 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
            <span>Exported types:</span>
            {["TextAreaProps", "TextAreaLabelProps", "TextAreaSize"].map((t) => (
              <code key={t} className={c.code}>{t}</code>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>Accessibility</h2>

        <div className={c.card}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Built-in Features</h3>
          <ul className={`space-y-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {([
              ["Label auto-associated via", "htmlFor"],
              ["Required textareas set", "aria-required=\"true\""],
              ["Error state sets", "aria-invalid"],
              ["Error connected via", "aria-describedby"],
              ["Error messages use", "role=\"alert\""],
              ["Success messages use", "role=\"status\""],
              ["Loading state sets", "aria-busy=\"true\""],
              ["Clear button has", "aria-label=\"Clear textarea\""],
              ["Character count uses", "aria-live=\"polite\""],
              ["Clickable icons are", "<button> with aria-label"],
              ["Dev warnings fire for", "missing accessible names"],
            ] as const).map(([text, attr]) => (
              <li key={text} className="flex items-start gap-2.5">
                <CheckIcon className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>{text} <code className={c.code}>{attr}</code></span>
              </li>
            ))}
          </ul>
        </div>

        <div className={c.card}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Keyboard Navigation</h3>
          <div className={`space-y-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {([
              ["Tab", "Move focus to/from textarea, icon buttons, and clear button"],
              ["Enter", "Activate focused icon or clear button (newline in textarea)"],
              ["Space", "Activate focused icon or clear button"],
            ] as const).map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <div className={`${c.cardDense} text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
        <strong className={dark ? "text-gray-300" : "text-gray-600"}>Note:</strong> TextArea extends{" "}
        <code className={c.code}>TextareaHTMLAttributes</code> — all standard props like{" "}
        {["value", "defaultValue", "onChange", "onBlur", "onFocus", "placeholder", "maxLength", "rows", "readOnly", "autoFocus", "wrap"].map((p, i) => (
          <span key={p}>{i > 0 && ", "}<code className={c.code}>{p}</code></span>
        ))}{" "}are fully supported.
      </div>
    </div>
  );
};

export default TextAreaDemo;
