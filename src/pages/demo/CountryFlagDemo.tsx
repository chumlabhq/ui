import { useState } from "react";
import {
  CountryFlag,
  CountryFlagGroup,
  CountryFlagGroupCount,
  CountryFlagShimmer,
  CountryFlagGroupShimmer,
} from "../../components/CountryFlag";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";

interface PropRowProps {
  name: string;
  type: string;
  defaultVal: string;
  description: string;
  isDarkMode: boolean;
}

const PropRow: React.FC<PropRowProps> = ({
  name,
  type,
  defaultVal,
  description,
  isDarkMode,
}) => (
  <tr>
    <td className="py-3 pr-4 font-mono text-blue-500">{name}</td>
    <td
      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
    >
      {type}
    </td>
    <td
      className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
    >
      {defaultVal}
    </td>
    <td
      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
    >
      {description}
    </td>
  </tr>
);

interface PropsTableProps {
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const PropsTable: React.FC<PropsTableProps> = ({
  title,
  children,
  isDarkMode,
}) => (
  <div>
    <h3
      className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
    >
      {title}
    </h3>
    <div className="overflow-x-auto">
      <table
        className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
      >
        <thead>
          <tr
            className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <th className="text-left py-3 pr-4 font-semibold">Prop</th>
            <th className="text-left py-3 pr-4 font-semibold">Type</th>
            <th className="text-left py-3 pr-4 font-semibold">Default</th>
            <th className="text-left py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
        >
          {children}
        </tbody>
      </table>
    </div>
  </div>
);

const CountryFlagDemo = () => {
  const { isDarkMode } = useTheme();
  const [errorFlag, setErrorFlag] = useState(false);

  return (
    <div className="space-y-16">
      <header>
        <h1
          className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          CountryFlag
        </h1>
        <p
          className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Display country flags with various sizes, tooltips, and grouping
          options. Uses ISO 3166-1 alpha-2 country codes with CDN-backed flag
          images.
        </p>

        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import {
  CountryFlag,
  CountryFlagGroup,
  CountryFlagGroupCount,
} from "@kern-ui/country-flag";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Examples
        </h2>

        <Section
          title="Preset Sizes"
          description="Available size presets: xs, sm, md, lg, xl, 2xl."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <CountryFlag code="us" size="xs" className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xs (12px)
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="us" size="sm" className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  sm (16px)
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="us" size="md" className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  md (20px)
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="us" size="lg" className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  lg (24px)
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="us" size="xl" className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xl (32px)
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="us" size="2xl" className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  2xl (40px)
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Pixel Sizes"
          description="Pass a number for pixel-precise sizing."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <CountryFlag code="gb" size={14} className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  14px
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="gb" size={28} className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  28px
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="gb" size={48} className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  48px
                </p>
              </div>
              <div className="text-center">
                <CountryFlag code="gb" size={64} className="rounded-sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  64px
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Various Countries"
          description="Use ISO 3166-1 alpha-2 codes to render any country flag."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-3">
              {[
                { code: "us", name: "United States" },
                { code: "gb", name: "United Kingdom" },
                { code: "ca", name: "Canada" },
                { code: "au", name: "Australia" },
                { code: "de", name: "Germany" },
                { code: "fr", name: "France" },
                { code: "jp", name: "Japan" },
                { code: "in", name: "India" },
                { code: "br", name: "Brazil" },
                { code: "mx", name: "Mexico" },
                { code: "kr", name: "South Korea" },
                { code: "it", name: "Italy" },
                { code: "es", name: "Spain" },
                { code: "se", name: "Sweden" },
                { code: "ch", name: "Switzerland" },
                { code: "nl", name: "Netherlands" },
              ].map(({ code, name }) => (
                <div key={code} className="text-center">
                  <CountryFlag
                    code={code}
                    size="lg"
                    className="rounded-sm"
                    tooltip={name}
                  />
                  <p
                    className={`text-xs mt-1.5 font-mono ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {code.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Styling"
          description="Apply custom classes for shadows, rings, opacity, and filters."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <CountryFlag
                  code="us"
                  size="xl"
                  className="rounded-sm shadow-md"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  shadow
                </p>
              </div>
              <div className="text-center">
                <CountryFlag
                  code="gb"
                  size="xl"
                  className="rounded-sm ring-2 ring-blue-500"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  ring
                </p>
              </div>
              <div className="text-center">
                <CountryFlag
                  code="ca"
                  size="xl"
                  className="rounded-sm opacity-50"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  opacity
                </p>
              </div>
              <div className="text-center">
                <CountryFlag
                  code="au"
                  size="xl"
                  className="rounded-sm grayscale"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  grayscale
                </p>
              </div>
              <div className="text-center">
                <CountryFlag
                  code="de"
                  size="xl"
                  className="rounded-full"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  rounded-full
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Tooltips"
          description="Use the tooltip prop with a string for simple tooltips, or an object for full control."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Simple string tooltips
                </p>
                <div className="flex items-center gap-4">
                  <CountryFlag
                    code="us"
                    size="lg"
                    className="rounded-sm"
                    tooltip="United States"
                  />
                  <CountryFlag
                    code="gb"
                    size="lg"
                    className="rounded-sm"
                    tooltip="United Kingdom"
                  />
                  <CountryFlag
                    code="ca"
                    size="lg"
                    className="rounded-sm"
                    tooltip="Canada"
                  />
                  <CountryFlag
                    code="jp"
                    size="lg"
                    className="rounded-sm"
                    tooltip="Japan"
                  />
                </div>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Tooltip with config object
                </p>
                <div className="flex items-center gap-4">
                  <CountryFlag
                    code="au"
                    size="lg"
                    className="rounded-sm"
                    tooltip={{
                      content: "Australia",
                      side: "bottom",
                    }}
                  />
                  <CountryFlag
                    code="de"
                    size="lg"
                    className="rounded-sm"
                    tooltip={{
                      content: "Germany",
                      side: "right",
                    }}
                  />
                  <CountryFlag
                    code="fr"
                    size="lg"
                    className="rounded-sm"
                    tooltip={{
                      content: "France",
                      showArrow: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Error State & Fallback"
          description="Handle loading errors with custom fallback content."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <CountryFlag
                  code="xx"
                  size="xl"
                  className={`rounded-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
                  fallback={
                    <svg
                      className={`w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
                      />
                    </svg>
                  }
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  with fallback
                </p>
              </div>
              <div className="text-center">
                <CountryFlag
                  code="zz"
                  size="xl"
                  className={`rounded-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  no fallback
                </p>
              </div>
              <div className="text-center">
                <CountryFlag
                  code="us"
                  size="xl"
                  className="rounded-sm"
                  onError={() => setErrorFlag(true)}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  onError callback
                </p>
                {errorFlag && (
                  <p className="text-xs text-red-500 mt-1">Error fired</p>
                )}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Flag Group"
          description="Group multiple flags together with overlapping layout."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  3 flags, md size
                </p>
                <CountryFlagGroup
                  itemClassName={`rounded-sm ring-1 ${isDarkMode ? "ring-gray-800" : "ring-white"}`}
                >
                  <CountryFlag code="us" size="md" />
                  <CountryFlag code="gb" size="md" />
                  <CountryFlag code="ca" size="md" />
                </CountryFlagGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  4 flags, lg size
                </p>
                <CountryFlagGroup
                  itemClassName={`rounded-sm ring-1 ${isDarkMode ? "ring-gray-800" : "ring-white"}`}
                >
                  <CountryFlag code="de" size="lg" />
                  <CountryFlag code="fr" size="lg" />
                  <CountryFlag code="it" size="lg" />
                  <CountryFlag code="es" size="lg" />
                </CountryFlagGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  5 flags, xl size
                </p>
                <CountryFlagGroup
                  itemClassName={`rounded-sm ring-1 ${isDarkMode ? "ring-gray-800" : "ring-white"}`}
                >
                  <CountryFlag code="jp" size="xl" />
                  <CountryFlag code="kr" size="xl" />
                  <CountryFlag code="cn" size="xl" />
                  <CountryFlag code="in" size="xl" />
                  <CountryFlag code="sg" size="xl" />
                </CountryFlagGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Flag Group with Max Limit"
          description="Use the max prop to limit visible flags and show a count badge for the rest."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  7 flags, max=3
                </p>
                <CountryFlagGroup
                  max={3}
                  size="lg"
                  itemClassName={`rounded-sm ring-1 ${isDarkMode ? "ring-gray-800" : "ring-white"}`}
                  countClassName={`rounded-sm text-xs font-medium ring-1 ${isDarkMode ? "bg-gray-700 text-gray-300 ring-gray-800" : "bg-gray-100 text-gray-500 ring-white"}`}
                >
                  <CountryFlag code="us" size="lg" />
                  <CountryFlag code="gb" size="lg" />
                  <CountryFlag code="ca" size="lg" />
                  <CountryFlag code="au" size="lg" />
                  <CountryFlag code="de" size="lg" />
                  <CountryFlag code="fr" size="lg" />
                  <CountryFlag code="jp" size="lg" />
                </CountryFlagGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  10 flags, max=5
                </p>
                <CountryFlagGroup
                  max={5}
                  size="xl"
                  itemClassName={`rounded-sm ring-1 ${isDarkMode ? "ring-gray-800" : "ring-white"}`}
                  countClassName={`rounded-sm text-xs font-medium ring-1 ${isDarkMode ? "bg-gray-700 text-gray-300 ring-gray-800" : "bg-gray-100 text-gray-500 ring-white"}`}
                >
                  <CountryFlag code="us" size="xl" />
                  <CountryFlag code="gb" size="xl" />
                  <CountryFlag code="ca" size="xl" />
                  <CountryFlag code="au" size="xl" />
                  <CountryFlag code="de" size="xl" />
                  <CountryFlag code="fr" size="xl" />
                  <CountryFlag code="jp" size="xl" />
                  <CountryFlag code="in" size="xl" />
                  <CountryFlag code="br" size="xl" />
                  <CountryFlag code="mx" size="xl" />
                </CountryFlagGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Flag Group with Count Tooltip"
          description="Hover the count badge to see the remaining country names."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Hover +4 to see remaining
                </p>
                <CountryFlagGroup
                  max={3}
                  size="lg"
                  showCountTooltip
                  itemClassName={`rounded-sm ring-1 ${isDarkMode ? "ring-gray-800" : "ring-white"}`}
                  countClassName={`rounded-sm text-xs font-medium ring-1 ${isDarkMode ? "bg-gray-700 text-gray-300 ring-gray-800" : "bg-gray-100 text-gray-500 ring-white"}`}
                >
                  <CountryFlag code="us" size="lg" alt="United States" />
                  <CountryFlag code="gb" size="lg" alt="United Kingdom" />
                  <CountryFlag code="ca" size="lg" alt="Canada" />
                  <CountryFlag code="au" size="lg" alt="Australia" />
                  <CountryFlag code="de" size="lg" alt="Germany" />
                  <CountryFlag code="fr" size="lg" alt="France" />
                  <CountryFlag code="jp" size="lg" alt="Japan" />
                </CountryFlagGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Count tooltip on right side
                </p>
                <CountryFlagGroup
                  max={2}
                  size="xl"
                  showCountTooltip
                  countTooltip={{ side: "right" }}
                  itemClassName={`rounded-sm ring-1 ${isDarkMode ? "ring-gray-800" : "ring-white"}`}
                  countClassName={`rounded-sm text-xs font-medium ring-1 ${isDarkMode ? "bg-gray-700 text-gray-300 ring-gray-800" : "bg-gray-100 text-gray-500 ring-white"}`}
                >
                  <CountryFlag code="br" size="xl" alt="Brazil" />
                  <CountryFlag code="mx" size="xl" alt="Mexico" />
                  <CountryFlag code="ar" size="xl" alt="Argentina" />
                  <CountryFlag code="cl" size="xl" alt="Chile" />
                  <CountryFlag code="co" size="xl" alt="Colombia" />
                </CountryFlagGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Standalone Count Badge"
          description="Use CountryFlagGroupCount independently."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <CountryFlagGroupCount
                  count={5}
                  size={20}
                  className={`rounded-sm text-xs font-medium ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  +5
                </p>
              </div>
              <div className="text-center">
                <CountryFlagGroupCount
                  count={10}
                  size={24}
                  className={`rounded-sm text-xs font-medium ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  +10
                </p>
              </div>
              <div className="text-center">
                <CountryFlagGroupCount
                  count={99}
                  size={32}
                  className={`rounded-sm text-sm font-medium ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}
                  tooltip="99 more countries"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  +99 (with tooltip)
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>
        <Section
          title="Shimmer / Loading Placeholders"
          description="Use the loading prop on CountryFlag for built-in shimmer, or CountryFlagShimmer / CountryFlagGroupShimmer as standalone skeletons."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Built-in loading prop (recommended)
                </p>
                <div className="flex items-end gap-4">
                  <div className="text-center">
                    <CountryFlag code="us" size="sm" loading className="rounded-sm" />
                    <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>sm</p>
                  </div>
                  <div className="text-center">
                    <CountryFlag code="gb" size="md" loading className="rounded-sm" />
                    <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>md</p>
                  </div>
                  <div className="text-center">
                    <CountryFlag code="de" size="lg" loading className="rounded-sm" />
                    <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>lg</p>
                  </div>
                  <div className="text-center">
                    <CountryFlag code="fr" size="xl" loading className="rounded-sm" />
                    <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>xl</p>
                  </div>
                </div>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Loading inside a group
                </p>
                <CountryFlagGroup size="lg" itemClassName="rounded-sm ring-1 ring-white dark:ring-gray-800">
                  <CountryFlag code="us" size="lg" loading />
                  <CountryFlag code="gb" size="lg" loading />
                  <CountryFlag code="de" size="lg" />
                  <CountryFlag code="fr" size="lg" />
                </CountryFlagGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Standalone shimmers at different sizes
                </p>
                <div className="flex items-end gap-4">
                  <div className="text-center">
                    <CountryFlagShimmer size="xs" className="rounded-sm" />
                    <p
                      className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      xs
                    </p>
                  </div>
                  <div className="text-center">
                    <CountryFlagShimmer size="sm" className="rounded-sm" />
                    <p
                      className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      sm
                    </p>
                  </div>
                  <div className="text-center">
                    <CountryFlagShimmer size="md" className="rounded-sm" />
                    <p
                      className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      md
                    </p>
                  </div>
                  <div className="text-center">
                    <CountryFlagShimmer size="lg" className="rounded-sm" />
                    <p
                      className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      lg
                    </p>
                  </div>
                  <div className="text-center">
                    <CountryFlagShimmer size="xl" className="rounded-sm" />
                    <p
                      className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      xl
                    </p>
                  </div>
                  <div className="text-center">
                    <CountryFlagShimmer size="2xl" className="rounded-sm" />
                    <p
                      className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      2xl
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Static (no animation)
                </p>
                <div className="flex items-center gap-4">
                  <CountryFlagShimmer size="lg" animate={false} className="rounded-sm" />
                  <CountryFlagShimmer size="lg" animate={false} className="rounded-full" />
                </div>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Group shimmer (3 items, lg)
                </p>
                <CountryFlagGroupShimmer
                  count={3}
                  size="lg"
                  className={`[&>span]:rounded-sm [&>span]:ring-1 ${isDarkMode ? "[&>span]:ring-gray-800" : "[&>span]:ring-white"}`}
                />
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Group shimmer with count placeholder (5 items, xl)
                </p>
                <CountryFlagGroupShimmer
                  count={5}
                  size="xl"
                  showCount
                  className={`[&>span]:rounded-sm [&>span]:ring-1 ${isDarkMode ? "[&>span]:ring-gray-800" : "[&>span]:ring-white"}`}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          API Reference
        </h2>

        <PropsTable title="CountryFlag" isDarkMode={isDarkMode}>
          <PropRow
            name="code"
            type="string"
            defaultVal="-"
            description="ISO 3166-1 alpha-2 country code (required)"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="size"
            type={'"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number'}
            defaultVal='"md"'
            description="Flag size preset or pixel value"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="alt"
            type="string"
            defaultVal="auto"
            description='Accessible label (defaults to "CODE flag")'
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="fallback"
            type="ReactNode"
            defaultVal="-"
            description="Content to render when flag fails to load"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="loading"
            type="boolean"
            defaultVal="false"
            description="Show a shimmer placeholder instead of the flag"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="tooltip"
            type="ReactNode | CountryFlagTooltipConfig"
            defaultVal="-"
            description="Tooltip content or config object"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="basePath"
            type="string"
            defaultVal='"/flags"'
            description="Base path for flag images"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="onLoad"
            type="() => void"
            defaultVal="-"
            description="Callback when flag image loads"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="onError"
            type="() => void"
            defaultVal="-"
            description="Callback when flag image fails to load"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="className"
            type="string"
            defaultVal="-"
            description="CSS class for the flag wrapper"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="style"
            type="CSSProperties"
            defaultVal="-"
            description="Inline styles for the flag wrapper"
            isDarkMode={isDarkMode}
          />
        </PropsTable>

        <PropsTable title="CountryFlagTooltipConfig" isDarkMode={isDarkMode}>
          <PropRow
            name="content"
            type="ReactNode"
            defaultVal="-"
            description="Tooltip content (required)"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="side"
            type={'"top" | "right" | "bottom" | "left"'}
            defaultVal='"top"'
            description="Tooltip placement side"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="align"
            type={'"start" | "center" | "end"'}
            defaultVal='"center"'
            description="Tooltip alignment"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="sideOffset"
            type="number"
            defaultVal="6"
            description="Distance from trigger in pixels"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="delayDuration"
            type="number"
            defaultVal="200"
            description="Delay before showing tooltip (ms)"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="className"
            type="string"
            defaultVal="-"
            description="CSS class for tooltip content"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="showArrow"
            type="boolean"
            defaultVal="true"
            description="Show tooltip arrow"
            isDarkMode={isDarkMode}
          />
        </PropsTable>

        <PropsTable title="CountryFlagGroup" isDarkMode={isDarkMode}>
          <PropRow
            name="children"
            type="ReactNode"
            defaultVal="-"
            description="CountryFlag components"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="max"
            type="number"
            defaultVal="-"
            description="Maximum flags to show before count badge"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="showCountTooltip"
            type="boolean"
            defaultVal="false"
            description="Show tooltip on count badge with remaining country names"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="countTooltip"
            type="Omit<CountryFlagTooltipConfig, 'content'>"
            defaultVal="-"
            description="Config for the count badge tooltip (side, align, etc.)"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="itemClassName"
            type="string"
            defaultVal="-"
            description="CSS class applied to each flag in the group"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="countClassName"
            type="string"
            defaultVal="-"
            description="CSS class for the count badge"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="className"
            type="string"
            defaultVal="-"
            description="CSS class for the group wrapper"
            isDarkMode={isDarkMode}
          />
        </PropsTable>

        <PropsTable title="CountryFlagGroupCount" isDarkMode={isDarkMode}>
          <PropRow
            name="count"
            type="number"
            defaultVal="-"
            description="Number to display (required)"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="size"
            type="number"
            defaultVal="20"
            description="Width in pixels"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="tooltip"
            type="ReactNode | CountryFlagTooltipConfig"
            defaultVal="-"
            description="Tooltip content or config object"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="className"
            type="string"
            defaultVal="-"
            description="CSS class for the count element"
            isDarkMode={isDarkMode}
          />
        </PropsTable>

        <PropsTable title="CountryFlagShimmer" isDarkMode={isDarkMode}>
          <PropRow
            name="size"
            type={'"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number'}
            defaultVal='"md"'
            description="Shimmer width (height derived from aspect ratio)"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="aspectRatio"
            type="number"
            defaultVal="0.75"
            description="Height / width ratio"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="animate"
            type="boolean"
            defaultVal="true"
            description="Enable pulse animation"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="className"
            type="string"
            defaultVal="-"
            description="CSS class for the shimmer element"
            isDarkMode={isDarkMode}
          />
        </PropsTable>

        <PropsTable title="CountryFlagGroupShimmer" isDarkMode={isDarkMode}>
          <PropRow
            name="count"
            type="number"
            defaultVal="3"
            description="Number of shimmer items to render"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="size"
            type={'"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number'}
            defaultVal='"md"'
            description="Size of each shimmer item"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="aspectRatio"
            type="number"
            defaultVal="0.75"
            description="Height / width ratio for each item"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="animate"
            type="boolean"
            defaultVal="true"
            description="Enable pulse animation"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="showCount"
            type="boolean"
            defaultVal="false"
            description="Show an extra placeholder for the count badge"
            isDarkMode={isDarkMode}
          />
          <PropRow
            name="className"
            type="string"
            defaultVal="-"
            description="CSS class for the group wrapper"
            isDarkMode={isDarkMode}
          />
        </PropsTable>
      </div>
    </div>
  );
};

export default CountryFlagDemo;
