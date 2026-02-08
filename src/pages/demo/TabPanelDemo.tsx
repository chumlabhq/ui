import { useState, useRef } from "react";
import { TabPanel } from "../../components/TabPanel";
import type { Tab } from "../../components/TabPanel";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";

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

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

const tabsWithIcons: Tab[] = [
  { id: "home", label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
  { id: "users", label: "Users", icon: <UsersIcon className="w-5 h-5" /> },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

const tabsWithCounts: Tab[] = [
  {
    id: "inbox",
    label: "Inbox",
    icon: <InboxIcon className="w-5 h-5" />,
    count: 12,
  },
  {
    id: "users",
    label: "Users",
    icon: <UsersIcon className="w-5 h-5" />,
    count: 5,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
    count: 0,
  },
];

const tabsWithTooltips: Tab[] = [
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon className="w-5 h-5" />,
    tooltip: "Go to home page",
  },
  {
    id: "users",
    label: "Users",
    icon: <UsersIcon className="w-5 h-5" />,
    tooltip: "Manage users",
    count: 8,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
    tooltip: "Application settings",
  },
];

const tabsWithDisabled: Tab[] = [
  { id: "home", label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
  {
    id: "users",
    label: "Users",
    icon: <UsersIcon className="w-5 h-5" />,
    disabled: true,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

const rtlTabs: Tab[] = [
  { id: "home", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: <HomeIcon className="w-5 h-5" /> },
  { id: "users", label: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0648\u0646", icon: <UsersIcon className="w-5 h-5" /> },
  { id: "settings", label: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", icon: <SettingsIcon className="w-5 h-5" /> },
];

const getTabStyles = (isDarkMode: boolean) => ({
  underline: {
    tabList: `flex items-center gap-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`,
    tab: "relative px-1 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none",
    tabActive: isDarkMode ? "text-blue-400" : "text-blue-600",
    tabInactive: isDarkMode
      ? "text-gray-400 hover:text-gray-200"
      : "text-gray-500 hover:text-gray-700",
    indicator: `absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? "bg-blue-400" : "bg-blue-600"}`,
  },
  pill: {
    tabList: `inline-flex items-center gap-1 p-1 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`,
    tab: "px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
    tabActive: isDarkMode
      ? "bg-gray-700 text-white shadow-sm"
      : "bg-white text-gray-900 shadow-sm",
    tabInactive: isDarkMode
      ? "text-gray-400 hover:text-gray-200"
      : "text-gray-600 hover:text-gray-900",
  },
  icon: {
    tabList: `flex items-center gap-1 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`,
    tab: "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none",
    tabActive: isDarkMode ? "text-blue-400" : "text-blue-600",
    tabInactive: isDarkMode
      ? "text-gray-400 hover:text-gray-200"
      : "text-gray-500 hover:text-gray-700",
    iconActive: isDarkMode ? "text-blue-400" : "text-blue-600",
    iconInactive: isDarkMode ? "text-gray-500" : "text-gray-400",
    indicator: `absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? "bg-blue-400" : "bg-blue-600"}`,
  },
  count: {
    count: "px-2 py-0.5 text-xs font-semibold rounded-full",
    countActive: isDarkMode
      ? "bg-blue-900 text-blue-300"
      : "bg-blue-100 text-blue-600",
    countInactive: isDarkMode
      ? "bg-gray-700 text-gray-400"
      : "bg-gray-100 text-gray-500",
  },
  disabled: {
    tabDisabled: isDarkMode
      ? "opacity-40 cursor-not-allowed hover:text-gray-400"
      : "opacity-40 cursor-not-allowed hover:text-gray-500",
  },
  content: isDarkMode ? "text-gray-300" : "text-gray-700",
  contentStrong: isDarkMode ? "text-white" : "text-gray-900",
  panel: "p-4",
  focus: isDarkMode
    ? "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400 focus-visible:ring-offset-gray-900"
    : "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500",
});

const TabPanelDemo = () => {
  const { isDarkMode } = useTheme();
  const [underlinedTab, setUnderlinedTab] = useState("home");
  const [pillTab, setPillTab] = useState("home");
  const [boxedTab, setBoxedTab] = useState("home");
  const [iconLeftTab, setIconLeftTab] = useState("home");
  const [iconRightTab, setIconRightTab] = useState("home");
  const [countTab, setCountTab] = useState("inbox");
  const [zeroCountTab, setZeroCountTab] = useState("inbox");
  const [tooltipTab, setTooltipTab] = useState("home");
  const [tooltipTopTab, setTooltipTopTab] = useState("home");
  const [disabledTab, setDisabledTab] = useState("home");
  const [gradientTab, setGradientTab] = useState("home");
  const [customFocusTab, setCustomFocusTab] = useState("home");
  const [keyboardTab, setKeyboardTab] = useState("home");
  const [verticalTab, setVerticalTab] = useState("home");
  const [manualTab, setManualTab] = useState("home");
  const [noLoopTab, setNoLoopTab] = useState("home");
  const [allDisabledTab, setAllDisabledTab] = useState("home");
  const [iconOnlyTab, setIconOnlyTab] = useState("home");
  const [customIdTab, setCustomIdTab] = useState("home");
  const [renderFnTab, setRenderFnTab] = useState("home");
  const [renderTabTab, setRenderTabTab] = useState("home");
  const [classesTab, setClassNamesTab] = useState("home");
  const [rtlTab, setRtlTab] = useState("home");

  const [dynamicTabs, setDynamicTabs] = useState<Tab[]>([
    { id: "tab-1", label: "Tab 1", icon: <HomeIcon className="w-5 h-5" /> },
    { id: "tab-2", label: "Tab 2", icon: <UsersIcon className="w-5 h-5" /> },
    {
      id: "tab-3",
      label: "Tab 3",
      icon: <SettingsIcon className="w-5 h-5" />,
    },
  ]);
  const [dynamicTab, setDynamicTab] = useState("tab-1");
  const nextDynamicId = useRef(4);

  const addDynamicTab = () => {
    const num = nextDynamicId.current++;
    setDynamicTabs((prev) => [
      ...prev,
      { id: `tab-${num}`, label: `Tab ${num}` },
    ]);
  };

  const removeDynamicTab = (tabId: string) => {
    setDynamicTabs((prev) => prev.filter((t) => t.id !== tabId));
  };

  const s = getTabStyles(isDarkMode);

  return (
    <div className="space-y-16">
      <header>
        <h1
          className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          TabPanel
        </h1>
        <p
          className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          A tabbed interface component with full keyboard navigation, RTL
          support, accessibility, roving tabindex, and extensive styling
          customization. Supports icons as ReactNode, count badges, tooltips,
          vertical orientation, manual activation, dynamic tabs with automatic
          fallback, and both controlled and uncontrolled modes.
        </p>

        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { TabPanel } from "@kern-ui/tab-panel";
import type { Tab } from "@kern-ui/tab-panel";`}
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
          title="Underlined Style"
          description="Classic underline tab style with an active indicator bar."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              value={underlinedTab}
              onValueChange={setUnderlinedTab}
              classes={{
                root: "w-full",
                tabList: s.underline.tabList,
                tab: s.underline.tab,
                tabActive: s.underline.tabActive,
                tabInactive: s.underline.tabInactive,
                tabFocus: s.focus,
                indicator: s.underline.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Content for{" "}
                <strong className={s.contentStrong}>{underlinedTab}</strong> tab
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Pill Style"
          description="Contained pill-shaped tab style with background highlight on active tab."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              value={pillTab}
              onValueChange={setPillTab}
              classes={{
                root: "w-full",
                tabList: s.pill.tabList,
                tab: s.pill.tab,
                tabActive: s.pill.tabActive,
                tabInactive: s.pill.tabInactive,
                tabFocus: s.focus,
                panel: "p-4 mt-2",
              }}
            >
              <div className={s.content}>
                Content for{" "}
                <strong className={s.contentStrong}>{pillTab}</strong> tab
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Boxed Style"
          description="Browser-style boxed tabs with bordered active state."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              value={boxedTab}
              onValueChange={setBoxedTab}
              classes={{
                root: "w-full",
                tabList: `flex items-center border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`,
                tab: "relative px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border border-transparent border-b-0 -mb-px",
                tabActive: isDarkMode
                  ? "bg-gray-800 text-blue-400 border-gray-700 border-b-gray-800 rounded-t-lg"
                  : "bg-white text-blue-600 border-gray-200 border-b-white rounded-t-lg",
                tabInactive: isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                tabFocus: s.focus,
                panel: `p-4 border border-t-0 rounded-b-lg ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`,
              }}
            >
              <div className={s.content}>
                Content for{" "}
                <strong className={s.contentStrong}>{boxedTab}</strong> tab
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="With Icons (Left)"
          description="Tabs with leading icon components using iconPosition='left' (default)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={iconLeftTab}
              onValueChange={setIconLeftTab}
              iconPosition="left"
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Content for{" "}
                <strong className={s.contentStrong}>{iconLeftTab}</strong> tab
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="With Icons (Right)"
          description="Tabs with trailing icon components using iconPosition='right'."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={iconRightTab}
              onValueChange={setIconRightTab}
              iconPosition="right"
              classes={{
                root: "w-full",
                tabList: s.pill.tabList,
                tab: "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
                tabActive: s.pill.tabActive,
                tabInactive: s.pill.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                panel: "p-4 mt-2",
              }}
            >
              <div className={s.content}>
                Content for{" "}
                <strong className={s.contentStrong}>{iconRightTab}</strong> tab
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Icon Only (Labels Hidden)"
          description="Set alwaysShowLabels={false} to hide labels on inactive tabs. Only the active tab shows its label. Inactive tabs get an aria-label for screen readers."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={iconOnlyTab}
              onValueChange={setIconOnlyTab}
              alwaysShowLabels={false}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Only the active tab shows its label. Icons always visible.
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="With Count Badges (Hide Zero)"
          description="Display count badges on tabs. Tabs with count 0 hide the badge by default."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithCounts}
              value={countTab}
              onValueChange={setCountTab}
              showZeroCount={false}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                count: s.count.count,
                countActive: s.count.countActive,
                countInactive: s.count.countInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Content for{" "}
                <strong className={s.contentStrong}>{countTab}</strong> tab
                (Settings count is 0, so badge is hidden)
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="With Count Badges (Show Zero)"
          description="Set showZeroCount={true} to always display the badge, even for count 0."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithCounts}
              value={zeroCountTab}
              onValueChange={setZeroCountTab}
              showZeroCount={true}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                count: s.count.count,
                countActive: s.count.countActive,
                countInactive: s.count.countInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Content for{" "}
                <strong className={s.contentStrong}>{zeroCountTab}</strong> tab
                (Settings shows 0)
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="With Tooltips (Bottom)"
          description="Hover over inactive tabs to see tooltips below. Active tab tooltip is hidden."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithTooltips}
              value={tooltipTab}
              onValueChange={setTooltipTab}
              showTooltips={true}
              tooltipPosition="bottom"
              tooltipOffset={4}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Currently viewing:{" "}
                <strong className={s.contentStrong}>{tooltipTab}</strong>
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="With Tooltips (Top)"
          description="Hover over inactive tabs to see tooltips above."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithTooltips}
              value={tooltipTopTab}
              onValueChange={setTooltipTopTab}
              showTooltips={true}
              tooltipPosition="top"
              tooltipOffset={4}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Currently viewing:{" "}
                <strong className={s.contentStrong}>{tooltipTopTab}</strong>
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled Tab"
          description="Individual tabs can be disabled via the tab object's disabled property. Disabled tabs are skipped during keyboard navigation."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithDisabled}
              value={disabledTab}
              onValueChange={setDisabledTab}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabDisabled: s.disabled.tabDisabled,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                The &quot;Users&quot; tab is disabled and cannot be selected
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="All Tabs Disabled"
          description="Set the top-level disabled prop to disable all tabs at once."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={allDisabledTab}
              onValueChange={setAllDisabledTab}
              disabled={true}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabDisabled: s.disabled.tabDisabled,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                All tabs are disabled via the top-level{" "}
                <code
                  className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  disabled
                </code>{" "}
                prop
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Gradient Style"
          description="Custom styled tabs with gradient background demonstrating full visual customization."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={gradientTab}
              onValueChange={setGradientTab}
              classes={{
                root: `w-full rounded-xl p-3 ${isDarkMode ? "bg-gradient-to-r from-purple-950 to-pink-950" : "bg-gradient-to-r from-purple-50 to-pink-50"}`,
                tabList: `inline-flex items-center gap-2 p-1.5 backdrop-blur rounded-xl ${isDarkMode ? "bg-gray-800/60" : "bg-white/60"}`,
                tab: "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-lg",
                tabFocus: `outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-purple-500 ${isDarkMode ? "focus-visible:ring-offset-gray-900" : ""}`,
                tabActive: isDarkMode
                  ? "bg-gray-800 text-purple-300 shadow-md"
                  : "bg-white text-purple-600 shadow-md",
                tabInactive: isDarkMode
                  ? "text-gray-400 hover:text-purple-300 hover:bg-gray-800/50"
                  : "text-gray-500 hover:text-purple-500 hover:bg-white/50",
                iconActive: isDarkMode ? "text-purple-300" : "text-purple-600",
                iconInactive: isDarkMode ? "text-gray-500" : "text-gray-400",
                panel: `p-4 mt-3 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`,
              }}
            >
              <div className={s.content}>
                Custom styled tabs with gradient background (notice the purple
                focus ring)
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Focus Styles"
          description="Use classes.tabFocus to customize the keyboard focus ring. Click a tab then use arrow keys to see the focus ring."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-6">
              <div>
                <p
                  className={`text-xs mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Green dashed focus ring:
                </p>
                <TabPanel
                  tabs={tabsWithIcons}
                  value={customFocusTab}
                  onValueChange={setCustomFocusTab}
                  classes={{
                    root: "w-full",
                    tabList: s.icon.tabList,
                    tab: s.icon.tab,
                    tabActive: isDarkMode
                      ? "text-green-400"
                      : "text-green-600",
                    tabInactive: s.icon.tabInactive,
                    tabFocus: `outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-dashed ${isDarkMode ? "focus-visible:ring-offset-gray-800" : ""}`,
                    iconActive: isDarkMode
                      ? "text-green-400"
                      : "text-green-600",
                    iconInactive: s.icon.iconInactive,
                    indicator: `absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? "bg-green-400" : "bg-green-600"}`,
                    panel: s.panel,
                  }}
                >
                  <div className={s.content}>Custom green dashed focus ring</div>
                </TabPanel>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Keyboard Navigation"
          description="Full WAI-ARIA keyboard support with RTL-aware arrow key direction. Click a tab and use arrow keys to navigate."
          isDarkMode={isDarkMode}
        >
          <div
            className={`mb-4 p-4 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}
          >
            <p className="font-semibold mb-2">Keyboard shortcuts:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  &rarr;
                </kbd>
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  &darr;
                </kbd>
                <span>Move to next tab (reversed in RTL)</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  &larr;
                </kbd>
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  &uarr;
                </kbd>
                <span>Move to previous tab (reversed in RTL)</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  Home
                </kbd>
                <span>Move to first tab</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  End
                </kbd>
                <span>Move to last tab</span>
              </li>
            </ul>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={keyboardTab}
              onValueChange={setKeyboardTab}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Click on a tab and use keyboard to navigate
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="RTL Support"
          description="Arrow key direction automatically reverses in right-to-left contexts. The component detects RTL via computed CSS direction."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div dir="rtl" className="w-full">
              <div
                className={`mb-3 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                This section has{" "}
                <code
                  className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  dir=&quot;rtl&quot;
                </code>{" "}
                &mdash; ArrowRight moves backward, ArrowLeft moves forward.
              </div>
              <TabPanel
                tabs={rtlTabs}
                value={rtlTab}
                onValueChange={setRtlTab}
                classes={{
                  root: "w-full",
                  tabList: s.icon.tabList,
                  tab: s.icon.tab,
                  tabActive: s.icon.tabActive,
                  tabInactive: s.icon.tabInactive,
                  tabFocus: s.focus,
                  iconActive: s.icon.iconActive,
                  iconInactive: s.icon.iconInactive,
                  indicator: s.icon.indicator,
                  panel: s.panel,
                }}
              >
                {(tab) => (
                  <div className={s.content}>
                    <strong className={s.contentStrong}>{tab.label}</strong>{" "}
                    &mdash; {tab.id}
                  </div>
                )}
              </TabPanel>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Dynamic Tabs (Add / Remove)"
          description="Tabs can be dynamically added and removed. When the active tab is removed, the component automatically falls back to the first available tab."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addDynamicTab}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDarkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Tab
                </button>
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {dynamicTabs.length} tab{dynamicTabs.length !== 1 && "s"}
                </span>
              </div>
              {dynamicTabs.length > 0 ? (
                <TabPanel
                  tabs={dynamicTabs}
                  value={dynamicTab}
                  onValueChange={setDynamicTab}
                  classes={{
                    root: "w-full",
                    tabList: s.icon.tabList,
                    tab: s.icon.tab,
                    tabActive: s.icon.tabActive,
                    tabInactive: s.icon.tabInactive,
                    tabFocus: s.focus,
                    iconActive: s.icon.iconActive,
                    iconInactive: s.icon.iconInactive,
                    indicator: s.icon.indicator,
                    panel: s.panel,
                  }}
                >
                  {(tab) => (
                    <div className="flex items-center justify-between">
                      <span className={s.content}>
                        Active:{" "}
                        <strong className={s.contentStrong}>{tab.label}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDynamicTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDarkMode ? "bg-red-900/50 hover:bg-red-800/60 text-red-300" : "bg-red-50 hover:bg-red-100 text-red-600"}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove this tab
                      </button>
                    </div>
                  )}
                </TabPanel>
              ) : (
                <div
                  className={`p-8 text-center rounded-lg border-2 border-dashed ${isDarkMode ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}
                >
                  No tabs. Click &quot;Add Tab&quot; to create one.
                </div>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Uncontrolled (defaultValue)"
          description="Use defaultValue for uncontrolled behavior — no external state management needed."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              defaultValue="profile"
              classes={{
                root: "w-full",
                tabList: s.underline.tabList,
                tab: s.underline.tab,
                tabActive: s.underline.tabActive,
                tabInactive: s.underline.tabInactive,
                tabFocus: s.focus,
                indicator: s.underline.indicator,
                panel: s.panel,
              }}
            >
              {(tab) => (
                <div className={s.content}>
                  Uncontrolled tab:{" "}
                  <strong className={s.contentStrong}>{tab.label}</strong>{" "}
                  (started at Profile)
                </div>
              )}
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Vertical Orientation"
          description="Set orientation='vertical' — keyboard navigation switches to ArrowUp/ArrowDown."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={verticalTab}
              onValueChange={setVerticalTab}
              orientation="vertical"
              classes={{
                root: "flex gap-0 w-full",
                tabList: `flex flex-col gap-1 pr-0 min-w-[160px] border-r ${isDarkMode ? "border-gray-700" : "border-gray-200"}`,
                tab: "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none text-left w-full",
                tabActive: isDarkMode
                  ? "text-blue-400 bg-blue-900/30"
                  : "text-blue-600 bg-blue-50",
                tabInactive: isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                panel: "flex-1 p-4",
              }}
            >
              <div className={s.content}>
                Vertical tab content for{" "}
                <strong className={s.contentStrong}>{verticalTab}</strong>
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Manual Activation Mode"
          description="With activationMode='manual', arrow keys move focus between tabs but do not activate them. Press Enter or Space to activate."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={manualTab}
              onValueChange={setManualTab}
              activationMode="manual"
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Active tab:{" "}
                <strong className={s.contentStrong}>{manualTab}</strong> (focus
                may differ from active)
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="No Loop (loop={false})"
          description="Set loop={false} to prevent keyboard navigation from wrapping around at the ends."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={noLoopTab}
              onValueChange={setNoLoopTab}
              loop={false}
              classes={{
                root: "w-full",
                tabList: s.icon.tabList,
                tab: s.icon.tab,
                tabActive: s.icon.tabActive,
                tabInactive: s.icon.tabInactive,
                tabFocus: s.focus,
                iconActive: s.icon.iconActive,
                iconInactive: s.icon.iconInactive,
                indicator: s.icon.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Arrow keys stop at first/last tab instead of wrapping
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Render Function Children"
          description="Pass a function as children for dynamic per-tab content rendering. The function receives the active tab object."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={renderFnTab}
              onValueChange={setRenderFnTab}
              classes={{
                root: "w-full",
                tabList: s.pill.tabList,
                tab: "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
                tabActive: s.pill.tabActive,
                tabInactive: s.pill.tabInactive,
                tabFocus: s.focus,
                iconActive: isDarkMode ? "text-white" : "text-gray-900",
                iconInactive: s.icon.iconInactive,
                panel: "p-4 mt-2",
              }}
            >
              {(tab) => (
                <div className={s.content}>
                  <strong className={s.contentStrong}>{tab.label}</strong>{" "}
                  &mdash; rendered via{" "}
                  <code
                    className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                  >
                    children(tab)
                  </code>
                </div>
              )}
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Tab Rendering (renderTab)"
          description="Use the renderTab prop to wrap or customize tab triggers. Receives render props and the default element."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={tabsWithIcons}
              value={renderTabTab}
              onValueChange={setRenderTabTab}
              classes={{
                root: "w-full",
                tabList: s.pill.tabList,
                tab: "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
                tabActive: s.pill.tabActive,
                tabInactive: s.pill.tabInactive,
                tabFocus: s.focus,
                iconActive: isDarkMode ? "text-white" : "text-gray-900",
                iconInactive: s.icon.iconInactive,
                panel: "p-4 mt-2",
              }}
              renderTab={(props, defaultElement) => (
                <div key={props.tab.id} className="relative">
                  {defaultElement}
                  {props.tab.count != null && props.tab.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {props.tab.count}
                    </span>
                  )}
                </div>
              )}
            >
              <div className={s.content}>
                Tab content for <strong className={s.contentStrong}>{renderTabTab}</strong>
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="classes Record"
          description="All styling is done via the classes record for a clean, consolidated API."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              value={classesTab}
              onValueChange={setClassNamesTab}
              classes={{
                root: "w-full",
                tabList: s.underline.tabList,
                tab: s.underline.tab,
                tabActive: s.underline.tabActive,
                tabInactive: s.underline.tabInactive,
                tabFocus: s.focus,
                indicator: s.underline.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                All styles via{" "}
                <strong className={s.contentStrong}>classes</strong> record
                for{" "}
                <strong className={s.contentStrong}>{classesTab}</strong>
              </div>
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom ID"
          description="Use the id prop for deterministic IDs useful for SSR and testing."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              id="my-tabs"
              value={customIdTab}
              onValueChange={setCustomIdTab}
              classes={{
                root: "w-full",
                tabList: s.underline.tabList,
                tab: s.underline.tab,
                tabActive: s.underline.tabActive,
                tabInactive: s.underline.tabInactive,
                tabFocus: s.focus,
                indicator: s.underline.indicator,
                panel: s.panel,
              }}
            >
              <div className={s.content}>
                Tab IDs are{" "}
                <code
                  className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  my-tabs-tab-home
                </code>
                ,{" "}
                <code
                  className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  my-tabs-panel-home
                </code>
                , etc.
              </div>
            </TabPanel>
          </DemoWrapper>
          <div
            className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}
          >
            <p
              className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}
            >
              <strong>Note:</strong> The ID is auto-generated via{" "}
              <code
                className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
              >
                useId()
              </code>{" "}
              if not provided. Use the{" "}
              <code
                className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
              >
                id
              </code>{" "}
              prop for deterministic SSR/testing IDs.
            </p>
          </div>
        </Section>

        <Section
          title="Custom Aria Label"
          description='Use aria-label to provide a meaningful accessible name for the tablist.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              defaultValue="home"
              aria-label="Main navigation tabs"
              classes={{
                root: "w-full",
                tabList: s.underline.tabList,
                tab: s.underline.tab,
                tabActive: s.underline.tabActive,
                tabInactive: s.underline.tabInactive,
                tabFocus: s.focus,
                indicator: s.underline.indicator,
                panel: s.panel,
              }}
            >
              {(tab) => (
                <div className={s.content}>
                  The tablist has{" "}
                  <code
                    className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                  >
                    aria-label=&quot;Main navigation tabs&quot;
                  </code>{" "}
                  &mdash; currently on:{" "}
                  <strong className={s.contentStrong}>{tab.label}</strong>
                </div>
              )}
            </TabPanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Data Attributes"
          description="The TabPanel component applies data attributes for CSS-based styling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto">
              <table
                className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
              >
                <thead>
                  <tr
                    className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <th className="text-left py-3 pr-4 font-semibold">
                      Attribute
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold">
                      Applied To
                    </th>
                    <th className="text-left py-3 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
                >
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-state
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      tab button, panel
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      &quot;active&quot; or &quot;inactive&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-disabled
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      root, tab button
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Present when the tab or entire component is disabled
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-orientation
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      root, tab button, panel
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      &quot;horizontal&quot; or &quot;vertical&quot;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Example usage:{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[state=active]:font-bold
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[disabled]:opacity-50
              </code>
            </p>
          </DemoWrapper>
        </Section>

        <Section
          title="Force Mount (All Panels)"
          description="With forceMount, every tab panel is rendered into the DOM regardless of whether it is active. Useful when panels contain forms or other stateful content that must persist across tab switches."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              defaultValue="home"
              forceMount
              classes={{
                root: "w-full",
                tabList: s.underline.tabList,
                tab: s.underline.tab,
                tabActive: s.underline.tabActive,
                tabInactive: s.underline.tabInactive,
                tabFocus: s.focus,
                indicator: s.underline.indicator,
                panel: s.panel,
              }}
            >
              {(tab: Tab) => (
                <div className={s.content}>
                  Panel for <strong className={s.contentStrong}>{tab.label}</strong> — always mounted in DOM
                </div>
              )}
            </TabPanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<TabPanel
  tabs={tabs}
  defaultValue="home"
  forceMount
>
  {(tab) => <div>Panel for {tab.label}</div>}
</TabPanel>`}
          />
        </Section>

        <Section
          title="Keep Mounted (Lazy Persist)"
          description="With keepMounted, a tab panel stays in the DOM once it has been activated at least once. Panels that have never been visited are not rendered, saving initial mount cost while preserving state after the first visit."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <TabPanel
              tabs={basicTabs}
              defaultValue="home"
              keepMounted
              classes={{
                root: "w-full",
                tabList: s.pill.tabList,
                tab: s.pill.tab,
                tabActive: s.pill.tabActive,
                tabInactive: s.pill.tabInactive,
                tabFocus: s.focus,
                panel: s.panel,
              }}
            >
              {(tab: Tab) => (
                <div className={s.content}>
                  Panel for <strong className={s.contentStrong}>{tab.label}</strong> — stays mounted after first visit
                </div>
              )}
            </TabPanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<TabPanel
  tabs={tabs}
  defaultValue="home"
  keepMounted
>
  {(tab) => <div>Panel for {tab.label}</div>}
</TabPanel>`}
          />
        </Section>
      </div>

      <div className="space-y-8">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          API Reference
        </h2>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            TabPanel Props
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
                  <th className="text-left py-3 pr-4 font-semibold">
                    Default
                  </th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  ["tabs", "Tab[]", "required", "Array of tab configuration objects"],
                  ["id", "string", "auto-generated", "Deterministic ID for SSR/testing"],
                  ["value", "string", "-", "Controlled active tab ID"],
                  ["defaultValue", "string", "tabs[0].id", "Initial active tab for uncontrolled mode"],
                  ["onValueChange", "(tabId: string) => void", "-", "Callback when active tab changes"],
                  ["children", "ReactNode | (tab: Tab) => ReactNode", "-", "Panel content or render function receiving active tab"],
                  ['orientation', '"horizontal" | "vertical"', '"horizontal"', "Tab orientation \u2014 affects keyboard navigation axis"],
                  ['activationMode', '"automatic" | "manual"', '"automatic"', "Automatic: arrows activate. Manual: Enter/Space activates"],
                  ["loop", "boolean", "true", "Whether keyboard navigation wraps around at ends"],
                  ['iconPosition', '"left" | "right"', '"left"', "Position of icon relative to label"],
                  ["showZeroCount", "boolean", "false", "Show count badge even when value is 0"],
                  ["alwaysShowLabels", "boolean", "true", "Show labels on all tabs or only the active one"],
                  ["showTooltips", "boolean", "true", "Enable tooltips on tabs with tooltip content"],
                  ['tooltipPosition', '"top" | "bottom" | "left" | "right"', '"bottom"', "Position of tooltip relative to tab"],
                  ["tooltipOffset", "number", "4", "Distance between tooltip and tab (px)"],
                  ["disabled", "boolean", "false", "Disable all tabs globally"],
                  ["renderTab", "(props: TabRenderProps, defaultElement: ReactElement) => ReactNode", "-", "Custom render function for each tab trigger"],
                  ["aria-label", "string", '"Tabs"', "Accessible label for the tablist element"],
                  ["classes", "TabPanelClasses", "-", "Record of class names for all internal elements"],
                  ["className", "string", "-", "Root element class name (fallback for classes.root)"],
                  ["style", "CSSProperties", "-", "Root element inline styles"],
                  ["forceMount", "boolean", "false", "Mount all tab panels eagerly, regardless of active state"],
                  ["keepMounted", "boolean", "false", "Keep a tab panel mounted after it has been activated at least once"],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      {prop}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {type}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      {def}
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Tab Object Properties
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">
                    Property
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">
                    Required
                  </th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  ["id", "string", "Yes", "Unique identifier for the tab"],
                  ["label", "string", "Yes", "Tab label text"],
                  ["icon", "ReactNode", "No", "Icon element rendered in the tab (any ReactNode)"],
                  ["count", "number", "No", "Count badge value"],
                  ["disabled", "boolean", "No", "Disable this specific tab"],
                  ["tooltip", "ReactNode", "No", "Tooltip content (shown on inactive tabs when showTooltips is true)"],
                ].map(([prop, type, required, desc]) => (
                  <tr key={prop}>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      {prop}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {type}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      {required}
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            classes Record (TabPanelClasses)
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Key</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  ["root", "Root container"],
                  ["tabList", "Tab list container (role=\"tablist\")"],
                  ["tab", "Tab button base"],
                  ["tabActive", "Tab button active state"],
                  ["tabInactive", "Tab button inactive state"],
                  ["tabDisabled", "Tab button disabled state"],
                  ["tabFocus", "Tab button focus ring"],
                  ["label", "Label text base"],
                  ["labelActive / labelInactive", "Label active/inactive states"],
                  ["icon", "Icon wrapper base"],
                  ["iconActive / iconInactive", "Icon active/inactive states"],
                  ["count", "Count badge base"],
                  ["countActive / countInactive", "Count badge active/inactive states"],
                  ["indicator", "Active tab indicator element"],
                  ["panel", "Tab panel content area"],
                ].map(([key, desc]) => (
                  <tr key={key}>
                    <td className="py-3 pr-4 font-mono text-blue-500">{key}</td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
  tooltip?: ReactNode;
}

interface TabPanelClasses {
  root?: string;
  tabList?: string;
  tab?: string;
  tabActive?: string;
  tabInactive?: string;
  tabDisabled?: string;
  tabFocus?: string;
  label?: string;
  labelActive?: string;
  labelInactive?: string;
  icon?: string;
  iconActive?: string;
  iconInactive?: string;
  count?: string;
  countActive?: string;
  countInactive?: string;
  indicator?: string;
  panel?: string;
}

interface TabPanelProps {
  tabs: Tab[];
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (tabId: string) => void;
  children?: ReactNode | ((tab: Tab) => ReactNode);
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  loop?: boolean;
  iconPosition?: "left" | "right";
  showZeroCount?: boolean;
  alwaysShowLabels?: boolean;
  showTooltips?: boolean;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  tooltipOffset?: number;
  disabled?: boolean;
  renderTab?: (props: TabRenderProps, defaultElement: ReactElement) => ReactNode;
  "aria-label"?: string;
  classes?: TabPanelClasses;
  className?: string;
  style?: CSSProperties;
}`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Accessibility
        </h2>
        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Features
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              Implements WAI-ARIA{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role=&quot;tablist&quot;
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role=&quot;tab&quot;
              </code>
              , and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role=&quot;tabpanel&quot;
              </code>{" "}
              semantics
            </li>
            <li>
              All panels are rendered in the DOM (hidden with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                hidden
              </code>{" "}
              attribute) so{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-controls
              </code>{" "}
              always references valid DOM elements
            </li>
            <li>
              RTL-aware keyboard navigation: arrow key direction automatically
              reverses based on the computed CSS{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                direction
              </code>{" "}
              of the element
            </li>
            <li>
              Roving tabindex:{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                tabIndex=0
              </code>{" "}
              on tabbable tab,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                tabIndex=-1
              </code>{" "}
              on others
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-selected
              </code>{" "}
              reflects active state on each tab
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-controls
              </code>{" "}
              and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-labelledby
              </code>{" "}
              link tabs to their panels
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-disabled
              </code>{" "}
              on disabled tabs (preserving roving tabindex; not HTML disabled)
            </li>
            <li>
              When labels are hidden (alwaysShowLabels=false), inactive tabs
              receive{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>{" "}
              for screen reader accessibility
            </li>
            <li>
              Icons are wrapped with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-hidden=&quot;true&quot;
              </code>{" "}
              as they are decorative
            </li>
            <li>
              Count badges have{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>{" "}
              for screen reader announcement
            </li>
            <li>
              No focus stealing on mount &mdash; focus is managed only during
              keyboard interaction
            </li>
            <li>
              Automatic fallback to first tab when the active tab is removed
              from the tabs array
            </li>
            <li>Supports ref forwarding for programmatic focus management</li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Keyboard Navigation
          </h3>
          <ul
            className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Tab
              </kbd>{" "}
              - Move focus into/out of the tablist
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                ArrowRight
              </kbd>{" "}
              /{" "}
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                ArrowDown
              </kbd>{" "}
              - Move to next tab (RTL-aware, orientation-aware)
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                ArrowLeft
              </kbd>{" "}
              /{" "}
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                ArrowUp
              </kbd>{" "}
              - Move to previous tab (RTL-aware, orientation-aware)
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Home
              </kbd>{" "}
              - Move to first enabled tab
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                End
              </kbd>{" "}
              - Move to last enabled tab
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Enter
              </kbd>{" "}
              /{" "}
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Space
              </kbd>{" "}
              - Activate focused tab (manual mode only)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabPanelDemo;
