import { useState } from "react";
import {
  CountryFlag,
  CountryFlagGroup,
  CountryFlagShimmer,
  CountryFlagGroupShimmer,
} from "../../components/CountryFlag";
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

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  // Flag styling
  flag: "rounded-[3px]",
  flagLg: "rounded",
  flagGroup: {
    root: "flex items-center -space-x-1.5",
    item: `rounded-[3px] ${dark ? "outline outline-[1.5px] outline-gray-900" : "outline outline-[1.5px] outline-white"}`,
    count: `shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none ${dark ? "bg-gray-700/90 text-gray-300 outline outline-[1.5px] outline-gray-900" : "bg-gray-100 text-gray-500 outline outline-[1.5px] outline-white"}`,
  },
  flagGroupDark: {
    root: "flex items-center -space-x-1.5",
    item: "rounded-[3px] outline outline-[1.5px] outline-gray-800",
    count:
      "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-gray-700 text-gray-300 outline outline-[1.5px] outline-gray-800",
  },
  fallback: `inline-flex items-center justify-center rounded-[3px] text-[10px] font-bold tracking-wide ${dark ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-400"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const CountryFlagDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [isLoading, setIsLoading] = useState(true);

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
            CountryFlag
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A lightweight component for rendering country flags from SVG files.
            Supports sizes, aspect ratios, tooltips, grouping with overflow,
            loading shimmer, error fallback, and fully customizable styling.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import {\n  CountryFlag, CountryFlagGroup,\n  CountryFlagShimmer, CountryFlagGroupShimmer,\n} from "@kern-ui/country-flag";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Render a flag by passing a two-letter ISO country code."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          {["us", "gb", "jp", "de", "fr", "in", "br", "ca"].map((code) => (
            <CountryFlag key={code} code={code} size={48} className={c.flag} />
          ))}
        </DemoWrapper>
      </Section>

      {/* ─── Sizes ──────────────────────────────────────────────────────── */}
      <Section
        title="Sizes"
        description="Presets: xs, sm, md, lg, xl, 2xl, or any custom pixel number."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
            <div key={s} className="text-center">
              <CountryFlag code="us" size={s} className={c.flag} />
              <p className={`text-xs mt-2 ${c.label}`}>{s}</p>
            </div>
          ))}
          <div className="text-center">
            <CountryFlag code="us" size={48} className={c.flag} />
            <p className={`text-xs mt-2 ${c.label}`}>48px</p>
          </div>
          <div className="text-center">
            <CountryFlag code="us" size={64} className={c.flag} />
            <p className={`text-xs mt-2 ${c.label}`}>64px</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Aspect Ratio ───────────────────────────────────────────────── */}
      <Section
        title="Aspect Ratio"
        description="Control height via aspectRatio (height/width). Default is 0.75 (4:3)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          {[0.5, 0.625, 0.75, 1].map((ratio) => (
            <div key={ratio} className="text-center">
              <CountryFlag
                code="jp"
                size={48}
                aspectRatio={ratio}
                className={c.flag}
              />
              <p className={`text-xs mt-2 ${c.label}`}>{ratio}</p>
            </div>
          ))}
        </DemoWrapper>
      </Section>

      {/* ─── Tooltip ────────────────────────────────────────────────────── */}
      <Section
        title="Tooltip"
        description="Add tooltips via string or config object."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CountryFlag
            code="us"
            size={48}
            tooltip="United States"
            className={c.flag}
          />
          <CountryFlag
            code="gb"
            size={48}
            tooltip="United Kingdom"
            className={c.flag}
          />
          <CountryFlag
            code="jp"
            size={48}
            tooltip={{ content: "Japan", side: "bottom" }}
            className={c.flag}
          />
          <CountryFlag
            code="de"
            size={48}
            tooltip={{ content: "Germany", showArrow: false }}
            className={c.flag}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Fallback ───────────────────────────────────────────────────── */}
      <Section
        title="Error Fallback"
        description="Custom fallback content when the flag image fails to load."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="text-center">
            <CountryFlag
              code="xx"
              size={48}
              className={c.flag}
              fallback={
                <span
                  className={c.fallback}
                  style={{ width: 48, height: 36, borderRadius: 3 }}
                >
                  ??
                </span>
              }
            />
            <p className={`text-xs mt-2 ${c.label}`}>invalid code</p>
          </div>
          <div className="text-center">
            <CountryFlag
              code=""
              size={48}
              className={c.flag}
              fallback={
                <span
                  className={c.fallback}
                  style={{ width: 48, height: 36, borderRadius: 3 }}
                >
                  --
                </span>
              }
            />
            <p className={`text-xs mt-2 ${c.label}`}>empty code</p>
          </div>
          <div className="text-center">
            <CountryFlag
              code="zz"
              size={48}
              className={c.flag}
              fallback={
                <span
                  className={c.fallback}
                  style={{ width: 48, height: 36, borderRadius: 3 }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </span>
              }
            />
            <p className={`text-xs mt-2 ${c.label}`}>icon fallback</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Loading / Shimmer ──────────────────────────────────────────── */}
      <Section
        title="Loading & Shimmer"
        description="Show a shimmer placeholder while data loads."
        isDarkMode={dark}
      >
        <div className="mb-3">
          <button className={c.btn} onClick={() => setIsLoading(!isLoading)}>
            {isLoading ? "Show Flags" : "Show Shimmer"}
          </button>
        </div>
        <DemoWrapper isDarkMode={dark}>
          {isLoading ? (
            <>
              <CountryFlagShimmer size={32} className="rounded-[3px]" />
              <CountryFlagShimmer size={48} className="rounded-[3px]" />
              <CountryFlagShimmer size={48} className="rounded-[3px]" />
            </>
          ) : (
            <>
              <CountryFlag code="us" size={32} className={c.flag} />
              <CountryFlag code="gb" size={48} className={c.flag} />
              <CountryFlag code="jp" size={48} className={c.flag} />
            </>
          )}
        </DemoWrapper>
        <div className="mt-4">
          <p className={`text-xs font-medium mb-2 ${c.label}`}>
            loading prop on CountryFlag
          </p>
          <DemoWrapper isDarkMode={dark}>
            <CountryFlag
              code="us"
              loading
              size={48}
              className="rounded-[3px]"
            />
            <CountryFlag
              code="gb"
              loading
              size={48}
              className="rounded-[3px]"
            />
          </DemoWrapper>
        </div>
      </Section>

      {/* ─── Group ──────────────────────────────────────────────────────── */}
      <Section
        title="Flag Group"
        description="Stack flags with automatic overflow counting, similar to AvatarGroup."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Default (all visible)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <CountryFlagGroup size={48} classes={c.flagGroup}>
                <CountryFlag code="us" className="rounded-[3px]" />
                <CountryFlag code="gb" className="rounded-[3px]" />
                <CountryFlag code="jp" className="rounded-[3px]" />
                <CountryFlag code="de" className="rounded-[3px]" />
              </CountryFlagGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              max=3 with surplus count
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <CountryFlagGroup size={48} max={3} classes={c.flagGroup}>
                <CountryFlag code="us" className="rounded-[3px]" />
                <CountryFlag code="gb" className="rounded-[3px]" />
                <CountryFlag code="jp" className="rounded-[3px]" />
                <CountryFlag code="de" className="rounded-[3px]" />
                <CountryFlag code="fr" className="rounded-[3px]" />
              </CountryFlagGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              showCountTooltip on surplus (hover +2)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <CountryFlagGroup
                size={48}
                max={2}
                showCountTooltip
                classes={c.flagGroup}
              >
                <CountryFlag
                  code="us"
                  alt="United States"
                  className="rounded-[3px]"
                />
                <CountryFlag
                  code="gb"
                  alt="United Kingdom"
                  className="rounded-[3px]"
                />
                <CountryFlag code="jp" alt="Japan" className="rounded-[3px]" />
                <CountryFlag
                  code="de"
                  alt="Germany"
                  className="rounded-[3px]"
                />
              </CountryFlagGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              On dark background
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <div className="p-4 rounded-lg bg-gray-800">
                <CountryFlagGroup size={48} classes={c.flagGroupDark}>
                  <CountryFlag code="us" className="rounded-[3px]" />
                  <CountryFlag code="gb" className="rounded-[3px]" />
                  <CountryFlag code="jp" className="rounded-[3px]" />
                  <CountryFlag code="de" className="rounded-[3px]" />
                </CountryFlagGroup>
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom surplus renderer
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <CountryFlagGroup
                size={48}
                max={2}
                classes={c.flagGroup}
                renderSurplus={(count) => (
                  <span
                    className={`ml-2 text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    and {count} more
                  </span>
                )}
              >
                <CountryFlag code="us" className="rounded-[3px]" />
                <CountryFlag code="gb" className="rounded-[3px]" />
                <CountryFlag code="jp" className="rounded-[3px]" />
                <CountryFlag code="de" className="rounded-[3px]" />
              </CountryFlagGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Large size group
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <CountryFlagGroup
                size={56}
                classes={{
                  ...c.flagGroup,
                  item: `rounded ${dark ? "outline outline-[1.5px] outline-gray-900" : "outline outline-[1.5px] outline-white"}`,
                  count: `${c.flagGroup.count} text-xs rounded`,
                }}
              >
                <CountryFlag code="us" className="rounded" />
                <CountryFlag code="gb" className="rounded" />
                <CountryFlag code="jp" className="rounded" />
              </CountryFlagGroup>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Group Shimmer ──────────────────────────────────────────────── */}
      <Section
        title="Group Shimmer"
        description="Loading placeholder for flag groups."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CountryFlagGroupShimmer
            count={4}
            size={48}
            showCount
            className="rounded-[3px]"
          />
        </DemoWrapper>
      </Section>

      {/* ─── Classes System ─────────────────────────────────────────────── */}
      <Section
        title="Classes System"
        description="Override internal elements with the classes prop. Slots: root, image, fallback."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CountryFlag
            code="us"
            size={48}
            classes={{
              root: "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-xl shadow-lg ring-2 ring-indigo-400",
            }}
          />
          <CountryFlag
            code="gb"
            size={48}
            classes={{
              root: "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full shadow-lg",
            }}
          />
          <CountryFlag
            code="jp"
            size={48}
            classes={{
              root: "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-none",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled=true to strip all default classes. Build from scratch."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CountryFlag
            code="us"
            size={48}
            unstyled
            classes={{
              root: "inline-block overflow-hidden rounded-2xl border-2 border-indigo-400 shadow-xl",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Reduce Motion ──────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description="Disable fade-in transition and shimmer pulse."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="text-center">
            <CountryFlag code="us" size={48} className={c.flag} />
            <p className={`text-xs mt-2 ${c.label}`}>default (auto)</p>
          </div>
          <div className="text-center">
            <CountryFlag
              code="gb"
              size={48}
              reduceMotion={true}
              className={c.flag}
            />
            <p className={`text-xs mt-2 ${c.label}`}>no transition</p>
          </div>
          <div className="text-center">
            <CountryFlagShimmer
              size={48}
              reduceMotion={true}
              className="rounded-[3px]"
            />
            <p className={`text-xs mt-2 ${c.label}`}>no pulse</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Base Path ───────────────────────────────────────────── */}
      <Section
        title="Custom Base Path"
        description="Load flags from a different directory or CDN."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <CountryFlag
            code="us"
            size={48}
            basePath="/assets/flags"
            className={c.flag}
            fallback={
              <span
                className={c.fallback}
                style={{ width: 48, height: 36, borderRadius: 3 }}
              >
                US
              </span>
            }
          />
        </DemoWrapper>
        <div className={c.note}>
          Default path is{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono ${dark ? "bg-white/6 text-gray-300" : "bg-gray-100 text-gray-600"}`}
          >
            /flags
          </code>
          . Override for CDN or custom paths.
        </div>
      </Section>

      {/* ─── Props Tables ───────────────────────────────────────────────── */}
      <Section title="CountryFlag Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="code"
              type="string"
              defaultVal="required"
              description="Two-letter ISO country code"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type="CountryFlagSize | number"
              defaultVal='"md"'
              description="Flag width (height from aspect ratio)"
              isDarkMode={dark}
            />
            <PropRow
              name="aspectRatio"
              type="number"
              defaultVal="0.75"
              description="Height / width ratio"
              isDarkMode={dark}
            />
            <PropRow
              name="alt"
              type="string"
              description='Alt text (defaults to "CODE flag")'
              isDarkMode={dark}
            />
            <PropRow
              name="fallback"
              type="ReactNode"
              description="Content when image fails"
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
              name="tooltip"
              type="ReactNode | TooltipConfig"
              description="Tooltip content or config"
              isDarkMode={dark}
            />
            <PropRow
              name="basePath"
              type="string"
              defaultVal='"/flags"'
              description="Base path for SVG files"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="CountryFlagClasses"
              description="Slot overrides: root, image, fallback"
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
              description="Disable fade-in animation"
              isDarkMode={dark}
            />
            <PropRow
              name="onLoad"
              type="(e) => void"
              description="Image load callback"
              isDarkMode={dark}
            />
            <PropRow
              name="onError"
              type="(e) => void"
              description="Image error callback"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="CountryFlagGroup Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              defaultVal="required"
              description="CountryFlag components"
              isDarkMode={dark}
            />
            <PropRow
              name="max"
              type="number"
              description="Max visible flags"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type="CountryFlagSize | number"
              defaultVal='"md"'
              description="Size for surplus badge"
              isDarkMode={dark}
            />
            <PropRow
              name="showCountTooltip"
              type="boolean"
              defaultVal="false"
              description="Auto tooltip from hidden flag names"
              isDarkMode={dark}
            />
            <PropRow
              name="surplusTooltipContent"
              type="ReactNode"
              description="Explicit surplus tooltip"
              isDarkMode={dark}
            />
            <PropRow
              name="renderSurplus"
              type="(count) => ReactNode"
              description="Custom surplus renderer"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="CountryFlagGroupClasses"
              description="Slot overrides: root, item, count"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-loading"
              type="root span"
              description="Present while image is loading"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="root span"
              description="Present when image failed"
              isDarkMode={dark}
            />
            <PropRow
              name="data-code"
              type="root span"
              description="Normalized country code"
              isDarkMode={dark}
            />
            <PropRow
              name="role"
              type="root span, group, shimmer"
              description='role="img" / "group" / "status"'
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
              'Flags use role="img" with auto-generated aria-label from code',
              'Inner <img> has alt="" and aria-hidden (decorative)',
              'Images default to loading="lazy" and decoding="async"',
              'Group uses role="group" with auto-generated aria-label',
              'Surplus count has aria-label: "N more flag(s) not shown"',
              'Shimmer uses role="status" with descriptive aria-label',
              "prefers-reduced-motion respected via reduceMotion prop",
              "Cached images skip fade-in via img.complete check",
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
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Flags are purely presentational from `code` (and optional image props). There is no internal country selection state—pair with a dropdown or form field when users pick a country."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Missing or invalid ISO codes should map to your `fallback` UI.",
          "Tooltip and group layouts can overlap on small viewports—test responsive breakpoints.",
          "CDN or sprite paths must be consistent across environments (basePath).",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `alt` text or `aria-label` when the flag conveys meaning.",
          "Use consistent sizes within a row for visual rhythm.",
          "Handle `onError` for broken flag assets in production monitoring.",
        ]}
        donts={[
          "Do not use flags alone to select phone country without an explicit control.",
          "Do not ship enormous raster assets for tiny sizes.",
          "Do not rely on color alone for state—pair with labels where needed.",
        ]}
      />
    </div>
  );
};

export default CountryFlagDemo;
