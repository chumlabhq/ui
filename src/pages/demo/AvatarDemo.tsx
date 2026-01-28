import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarShimmer,
  AvatarGroupShimmer,
} from "../../components/Avatar";
import { Section, ComponentHeader } from "./components";

const companyLogos = {
  google: "https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png",
  github: "https://github.githubassets.com/favicons/favicon.svg",
  slack:
    "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
  figma: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
};

const avatarStyle =
  "bg-indigo-100 text-indigo-700 border border-indigo-200 text-sm font-medium";
const avatarStyle2 =
  "bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-medium";
const avatarStyle3 =
  "bg-amber-100 text-amber-700 border border-amber-200 text-sm font-medium";
const avatarStyle4 =
  "bg-rose-100 text-rose-700 border border-rose-200 text-sm font-medium";
const avatarStyle5 =
  "bg-cyan-100 text-cyan-700 border border-cyan-200 text-sm font-medium";

const imageAvatarStyle = "bg-white border border-gray-200";
const groupItemStyle = "ring-2 ring-white";
const countStyle =
  "bg-gray-100 text-gray-600 border border-gray-200 text-sm font-medium ring-2 ring-white";

const AvatarDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <ComponentHeader
        title="Avatar"
        description="A minimal avatar component for displaying user initials or images with optional loading states and tooltips."
      />

      <Section title="Basic Usage">
        <Avatar text="John" size={32} className={avatarStyle} />
        <Avatar text="Jane" size={32} className={avatarStyle2} />
        <Avatar text="Alex" size={32} className={avatarStyle3} />
        <Avatar text="Sam" size={32} className={avatarStyle4} />
        <Avatar text="Mike" size={32} className={avatarStyle5} />
      </Section>

      <Section title="With Initials (maxChars)">
        <Avatar
          text="John Doe"
          maxChars={2}
          size={32}
          className={avatarStyle}
        />
        <Avatar
          text="Jane Smith"
          maxChars={2}
          size={32}
          className={avatarStyle2}
        />
        <Avatar
          text="Alex Johnson"
          maxChars={2}
          size={32}
          className={avatarStyle3}
        />
        <Avatar
          text="Michael Brown"
          maxChars={2}
          size={32}
          className={avatarStyle4}
        />
      </Section>

      <Section title="Different Sizes">
        <Avatar text="S" size={20} className={avatarStyle} />
        <Avatar text="M" size={24} className={avatarStyle} />
        <Avatar text="L" size={32} className={avatarStyle} />
        <Avatar text="XL" size={40} className={avatarStyle} />
        <Avatar text="2XL" size={48} className={avatarStyle} />
      </Section>

      <Section title="Image Avatars">
        <Avatar
          src={companyLogos.google}
          alt="Google"
          size={32}
          className={imageAvatarStyle}
          imgClassName="object-contain w-[70%] h-[70%]"
        />
        <Avatar
          src={companyLogos.github}
          alt="GitHub"
          size={32}
          className={imageAvatarStyle}
        />
        <Avatar
          src={companyLogos.slack}
          alt="Slack"
          size={32}
          className={imageAvatarStyle}
          imgClassName="object-contain w-[70%] h-[70%]"
        />
        <Avatar
          src={companyLogos.figma}
          alt="Figma"
          size={32}
          className={imageAvatarStyle}
          imgClassName="object-contain w-[70%] h-[70%]"
        />
      </Section>

      <Section title="With Tooltips">
        <Avatar
          text="John"
          size={32}
          className={avatarStyle}
          tooltipContent="John Doe - Software Engineer"
        />
        <Avatar
          text="Jane"
          size={32}
          className={avatarStyle2}
          tooltipContent="Jane Smith - Product Manager"
          tooltipSide="bottom"
        />
        <Avatar
          text="Alex"
          size={32}
          className={avatarStyle3}
          tooltipContent="Alex Johnson - Designer"
          tooltipSide="right"
        />
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          alt="Mike"
          size={32}
          className={imageAvatarStyle}
          tooltipContent={
            <div className="flex flex-col gap-1">
              <span className="font-medium">Mike Wilson</span>
              <span className="text-xs text-gray-500">mike@example.com</span>
            </div>
          }
        />
      </Section>

      <Section title="Tooltip Positions">
        <Avatar
          text="T"
          size={32}
          className={avatarStyle}
          tooltipContent="Top (default)"
          tooltipSide="top"
        />
        <Avatar
          text="R"
          size={32}
          className={avatarStyle2}
          tooltipContent="Right"
          tooltipSide="right"
        />
        <Avatar
          text="B"
          size={32}
          className={avatarStyle3}
          tooltipContent="Bottom"
          tooltipSide="bottom"
        />
        <Avatar
          text="L"
          size={32}
          className={avatarStyle4}
          tooltipContent="Left"
          tooltipSide="left"
        />
      </Section>

      <Section title="Loading State (Individual)">
        <Avatar text="John" size={32} className={avatarStyle} isLoading />
        <Avatar text="Jane" size={36} className={avatarStyle2} isLoading />
        <Avatar text="Alex" size={40} className={avatarStyle3} isLoading />
        <Avatar text="Sam" size={48} className={avatarStyle4} isLoading />
      </Section>

      <Section title="Loading Shimmer (Standalone)">
        <AvatarShimmer size={24} />
        <AvatarShimmer size={32} />
        <AvatarShimmer size={40} />
        <AvatarShimmer size={48} className="bg-indigo-200" />
      </Section>

      <Section title="Avatar Group">
        <AvatarGroup size={36} itemClassName={groupItemStyle}>
          <Avatar text="Alice" className={avatarStyle} />
          <Avatar text="Bob" className={avatarStyle2} />
          <Avatar text="Charlie" className={avatarStyle3} />
          <Avatar text="Diana" className={avatarStyle4} />
          <Avatar text="Eve" className={avatarStyle5} />
        </AvatarGroup>
      </Section>

      <Section title="Avatar Group with Max">
        <AvatarGroup
          size={36}
          max={3}
          itemClassName={groupItemStyle}
          countClassName={countStyle}
        >
          <Avatar text="Alice" className={avatarStyle} />
          <Avatar text="Bob" className={avatarStyle2} />
          <Avatar text="Charlie" className={avatarStyle3} />
          <Avatar text="Diana" className={avatarStyle4} />
          <Avatar text="Eve" className={avatarStyle5} />
          <Avatar text="Frank" className={avatarStyle} />
        </AvatarGroup>
      </Section>

      <Section title="Avatar Group with Count Tooltip">
        <p className="text-sm text-gray-500 mb-4">
          Hover over the +X badge to see remaining names
        </p>
        <AvatarGroup
          size={36}
          max={3}
          itemClassName={groupItemStyle}
          countClassName={countStyle}
          showCountTooltip
        >
          <Avatar text="Alice" className={avatarStyle} />
          <Avatar text="Bob" className={avatarStyle2} />
          <Avatar text="Charlie" className={avatarStyle3} />
          <Avatar text="Diana" className={avatarStyle4} />
          <Avatar text="Eve" className={avatarStyle5} />
          <Avatar text="Frank" className={avatarStyle} />
        </AvatarGroup>
      </Section>

      <Section title="Count Tooltip with Images (uses alt)">
        <p className="text-sm text-gray-500 mb-4">
          For image avatars, the tooltip uses the alt prop
        </p>
        <AvatarGroup
          size={40}
          max={2}
          itemClassName={groupItemStyle}
          countClassName={countStyle}
          showCountTooltip
          countTooltipSide="bottom"
        >
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            alt="John Doe"
            className={imageAvatarStyle}
          />
          <Avatar
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
            alt="Jane Smith"
            className={imageAvatarStyle}
          />
          <Avatar
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
            alt="Alex Johnson"
            className={imageAvatarStyle}
          />
          <Avatar text="Sarah Wilson" className={avatarStyle} />
          <Avatar text="Mike Brown" className={avatarStyle2} />
        </AvatarGroup>
      </Section>

      <Section title="Avatar Group (Images)">
        <AvatarGroup
          size={40}
          max={4}
          itemClassName={groupItemStyle}
          countClassName={countStyle}
        >
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            alt="John"
            className={imageAvatarStyle}
          />
          <Avatar
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
            alt="Jane"
            className={imageAvatarStyle}
          />
          <Avatar
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
            alt="Alex"
            className={imageAvatarStyle}
          />
          <Avatar text="Sarah" className={avatarStyle} />
          <Avatar text="Mike" className={avatarStyle2} />
        </AvatarGroup>
      </Section>

      <Section title="Avatar Group with Tooltips">
        <AvatarGroup
          size={40}
          max={4}
          itemClassName={groupItemStyle}
          countClassName={countStyle}
        >
          <Avatar
            text="Alice"
            className={avatarStyle}
            tooltipContent="Alice Williams"
          />
          <Avatar
            text="Bob"
            className={avatarStyle2}
            tooltipContent="Bob Johnson"
          />
          <Avatar
            text="Charlie"
            className={avatarStyle3}
            tooltipContent="Charlie Brown"
          />
          <Avatar
            text="Diana"
            className={avatarStyle4}
            tooltipContent="Diana Prince"
          />
          <Avatar
            text="Eve"
            className={avatarStyle5}
            tooltipContent="Eve Smith"
          />
        </AvatarGroup>
      </Section>

      <Section title="Avatar Group Loading State">
        <AvatarGroup
          size={36}
          itemClassName={groupItemStyle}
          isLoading
          shimmerCount={4}
        />
      </Section>

      <Section title="Avatar Group Shimmer (Standalone)">
        <AvatarGroupShimmer count={3} size={32} />
        <AvatarGroupShimmer
          count={5}
          size={36}
          itemClassName="ring-2 ring-white"
        />
      </Section>

      <Section title="Interactive Loading Toggle">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 w-fit"
          >
            Toggle Loading: {isLoading ? "ON" : "OFF"}
          </button>
          <div className="flex items-center gap-4">
            <Avatar
              text="John Doe"
              maxChars={2}
              size={40}
              className={avatarStyle}
              isLoading={isLoading}
              tooltipContent="John Doe"
            />
            <AvatarGroup
              size={36}
              max={3}
              itemClassName={groupItemStyle}
              countClassName={countStyle}
              isLoading={isLoading}
              shimmerCount={4}
            >
              <Avatar text="Alice" className={avatarStyle} />
              <Avatar text="Bob" className={avatarStyle2} />
              <Avatar text="Charlie" className={avatarStyle3} />
              <Avatar text="Diana" className={avatarStyle4} />
            </AvatarGroup>
          </div>
        </div>
      </Section>

      <Section title="Avatar Group Count (Standalone)">
        <AvatarGroupCount count={5} size={32} className={countStyle} />
        <AvatarGroupCount count={10} size={36} className={countStyle} />
        <AvatarGroupCount count={99} size={40} className={countStyle} />
      </Section>

      <Section title="User Profile Example">
        <div className="flex items-center gap-4">
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            alt="User"
            size={48}
            className={imageAvatarStyle}
            tooltipContent="View Profile"
          />
          <div>
            <p className="font-medium text-gray-900">John Doe</p>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>
        </div>
      </Section>

      <Section title="Avatar Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">text</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Text to display as initials
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">src</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Image source URL</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">alt</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Alt text for image</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">maxChars</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">1</td>
                <td className="py-2 text-gray-600">
                  Max characters to display
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">size</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">24</td>
                <td className="py-2 text-gray-600">Size in pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isLoading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show loading shimmer state
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Tooltip Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipContent
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Content to show in tooltip
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipSide
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "top" | "right" | "bottom" | "left"
                </td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">Tooltip position</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipAlign
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "start" | "center" | "end"
                </td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">Tooltip alignment</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipSideOffset
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">6</td>
                <td className="py-2 text-gray-600">Distance from trigger</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipDelayDuration
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">200</td>
                <td className="py-2 text-gray-600">
                  Delay before showing tooltip (ms)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Custom class for tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showTooltipArrow
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show tooltip arrow</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="AvatarGroup Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">children</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Avatar components</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">max</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Max avatars to display</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">size</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">24</td>
                <td className="py-2 text-gray-600">Size for all avatars</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isLoading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show loading shimmer state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerCount
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">3</td>
                <td className="py-2 text-gray-600">
                  Number of shimmer avatars when loading
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showCountTooltip
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show tooltip on +X badge with remaining names
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countTooltipSide
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "top" | "right" | "bottom" | "left"
                </td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">
                  Position of count tooltip
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countTooltipAlign
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "start" | "center" | "end"
                </td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">
                  Alignment of count tooltip
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countTooltipClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Custom class for count tooltip
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="AvatarGroupCount Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">count</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Number to display (required)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">size</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">24</td>
                <td className="py-2 text-gray-600">Size in pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipContent
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Content for tooltip (auto-set when using showCountTooltip)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipSide
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "top" | "right" | "bottom" | "left"
                </td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">Tooltip position</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipAlign
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "start" | "center" | "end"
                </td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">Tooltip alignment</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Custom class for tooltip</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Shimmer Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Component
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  AvatarShimmer
                </td>
                <td className="py-2 pr-4 font-mono text-gray-600">size</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">24</td>
                <td className="py-2 text-gray-600">Size in pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  AvatarShimmer
                </td>
                <td className="py-2 pr-4 font-mono text-gray-600">className</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Custom CSS class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  AvatarGroupShimmer
                </td>
                <td className="py-2 pr-4 font-mono text-gray-600">count</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">3</td>
                <td className="py-2 text-gray-600">
                  Number of shimmer avatars
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  AvatarGroupShimmer
                </td>
                <td className="py-2 pr-4 font-mono text-gray-600">size</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">24</td>
                <td className="py-2 text-gray-600">
                  Size for all shimmer avatars
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  AvatarGroupShimmer
                </td>
                <td className="py-2 pr-4 font-mono text-gray-600">
                  itemClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Custom class for each shimmer item
                </td>
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
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">
                  CSS class for the avatar container (Avatar, AvatarGroup,
                  AvatarGroupCount)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  imgClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for the image element (Avatar only)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">style</td>
                <td className="py-2 text-gray-600">
                  Inline styles for the avatar container (Avatar only)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  itemClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class applied to each avatar in group (AvatarGroup only)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for the count badge (AvatarGroup only)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for shimmer state (Avatar, AvatarGroup)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerItemClassName
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for each shimmer avatar in group (AvatarGroup only)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default AvatarDemo;
