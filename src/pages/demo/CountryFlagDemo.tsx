import type { CountryFlagGroupClasses } from "../../components/CountryFlag/index.js";
import {
  useState } from "react";
import {
  CountryFlag,
  CountryFlagGroup,
  CountryFlagShimmer,
  CountryFlagGroupShimmer,
  } from "../../components/CountryFlag/index.js";
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
import { useTheme } from "./ThemeContext.js";

const getClasses = (_dark: boolean) => ({
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
  flag: "rounded-[3px]",
  flagLg: "rounded",
  flagGroup: {
    root: "flex items-center -space-x-1.5",
    item: `rounded-[3px] outline outline-[1.5px] outline-white dark:outline dark:outline-[1.5px] dark:outline-bg-base`,
    count: `shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-hover text-cl-text-secondary outline outline-[1.5px] outline-white dark:bg-cl-bg-elevated/90 dark:text-cl-text-secondary dark:outline dark:outline-[1.5px] dark:outline-bg-base`,
  } satisfies CountryFlagGroupClasses,
  flagGroupDark: {
    root: "flex items-center -space-x-1.5",
    item: "rounded-[3px] outline outline-[1.5px] outline-gray-800",
    count:
      "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-elevated text-cl-text-secondary outline outline-[1.5px] outline-gray-800",
  } satisfies CountryFlagGroupClasses,
  fallback: `inline-flex items-center justify-center rounded-[3px] text-[10px] font-bold tracking-wide bg-cl-bg-hover text-cl-text-tertiary dark:bg-cl-bg-elevated dark:text-cl-text-tertiary`,
});

const CountryFlagDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Country Flag"
        description="A lightweight component for rendering country flags from SVG files. Supports sizes, aspect ratios, tooltips, grouping with overflow, loading shimmer, error fallback, and fully customizable styling."
        code={`import { CountryFlag, CountryFlagGroup } from "@chumlab/ui/country-flag";`}
      />

      <SetupNote />

      <CopyPasteBlock name="CountryFlag" />

      <Section
        title="Basic Usage"
        description="Render a flag by passing a two-letter ISO country code."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {}
          {["us", "gb", "jp", "de", "fr", "in", "br", "ca"].map((code) => (
            <CountryFlag key={code} code={code} size={48} />
          ))}
        </DemoWrapper>
      </Section>

      <Section
        title="Sizes"
        description="Presets: xs, sm, md, lg, xl, 2xl, or any custom pixel number."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
          <DemoWrapper isDarkMode={dark} layout="inline">
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
              <div className="p-4 rounded-cl-md bg-cl-bg-elevated">
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
                    className={`ml-2 text-xs font-medium text-cl-text-secondary`}
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
                  item: `rounded outline outline-[1.5px] outline-white dark:outline dark:outline-[1.5px] dark:outline-bg-base`,
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
        <DemoWrapper isDarkMode={dark} layout="inline">
          <CountryFlagGroupShimmer
            count={4}
            size={48}
            showCount
            className="rounded-[3px]"
          />
        </DemoWrapper>
      </Section>

      <Section
        title="Classes System"
        description="Override internal elements with the classes prop. Slots: root, image, fallback."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <CountryFlag
            code="us"
            size={48}
            classes={{
              root: "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-cl-lg shadow-lg ring-2 ring-cl-accent",
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

      {/* ─── Reduce Motion ──────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description="Disable fade-in transition and shimmer pulse."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
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
            className={`px-1 py-0.5 rounded text-[11px] font-mono bg-cl-bg-elevated text-cl-text-secondary`}
          >
            /flags
          </code>
          . Override for CDN or custom paths.
        </div>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="CountryFlag" />

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
