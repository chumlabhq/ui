import { useState, type CSSProperties } from "react";
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  AvatarShimmer,
  AvatarGroupShimmer,
  } from "../../components/Avatar/index.js";
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
import { Table } from "../../components/Table/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";

/**
 * Four tones for the rows that demonstrate the badge, cycled by position.
 *
 * The row should read as composed: `autoColor` hashing the label gave seven
 * unrelated hues and buried the variant under the colour, and pinning it to one
 * entry made the whole row the same indigo. Four is enough to look deliberate
 * and few enough that the eye stops reading it as data.
 *
 * They are four adjacent cool hues — indigo, violet, cyan, emerald — at
 * matching lightness and low saturation, so no single avatar steps forward and
 * the badge stays the thing that changes. Light and dark walk the same hue
 * order, so switching theme re-lights the row instead of repainting it in a
 * different palette.
 *
 * MEASURED, not assumed. This comment used to say the pairs were "already a
 * contrast-checked pair" because they came from the library's ramps, and two of
 * the four were not: cyan sat at 3.29:1 and emerald at 3.32:1 against their own
 * backgrounds, under the 4.5 an avatar's initials need. Indigo (5.10) and
 * violet (4.80) were fine. The two were stepped down one shade — cyan to
 * #155e75 for 6.49, emerald to #047857 for 4.84 — and the dark pairs all clear
 * it already, at 5.73 to 8.12. `e2e/demo-contrast.spec.ts` is what measures it
 * now; the fixture sweep never could, because `autoColor` hashes the NAME and
 * the fixtures only ever land on a few entries.
 *
 * Set directly rather than through `autoColor`, which offers no way to choose:
 * it derives the index from a hash of the name, and its dark colours come from
 * its own array at that index, so a curated light palette would have been
 * paired with whatever dark tone the hash happened to land on.
 */
const BADGE_TONES = [
  { bg: "#e0e7ff", text: "#4f46e5", darkBg: "#312e81", darkText: "#a5b4fc" },
  { bg: "#ede9fe", text: "#7c3aed", darkBg: "#3b0764", darkText: "#c4b5fd" },
  { bg: "#cffafe", text: "#155e75", darkBg: "#164e63", darkText: "#67e8f9" },
  { bg: "#d1fae5", text: "#047857", darkBg: "#064e3b", darkText: "#6ee7b7" },
];

/**
 * `--avatar-dark-*` is how Avatar carries its dark values: it injects a rule
 * keyed on those properties being present, so the pair below survives a theme
 * switch without this page knowing which theme is on.
 */
const badgeToneStyle = (i: number) => {
  const t = BADGE_TONES[i % BADGE_TONES.length];
  return {
    backgroundColor: t.bg,
    color: t.text,
    "--avatar-dark-bg": t.darkBg,
    "--avatar-dark-text": t.darkText,
  } as CSSProperties;
};

const getClasses = (dark: boolean) => ({
  subtleColors: {
    backgrounds: [
      "#e0e7ff",
      "#dbeafe",
      "#d1fae5",
      "#fef9c3",
      "#fce7f3",
      "#ede9fe",
      "#cffafe",
      "#fef2f2",
    ],
    text: [
      "#4f46e5",
      "#1d4ed8",
      "#047857",
      "#854d0e",
      "#be185d",
      "#7c3aed",
      "#0e7490",
      "#ef4444",
    ],
  },
  brandColors: {
    backgrounds: ["#1e40af", "#7c3aed", "#0e7490", "#b91c1c"],
    text: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
  },

 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
  btnPrimary:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90",
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
  fallbackBg: "bg-cl-bg-hover",
  stateDisplay: `text-sm font-mono text-cl-text-secondary`,
  // The ring demo needs a surface that is plainly not the page background in
  // both themes, and the token scale has none: `bg-cl-elevated` is a hair off
  // white (#f8f9fb on #ffffff), and everything with more separation is
  // translucent, which a solid ring colour cannot match. So an opaque neutral
  // pair, kept next to the colour it has to equal so the two cannot drift.
  ringSurface: dark ? "p-4 rounded-cl-md bg-[#171a21]" : "p-4 rounded-cl-md bg-[#eceef2]",
  ringSurfaceColor: dark ? "#171a21" : "#eceef2",
});

const AvatarDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clickLog, setClickLog] = useState<string[]>([]);
  const [groupCountClicks, setGroupCountClicks] = useState(0);
  const [avatarButtonClicks, setAvatarButtonClicks] = useState(0);
  const [profileButtonClicks, setProfileButtonClicks] = useState(0);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Avatar"
        description="A flexible avatar component for displaying user images, initials, or fallback content. Supports status indicators, badges, tooltips, auto-generated colors, grouping, and fully customizable styling via the classes system."
        code={`import { Avatar, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@chumlab/ui/avatar";`}
      />

      <SetupNote />

      <ComponentAnatomy name="Avatar" />

      <Section
        title="Basic Usage"
        description="Avatar with image, initials, and custom fallback."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {}
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
            alt="John Doe"
            name="John Doe"
          />
          <Avatar name="Jane Smith" autoColor />
          <Avatar name="Alex" autoColor />
        </DemoWrapper>
      </Section>

      <Section
        title="Sizes"
        description="Presets: xs, sm, md, lg, xl, or any custom pixel number."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <div key={s} className="text-center">
              <Avatar
                name={s.toUpperCase()}
                size={s}
                autoColor
                colors={c.subtleColors}
              />
              <p className={`text-xs mt-2 ${c.label}`}>{s}</p>
            </div>
          ))}
          <div className="text-center">
            <Avatar name="80" size={80} autoColor colors={c.subtleColors} />
            <p className={`text-xs mt-2 ${c.label}`}>80px</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Shapes ─────────────────────────────────────────────────────── */}
      <Section
        title="Shapes"
        description="circle (default), rounded, and square."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {(["circle", "rounded", "square"] as const).map((s) => (
            <div key={s} className="text-center">
              <Avatar
                name={s}
                shape={s}
                size="lg"
                autoColor
                colors={c.subtleColors}
              />
              <p className={`text-xs mt-2 ${c.label}`}>{s}</p>
            </div>
          ))}
        </DemoWrapper>
      </Section>

      {/* ─── Max Initials ───────────────────────────────────────────────── */}
      <Section
        title="Max Initials"
        description="Control how many initials are shown with maxInitials."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="text-center">
            <Avatar
              name="John Michael Doe"
              maxInitials={1}
              autoColor
              colors={c.subtleColors}
            />
            <p className={`text-xs mt-2 ${c.label}`}>maxInitials=1</p>
          </div>
          <div className="text-center">
            <Avatar
              name="John Michael Doe"
              maxInitials={2}
              autoColor
              colors={c.subtleColors}
            />
            <p className={`text-xs mt-2 ${c.label}`}>maxInitials=2</p>
          </div>
          <div className="text-center">
            <Avatar
              name="John Michael Doe"
              maxInitials={3}
              autoColor
              colors={c.subtleColors}
            />
            <p className={`text-xs mt-2 ${c.label}`}>maxInitials=3</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Fallback Content ──────────────────────────────────────────── */}
      <Section
        title="Fallback Content"
        description="Use the fallback prop to show custom content (icon, emoji, etc.) when no image or name is provided."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="text-center">
            <Avatar fallback={<span>?</span>} />
            <p className={`text-xs mt-2 ${c.label}`}>text fallback</p>
          </div>
          <div className="text-center">
            <Avatar
              fallback={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <p className={`text-xs mt-2 ${c.label}`}>icon fallback</p>
          </div>
          <div className="text-center">
            <Avatar
              src="data:image/gif;base64,invalid"
              fallback={<span>!</span>}
              imageConfig={{ loading: "eager" }}
            />
            <p className={`text-xs mt-2 ${c.label}`}>image error fallback</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Auto Colors ────────────────────────────────────────────────── */}
      <Section
        title="Auto-Generated Colors"
        description="autoColor generates consistent colors based on the name hash."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {[
            "Alice",
            "Bob",
            "Charlie",
            "Diana",
            "Edward",
            "Fiona",
            "George",
            "Hannah",
          ].map((name) => (
            <Avatar key={name} name={name} autoColor colors={c.subtleColors} />
          ))}
        </DemoWrapper>
      </Section>

      {/* ─── Custom Color Palettes ──────────────────────────────────────── */}
      <Section
        title="Custom Color Palettes"
        description="Provide custom color arrays for autoColor generation."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Subtle pastel palette
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              {["Custom 1", "Custom 2", "Custom 3"].map((n) => (
                <Avatar
                  key={n}
                  name={n}
                  autoColor
                  colors={{
                    backgrounds: ["#e0f2fe", "#fce7f3", "#dcfce7"],
                    text: ["#0369a1", "#be185d", "#15803d"],
                  }}
                />
              ))}
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Brand colors (white text on dark backgrounds)
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              {["Brand A", "Brand B", "Brand C", "Brand D"].map((n) => (
                <Avatar key={n} name={n} autoColor colors={c.brandColors} />
              ))}
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Text Styling ───────────────────────────────────────────────── */}
      <Section
        title="Text & Initials Styling"
        description="Customize initials via classes.initials or textStyle."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Avatar
            name="Bold"
            autoColor
            colors={c.subtleColors}
            classes={{ fallback: "font-bold" }}
          />
          <Avatar
            name="Light"
            autoColor
            colors={c.subtleColors}
            classes={{ fallback: "font-light" }}
          />
          <Avatar
            name="Italic"
            autoColor
            colors={c.subtleColors}
            textStyle={{ fontStyle: "italic" }}
          />
          <Avatar
            name="Custom"
            className={c.fallbackBg}
            textStyle={{ color: "var(--cl-accent)", fontWeight: 600 }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Bordered ───────────────────────────────────────────────────── */}
      <Section
        title="Bordered Avatars"
        description="bordered={true} for auto-generated color, or a CSS border string."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="text-center">
            <Avatar name="Auto" autoColor colors={c.subtleColors} bordered />
            <p className={`text-xs mt-2 ${c.label}`}>bordered=true</p>
          </div>
          <div className="text-center">
            <Avatar
              name="Custom"
              autoColor
              colors={c.subtleColors}
              bordered="2px solid #a5b4fc"
            />
            <p className={`text-xs mt-2 ${c.label}`}>custom string</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
              name="Image"
              bordered="2px solid #86efac"
            />
            <p className={`text-xs mt-2 ${c.label}`}>with image</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Status Indicator ───────────────────────────────────────────── */}
      <Section
        title="Status Indicator"
        description="Show online/offline/away/busy status. Use a string shorthand or config object."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {(["online", "offline", "away", "busy"] as const).map((s) => (
            <div key={s} className="text-center">
              <Avatar name={s} autoColor colors={c.subtleColors} status={s} />
              <p className={`text-xs mt-2 ${c.label}`}>{s}</p>
            </div>
          ))}
        </DemoWrapper>
      </Section>

      {/* ─── Status Position & Custom Color ─────────────────────────────── */}
      <Section
        title="Status Position & Custom Color"
        description="Position the indicator at any corner and override the default color."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <DemoWrapper isDarkMode={dark} layout="inline">
            {(
              ["top-right", "top-left", "bottom-right", "bottom-left"] as const
            ).map((pos) => (
              <div key={pos} className="text-center">
                <Avatar
                  name={pos.slice(0, 2).toUpperCase()}
                  autoColor
                  colors={c.subtleColors}
                  status={{ type: "online", position: pos }}
                />
                <p className={`text-xs mt-2 ${c.label}`}>{pos}</p>
              </div>
            ))}
          </DemoWrapper>
          <DemoWrapper isDarkMode={dark} layout="inline">
            <Avatar
              name="Purple"
              autoColor
              colors={c.subtleColors}
              status={{ type: "online", color: "#8b5cf6" }}
            />
            <Avatar
              name="Pink"
              autoColor
              colors={c.subtleColors}
              status={{ type: "online", color: "#ec4899" }}
            />
            <Avatar
              name="Cyan"
              autoColor
              colors={c.subtleColors}
              status={{ type: "online", color: "#06b6d4" }}
            />
          </DemoWrapper>
        </div>
      </Section>

      {/* ─── Tooltip ────────────────────────────────────────────────────── */}
      <Section
        title="Tooltip"
        description="Simple string tooltip or full config object with side, offset, delay."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Avatar
            name="Simple"
            autoColor
            colors={c.subtleColors}
            tooltip="Simple tooltip"
          />
          <Avatar
            name="Bottom"
            autoColor
            colors={c.subtleColors}
            tooltip={{
              content: "Bottom tooltip",
              side: "bottom",
              sideOffset: 8,
            }}
          />
          <Avatar
            name="Delayed"
            autoColor
            colors={c.subtleColors}
            tooltip={{ content: "Appears after 500ms", delayDuration: 500 }}
          />
          <Avatar
            name="No Arrow"
            autoColor
            colors={c.subtleColors}
            tooltip={{ content: "No arrow", showArrow: false }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Avatar Badge ───────────────────────────────────────────────── */}
      <Section
        title="Avatar Badge"
        description="Overlay notification badges with count, dot, variants, sizes, and positioning."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Variants & dot
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline" className="overflow-visible">
              {[
                { label: "count", props: { count: 5 } },
                { label: "max=99", props: { count: 150, max: 99 } },
                { label: "dot", props: { dot: true } },
                {
                  label: "pulse",
                  props: { dot: true, pulse: true, color: "#22c55e" },
                },
                {
                  label: "outline",
                  props: { count: 3, variant: "outline" as const },
                },
                {
                  label: "soft",
                  props: { count: 7, variant: "soft" as const },
                },
                { label: "showZero", props: { count: 0, showZero: true } },
              ].map(({ label, props }, i) => (
                <div key={label} className="text-center pt-2 pb-1">
                  <div className="relative inline-flex">
                    <Avatar name={label} style={badgeToneStyle(i)} />
                    <AvatarBadge {...props} />
                  </div>
                  <p className={`text-xs mt-3 ${c.label}`}>{label}</p>
                </div>
              ))}
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>Sizes</p>
            <DemoWrapper isDarkMode={dark} layout="inline" className="overflow-visible">
              {(["xs", "sm", "md", "lg"] as const).map((s, i) => (
                <div key={s} className="text-center pt-2 pb-1">
                  <div className="relative inline-flex">
                    <Avatar name={s} style={badgeToneStyle(i)} />
                    <AvatarBadge count={3} size={s} />
                  </div>
                  <p className={`text-xs mt-3 ${c.label}`}>{s}</p>
                </div>
              ))}
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>Tone</p>
            <DemoWrapper isDarkMode={dark} layout="inline" className="overflow-visible">
              {(
                [
                  { tone: "accent" as const, label: "accent (default)", count: 5 },
                  { tone: "error" as const, label: "error", count: 5 },
                  { tone: "accent" as const, label: "accent dot", dot: true },
                  { tone: "error" as const, label: "error dot", dot: true },
                ]
              ).map(({ tone, label, count, dot }, i) => (
                <div key={label} className="text-center pt-2 pb-1">
                  <div className="relative inline-flex">
                    <Avatar name={label} style={badgeToneStyle(i)} />
                    <AvatarBadge tone={tone} count={count} dot={dot} />
                  </div>
                  <p className={`text-xs mt-3 ${c.label}`}>{label}</p>
                </div>
              ))}
            </DemoWrapper>
            <p className={`${c.note}`}>
              A count is a notification, not a fault, so the default is the
              accent. Reserve <code>tone="error"</code> for a badge that reports
              something wrong.
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>Positions</p>
            <DemoWrapper isDarkMode={dark} layout="inline" className="overflow-visible">
              {(
                [
                  "top-right",
                  "top-left",
                  "bottom-right",
                  "bottom-left",
                ] as const
              ).map((pos) => (
                <div key={pos} className="text-center pt-2 pb-1">
                  <div className="relative inline-flex">
                    <Avatar
                      name={pos.slice(0, 2)}
                      autoColor
                      colors={c.subtleColors}
                    />
                    <AvatarBadge dot color="#22c55e" position={pos} />
                  </div>
                  <p className={`text-xs mt-3 ${c.label}`}>{pos}</p>
                </div>
              ))}
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Overlap modes & custom offset
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline" className="overflow-visible">
              <div className="text-center pt-2 pb-1">
                <div className="relative inline-flex">
                  <Avatar name="Circ" autoColor colors={c.subtleColors} />
                  <AvatarBadge count={2} overlap="circular" />
                </div>
                <p className={`text-xs mt-3 ${c.label}`}>circular</p>
              </div>
              <div className="text-center pt-2 pb-1">
                <div className="relative inline-flex">
                  <Avatar
                    name="Rect"
                    shape="square"
                    autoColor
                    colors={c.subtleColors}
                  />
                  <AvatarBadge count={2} overlap="rectangular" />
                </div>
                <p className={`text-xs mt-3 ${c.label}`}>rectangular</p>
              </div>
              <div className="text-center pt-2 pb-1">
                <div className="relative inline-flex">
                  <Avatar name="Off" autoColor colors={c.subtleColors} />
                  <AvatarBadge count={9} offset={{ x: 2, y: -2 }} />
                </div>
                <p className={`text-xs mt-3 ${c.label}`}>custom offset</p>
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Avatar Group ───────────────────────────────────────────────── */}
      <Section
        title="Avatar Group"
        description="Stack avatars with automatic overflow counting, custom spacing, and layout variants."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Default stack
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup>
                <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                <Avatar
                  name="Charlie Davis"
                  autoColor
                  colors={c.subtleColors}
                />
                <Avatar name="Diana Evans" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              max=3 with surplus
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup maxVisible={3}>
                <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                <Avatar
                  name="Charlie Davis"
                  autoColor
                  colors={c.subtleColors}
                />
                <Avatar name="Diana Evans" autoColor colors={c.subtleColors} />
                <Avatar name="Edward Fox" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              total=50 (server-side count)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup maxVisible={3} total={50}>
                <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                <Avatar
                  name="Charlie Davis"
                  autoColor
                  colors={c.subtleColors}
                />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              showTooltip on surplus
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup maxVisible={2} showTooltip>
                <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                <Avatar
                  name="Charlie Davis"
                  autoColor
                  colors={c.subtleColors}
                />
                <Avatar name="Diana Evans" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom spacing
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <div className="text-center">
                <AvatarGroup spacing={-16}>
                  <Avatar name="A" autoColor colors={c.subtleColors} />
                  <Avatar name="B" autoColor colors={c.subtleColors} />
                  <Avatar name="C" autoColor colors={c.subtleColors} />
                </AvatarGroup>
                <p className={`text-xs mt-2 ${c.label}`}>spacing=-16 (tight)</p>
              </div>
              <div className="text-center">
                <AvatarGroup spacing={4}>
                  <Avatar name="D" autoColor colors={c.subtleColors} />
                  <Avatar name="E" autoColor colors={c.subtleColors} />
                  <Avatar name="F" autoColor colors={c.subtleColors} />
                </AvatarGroup>
                <p className={`text-xs mt-2 ${c.label}`}>spacing=4 (spaced)</p>
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Ring color on a raised surface (compare default vs matched)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Default (page-colored ring)</p>
                  <div className={c.ringSurface}>
                    <AvatarGroup>
                      <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                      <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                      <Avatar name="Charlie Davis" autoColor colors={c.subtleColors} />
                    </AvatarGroup>
                  </div>
                </div>
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Matched ring (surface color)</p>
                  <div className={c.ringSurface}>
                    <AvatarGroup ringColor={c.ringSurfaceColor}>
                      <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                      <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                      <Avatar name="Charlie Davis" autoColor colors={c.subtleColors} />
                    </AvatarGroup>
                  </div>
                </div>
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              reverseOrder
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup reverseOrder>
                <Avatar name="First" autoColor colors={c.subtleColors} />
                <Avatar name="Second" autoColor colors={c.subtleColors} />
                <Avatar name="Third" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              renderSurplus (custom)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup
                maxVisible={2}
                renderSurplus={(count) => (
                  <span
                    className={`ml-2 text-xs font-medium text-cl-text-secondary`}
                  >
                    and {count} more...
                  </span>
                )}
              >
                <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                <Avatar
                  name="Charlie Davis"
                  autoColor
                  colors={c.subtleColors}
                />
                <Avatar name="Diana Evans" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Avatar Group Variants ──────────────────────────────────────── */}
      <Section
        title="Group Layout Variants"
        description='variant="stack" (default), "grid", or "inline".'
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {(["stack", "grid", "inline"] as const).map((v) => (
            <div key={v}>
              <p className={`text-xs font-medium mb-2 ${c.label}`}>{v}</p>
              <DemoWrapper
                isDarkMode={dark}
                layout="block"
                className="overflow-visible"
              >
                <AvatarGroup layout={v} spacing={v === "stack" ? -8 : 4}>
                  <Avatar name="Alice" autoColor colors={c.subtleColors} />
                  <Avatar name="Bob" autoColor colors={c.subtleColors} />
                  <Avatar name="Charlie" autoColor colors={c.subtleColors} />
                </AvatarGroup>
              </DemoWrapper>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Avatar Group Click ─────────────────────────────────────────── */}
      <Section
        title="Group Click Handler"
        description="onAvatarClick receives {index, name} and the event."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <AvatarGroup
            onAvatarClick={(info) => {
              setClickLog((prev) => [
                `Clicked: ${info.name ?? "unknown"} (index ${info.index})`,
                ...prev.slice(0, 4),
              ]);
            }}
          >
            <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
            <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
            <Avatar name="Charlie Davis" autoColor colors={c.subtleColors} />
          </AvatarGroup>
          {clickLog.length > 0 && (
            <div
              className={`mt-3 text-xs font-mono space-y-1 text-cl-text-secondary`}
            >
              {clickLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Standalone AvatarGroupCount ─────────────────────────────────── */}
      <Section
        title="AvatarGroupCount (Standalone)"
        description="Use AvatarGroupCount independently with variants, custom format, and click handler."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>Variants</p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              {(["solid", "outline", "ghost"] as const).map((v) => (
                <div key={v} className="text-center">
                  <AvatarGroupCount count={5} variant={v} />
                  <p className={`text-xs mt-2 ${c.label}`}>{v}</p>
                </div>
              ))}
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom format & showPlus
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <div className="text-center">
                <AvatarGroupCount count={12} showPlus />
                <p className={`text-xs mt-2 ${c.label}`}>+12</p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={12} showPlus={false} />
                <p className={`text-xs mt-2 ${c.label}`}>no plus</p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={1234}
                  format={(n) =>
                    n > 999 ? `${(n / 1000).toFixed(1)}k` : `${n}`
                  }
                />
                <p className={`text-xs mt-2 ${c.label}`}>custom format</p>
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              With tooltip & click
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <AvatarGroupCount
                count={8}
                tooltip="View all 8 members"
                onClick={() => setGroupCountClicks((n) => n + 1)}
              />
              <div
                className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
                data-demo-action
              >
                onClick: {groupCountClicks ? `fired ${groupCountClicks}×` : "not fired yet"}
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Loading & Shimmer ──────────────────────────────────────────── */}
      <Section
        title="Loading & Shimmer"
        description="Shimmer placeholders for avatars and groups. Use AvatarShimmer, AvatarGroupShimmer, or the loading prop directly on Avatar."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Toggle shimmer / content
            </p>
            <div className="mb-3">
              <button className={c.btn} onClick={() => setIsLoading(!isLoading)}>
                {isLoading ? "Show Content" : "Show Shimmer"}
              </button>
            </div>
            <DemoWrapper isDarkMode={dark} layout="inline">
              {isLoading ? (
                <>
                  <AvatarShimmer size="sm" />
                  <AvatarShimmer />
                  <AvatarShimmer size="lg" />
                  <AvatarShimmer shape="rounded" />
                  <AvatarShimmer shape="square" />
                  <AvatarShimmer animate={false} />
                </>
              ) : (
                <>
                  <Avatar name="Alice" size="sm" autoColor colors={c.subtleColors} />
                  <Avatar name="Bob" autoColor colors={c.subtleColors} />
                  <Avatar name="Charlie" size="lg" autoColor colors={c.subtleColors} />
                  <Avatar name="Diana" shape="rounded" autoColor colors={c.subtleColors} />
                  <Avatar name="Edward" shape="square" autoColor colors={c.subtleColors} />
                  <Avatar name="Fiona" autoColor colors={c.subtleColors} />
                </>
              )}
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              loading prop on Avatar
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <div className="text-center">
                <Avatar loading />
                <p className={`text-xs mt-2 ${c.label}`}>default</p>
              </div>
              <div className="text-center">
                <Avatar loading size="lg" />
                <p className={`text-xs mt-2 ${c.label}`}>large</p>
              </div>
              <div className="text-center">
                <Avatar loading shape="rounded" />
                <p className={`text-xs mt-2 ${c.label}`}>rounded</p>
              </div>
              <div className="text-center">
                <Avatar loading shape="square" />
                <p className={`text-xs mt-2 ${c.label}`}>square</p>
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              AvatarGroupShimmer options
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <div className="text-center">
                <AvatarGroupShimmer count={3} showCount />
                <p className={`text-xs mt-2 ${c.label}`}>showCount</p>
              </div>
              <div className="text-center">
                <AvatarGroupShimmer count={4} size="lg" shape="rounded" />
                <p className={`text-xs mt-2 ${c.label}`}>large + rounded</p>
              </div>
              <div className="text-center">
                <AvatarGroupShimmer count={3} spacing={-16} />
                <p className={`text-xs mt-2 ${c.label}`}>custom spacing</p>
              </div>
              <div className="text-center">
                <AvatarGroupShimmer count={3} animate={false} />
                <p className={`text-xs mt-2 ${c.label}`}>no animation</p>
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Ring color on a raised surface
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <div className="flex items-center gap-6">
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Default (page-colored ring)</p>
                  <div className={c.ringSurface}>
                    <AvatarGroupShimmer count={3} />
                  </div>
                </div>
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Matched ring (surface color)</p>
                  <div className={c.ringSurface}>
                    <AvatarGroupShimmer count={3} ringColor={c.ringSurfaceColor} />
                  </div>
                </div>
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Image Config ───────────────────────────────────────────────── */}
      <Section
        title="Image Configuration"
        description="Fine-tune image loading: lazy/eager, priority, srcSet, crossOrigin."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
              name="Lazy"
              imageConfig={{ loading: "lazy" }}
            />
            <p className={`text-xs mt-2 ${c.label}`}>lazy (default)</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              name="Eager"
              imageConfig={{ loading: "eager", decoding: "sync" }}
            />
            <p className={`text-xs mt-2 ${c.label}`}>eager + sync</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
              name="Priority"
              imageConfig={{ fetchPriority: "high" }}
            />
            <p className={`text-xs mt-2 ${c.label}`}>high priority</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Image Error ────────────────────────────────────────────────── */}
      <Section
        title="Image Error Handling"
        description="Graceful fallback to initials when image fails to load."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Avatar
            src={imageError ? "" : "data:image/gif;base64,invalid"}
            name="John Doe"
            autoColor
            colors={c.subtleColors}
            onError={() => setImageError(true)}
            imageConfig={{ loading: "eager" }}
          />
        </DemoWrapper>
      </Section>

      <Section
        title="Classes System"
        description="Override internal element styling with the classes prop. Slots: root, inner, image, initials, fallback, status."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom initials styling
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Avatar
                name="Bold"
                autoColor
                colors={c.subtleColors}
                classes={{ fallback: "font-bold tracking-wider" }}
              />
              <Avatar
                name="Italic"
                autoColor
                colors={c.subtleColors}
                classes={{ fallback: "italic" }}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom status class (ring effect)
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Avatar
                name="Ring"
                autoColor
                colors={c.subtleColors}
                status="online"
                classes={{
                  status: "absolute block rounded-full ring-2 ring-white",
                }}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              unstyled + gradient root
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Avatar
                name="Custom"
                unstyled
                classes={{
                  root: "inline-flex items-center justify-center rounded-cl-lg bg-linear-to-br from-cl-accent to-cl-accent text-white font-bold",
                  control:
                    "absolute inset-0 overflow-hidden flex items-center justify-center rounded-cl-lg",
                }}
                size="lg"
              />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Clickable ──────────────────────────────────────────────────── */}
      <Section
        title="Clickable Avatars"
        description="Wrap avatars in buttons or links. Prefer wrapping over asChild for focus management."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <button
            aria-label="Click"
            onClick={() => setAvatarButtonClicks((n) => n + 1)}
            className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-2 rounded-full"
          >
            <Avatar
              name="Click"
              autoColor
              colors={c.subtleColors}
              tooltip="Click me!"
            />
          </button>
          <button
            onClick={() => setProfileButtonClicks((n) => n + 1)}
            className={`flex items-center gap-3 px-3 py-2 rounded-cl-md transition-colors focus:outline-none focus:ring-2 focus:ring-cl-accent hover:bg-cl-bg-hover cursor-pointer`}
          >
            <Avatar
              name="Jane Doe"
              autoColor
              colors={c.subtleColors}
              status="online"
            />
            <span
              className={`text-sm font-medium text-cl-text`}
            >
              Jane Doe
            </span>
          </button>
          <div
            className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
            data-demo-action
          >
            <div>avatar onClick: {avatarButtonClicks ? `fired ${avatarButtonClicks}×` : "not fired yet"}</div>
            <div>profile onClick: {profileButtonClicks ? `fired ${profileButtonClicks}×` : "not fired yet"}</div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Group Size / Shape / Bordered ─────────────────────────────── */}
      <Section
        title="Group Inherited Props"
        description="AvatarGroup passes size, shape, and bordered to all children via context."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              size=&quot;lg&quot; (all children inherit)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup size="lg">
                <Avatar name="Alice" autoColor colors={c.subtleColors} />
                <Avatar name="Bob" autoColor colors={c.subtleColors} />
                <Avatar name="Charlie" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              shape=&quot;rounded&quot;
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup shape="rounded">
                <Avatar name="Alice" autoColor colors={c.subtleColors} />
                <Avatar name="Bob" autoColor colors={c.subtleColors} />
                <Avatar name="Charlie" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              bordered (all children get border)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup bordered>
                <Avatar name="Alice" autoColor colors={c.subtleColors} />
                <Avatar name="Bob" autoColor colors={c.subtleColors} />
                <Avatar name="Charlie" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              dir=&quot;rtl&quot;
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <AvatarGroup dir="rtl">
                <Avatar name="Alice" autoColor colors={c.subtleColors} />
                <Avatar name="Bob" autoColor colors={c.subtleColors} />
                <Avatar name="Charlie" autoColor colors={c.subtleColors} />
              </AvatarGroup>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Badge Invisible ───────────────────────────────────────────── */}
      <Section
        title="Badge Invisible"
        description="Use invisible to hide a badge without unmounting (preserves layout)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline" className="overflow-visible">
          <div className="text-center pt-2 pb-1">
            <div className="relative inline-flex">
              <Avatar name="Visible" autoColor colors={c.subtleColors} />
              <AvatarBadge count={3} />
            </div>
            <p className={`text-xs mt-3 ${c.label}`}>visible</p>
          </div>
          <div className="text-center pt-2 pb-1">
            <div className="relative inline-flex">
              <Avatar name="Hidden" autoColor colors={c.subtleColors} />
              <AvatarBadge count={3} invisible />
            </div>
            <p className={`text-xs mt-3 ${c.label}`}>invisible=true</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Reduce Motion ──────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description="Set reduceMotion={true} to disable image fade-in and shimmer pulse animations."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
              name="Animated"
            />
            <p className={`text-xs mt-2 ${c.label}`}>default (auto)</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              name="No Motion"
              reduceMotion={true}
            />
            <p className={`text-xs mt-2 ${c.label}`}>reduceMotion=true</p>
          </div>
          <div className="text-center">
            <AvatarShimmer reduceMotion={true} />
            <p className={`text-xs mt-2 ${c.label}`}>shimmer (no pulse)</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Avatars in rows ──────────────────────────────────────────────── */}
      <Section
        title="Avatars in rows"
        description="Avatar inside a Table cell, beside each person's name, and inside each Dropdown option, where the picked person's initials show in the list. With no image, an Avatar draws the initials of its name."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div data-demo-recipe="avatars-in-rows" className="w-full space-y-6">
            <Table
              caption="The team"
              getRowId={(person) => person.id}
              data={[
                { id: "ada", name: "Ada Lovelace", role: "Engineer" },
                { id: "grace", name: "Grace Hopper", role: "Admiral" },
                { id: "alan", name: "Alan Turing", role: "Researcher" },
              ]}
              columns={[
                {
                  id: "name",
                  accessorKey: "name",
                  header: "Name",
                  cell: ({ row }) => (
                    <span className="flex items-center gap-2">
                      <Avatar name={row.original.name} size="sm" />
                      {row.original.name}
                    </span>
                  ),
                },
                { id: "role", accessorKey: "role", header: "Role" },
              ]}
            />
            <div className="w-full sm:max-w-xs">
              <Dropdown
                label="Assign to"
                options={["Ada Lovelace", "Grace Hopper", "Alan Turing"].map((name) => ({
                  value: name,
                  label: name,
                  content: (
                    <span className="flex items-center gap-2">
                      <Avatar name={name} size="xs" />
                      {name}
                    </span>
                  ),
                }))}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="Avatar" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Image and fallback content are driven by props; there is no separate internal form state. Control `src` / `name` from your data layer and let the component handle loading and error fallbacks."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Broken image URLs should show the initials or fallback slot—verify your `onError` handling in design reviews.",
          "Very long names truncate in initials; confirm max length with design tokens.",
          "Status badges and groups add extra DOM—test zoom and high-contrast themes.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `name` or meaningful `alt` / `aria-label` for standalone avatars.",
          "Use stable `src` URLs or cache-bust intentionally to avoid flicker.",
          "Reserve group overflow counts for supplementary information, not primary identity.",
        ]}
        donts={[
          "Do not use avatars as the only cue for critical account actions.",
          "Do not omit accessible names on icon-only or image-only avatars.",
          "Do not load huge unoptimized images without size constraints.",
        ]}
      />

      <CopyPasteBlock name="Avatar" />
    </div>
  );
};

export default AvatarDemo;
