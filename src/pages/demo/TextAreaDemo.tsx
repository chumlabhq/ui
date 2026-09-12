import {
  useState,
  useRef } from "react";
import { Input } from "../../components/Input/index.js";
import { Button } from "../../components/Button/index.js";
import { TextArea,
  TextAreaLabel } from "../../components/TextArea/index.js";
import type { TextAreaClasses } from "../../components/TextArea/index.js";
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

const MessageIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const SendIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);
const FileIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
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

const getClasses = (dark: boolean) => ({
  textarea: {
    control: `rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
    input: `w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary`,
    label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
    description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
    /* No colour here on purpose. The library paints this slot
       `data-[invalid]:text-cl-error data-[valid]:text-cl-success`; a plain
       colour token drops both variants and then only the last one survives,
       which is how every error message on this page rendered green. */
    message: "text-xs mt-1.5 flex items-center gap-1.5",
    count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`,
  } satisfies TextAreaClasses,

  /* The one native field this page renders, for the TextAreaLabel section
     where pairing with a non-Chumlab control is the point. Written once so it
     cannot drift from the component's own look. */
  nativeField: `w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm resize-y transition-all duration-150 bg-cl-bg-input border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus`,
  input: {
    root: "flex flex-col",
    label: `block text-[13px] font-medium mb-1.5 text-cl-text-chrome`,
  },
  wrapperError: `rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-error shadow-sm shadow-danger/0.04 focus-within:ring-2 focus-within:ring-cl-error/15 dark:text-cl-text-secondary dark:border dark:border-cl-error/40 dark:focus-within:ring-2 dark:focus-within:ring-cl-error/25`,
  wrapperSuccess: `rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-success shadow-sm shadow-success/0.04 focus-within:ring-2 focus-within:ring-cl-success/15 dark:text-cl-text-secondary dark:border dark:border-cl-success/40 dark:focus-within:ring-2 dark:focus-within:ring-cl-success/25`,
  wrapperDisabled: `rounded-cl-lg border gap-2.5 opacity-50 cursor-not-allowed border-cl-border bg-cl-bg-hover dark:border dark:border-cl-text/5 dark:bg-cl-text/[0.02]`,
  disabledTextarea: `w-full bg-transparent outline-none text-sm resize-none cursor-not-allowed text-cl-text-tertiary placeholder:text-cl-text-tertiary`,

  container: "flex flex-col",
  icon: dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary",
  iconHover: dark
    ? "text-cl-text-tertiary hover:text-cl-text-secondary"
    : "text-cl-text-tertiary hover:text-cl-text-secondary",
  sectionLabel: `text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary`,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 cardDense: `rounded-cl-lg p-4 bg-cl-bg-elevated`,
  propName: `font-mono text-xs text-cl-accent`,
  propType: `font-mono text-[11px] text-cl-text-tertiary`,
  propDefault: `font-mono text-[11px] text-cl-text-tertiary`,
  propDesc: `text-xs text-cl-text-secondary`,
  code: `px-1.5 py-0.5 rounded-cl-md text-[11px] font-mono font-medium bg-cl-bg-elevated text-cl-text-secondary`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  tableHead: `text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary`,
  tableCell: "py-2.5 px-4",
  divider: `border-t border-cl-border`,
});

const TextAreaDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");
  // An alert() here blocks the page and every automated check with it.
  const [lastAction, setLastAction] = useState("");
  const [bio, setBio] = useState("");
  const [bio2, setBio2] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedback2, setFeedback2] = useState("");
  const [notes, setNotes] = useState("");
  const [notes2, setNotes2] = useState("");

  const bioOk = bio.length >= 10;
  const bioBad = bio.length > 0 && bio.length < 10;

  const wrapperFor = (err: boolean, ok: boolean) =>
    err ? c.wrapperError : ok ? c.wrapperSuccess : c.textarea.control;

  return (
    <div className="space-y-10">
      <DocsHero
        title="Text Area"
        description="A production-grade, multi-line text input. Supports icons, validation states, character counts, clearable, loading states, description text, and complete styling control through the classes prop."
        code={`import { TextArea, TextAreaLabel } from "@chumlab/ui/textarea";`}
      />

      <SetupNote />

      <CopyPasteBlock name="TextArea" />

      <div className="space-y-8">
        <Section
          title="Basic Usage"
          description="Works out-of-the-box with built-in styles, dark mode, and focus states. No custom classes needed."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark} layout="block">
            <div className="flex flex-col gap-4 w-full sm:max-w-md">
              {}
              <TextArea label="Message" placeholder="Write your message..." />
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                description="Max 200 characters"
                maxLength={200}
                showCount
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
              {(["sm", "md", "lg"] as const).map((s) => (
                <div key={s} className="space-y-1.5">
                  <span className={c.sectionLabel}>{s}</span>
                  <TextArea
                    aria-label={`Size ${s}`}
                    placeholder={`Size ${s}...`}
                    size={s}
                    classes={c.textarea}
                  />
                </div>
              ))}
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
              <TextArea
                label="Message"
                description="Write your message here."
                placeholder="Type your message..."
                classes={c.textarea}
                className={c.container}
              />
              <TextArea
                label="Comment"
                placeholder="Leave a comment..."
                required
                classes={c.textarea}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Row Sizes */}
        <Section
          title="Row Sizes"
          description="Control the visible height with the rows prop."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {(
                [
                  ["2 rows", 2],
                  ["4 rows (default)", 4],
                  ["8 rows", 8],
                ] as const
              ).map(([lbl, r]) => (
                <div key={String(lbl)} className="space-y-1.5">
                  <span className={c.sectionLabel}>{lbl}</span>
                  <TextArea
                    aria-label={String(lbl)}
                    placeholder="Resizable..."
                    rows={r as number}
                    classes={c.textarea}
                  />
                </div>
              ))}
            </div>
          </DemoWrapper>
        </Section>

        {/* Resize Behavior */}
        <Section
          title="Resize Behavior"
          description="Control resize via the textarea slot in classes. No resize is hardcoded — you choose."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Vertical only (resize-y)</span>
                <TextArea
                  aria-label="Resize vertical"
                  placeholder="Drag the bottom edge..."
                  rows={3}
                  classes={{
                    ...c.textarea,
                    input: `${c.textarea.input} resize-y`,
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>
                  Fixed height (resize-none)
                </span>
                <TextArea
                  aria-label="Fixed height"
                  placeholder="Cannot resize this..."
                  rows={3}
                  classes={{
                    ...c.textarea,
                    input: `${c.textarea.input} resize-none`,
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Both axes (resize)</span>
                <TextArea
                  aria-label="Resize both"
                  placeholder="Drag any corner..."
                  rows={3}
                  classes={{
                    ...c.textarea,
                    input: `${c.textarea.input} resize`,
                  }}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Auto Resize */}
        <Section
          title="Auto Resize"
          description="Set autoResize to automatically grow/shrink the textarea height to fit content."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-md space-y-3">
              <TextArea
                label="Auto-resizing textarea"
                placeholder="Start typing — the textarea grows as you type..."
                autoResize
                rows={2}
                classes={c.textarea}
              />
              <TextArea
                label="Auto-resize with max length"
                placeholder="Grows up to 200 characters..."
                autoResize
                rows={2}
                maxLength={200}
                showCount
                classes={c.textarea}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Icons */}
        <Section
          title="Icons"
          description="Start and end icons. Add a click handler to make them interactive buttons."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Start icon</span>
                <TextArea
                  aria-label="With start icon"
                  placeholder="Write a message..."
                  startIcon={<MessageIcon className={c.icon} />}
                  classes={c.textarea}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Clickable end icon</span>
                <span className={c.sectionLabel} data-demo-action>
                  {lastAction}
                </span>
                <TextArea
                  aria-label="With send button"
                  placeholder="Type and send..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  endIcon={<SendIcon className={c.iconHover} />}
                  onEndIconClick={() => {
                    setLastAction(`Sent: ${message}`);
                    setMessage("");
                  }}
                  endIconLabel="Send message"
                  classes={c.textarea}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Clickable start icon</span>
                <TextArea
                  aria-label="With attach button"
                  placeholder="Click the icon to attach..."
                  startIcon={<FileIcon className={c.iconHover} />}
                  onStartIconClick={() => setLastAction("Attach file clicked")}
                  startIconLabel="Attach file"
                  classes={c.textarea}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Clearable */}
        <Section
          title="Clearable"
          description="Built-in clear button when the textarea has a value."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <TextArea
                label="Controlled"
                placeholder="Type something..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                clearable
                onClear={() => setNotes("")}
                classes={c.textarea}
                className={c.container}
              />
              <TextArea
                label="Uncontrolled"
                placeholder="Type and clear..."
                clearable
                defaultValue=""
                classes={c.textarea}
                className={c.container}
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
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                maxLength={200}
                showCount
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                success={bioOk}
                successMessage={
                  <>
                    <CheckIcon /> Looks great!
                  </>
                }
                error={bioBad}
                errorMessage="At least 10 characters required"
                classes={{ ...c.textarea, control: wrapperFor(bioBad, bioOk) }}
                className={c.container}
              />
              <TextArea
                label="Notes"
                placeholder="Quick notes..."
                maxLength={100}
                showCount
                clearable
                value={notes2}
                onChange={(e) => setNotes2(e.target.value)}
                onClear={() => setNotes2("")}
                classes={c.textarea}
                className={c.container}
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
              <TextArea
                label="Default"
                placeholder="Normal state"
                classes={c.textarea}
                className={c.container}
              />
              <TextArea
                label="Error"
                value="Too short"
                error
                errorMessage={
                  <>
                    <AlertIcon /> Minimum 20 characters required
                  </>
                }
                classes={{ ...c.textarea, control: c.wrapperError }}
                className={c.container}
              />
              <TextArea
                label="Success"
                value="This is a properly written description that meets the requirements."
                success
                successMessage={
                  <>
                    <CheckIcon /> Content looks good
                  </>
                }
                classes={{ ...c.textarea, control: c.wrapperSuccess }}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Live Validation */}
        <Section
          title="Live Validation"
          description="Real-time feedback as you type. Try entering at least 10 characters."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full max-w-md">
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                maxLength={200}
                showCount
                clearable
                value={bio2}
                onChange={(e) => setBio2(e.target.value)}
                onClear={() => setBio2("")}
                error={bioBad}
                errorMessage={
                  <>
                    <AlertIcon /> At least 10 characters required
                  </>
                }
                success={bioOk}
                successMessage={
                  <>
                    <CheckIcon /> Looks great!
                  </>
                }
                classes={{ ...c.textarea, control: wrapperFor(bioBad, bioOk) }}
                className={c.container}
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
            <div className="w-full max-w-md space-y-3">
              <TextArea
                label="Type anything"
                placeholder="Watch the value below..."
                value={feedback}
                onValueChange={setFeedback}
                clearable
                onClear={() => setFeedback("")}
                classes={c.textarea}
                className={c.container}
              />
              <div
                className={`rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary`}
              >
                value: {JSON.stringify(feedback)}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Loading */}
        <Section
          title="Loading State"
          description="Disables textarea and shows a spinner. Supports custom loaders."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Default loader</span>
                <TextArea
                  aria-label="Loading"
                  placeholder="Loading..."
                  loading
                  classes={c.textarea}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Custom loader</span>
                <TextArea
                  aria-label="Saving"
                  placeholder="Saving..."
                  loading
                  loader={
                    <span
                      className={`text-[11px] font-medium animate-pulse text-cl-accent`}
                    >
                      Saving...
                    </span>
                  }
                  classes={c.textarea}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>
                  Custom loader size (24px)
                </span>
                <TextArea
                  aria-label="Loading large"
                  placeholder="Loading..."
                  loading
                  loaderSize={24}
                  classes={c.textarea}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Disabled & Read-Only */}
        <Section
          title="Disabled & Read-Only"
          description="Disabled prevents interaction. Read-only allows selection but not editing."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <TextArea
                label="Disabled"
                value="Cannot edit this content"
                disabled
                startIcon={
                  <LockIcon
                    className={dark ? "text-cl-text-secondary" : "text-cl-text-secondary"}
                  />
                }
                classes={{
                  ...c.textarea,
                  input: c.disabledTextarea,
                  control: c.wrapperDisabled,
                }}
                className={c.container}
              />
              <TextArea
                label="Disabled empty"
                placeholder="Disabled placeholder"
                disabled
                classes={{
                  ...c.textarea,
                  input: c.disabledTextarea,
                  control: c.wrapperDisabled,
                }}
                className={c.container}
              />
              <TextArea
                label="Read-only"
                value="This content can be selected and copied but not edited."
                readOnly
                classes={{
                  ...c.textarea,
                  control: `${c.textarea.control} cursor-default`,
                }}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Native HTML Attributes */}
        <Section
          title="Native HTML Attributes"
          description="All native textarea attributes (wrap, spellCheck, autoComplete) pass through."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <TextArea
                label="Spellcheck disabled"
                placeholder="Code snippets, IDs..."
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                rows={3}
                classes={{
                  ...c.textarea,
                  input: `${c.textarea.input} resize-none`,
                }}
                className={c.container}
              />
              <TextArea
                label="Hard wrap"
                placeholder="Text wraps at width..."
                wrap="hard"
                cols={40}
                rows={3}
                classes={{
                  ...c.textarea,
                  input: `${c.textarea.input} resize-none`,
                }}
                className={c.container}
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
              <TextArea
                label="Full width with all features"
                placeholder="Enter your message..."
                fullWidth
                clearable
                maxLength={500}
                showCount
                startIcon={<MessageIcon className={c.icon} />}
                classes={c.textarea}
                className={c.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* Ref Forwarding */}
        <Section
          title="Ref Forwarding"
          description="Access the native textarea for programmatic control."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-4 w-full max-w-md">
              <TextArea
                ref={textAreaRef}
                aria-label="Ref demo"
                placeholder="Click buttons below"
                classes={c.textarea}
              />
              <div className="flex gap-2 flex-wrap">
                {(["Focus", "Select All", "Get Value"] as const).map((lbl) => (
                  <button
                    key={lbl}
                    onClick={() => {
                      if (lbl === "Focus") textAreaRef.current?.focus();
                      else if (lbl === "Select All") {
                        textAreaRef.current?.focus();
                        textAreaRef.current?.select();
                      } else if (lbl === "Get Value")
                        alert(`"${textAreaRef.current?.value}"`);
                    }}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-cl-md transition-colors bg-cl-bg-hover text-cl-text-tertiary hover:bg-cl-bg-hover ring-1 ring-inset ring-border-soft dark:bg-cl-text/4 dark:text-cl-text-tertiary dark:hover:bg-cl-text/8 dark:ring-1 dark:ring-inset dark:ring-cl-text/6 cursor-pointer`}
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
          title="TextAreaLabel Standalone"
          description="Use TextAreaLabel independently for custom field layouts."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-4 w-full max-w-xl">
              {/* Beside the field, not above it: `TextArea`'s own `label` prop
                  stacks, so a row is the arrangement that needs the label
                  standalone. Paired with a native textarea on purpose — with
                  `TextArea` you would pass `label` and never reach for this. */}
              <div className="flex items-start gap-3">
                <TextAreaLabel
                  label="Custom Layout"
                  htmlFor="custom-ta"
                  className={`${c.textarea.label} mb-0 mt-2 shrink-0 w-32`}
                />
                <textarea
                  id="custom-ta"
                  placeholder="Label sits beside this field"
                  rows={3}
                  className={c.nativeField}
                />
              </div>
              <div className="flex items-start gap-3">
                <TextAreaLabel
                  label="Required Field"
                  htmlFor="req-ta"
                  required
                  className={`${c.textarea.label} mb-0 mt-2 shrink-0 w-32`}
                />
                <textarea
                  id="req-ta"
                  required
                  rows={3}
                  placeholder="The * comes from `required`"
                  className={c.nativeField}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Custom Themes */}
        <Section
          title="Custom Themes"
          description="Full visual control through the classes prop."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Underline</span>
                <TextArea
                  aria-label="Underline theme"
                  placeholder="Enter text..."
                  rows={3}
                  classes={{
                    ...c.textarea,
                    control: `px-0 gap-2.5 transition-all duration-150 rounded-none border-0 border-b-2 bg-transparent border-cl-border focus-within:border-cl-border-input-focus dark:border-cl-text/10 dark:focus-within:border-cl-border-input-focus`,
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Blue accent</span>
                <TextArea
                  aria-label="Blue accent theme"
                  placeholder="Blue accent theme..."
                  rows={3}
                  classes={{
                    ...c.textarea,
                    control: `rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-border-input-focus bg-cl-accent/[0.08] shadow-sm focus-within:ring-2 focus-within:ring-cl-accent/15 dark:border dark:border-cl-border-input-focus/30 dark:bg-cl-accent/[0.10] dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/25`,
                  }}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* Contact Form */}
        <Section
          title="Contact Form"
          description="Real-world composition with multiple features."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark} className="sm:w-fit">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent!");
              }}
              className="w-full max-w-md space-y-4"
            >
              <div className="text-center space-y-1 mb-6">
                <h3
                  className={`text-xl font-semibold tracking-tight text-cl-text`}
                >
                  Get in touch
                </h3>
                <p
                  className={`text-sm text-cl-text-tertiary`}
                >
                  We'd love to hear from you
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  id="contact-name"
                  placeholder="John Doe"
                  required
                  classes={c.input}
                />
                <Input
                  label="Email"
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  classes={c.input}
                />
              </div>
              <TextArea
                label="Message"
                placeholder="How can we help?"
                required
                rows={5}
                maxLength={500}
                showCount
                clearable
                value={feedback2}
                onChange={(e) => setFeedback2(e.target.value)}
                onClear={() => setFeedback2("")}
                classes={c.textarea}
                className={c.container}
              />
              <Button
                type="submit"
                fullWidth
                className="bg-cl-text text-cl-bg hover:opacity-90"
              >
                Send Message
              </Button>
            </form>
          </DemoWrapper>
        </Section>
      </div>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="TextArea" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Same as Input: controlled via `value` with `onChange` / `onValueChange`, or `defaultValue` for uncontrolled. Long content should stay in sync with parent form state."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Resize behaviors and min/max rows affect layout—test in flex containers.",
          "Screen readers may announce length limits—keep `maxLength` aligned with product copy.",
          "Pasting large text can spike render cost—consider debounced validation.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide labels and error messages like other fields.",
          "Use `rows` and design tokens for comfortable reading width.",
          "Expose clear actions accessibly when `clearable` is on.",
        ]}
        donts={[
          "Do not nest scrollable regions without visible overflow cues.",
          "Do not strip newlines on paste unless the product requires it.",
          "Do not rely on placeholder for the accessible name.",
        ]}
      />
    </div>
  );
};

export default TextAreaDemo;
