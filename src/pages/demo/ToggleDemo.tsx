import { useState } from "react";
import { Toggle } from "../../components/Toggle";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Icons ───────────────────────────────────────────────────────────────────

const BoldIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = ({ className = "" }: { className?: string }) => (
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
    <line x1="19" x2="10" y1="4" y2="4" />
    <line x1="14" x2="5" y1="20" y2="20" />
    <line x1="15" x2="9" y1="4" y2="20" />
  </svg>
);

const UnderlineIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" x2="20" y1="20" y2="20" />
  </svg>
);

const PinIcon = ({ className = "" }: { className?: string }) => (
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
    <line x1="12" x2="12" y1="17" y2="22" />
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
  </svg>
);

const StarIcon = ({ className = "" }: { className?: string }) => (
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
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const VolumeOffIcon = ({ className = "" }: { className?: string }) => (
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
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" x2="17" y1="9" y2="15" />
    <line x1="17" x2="23" y1="9" y2="15" />
  </svg>
);

const AlignLeftIcon = ({ className = "" }: { className?: string }) => (
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
    <line x1="21" x2="3" y1="6" y2="6" />
    <line x1="15" x2="3" y1="12" y2="12" />
    <line x1="17" x2="3" y1="18" y2="18" />
  </svg>
);

const AlignCenterIcon = ({ className = "" }: { className?: string }) => (
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
    <line x1="21" x2="3" y1="6" y2="6" />
    <line x1="17" x2="7" y1="12" y2="12" />
    <line x1="19" x2="5" y1="18" y2="18" />
  </svg>
);

const AlignRightIcon = ({ className = "" }: { className?: string }) => (
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
    <line x1="21" x2="3" y1="6" y2="6" />
    <line x1="21" x2="9" y1="12" y2="12" />
    <line x1="21" x2="7" y1="18" y2="18" />
  </svg>
);

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

export default function ToggleDemo() {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [controlled, setControlled] = useState(false);

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
            Toggle
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A pressed-state button for toolbar actions like bold, italic, align.
            Supports controlled and uncontrolled usage, sizes, loading, disabled
            states, and full class customization.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import Toggle from "@chumlab/ui/toggle";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic"
        description="Simple toggles with icon content. Click to toggle pressed state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Toggle aria-label="Bold">
            <BoldIcon />
          </Toggle>
          <Toggle aria-label="Italic">
            <ItalicIcon />
          </Toggle>
          <Toggle aria-label="Underline">
            <UnderlineIcon />
          </Toggle>
        </DemoWrapper>
      </Section>

      {/* ─── With Text ──────────────────────────────────────────────────── */}
      <Section
        title="With Text"
        description="Toggles can contain text content instead of or alongside icons."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Toggle>
            <span className="flex items-center gap-1.5">
              <VolumeOffIcon /> Mute
            </span>
          </Toggle>
          <Toggle>
            <span className="flex items-center gap-1.5">
              <PinIcon /> Pin
            </span>
          </Toggle>
          <Toggle>
            <span className="flex items-center gap-1.5">
              <StarIcon /> Favorite
            </span>
          </Toggle>
        </DemoWrapper>
      </Section>

      {/* ─── Sizes ──────────────────────────────────────────────────────── */}
      <Section
        title="Sizes"
        description='Available sizes: "sm", "md" (default), "lg".'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="text-center">
            <Toggle size="sm" aria-label="Bold small">
              <BoldIcon />
            </Toggle>
            <p className={`text-xs mt-2 ${c.label}`}>sm</p>
          </div>
          <div className="text-center">
            <Toggle size="md" aria-label="Bold medium">
              <BoldIcon />
            </Toggle>
            <p className={`text-xs mt-2 ${c.label}`}>md</p>
          </div>
          <div className="text-center">
            <Toggle size="lg" aria-label="Bold large">
              <BoldIcon />
            </Toggle>
            <p className={`text-xs mt-2 ${c.label}`}>lg</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled ─────────────────────────────────────────────────── */}
      <Section
        title="Controlled"
        description="Use pressed and onPressedChange for controlled state management."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Toggle
            pressed={controlled}
            onPressedChange={setControlled}
            aria-label="Controlled toggle"
          >
            <StarIcon />
          </Toggle>
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Pressed: <strong>{controlled ? "true" : "false"}</strong>
          </p>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Use disabled to prevent interaction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Toggle disabled aria-label="Disabled unpressed">
            <BoldIcon />
          </Toggle>
          <Toggle disabled defaultPressed aria-label="Disabled pressed">
            <ItalicIcon />
          </Toggle>
        </DemoWrapper>
      </Section>

      {/* ─── Loading ────────────────────────────────────────────────────── */}
      <Section
        title="Loading"
        description="Use loading to indicate an async operation. Disables interaction while loading."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Toggle loading aria-label="Loading unpressed">
            <BoldIcon />
          </Toggle>
          <Toggle loading defaultPressed aria-label="Loading pressed">
            <StarIcon />
          </Toggle>
        </DemoWrapper>
      </Section>

      {/* ─── Toolbar Example ────────────────────────────────────────────── */}
      <Section
        title="Toolbar Example"
        description="Multiple toggles in a flex row simulating a text formatting toolbar."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div
            className={`inline-flex items-center gap-1 rounded-lg p-1 ${dark ? "bg-white/[0.06] border border-white/[0.08]" : "bg-gray-100 border border-gray-200"}`}
          >
            <Toggle
              pressed={bold}
              onPressedChange={setBold}
              size="sm"
              aria-label="Bold"
            >
              <BoldIcon />
            </Toggle>
            <Toggle
              pressed={italic}
              onPressedChange={setItalic}
              size="sm"
              aria-label="Italic"
            >
              <ItalicIcon />
            </Toggle>
            <Toggle
              pressed={underline}
              onPressedChange={setUnderline}
              size="sm"
              aria-label="Underline"
            >
              <UnderlineIcon />
            </Toggle>
            <div
              className={`w-px h-5 mx-1 ${dark ? "bg-white/10" : "bg-gray-300"}`}
            />
            <Toggle size="sm" aria-label="Align left">
              <AlignLeftIcon />
            </Toggle>
            <Toggle size="sm" aria-label="Align center">
              <AlignCenterIcon />
            </Toggle>
            <Toggle size="sm" aria-label="Align right">
              <AlignRightIcon />
            </Toggle>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Active: {[bold && "Bold", italic && "Italic", underline && "Underline"]
            .filter(Boolean)
            .join(", ") || "None"}
        </div>
      </Section>

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled"
        description="Set unstyled=true to strip all default classes. Build from scratch."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Toggle
            unstyled
            className={`px-4 py-2 rounded-full font-bold ${dark ? "bg-linear-to-r from-purple-500 to-pink-500 text-white" : "bg-linear-to-r from-purple-500 to-pink-500 text-white"}`}
            aria-label="Unstyled toggle"
          >
            <StarIcon />
          </Toggle>
          <Toggle
            unstyled
            className={`px-3 py-1.5 rounded-md text-sm font-medium border-2 ${dark ? "border-emerald-400 text-emerald-400 data-[pressed]:bg-emerald-400 data-[pressed]:text-gray-900" : "border-emerald-600 text-emerald-600 data-[pressed]:bg-emerald-600 data-[pressed]:text-white"}`}
            aria-label="Custom styled toggle"
          >
            Custom
          </Toggle>
        </DemoWrapper>
      </Section>

      {/* ─── Props Table ────────────────────────────────────────────────── */}
      <Section title="Toggle Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="pressed"
              type="boolean"
              description="Controlled pressed state"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultPressed"
              type="boolean"
              defaultVal="false"
              description="Initial pressed state for uncontrolled usage"
              isDarkMode={dark}
            />
            <PropRow
              name="onPressedChange"
              type="(pressed: boolean) => void"
              description="Fires when the pressed state changes"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disables interaction"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="boolean"
              defaultVal="false"
              description="Shows a loading state and disables interaction"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type='"sm" | "md" | "lg"'
              defaultVal='"md"'
              description="Size variant"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="ToggleClasses"
              description="CSS class overrides for sub-elements (root, content, icon)"
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
              name="reduceMotion"
              type='boolean | "auto"'
              defaultVal='"auto"'
              description='Controls motion preferences. "auto" respects OS setting.'
              isDarkMode={dark}
            />
            <PropRow
              name="children"
              type="ReactNode"
              description="Icon or content to render inside the toggle"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use these for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-pressed"
              type="button element"
              description="Present when the toggle is pressed"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="button element"
              description="Present when disabled or loading"
              isDarkMode={dark}
            />
            <PropRow
              name="data-size"
              type="button element"
              description='Current size value ("sm" | "md" | "lg")'
              isDarkMode={dark}
            />
            <PropRow
              name="data-loading"
              type="button element"
              description="Present when loading=true"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Toggle supports both controlled (pressed + onPressedChange) and uncontrolled (defaultPressed) patterns. When pressed is provided, the component is fully controlled and onPressedChange is required to update state."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "`loading` implicitly disables the toggle, preventing state changes while an async operation is in progress.",
          "When both `disabled` and `defaultPressed` are set, the toggle renders in its pressed visual state but cannot be interacted with.",
          "`unstyled` removes all default classes including size styles; you must provide your own via `className` or `classes`.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `aria-label` for icon-only toggles.",
          "Use controlled mode when toggle state drives other UI.",
          "Group related toggles in a toolbar with proper spacing.",
        ]}
        donts={[
          "Do not use a toggle for binary choices that require a form submission—use a checkbox instead.",
          "Do not nest interactive elements inside the toggle.",
          "Do not omit focus styles in custom themes.",
        ]}
      />
    </div>
  );
}
