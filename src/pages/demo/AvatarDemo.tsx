import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  AvatarShimmer,
  AvatarGroupShimmer,
} from "../../components/Avatar";
import { useTheme } from "./ThemeContext";
import {
  DocsHero,
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Themed Classes ──────────────────────────────────────────────────────────

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
      "#2563eb",
      "#059669",
      "#ca8a04",
      "#db2777",
      "#7c3aed",
      "#0891b2",
      "#ef4444",
    ],
  },
  brandColors: {
    backgrounds: ["#1e40af", "#7c3aed", "#0e7490", "#b91c1c"],
    text: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
  btnPrimary:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-white hover:bg-cl-accent/90",
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
  fallbackBg: dark ? "bg-cl-bg-elevated" : "bg-cl-bg-hover",
  stateDisplay: `text-sm font-mono text-cl-text-secondary`,
  darkBg: `p-4 rounded-cl-md bg-cl-bg-elevated dark:bg-cl-bg`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const AvatarDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clickLog, setClickLog] = useState<string[]>([]);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Avatar"
        description="A flexible avatar component for displaying user images, initials, or fallback content. Supports status indicators, badges, tooltips, auto-generated colors, grouping, and fully customizable styling via the classes system."
        code={`import { Avatar, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@chumlab/ui/avatar";`}
      />

      {/* ─── Basic Usage ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Avatar with image, initials, and custom fallback."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {/* Basic usage — works out-of-the-box with built-in styles */}
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
            alt="John Doe"
            name="John Doe"
          />
          <Avatar name="Jane Smith" autoColor />
          <Avatar name="Alex" autoColor />
        </DemoWrapper>
      </Section>

      {/* ─── Sizes ──────────────────────────────────────────────────────── */}
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
            classes={{ initials: "font-bold" }}
          />
          <Avatar
            name="Light"
            autoColor
            colors={c.subtleColors}
            classes={{ initials: "font-light" }}
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
            textStyle={{ color: "#6366f1", fontWeight: 600 }}
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
              ].map(({ label, props }) => (
                <div key={label} className="text-center pt-2 pb-1">
                  <div className="relative inline-flex">
                    <Avatar name={label} autoColor colors={c.subtleColors} />
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
              {(["xs", "sm", "md", "lg"] as const).map((s) => (
                <div key={s} className="text-center pt-2 pb-1">
                  <div className="relative inline-flex">
                    <Avatar name={s} autoColor colors={c.subtleColors} />
                    <AvatarBadge count={3} size={s} />
                  </div>
                  <p className={`text-xs mt-3 ${c.label}`}>{s}</p>
                </div>
              ))}
            </DemoWrapper>
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
              <AvatarGroup max={3}>
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
              <AvatarGroup max={3} total={50}>
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
              <AvatarGroup max={2} showTooltip>
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
              Ring color on dark background (compare default vs matched)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Default (white ring)</p>
                  <div className={c.darkBg}>
                    <AvatarGroup>
                      <Avatar name="Alice Brown" autoColor colors={c.subtleColors} />
                      <Avatar name="Bob Chen" autoColor colors={c.subtleColors} />
                      <Avatar name="Charlie Davis" autoColor colors={c.subtleColors} />
                    </AvatarGroup>
                  </div>
                </div>
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Matched ring (#111827)</p>
                  <div className={c.darkBg}>
                    <AvatarGroup ringColor="#111827">
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
                max={2}
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
                <AvatarGroup variant={v} spacing={v === "stack" ? -8 : 4}>
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
                onClick={() => alert("View all clicked!")}
              />
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
              Ring color on dark background
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <div className="flex items-center gap-6">
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Default (white ring)</p>
                  <div className={c.darkBg}>
                    <AvatarGroupShimmer count={3} />
                  </div>
                </div>
                <div>
                  <p className={`text-[10px] mb-1.5 ${c.label}`}>Matched ring (#111827)</p>
                  <div className={c.darkBg}>
                    <AvatarGroupShimmer count={3} ringColor="#111827" />
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
          />
        </DemoWrapper>
      </Section>

      {/* ─── Classes System ─────────────────────────────────────────────── */}
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
                classes={{ initials: "font-bold tracking-wider" }}
              />
              <Avatar
                name="Italic"
                autoColor
                colors={c.subtleColors}
                classes={{ initials: "italic" }}
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
                  inner:
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
            onClick={() => alert("Avatar clicked!")}
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
            onClick={() => alert("Profile opened!")}
            className={`flex items-center gap-3 px-3 py-2 rounded-cl-md transition-colors focus:outline-none focus:ring-2 focus:ring-cl-accent hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated/50`}
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

      {/* ─── Props Tables ───────────────────────────────────────────────── */}
      <Section title="Avatar Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="name"
              type="string"
              description="User name for initials generation"
              isDarkMode={dark}
            />
            <PropRow
              name="src"
              type="string"
              description="Image URL"
              isDarkMode={dark}
            />
            <PropRow
              name="alt"
              type="string"
              description="Image alt text"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type='"xs"|"sm"|"md"|"lg"|"xl"|number'
              defaultVal='"md"'
              description="Size preset or pixel value"
              isDarkMode={dark}
            />
            <PropRow
              name="shape"
              type='"circle"|"rounded"|"square"'
              defaultVal='"circle"'
              description="Avatar shape"
              isDarkMode={dark}
            />
            <PropRow
              name="maxInitials"
              type="number"
              defaultVal="2"
              description="Max characters for initials"
              isDarkMode={dark}
            />
            <PropRow
              name="fallback"
              type="ReactNode"
              description="Custom fallback when no name/image"
              isDarkMode={dark}
            />
            <PropRow
              name="autoColor"
              type="boolean"
              defaultVal="false"
              description="Generate colors from name"
              isDarkMode={dark}
            />
            <PropRow
              name="colors"
              type="AvatarColors"
              description="Custom color palettes for autoColor"
              isDarkMode={dark}
            />
            <PropRow
              name="bordered"
              type="boolean | string"
              description="Add border (true or CSS string)"
              isDarkMode={dark}
            />
            <PropRow
              name="status"
              type="AvatarStatus | AvatarStatusConfig"
              description="Status indicator"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltip"
              type="ReactNode | AvatarTooltipConfig"
              description="Tooltip content or config"
              isDarkMode={dark}
            />
            <PropRow
              name="imageConfig"
              type="AvatarImageConfig"
              description="Image loading options (lazy, srcSet, priority, etc.)"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="AvatarClasses"
              description="Slot class overrides: root, inner, image, initials, fallback, status"
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
              name="textStyle"
              type="CSSProperties"
              description="Inline styles for initials text"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="boolean"
              defaultVal="false"
              description="Show shimmer placeholder"
              isDarkMode={dark}
            />
            <PropRow
              name="reduceMotion"
              type='boolean | "auto"'
              defaultVal='"auto"'
              description="Disable fade-in and shimmer pulse"
              isDarkMode={dark}
            />
            <PropRow
              name="onLoad"
              type="() => void"
              description="Image load success callback"
              isDarkMode={dark}
            />
            <PropRow
              name="onError"
              type="() => void"
              description="Image load error callback"
              isDarkMode={dark}
            />
            <PropRow
              name="asChild"
              type="boolean"
              defaultVal="false"
              description="Merge props onto child element"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="AvatarGroup Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="max"
              type="number"
              description="Maximum visible avatars"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type="AvatarSize"
              defaultVal='"md"'
              description="Size for all children"
              isDarkMode={dark}
            />
            <PropRow
              name="shape"
              type="AvatarShape"
              defaultVal='"circle"'
              description="Shape for all children"
              isDarkMode={dark}
            />
            <PropRow
              name="bordered"
              type="boolean | string"
              description="Border for all children"
              isDarkMode={dark}
            />
            <PropRow
              name="spacing"
              type="number"
              defaultVal="-8"
              description="Overlap spacing in px (negative = overlap)"
              isDarkMode={dark}
            />
            <PropRow
              name="ringColor"
              type="string"
              defaultVal='"white"'
              description="Ring color between stacked avatars"
              isDarkMode={dark}
            />
            <PropRow
              name="variant"
              type='"stack"|"grid"|"inline"'
              defaultVal='"stack"'
              description="Layout variant"
              isDarkMode={dark}
            />
            <PropRow
              name="total"
              type="number"
              description="Override total count for surplus calculation"
              isDarkMode={dark}
            />
            <PropRow
              name="showTooltip"
              type="boolean"
              defaultVal="false"
              description="Show hidden names in surplus tooltip"
              isDarkMode={dark}
            />
            <PropRow
              name="reverseOrder"
              type="boolean"
              defaultVal="false"
              description="Reverse child order"
              isDarkMode={dark}
            />
            <PropRow
              name="renderSurplus"
              type="(count) => ReactNode"
              description="Custom surplus renderer"
              isDarkMode={dark}
            />
            <PropRow
              name="onAvatarClick"
              type="(info, event) => void"
              description="Click handler: {index, name}"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="AvatarGroupClasses"
              description="Slot class overrides: root, item"
              isDarkMode={dark}
            />
            <PropRow
              name="dir"
              type='"ltr"|"rtl"'
              defaultVal='"ltr"'
              description="Text direction"
              isDarkMode={dark}
            />
            <PropRow
              name="asChild"
              type="boolean"
              defaultVal="false"
              description="Merge props onto child"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="AvatarGroupCount Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="count"
              type="number"
              description="Surplus count to display"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type="AvatarSize"
              defaultVal='"md"'
              description="Size matching group avatars"
              isDarkMode={dark}
            />
            <PropRow
              name="shape"
              type="AvatarShape"
              defaultVal='"circle"'
              description="Shape matching group avatars"
              isDarkMode={dark}
            />
            <PropRow
              name="max"
              type="number"
              description='Max before showing "+"'
              isDarkMode={dark}
            />
            <PropRow
              name="showPlus"
              type="boolean"
              defaultVal="true"
              description='Prefix with "+"'
              isDarkMode={dark}
            />
            <PropRow
              name="format"
              type="(count) => string"
              description="Custom display format function"
              isDarkMode={dark}
            />
            <PropRow
              name="variant"
              type='"solid"|"outline"|"ghost"'
              defaultVal='"solid"'
              description="Visual variant"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltip"
              type="ReactNode | AvatarTooltipConfig"
              description="Tooltip on hover"
              isDarkMode={dark}
            />
            <PropRow
              name="bordered"
              type="boolean | string"
              description="Border style"
              isDarkMode={dark}
            />
            <PropRow
              name="onClick"
              type="() => void"
              description="Click handler"
              isDarkMode={dark}
            />
            <PropRow
              name="asChild"
              type="boolean"
              defaultVal="false"
              description="Merge props onto child"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="AvatarBadge Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="count"
              type="number"
              description="Notification count"
              isDarkMode={dark}
            />
            <PropRow
              name="max"
              type="number"
              defaultVal="99"
              description='Max before showing "+"'
              isDarkMode={dark}
            />
            <PropRow
              name="dot"
              type="boolean"
              defaultVal="false"
              description="Show dot instead of count"
              isDarkMode={dark}
            />
            <PropRow
              name="showZero"
              type="boolean"
              defaultVal="false"
              description="Show badge when count is 0"
              isDarkMode={dark}
            />
            <PropRow
              name="position"
              type="CornerPosition"
              defaultVal='"top-right"'
              description="Badge position corner"
              isDarkMode={dark}
            />
            <PropRow
              name="variant"
              type='"solid"|"outline"|"soft"'
              defaultVal='"solid"'
              description="Visual variant"
              isDarkMode={dark}
            />
            <PropRow
              name="color"
              type="string"
              description="Custom badge color"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type='"xs"|"sm"|"md"|"lg"'
              defaultVal='"md"'
              description="Badge size"
              isDarkMode={dark}
            />
            <PropRow
              name="pulse"
              type="boolean"
              defaultVal="false"
              description="Pulse animation"
              isDarkMode={dark}
            />
            <PropRow
              name="invisible"
              type="boolean"
              defaultVal="false"
              description="Render but visually hide"
              isDarkMode={dark}
            />
            <PropRow
              name="overlap"
              type='"circular"|"rectangular"'
              defaultVal='"circular"'
              description="Overlap positioning mode"
              isDarkMode={dark}
            />
            <PropRow
              name="offset"
              type="BadgeOffset"
              description="Fine-tune position with {x, y} px"
              isDarkMode={dark}
            />
            <PropRow
              name="asChild"
              type="boolean"
              defaultVal="false"
              description="Merge props onto child"
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
              name="data-has-image"
              type="Avatar root"
              description="Present when rendering an image (not initials/fallback)"
              isDarkMode={dark}
            />
            <PropRow
              name="data-shape"
              type="Avatar root"
              description='"circle"|"rounded"|"square"'
              isDarkMode={dark}
            />
            <PropRow
              name="data-state"
              type="AvatarBadge (via content)"
              description="Can be used for custom state styling"
              isDarkMode={dark}
            />
            <PropRow
              name="role"
              type="Avatar root"
              description='role="img" when showing initials/fallback (not image)'
              isDarkMode={dark}
            />
            <PropRow
              name="role"
              type="AvatarGroup"
              description='role="group" with auto-generated aria-label'
              isDarkMode={dark}
            />
            <PropRow
              name="role"
              type="AvatarBadge, Shimmer"
              description='role="status" for live region semantics'
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
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              'Avatar uses role="img" with aria-label when showing initials or fallback',
              "Image avatars use native <img> with alt text (empty alt for decorative)",
              "Status indicators have aria-label describing the status type",
              'AvatarBadge uses role="status" with aria-live="polite" for screen reader announcements',
              'Badge auto-generates aria-label: "N notification(s)" or "New notification" for dots',
              'AvatarGroup uses role="group" with auto-generated aria-label including member count',
              'AvatarGroupCount provides aria-label: "N more member(s) not shown"',
              'Images default to loading="lazy" and decoding="async" for performance',
              "prefers-reduced-motion disables image fade-in and shimmer pulse (via reduceMotion prop)",
              'Shimmer components use role="status" with descriptive aria-label',
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 text-cl-success`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
      </Section>

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
    </div>
  );
};

export default AvatarDemo;
