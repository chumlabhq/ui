import { CountryFlag, CountryFlagGroup, CountryFlagGroupCount } from "../../components/CountryFlag";
import { Section, ComponentHeader } from "./components";

const flagStyle = "rounded-sm";
const flagItemStyle = "rounded-sm ring-1 ring-white";
const flagCountStyle = "rounded-sm bg-gray-100 text-gray-500 text-xs font-medium ring-1 ring-white";

const CountryFlagDemo = () => {
  return (
    <>
      <ComponentHeader
        title="CountryFlag"
        description="Display country flags with various sizes and grouping options."
      />

      <Section title="Preset Sizes">
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="us" size="xs" className={flagStyle} />
            <span className="text-xs text-gray-500">xs</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="us" size="sm" className={flagStyle} />
            <span className="text-xs text-gray-500">sm</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="us" size="md" className={flagStyle} />
            <span className="text-xs text-gray-500">md</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="us" size="lg" className={flagStyle} />
            <span className="text-xs text-gray-500">lg</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="us" size="xl" className={flagStyle} />
            <span className="text-xs text-gray-500">xl</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="us" size="2xl" className={flagStyle} />
            <span className="text-xs text-gray-500">2xl</span>
          </div>
        </div>
      </Section>

      <Section title="Custom Pixel Sizes">
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="gb" size={14} className={flagStyle} />
            <span className="text-xs text-gray-500">14px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="gb" size={28} className={flagStyle} />
            <span className="text-xs text-gray-500">28px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="gb" size={48} className={flagStyle} />
            <span className="text-xs text-gray-500">48px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CountryFlag code="gb" size={64} className={flagStyle} />
            <span className="text-xs text-gray-500">64px</span>
          </div>
        </div>
      </Section>

      <Section title="Various Countries">
        <div className="flex flex-wrap gap-3">
          <CountryFlag code="us" size="lg" className={flagStyle} />
          <CountryFlag code="gb" size="lg" className={flagStyle} />
          <CountryFlag code="ca" size="lg" className={flagStyle} />
          <CountryFlag code="au" size="lg" className={flagStyle} />
          <CountryFlag code="de" size="lg" className={flagStyle} />
          <CountryFlag code="fr" size="lg" className={flagStyle} />
          <CountryFlag code="jp" size="lg" className={flagStyle} />
          <CountryFlag code="in" size="lg" className={flagStyle} />
          <CountryFlag code="br" size="lg" className={flagStyle} />
          <CountryFlag code="mx" size="lg" className={flagStyle} />
        </div>
      </Section>

      <Section title="Flag Group">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <CountryFlagGroup itemClassName={flagItemStyle}>
              <CountryFlag code="us" size="md" />
              <CountryFlag code="gb" size="md" />
              <CountryFlag code="ca" size="md" />
            </CountryFlagGroup>
            <span className="text-sm text-gray-600">3 flags</span>
          </div>
          <div className="flex items-center gap-4">
            <CountryFlagGroup itemClassName={flagItemStyle}>
              <CountryFlag code="de" size="lg" />
              <CountryFlag code="fr" size="lg" />
              <CountryFlag code="it" size="lg" />
              <CountryFlag code="es" size="lg" />
            </CountryFlagGroup>
            <span className="text-sm text-gray-600">4 flags, lg size</span>
          </div>
          <div className="flex items-center gap-4">
            <CountryFlagGroup itemClassName={flagItemStyle}>
              <CountryFlag code="jp" size="xl" />
              <CountryFlag code="kr" size="xl" />
              <CountryFlag code="cn" size="xl" />
              <CountryFlag code="in" size="xl" />
              <CountryFlag code="sg" size="xl" />
            </CountryFlagGroup>
            <span className="text-sm text-gray-600">5 flags, xl size</span>
          </div>
        </div>
      </Section>

      <Section title="Flag Group with Max Limit">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <CountryFlagGroup max={3} itemClassName={flagItemStyle} countClassName={flagCountStyle}>
              <CountryFlag code="us" size="lg" />
              <CountryFlag code="gb" size="lg" />
              <CountryFlag code="ca" size="lg" />
              <CountryFlag code="au" size="lg" />
              <CountryFlag code="de" size="lg" />
              <CountryFlag code="fr" size="lg" />
              <CountryFlag code="jp" size="lg" />
            </CountryFlagGroup>
            <span className="text-sm text-gray-600">7 flags, max=3</span>
          </div>
          <div className="flex items-center gap-4">
            <CountryFlagGroup max={5} itemClassName={flagItemStyle} countClassName={flagCountStyle}>
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
            <span className="text-sm text-gray-600">10 flags, max=5</span>
          </div>
        </div>
      </Section>

      <Section title="With Custom Styling">
        <div className="flex items-center gap-4">
          <CountryFlag code="us" size="xl" className="rounded-sm shadow-md" />
          <CountryFlag code="gb" size="xl" className="rounded-sm ring-2 ring-blue-500" />
          <CountryFlag code="ca" size="xl" className="rounded-sm opacity-50" />
          <CountryFlag code="au" size="xl" className="rounded-sm grayscale" />
        </div>
      </Section>

      <Section title="With Tooltips">
        <div className="flex items-center gap-4">
          <CountryFlag
            code="us"
            size="lg"
            className={flagStyle}
            tooltipContent="United States"
          />
          <CountryFlag
            code="gb"
            size="lg"
            className={flagStyle}
            tooltipContent="United Kingdom"
          />
          <CountryFlag
            code="ca"
            size="lg"
            className={flagStyle}
            tooltipContent="Canada"
          />
          <CountryFlag
            code="au"
            size="lg"
            className={flagStyle}
            tooltipContent="Australia"
            tooltipSide="bottom"
          />
          <CountryFlag
            code="de"
            size="lg"
            className={flagStyle}
            tooltipContent="Germany"
            showTooltipArrow={false}
          />
        </div>
      </Section>

      <Section title="Flag Group with Count Tooltip">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <CountryFlagGroup
              max={3}
              showCountTooltip
              itemClassName={flagItemStyle}
              countClassName={flagCountStyle}
            >
              <CountryFlag code="us" size="lg" alt="United States" />
              <CountryFlag code="gb" size="lg" alt="United Kingdom" />
              <CountryFlag code="ca" size="lg" alt="Canada" />
              <CountryFlag code="au" size="lg" alt="Australia" />
              <CountryFlag code="de" size="lg" alt="Germany" />
              <CountryFlag code="fr" size="lg" alt="France" />
              <CountryFlag code="jp" size="lg" alt="Japan" />
            </CountryFlagGroup>
            <span className="text-sm text-gray-600">Hover +4 for country names</span>
          </div>
          <div className="flex items-center gap-4">
            <CountryFlagGroup
              max={2}
              showCountTooltip
              countTooltipSide="right"
              itemClassName={flagItemStyle}
              countClassName={flagCountStyle}
            >
              <CountryFlag code="br" size="xl" alt="Brazil" />
              <CountryFlag code="mx" size="xl" alt="Mexico" />
              <CountryFlag code="ar" size="xl" alt="Argentina" />
              <CountryFlag code="cl" size="xl" alt="Chile" />
              <CountryFlag code="co" size="xl" alt="Colombia" />
            </CountryFlagGroup>
            <span className="text-sm text-gray-600">Tooltip on right side</span>
          </div>
        </div>
      </Section>

      <Section title="Flag Group Count (Standalone)">
        <div className="flex items-center gap-4">
          <CountryFlagGroupCount count={5} size={20} className={flagCountStyle} />
          <CountryFlagGroupCount count={10} size={24} className={flagCountStyle} />
          <CountryFlagGroupCount count={99} size={32} className={flagCountStyle} />
        </div>
      </Section>

      <Section title="CountryFlag Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Default</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">code</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">ISO 3166-1 alpha-2 country code</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">size</td>
                <td className="py-2 pr-4 text-gray-600">"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number</td>
                <td className="py-2 pr-4 text-gray-500">"md"</td>
                <td className="py-2 text-gray-600">Flag size</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">alt</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto</td>
                <td className="py-2 text-gray-600">Alt text for the image</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fallback</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Custom fallback when flag fails to load</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipContent</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Content to display in tooltip</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipSide</td>
                <td className="py-2 pr-4 text-gray-600">"top" | "right" | "bottom" | "left"</td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">Tooltip placement side</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipAlign</td>
                <td className="py-2 pr-4 text-gray-600">"start" | "center" | "end"</td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">Tooltip alignment</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipSideOffset</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">6</td>
                <td className="py-2 text-gray-600">Distance from trigger in pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipDelayDuration</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">200</td>
                <td className="py-2 text-gray-600">Delay before showing tooltip (ms)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for tooltip content</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showTooltipArrow</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show tooltip arrow</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="CountryFlagGroup Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Default</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">children</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">CountryFlag components</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">max</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Max flags to show</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showCountTooltip</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show tooltip on count badge with remaining country names</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">countTooltipSide</td>
                <td className="py-2 pr-4 text-gray-600">"top" | "right" | "bottom" | "left"</td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">Count tooltip placement side</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">countTooltipAlign</td>
                <td className="py-2 pr-4 text-gray-600">"start" | "center" | "end"</td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">Count tooltip alignment</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">countTooltipClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for count tooltip content</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="CountryFlagGroupCount Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Default</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">count</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Number to display (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">size</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">20</td>
                <td className="py-2 text-gray-600">Size in pixels (width)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipContent</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Content to display in tooltip</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipSide</td>
                <td className="py-2 pr-4 text-gray-600">"top" | "right" | "bottom" | "left"</td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">Tooltip placement side</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipAlign</td>
                <td className="py-2 pr-4 text-gray-600">"start" | "center" | "end"</td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">Tooltip alignment</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltipClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for tooltip content</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">CSS class for the flag element (CountryFlag, CountryFlagGroup, CountryFlagGroupCount)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">style</td>
                <td className="py-2 text-gray-600">Inline styles for the flag element (CountryFlag only)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">itemClassName</td>
                <td className="py-2 text-gray-600">CSS class applied to each flag in group (CountryFlagGroup only)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">countClassName</td>
                <td className="py-2 text-gray-600">CSS class for the count badge (CountryFlagGroup only)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default CountryFlagDemo;
