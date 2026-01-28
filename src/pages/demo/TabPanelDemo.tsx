import { useState } from "react";
import { TabPanel } from "../../components/TabPanel";
import type { Tab } from "../../components/TabPanel";
import { Section, ComponentHeader } from "./components";

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const InboxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

const tabsWithIcons: Tab[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "users", label: "Users", icon: UsersIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const tabsWithCounts: Tab[] = [
  { id: "inbox", label: "Inbox", icon: InboxIcon, count: 12 },
  { id: "users", label: "Users", icon: UsersIcon, count: 5 },
  { id: "settings", label: "Settings", icon: SettingsIcon, count: 0 },
];

const tabsWithTooltips: Tab[] = [
  { id: "home", label: "Home", icon: HomeIcon, tooltip: "Go to home page" },
  {
    id: "users",
    label: "Users",
    icon: UsersIcon,
    tooltip: "Manage users",
    count: 8,
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    tooltip: "Application settings",
  },
];

const tabsWithDisabled: Tab[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "users", label: "Users", icon: UsersIcon, disabled: true },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const TabPanelDemo = () => {
  const [underlinedTab, setUnderlinedTab] = useState("home");
  const [pillTab, setPillTab] = useState("home");
  const [boxedTab, setBoxedTab] = useState("home");
  const [iconLeftTab, setIconLeftTab] = useState("home");
  const [iconRightTab, setIconRightTab] = useState("home");
  const [countTab, setCountTab] = useState("inbox");
  const [zeroCountTab, setZeroCountTab] = useState("inbox");
  const [tooltipTab, setTooltipTab] = useState("home");
  const [disabledTab, setDisabledTab] = useState("home");
  const [gradientTab, setGradientTab] = useState("home");
  const [customFocusTab, setCustomFocusTab] = useState("home");
  const [noFocusRingTab, setNoFocusRingTab] = useState("home");
  const [keyboardTab, setKeyboardTab] = useState("home");

  return (
    <>
      <ComponentHeader
        title="TabPanel"
        description="A tabbed interface component with keyboard navigation and accessibility support."
      />

      <Section title="Underlined Style">
        <TabPanel
          tabs={basicTabs}
          activeTabId={underlinedTab}
          onTabChange={setUnderlinedTab}
          showIcons={false}
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center gap-6 border-b border-gray-200"
          tabButtonClassName="relative px-1 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            Content for <strong>{underlinedTab}</strong> tab
          </div>
        </TabPanel>
      </Section>

      <Section title="Pill Style">
        <TabPanel
          tabs={basicTabs}
          activeTabId={pillTab}
          onTabChange={setPillTab}
          showIcons={false}
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg"
          tabButtonClassName="px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md"
          tabButtonActiveClassName="bg-white text-gray-900 shadow-sm"
          tabButtonInactiveClassName="text-gray-600 hover:text-gray-900"
          tabPanelClassName="p-4 mt-2"
        >
          <div className="text-gray-700">
            Content for <strong>{pillTab}</strong> tab
          </div>
        </TabPanel>
      </Section>

      <Section title="Boxed Style">
        <TabPanel
          tabs={basicTabs}
          activeTabId={boxedTab}
          onTabChange={setBoxedTab}
          showIcons={false}
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center border-b border-gray-200"
          tabButtonClassName="relative px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border border-transparent border-b-0 -mb-px"
          tabButtonActiveClassName="bg-white text-blue-600 border-gray-200 border-b-white rounded-t-lg"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          tabPanelClassName="p-4 border border-t-0 border-gray-200 rounded-b-lg bg-white"
        >
          <div className="text-gray-700">
            Content for <strong>{boxedTab}</strong> tab
          </div>
        </TabPanel>
      </Section>

      <Section title="With Icons (Left)">
        <TabPanel
          tabs={tabsWithIcons}
          activeTabId={iconLeftTab}
          onTabChange={setIconLeftTab}
          iconPosition="left"
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center gap-1 border-b border-gray-200"
          tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            Content for <strong>{iconLeftTab}</strong> tab
          </div>
        </TabPanel>
      </Section>

      <Section title="With Icons (Right)">
        <TabPanel
          tabs={tabsWithIcons}
          activeTabId={iconRightTab}
          onTabChange={setIconRightTab}
          iconPosition="right"
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg"
          tabButtonClassName="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md"
          tabButtonActiveClassName="bg-white text-blue-600 shadow-sm"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabIconClassName="w-4 h-4"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          tabPanelClassName="p-4 mt-2"
        >
          <div className="text-gray-700">
            Content for <strong>{iconRightTab}</strong> tab
          </div>
        </TabPanel>
      </Section>

      <Section title="With Count (Hide Zero)">
        <TabPanel
          tabs={tabsWithCounts}
          activeTabId={countTab}
          onTabChange={setCountTab}
          showZeroCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center gap-1 border-b border-gray-200"
          tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          tabCountClassName="px-2 py-0.5 text-xs font-semibold rounded-full"
          tabCountActiveClassName="bg-blue-100 text-blue-600"
          tabCountInactiveClassName="bg-gray-100 text-gray-500"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            Content for <strong>{countTab}</strong> tab (Settings count is 0, so
            hidden)
          </div>
        </TabPanel>
      </Section>

      <Section title="With Count (Show Zero)">
        <TabPanel
          tabs={tabsWithCounts}
          activeTabId={zeroCountTab}
          onTabChange={setZeroCountTab}
          showZeroCount={true}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center gap-1 border-b border-gray-200"
          tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          tabCountClassName="px-2 py-0.5 text-xs font-semibold rounded-full"
          tabCountActiveClassName="bg-blue-100 text-blue-600"
          tabCountInactiveClassName="bg-gray-100 text-gray-500"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            Content for <strong>{zeroCountTab}</strong> tab (Settings shows 0)
          </div>
        </TabPanel>
      </Section>

      <Section title="With Tooltips (Bottom)">
        <p className="text-sm text-gray-500 mb-3">
          Hover over <strong>inactive</strong> tabs to see tooltips below
        </p>
        <TabPanel
          tabs={tabsWithTooltips}
          activeTabId={tooltipTab}
          onTabChange={setTooltipTab}
          showTooltips={true}
          tooltipPosition="bottom"
          tooltipOffset={4}
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center gap-1 border-b border-gray-200"
          tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            Currently viewing: <strong>{tooltipTab}</strong>
          </div>
        </TabPanel>
      </Section>

      <Section title="With Tooltips (Top)">
        <p className="text-sm text-gray-500 mb-3">
          Hover over <strong>inactive</strong> tabs to see tooltips above
        </p>
        <TabPanel
          tabs={tabsWithTooltips}
          activeTabId={tooltipTab}
          onTabChange={setTooltipTab}
          showTooltips={true}
          tooltipPosition="top"
          tooltipOffset={4}
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center gap-1 border-b border-gray-200"
          tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            Currently viewing: <strong>{tooltipTab}</strong>
          </div>
        </TabPanel>
      </Section>

      <Section title="With Disabled Tab">
        <TabPanel
          tabs={tabsWithDisabled}
          activeTabId={disabledTab}
          onTabChange={setDisabledTab}
          showCount={false}
          disableAutoFocus
          containerClassName="w-full"
          tabListClassName="flex items-center gap-1 border-b border-gray-200"
          tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabButtonDisabledClassName="opacity-40 cursor-not-allowed hover:text-gray-500"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            The "Users" tab is disabled and cannot be selected
          </div>
        </TabPanel>
      </Section>

      <Section title="Gradient Style">
        <TabPanel
          tabs={tabsWithIcons}
          activeTabId={gradientTab}
          onTabChange={setGradientTab}
          showCount={false}
          disableAutoFocus
          containerClassName="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3"
          tabListClassName="inline-flex items-center gap-2 p-1.5 bg-white/60 backdrop-blur rounded-xl"
          tabButtonClassName="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-lg"
          tabButtonFocusClassName="outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-purple-500"
          tabButtonActiveClassName="bg-white text-purple-600 shadow-md"
          tabButtonInactiveClassName="text-gray-500 hover:text-purple-500 hover:bg-white/50"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-purple-600"
          tabIconInactiveClassName="text-gray-400"
          tabPanelClassName="p-4 mt-3 bg-white rounded-xl shadow-sm"
        >
          <div className="text-gray-700">
            Custom styled tabs with gradient background (notice the purple focus ring)
          </div>
        </TabPanel>
      </Section>

      <Section title="Custom Focus Styles">
        <p className="text-sm text-gray-500 mb-3">
          Use <code className="bg-gray-100 px-1 rounded">tabButtonFocusClassName</code> to customize the keyboard focus ring. Click a tab and use arrow keys to see the focus ring.
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-400 mb-2">Green dashed focus ring:</p>
            <TabPanel
              tabs={tabsWithIcons}
              activeTabId={customFocusTab}
              onTabChange={setCustomFocusTab}
              showCount={false}
              containerClassName="w-full"
              tabListClassName="flex items-center gap-1 border-b border-gray-200"
              tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
              tabButtonActiveClassName="text-green-600"
              tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
              tabButtonFocusClassName="outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-dashed"
              tabIconClassName="w-5 h-5"
              tabIconActiveClassName="text-green-600"
              tabIconInactiveClassName="text-gray-400"
              activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
              tabPanelClassName="p-4"
            >
              <div className="text-gray-700">
                Custom green dashed focus ring
              </div>
            </TabPanel>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">No focus ring (outline only):</p>
            <TabPanel
              tabs={tabsWithIcons}
              activeTabId={noFocusRingTab}
              onTabChange={setNoFocusRingTab}
              showCount={false}
              containerClassName="w-full"
              tabListClassName="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg"
              tabButtonClassName="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md"
              tabButtonActiveClassName="bg-white text-gray-900 shadow-sm"
              tabButtonInactiveClassName="text-gray-600 hover:text-gray-900"
              tabButtonFocusClassName="outline-none"
              tabIconClassName="w-5 h-5"
              tabIconActiveClassName="text-gray-900"
              tabIconInactiveClassName="text-gray-400"
              tabPanelClassName="p-4 mt-2"
            >
              <div className="text-gray-700">
                Focus ring completely disabled
              </div>
            </TabPanel>
          </div>
        </div>
      </Section>

      <Section title="Keyboard Navigation">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-2">Keyboard shortcuts:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-xs font-mono shadow-sm">
                →
              </kbd>
              <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-xs font-mono shadow-sm">
                ↓
              </kbd>
              <span>Move to next tab</span>
            </li>
            <li className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-xs font-mono shadow-sm">
                ←
              </kbd>
              <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-xs font-mono shadow-sm">
                ↑
              </kbd>
              <span>Move to previous tab</span>
            </li>
            <li className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-xs font-mono shadow-sm">
                Home
              </kbd>
              <span>Move to first tab</span>
            </li>
            <li className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border border-blue-200 text-xs font-mono shadow-sm">
                End
              </kbd>
              <span>Move to last tab</span>
            </li>
          </ul>
        </div>
        <TabPanel
          tabs={tabsWithIcons}
          activeTabId={keyboardTab}
          onTabChange={setKeyboardTab}
          showCount={false}
          containerClassName="w-full"
          tabListClassName="flex items-center gap-1 border-b border-gray-200"
          tabButtonClassName="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
          tabButtonActiveClassName="text-blue-600"
          tabButtonInactiveClassName="text-gray-500 hover:text-gray-700"
          tabIconClassName="w-5 h-5"
          tabIconActiveClassName="text-blue-600"
          tabIconInactiveClassName="text-gray-400"
          activeIndicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          tabPanelClassName="p-4"
        >
          <div className="text-gray-700">
            Click on a tab and use keyboard to navigate
          </div>
        </TabPanel>
      </Section>

      <Section title="TabPanel Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">tabs</td>
                <td className="py-2 pr-4 text-gray-600">Tab[]</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Array of tab objects</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  activeTabId
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">ID of the active tab</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onTabChange
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (tabId: string) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when tab changes
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">children</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Content to render in the active tab panel
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showIcons</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show tab icons</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  iconPosition
                </td>
                <td className="py-2 pr-4 text-gray-600">"left" | "right"</td>
                <td className="py-2 pr-4 text-gray-500">"left"</td>
                <td className="py-2 text-gray-600">
                  Position of icon relative to label
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showCount</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show count badge</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showZeroCount
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show count even when value is 0
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  alwaysShowLabels
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show labels for all tabs or only active
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showTooltips
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Enable tooltips on inactive tabs
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipPosition
                </td>
                <td className="py-2 pr-4 text-gray-600">"top" | "bottom"</td>
                <td className="py-2 pr-4 text-gray-500">"bottom"</td>
                <td className="py-2 text-gray-600">
                  Position of the tooltip relative to tab
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipOffset
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">4</td>
                <td className="py-2 text-gray-600">
                  Distance between tooltip and tab (in pixels)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  disableAutoFocus
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Disable auto-focus on active tab
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Disable all tabs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Tab Object Properties">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Required
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">Unique identifier</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">Tab label text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">icon</td>
                <td className="py-2 pr-4 text-gray-600">ComponentType</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Icon component</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">count</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Count badge value</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Disable this tab</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltip</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Tooltip content</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 text-gray-600">Root container wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabListClassName</td>
                <td className="py-2 text-gray-600">Tab list container (role="tablist")</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabButtonClassName</td>
                <td className="py-2 text-gray-600">Tab button (base styles)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabButtonActiveClassName</td>
                <td className="py-2 text-gray-600">Tab button when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabButtonInactiveClassName</td>
                <td className="py-2 text-gray-600">Tab button when inactive</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabButtonDisabledClassName</td>
                <td className="py-2 text-gray-600">Tab button when disabled</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabButtonFocusClassName</td>
                <td className="py-2 text-gray-600">Tab button focus ring styles (default: blue ring with focus-visible)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabLabelClassName</td>
                <td className="py-2 text-gray-600">Tab label text (base styles)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabLabelActiveClassName</td>
                <td className="py-2 text-gray-600">Tab label when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabLabelInactiveClassName</td>
                <td className="py-2 text-gray-600">Tab label when inactive</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabIconClassName</td>
                <td className="py-2 text-gray-600">Tab icon (base styles)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabIconActiveClassName</td>
                <td className="py-2 text-gray-600">Tab icon when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabIconInactiveClassName</td>
                <td className="py-2 text-gray-600">Tab icon when inactive</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabCountClassName</td>
                <td className="py-2 text-gray-600">Count badge (base styles)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabCountActiveClassName</td>
                <td className="py-2 text-gray-600">Count badge when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabCountInactiveClassName</td>
                <td className="py-2 text-gray-600">Count badge when inactive</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">activeIndicatorClassName</td>
                <td className="py-2 text-gray-600">Active tab indicator (underline/highlight)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tabPanelClassName</td>
                <td className="py-2 text-gray-600">Tab panel content container</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default TabPanelDemo;
