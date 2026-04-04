import { useState, useRef } from "react";
import { TabPanel } from "../../components/TabPanel";
import type { Tab } from "../../components/TabPanel";
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

// ─── Tab Data ────────────────────────────────────────────────────────────────

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
  {
    id: "home",
    label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    id: "users",
    label: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0648\u0646",
    icon: <UsersIcon className="w-5 h-5" />,
  },
  {
    id: "settings",
    label: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  tabs: {
    underline: {
      root: "w-full",
      tabList: `flex items-center gap-6 border-b ${dark ? "border-gray-700" : "border-gray-200"}`,
      tab: "relative px-1 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none",
      tabActive: dark ? "text-blue-400" : "text-blue-600",
      tabInactive: dark
        ? "text-gray-400 hover:text-gray-200"
        : "text-gray-500 hover:text-gray-700",
      tabFocus: `outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400 ${dark ? "focus-visible:ring-offset-gray-900" : "focus-visible:ring-blue-500"}`,
      indicator: `absolute bottom-0 left-0 right-0 h-0.5 ${dark ? "bg-blue-400" : "bg-blue-600"}`,
      panel: "p-4",
    },
    pill: {
      root: "w-full",
      tabList: `inline-flex items-center gap-1 p-1 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-100"}`,
      tab: "px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
      tabActive: dark
        ? "bg-gray-700 text-white shadow-sm"
        : "bg-white text-gray-900 shadow-sm",
      tabInactive: dark
        ? "text-gray-400 hover:text-gray-200"
        : "text-gray-600 hover:text-gray-900",
      tabFocus: `outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400 ${dark ? "focus-visible:ring-offset-gray-900" : "focus-visible:ring-blue-500"}`,
      panel: "p-4 mt-2",
    },
    icon: {
      root: "w-full",
      tabList: `flex items-center gap-1 border-b ${dark ? "border-gray-700" : "border-gray-200"}`,
      tab: "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none",
      tabActive: dark ? "text-blue-400" : "text-blue-600",
      tabInactive: dark
        ? "text-gray-400 hover:text-gray-200"
        : "text-gray-500 hover:text-gray-700",
      tabDisabled: dark
        ? "opacity-40 cursor-not-allowed hover:text-gray-400"
        : "opacity-40 cursor-not-allowed hover:text-gray-500",
      tabFocus: `outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400 ${dark ? "focus-visible:ring-offset-gray-900" : "focus-visible:ring-blue-500"}`,
      iconActive: dark ? "text-blue-400" : "text-blue-600",
      iconInactive: dark ? "text-gray-500" : "text-gray-400",
      count: "px-2 py-0.5 text-xs font-semibold rounded-full",
      countActive: dark
        ? "bg-blue-900 text-blue-300"
        : "bg-blue-100 text-blue-600",
      countInactive: dark
        ? "bg-gray-700 text-gray-400"
        : "bg-gray-100 text-gray-500",
      indicator: `absolute bottom-0 left-0 right-0 h-0.5 ${dark ? "bg-blue-400" : "bg-blue-600"}`,
      panel: "p-4",
    },
  },
  content: `text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`,
  contentStrong: `font-medium ${dark ? "text-gray-200" : "text-gray-700"}`,
  contentTitle: `text-base font-semibold mb-1 ${dark ? "text-white" : "text-gray-900"}`,
  contentCard: `rounded-lg p-4 ${dark ? "bg-white/[0.02] border border-white/[0.04]" : "bg-gray-50 border border-gray-100"}`,
  stat: `text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`,
  statLabel: `text-xs ${dark ? "text-gray-500" : "text-gray-400"}`,
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const TabPanelDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // Each demo section has its own independent state
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
            TabPanel
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A tabbed interface component with full keyboard navigation, RTL
            support, accessibility, roving tabindex, and extensive styling
            customization. Supports icons as ReactNode, count badges, tooltips,
            vertical orientation, manual activation, dynamic tabs with automatic
            fallback, and both controlled and uncontrolled modes.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { TabPanel } from "@chumlab/ui/tab-panel";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Minimal tab panel with simple text labels."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            defaultValue="home"
            classes={c.tabs.underline}
          />
        </DemoWrapper>
      </Section>

      {/* ─── 1. Underlined Style ─────────────────────────────────────────── */}
      <Section
        title="Underlined Style"
        description="Classic underline tab style with an active indicator bar."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            value={underlinedTab}
            onValueChange={setUnderlinedTab}
            classes={c.tabs.underline}
          >
            {underlinedTab === "home" && (
              <div className="space-y-3">
                <p className={c.contentTitle}>Welcome back</p>
                <p className={c.content}>Here's what's happening with your projects today. You have 3 tasks due and 2 messages waiting.</p>
                <div className="flex gap-4 mt-2">
                  {[["12", "Active projects"], ["3", "Due today"], ["98%", "Uptime"]].map(([v, l]) => (
                    <div key={l}><div className={c.stat}>{v}</div><div className={c.statLabel}>{l}</div></div>
                  ))}
                </div>
              </div>
            )}
            {underlinedTab === "profile" && (
              <div className="space-y-2">
                <p className={c.contentTitle}>Profile settings</p>
                <p className={c.content}>Manage your account details, notification preferences, and connected integrations.</p>
              </div>
            )}
            {underlinedTab === "settings" && (
              <div className="space-y-2">
                <p className={c.contentTitle}>General settings</p>
                <p className={c.content}>Configure language, timezone, theme, and default workspace options.</p>
              </div>
            )}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 2. Pill Style ───────────────────────────────────────────────── */}
      <Section
        title="Pill Style"
        description="Contained pill-shaped tab style with background highlight on active tab."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            value={pillTab}
            onValueChange={setPillTab}
            classes={c.tabs.pill}
          >
            <div className={c.content}>
              {pillTab === "home" && "Your dashboard overview with key metrics, recent activity, and quick actions."}
              {pillTab === "profile" && "Edit your display name, avatar, bio, and social links."}
              {pillTab === "settings" && "Theme preferences, notification channels, and API key management."}
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 3. Boxed Style ──────────────────────────────────────────────── */}
      <Section
        title="Boxed Style"
        description="Browser-style boxed tabs with bordered active state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            value={boxedTab}
            onValueChange={setBoxedTab}
            classes={{
              root: "w-full",
              tabList: `flex items-center border-b ${dark ? "border-gray-700" : "border-gray-200"}`,
              tab: "relative px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border border-transparent border-b-0 -mb-px",
              tabActive: dark
                ? "bg-gray-800 text-blue-400 border-gray-700 border-b-gray-800 rounded-t-lg"
                : "bg-white text-blue-600 border-gray-200 border-b-white rounded-t-lg",
              tabInactive: dark
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              tabFocus: c.tabs.underline.tabFocus,
              panel: `p-4 border border-t-0 rounded-b-lg ${dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`,
            }}
          >
            <div className={c.content}>
              {boxedTab === "home" && "Boxed tabs work well for document-style interfaces where the active panel needs a clear visual boundary."}
              {boxedTab === "profile" && "User profile information, team membership, and activity history."}
              {boxedTab === "settings" && "Workspace configuration, billing, and access control settings."}
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 4. With Icons (Left) ────────────────────────────────────────── */}
      <Section
        title="With Icons (Left)"
        description="Tabs with leading icon components using iconPosition='left' (default)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={iconLeftTab}
            onValueChange={setIconLeftTab}
            iconPosition="left"
            classes={c.tabs.icon}
          >
            {iconLeftTab === "home" && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[["Revenue", "$24.5k", "+12%"], ["Users", "1,429", "+8%"], ["Orders", "892", "+23%"]].map(([label, value, change]) => (
                    <div key={label} className={c.contentCard}>
                      <div className={c.statLabel}>{label}</div>
                      <div className={c.stat}>{value}</div>
                      <div className={`text-xs font-medium ${dark ? "text-emerald-400" : "text-emerald-600"}`}>{change}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {iconLeftTab === "users" && <div className={c.content}>Team members, roles, and invitation management.</div>}
            {iconLeftTab === "settings" && <div className={c.content}>Workspace preferences, integrations, and security.</div>}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 5. With Icons (Right) ───────────────────────────────────────── */}
      <Section
        title="With Icons (Right)"
        description="Tabs with trailing icon components using iconPosition='right'."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={iconRightTab}
            onValueChange={setIconRightTab}
            iconPosition="right"
            classes={{
              ...c.tabs.pill,
              tab: "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
              iconActive: c.tabs.icon.iconActive,
              iconInactive: c.tabs.icon.iconInactive,
            }}
          >
            <div className={c.content}>
              {iconRightTab === "home" && "Overview dashboard with key performance indicators and recent activity."}
              {iconRightTab === "users" && "Active users, pending invitations, and role assignments."}
              {iconRightTab === "settings" && "Application configuration, webhooks, and API tokens."}
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 6. Icon Only (Labels Hidden) ────────────────────────────────── */}
      <Section
        title="Icon Only (Labels Hidden)"
        description="Set alwaysShowLabels={false} to hide labels on inactive tabs. Only the active tab shows its label. Inactive tabs get an aria-label for screen readers."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={iconOnlyTab}
            onValueChange={setIconOnlyTab}
            alwaysShowLabels={false}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              Only the active tab shows its label. Icons always visible.
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 7. With Count Badges (Hide Zero) ────────────────────────────── */}
      <Section
        title="With Count Badges (Hide Zero)"
        description="Display count badges on tabs. Tabs with count 0 hide the badge by default."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithCounts}
            value={countTab}
            onValueChange={setCountTab}
            showZeroCount={false}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              {countTab === "inbox" && "12 unread messages — 3 flagged as urgent. Settings badge is hidden since its count is 0."}
              {countTab === "users" && "5 team members online. Manage roles and permissions."}
              {countTab === "settings" && "No pending configuration changes."}
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 8. With Count Badges (Show Zero) ────────────────────────────── */}
      <Section
        title="With Count Badges (Show Zero)"
        description="Set showZeroCount={true} to always display the badge, even for count 0."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithCounts}
            value={zeroCountTab}
            onValueChange={setZeroCountTab}
            showZeroCount={true}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              {zeroCountTab === "inbox" && "All messages displayed. Badge counts remain visible even at zero."}
              {zeroCountTab === "users" && "Team member directory with activity status."}
              {zeroCountTab === "settings" && "Zero pending changes — the 0 badge is visible to show the count explicitly."}
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 9. With Tooltips (Bottom) ───────────────────────────────────── */}
      <Section
        title="With Tooltips (Bottom)"
        description="Hover over inactive tabs to see tooltips below. Active tab tooltip is hidden."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithTooltips}
            value={tooltipTab}
            onValueChange={setTooltipTab}
            showTooltips={true}
            tooltipPosition="bottom"
            tooltipOffset={4}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              Currently viewing:{" "}
              <strong className={c.contentStrong}>{tooltipTab}</strong>
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 10. With Tooltips (Top) ─────────────────────────────────────── */}
      <Section
        title="With Tooltips (Top)"
        description="Hover over inactive tabs to see tooltips above."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithTooltips}
            value={tooltipTopTab}
            onValueChange={setTooltipTopTab}
            showTooltips={true}
            tooltipPosition="top"
            tooltipOffset={4}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              Currently viewing:{" "}
              <strong className={c.contentStrong}>{tooltipTopTab}</strong>
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 11. Disabled Tab ────────────────────────────────────────────── */}
      <Section
        title="Disabled Tab"
        description="Individual tabs can be disabled via the tab object's disabled property. Disabled tabs are skipped during keyboard navigation."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithDisabled}
            value={disabledTab}
            onValueChange={setDisabledTab}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              The &quot;Users&quot; tab is disabled and cannot be selected
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 12. All Tabs Disabled ───────────────────────────────────────── */}
      <Section
        title="All Tabs Disabled"
        description="Set the top-level disabled prop to disable all tabs at once."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={allDisabledTab}
            onValueChange={setAllDisabledTab}
            disabled={true}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              All tabs are disabled via the top-level{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                disabled
              </code>{" "}
              prop
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 13. Gradient Style ──────────────────────────────────────────── */}
      <Section
        title="Gradient Style"
        description="Custom styled tabs with gradient background demonstrating full visual customization."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={gradientTab}
            onValueChange={setGradientTab}
            classes={{
              root: `w-full rounded-xl p-3 ${dark ? "bg-linear-to-r from-purple-950 to-pink-950" : "bg-linear-to-r from-purple-50 to-pink-50"}`,
              tabList: `inline-flex items-center gap-2 p-1.5 backdrop-blur rounded-xl ${dark ? "bg-gray-800/60" : "bg-white/60"}`,
              tab: "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-lg",
              tabFocus: `outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-purple-500 ${dark ? "focus-visible:ring-offset-gray-900" : ""}`,
              tabActive: dark
                ? "bg-gray-800 text-purple-300 shadow-md"
                : "bg-white text-purple-600 shadow-md",
              tabInactive: dark
                ? "text-gray-400 hover:text-purple-300 hover:bg-gray-800/50"
                : "text-gray-500 hover:text-purple-500 hover:bg-white/50",
              iconActive: dark ? "text-purple-300" : "text-purple-600",
              iconInactive: dark ? "text-gray-500" : "text-gray-400",
              panel: `p-4 mt-3 rounded-xl shadow-sm ${dark ? "bg-gray-800" : "bg-white"}`,
            }}
          >
            <div className={c.content}>
              Custom styled tabs with gradient background (notice the purple
              focus ring)
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 14. Custom Focus Styles ─────────────────────────────────────── */}
      <Section
        title="Custom Focus Styles"
        description="Use classes.tabFocus to customize the keyboard focus ring. Click a tab then use arrow keys to see the focus ring."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-6">
            <div>
              <p className={`text-xs mb-2 ${c.label}`}>
                Green dashed focus ring:
              </p>
              <TabPanel
                tabs={tabsWithIcons}
                value={customFocusTab}
                onValueChange={setCustomFocusTab}
                classes={{
                  ...c.tabs.icon,
                  tabActive: dark ? "text-green-400" : "text-green-600",
                  tabFocus: `outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-dashed ${dark ? "focus-visible:ring-offset-gray-800" : ""}`,
                  iconActive: dark ? "text-green-400" : "text-green-600",
                  indicator: `absolute bottom-0 left-0 right-0 h-0.5 ${dark ? "bg-green-400" : "bg-green-600"}`,
                }}
              >
                <div className={c.content}>Custom green dashed focus ring</div>
              </TabPanel>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 15. Keyboard Navigation ─────────────────────────────────────── */}
      <Section
        title="Keyboard Navigation"
        description="Full WAI-ARIA keyboard support with RTL-aware arrow key direction. Click a tab and use arrow keys to navigate."
        isDarkMode={dark}
      >
        <div className={c.note}>
          <p className="font-semibold mb-2">Keyboard shortcuts:</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <kbd className={c.kbd}>&rarr;</kbd>
              <kbd className={c.kbd}>&darr;</kbd>
              <span>Move to next tab (reversed in RTL)</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={c.kbd}>&larr;</kbd>
              <kbd className={c.kbd}>&uarr;</kbd>
              <span>Move to previous tab (reversed in RTL)</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={c.kbd}>Home</kbd>
              <span>Move to first tab</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={c.kbd}>End</kbd>
              <span>Move to last tab</span>
            </div>
          </div>
        </div>
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={keyboardTab}
            onValueChange={setKeyboardTab}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              Click on a tab and use keyboard to navigate
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 16. RTL Support ─────────────────────────────────────────────── */}
      <Section
        title="RTL Support"
        description="Arrow key direction automatically reverses in right-to-left contexts. The component detects RTL via computed CSS direction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div dir="rtl" className="w-full">
            <div
              className={`mb-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              This section has{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                dir=&quot;rtl&quot;
              </code>{" "}
              &mdash; ArrowRight moves backward, ArrowLeft moves forward.
            </div>
            <TabPanel
              tabs={rtlTabs}
              value={rtlTab}
              onValueChange={setRtlTab}
              classes={c.tabs.icon}
            >
              {(tab) => (
                <div className={c.content}>
                  <strong className={c.contentStrong}>{tab.label}</strong>{" "}
                  &mdash; {tab.id}
                </div>
              )}
            </TabPanel>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 17. Dynamic Tabs (Add / Remove) ─────────────────────────────── */}
      <Section
        title="Dynamic Tabs (Add / Remove)"
        description="Tabs can be dynamically added and removed. When the active tab is removed, the component automatically falls back to the first available tab."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addDynamicTab}
                className={c.btnPrimary}
              >
                <span className="inline-flex items-center gap-1.5">
                  <PlusIcon className="w-4 h-4" />
                  Add Tab
                </span>
              </button>
              <span
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                {dynamicTabs.length} tab{dynamicTabs.length !== 1 && "s"}
              </span>
            </div>
            {dynamicTabs.length > 0 ? (
              <TabPanel
                tabs={dynamicTabs}
                value={dynamicTab}
                onValueChange={setDynamicTab}
                classes={c.tabs.icon}
              >
                {(tab) => (
                  <div className="flex items-center justify-between">
                    <span className={c.content}>
                      Active:{" "}
                      <strong className={c.contentStrong}>{tab.label}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDynamicTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${dark ? "bg-red-900/50 hover:bg-red-800/60 text-red-300" : "bg-red-50 hover:bg-red-100 text-red-600"}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Remove this tab
                    </button>
                  </div>
                )}
              </TabPanel>
            ) : (
              <div
                className={`p-8 text-center rounded-lg border-2 border-dashed ${dark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}
              >
                No tabs. Click &quot;Add Tab&quot; to create one.
              </div>
            )}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── 18. Uncontrolled (defaultValue) ─────────────────────────────── */}
      <Section
        title="Uncontrolled (defaultValue)"
        description="Use defaultValue for uncontrolled behavior -- no external state management needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            defaultValue="profile"
            classes={c.tabs.underline}
          >
            {(tab) => (
              <div className={c.content}>
                Uncontrolled tab:{" "}
                <strong className={c.contentStrong}>{tab.label}</strong>{" "}
                (started at Profile)
              </div>
            )}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 19. Vertical Orientation ────────────────────────────────────── */}
      <Section
        title="Vertical Orientation"
        description="Set orientation='vertical' -- keyboard navigation switches to ArrowUp/ArrowDown."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={verticalTab}
            onValueChange={setVerticalTab}
            orientation="vertical"
            classes={{
              root: "flex gap-0 w-full",
              tabList: `flex flex-col gap-1 pr-0 min-w-[160px] border-r ${dark ? "border-gray-700" : "border-gray-200"}`,
              tab: "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none text-left w-full",
              tabActive: dark
                ? "text-blue-400 bg-blue-900/30"
                : "text-blue-600 bg-blue-50",
              tabInactive: dark
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              tabFocus: c.tabs.underline.tabFocus,
              iconActive: c.tabs.icon.iconActive,
              iconInactive: c.tabs.icon.iconInactive,
              panel: "flex-1 p-4",
            }}
          >
            <div className={c.content}>
              Vertical tab content for{" "}
              <strong className={c.contentStrong}>{verticalTab}</strong>
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 20. Manual Activation Mode ──────────────────────────────────── */}
      <Section
        title="Manual Activation Mode"
        description="With activationMode='manual', arrow keys move focus between tabs but do not activate them. Press Enter or Space to activate."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={manualTab}
            onValueChange={setManualTab}
            activationMode="manual"
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              Active tab:{" "}
              <strong className={c.contentStrong}>{manualTab}</strong> (focus
              may differ from active)
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 21. No Loop ─────────────────────────────────────────────────── */}
      <Section
        title="No Loop (loop={false})"
        description="Set loop={false} to prevent keyboard navigation from wrapping around at the ends."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={noLoopTab}
            onValueChange={setNoLoopTab}
            loop={false}
            classes={c.tabs.icon}
          >
            <div className={c.content}>
              Arrow keys stop at first/last tab instead of wrapping
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 22. Render Function Children ────────────────────────────────── */}
      <Section
        title="Render Function Children"
        description="Pass a function as children for dynamic per-tab content rendering. The function receives the active tab object."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={renderFnTab}
            onValueChange={setRenderFnTab}
            classes={{
              ...c.tabs.pill,
              tab: "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
              iconActive: dark ? "text-white" : "text-gray-900",
              iconInactive: c.tabs.icon.iconInactive,
            }}
          >
            {(tab) => (
              <div className={c.content}>
                <strong className={c.contentStrong}>{tab.label}</strong> &mdash;
                rendered via{" "}
                <code
                  className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  children(tab)
                </code>
              </div>
            )}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 23. Custom Tab Rendering (renderTab) ────────────────────────── */}
      <Section
        title="Custom Tab Rendering (renderTab)"
        description="Use the renderTab prop to wrap or customize tab triggers. Receives render props and the default element."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithIcons}
            value={renderTabTab}
            onValueChange={setRenderTabTab}
            classes={{
              ...c.tabs.pill,
              tab: "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-md",
              iconActive: dark ? "text-white" : "text-gray-900",
              iconInactive: c.tabs.icon.iconInactive,
            }}
            renderTab={(props, defaultElement) => (
              <div key={props.tab.id} className="relative">
                {defaultElement}
                {props.tab.count != null && props.tab.count > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center ${dark ? "bg-red-400" : "bg-red-500"}`}>
                    {props.tab.count}
                  </span>
                )}
              </div>
            )}
          >
            <div className={c.content}>
              Tab content for{" "}
              <strong className={c.contentStrong}>{renderTabTab}</strong>
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 24. classes Record ───────────────────────────────────────────── */}
      <Section
        title="classes Record"
        description="All styling is done via the classes record for a clean, consolidated API."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            value={classesTab}
            onValueChange={setClassNamesTab}
            classes={c.tabs.underline}
          >
            <div className={c.content}>
              All styles via{" "}
              <strong className={c.contentStrong}>classes</strong> record for{" "}
              <strong className={c.contentStrong}>{classesTab}</strong>
            </div>
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 25. Custom ID ───────────────────────────────────────────────── */}
      <Section
        title="Custom ID"
        description="Use the id prop for deterministic IDs useful for SSR and testing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            id="my-tabs"
            value={customIdTab}
            onValueChange={setCustomIdTab}
            classes={c.tabs.underline}
          >
            <div className={c.content}>
              Tab IDs are{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                my-tabs-tab-home
              </code>
              ,{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                my-tabs-panel-home
              </code>
              , etc.
            </div>
          </TabPanel>
        </DemoWrapper>
        <div className={c.note}>
          <strong>Note:</strong> The ID is auto-generated via{" "}
          <code
            className={`px-1 py-0.5 border rounded text-xs font-mono ${dark ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
          >
            useId()
          </code>{" "}
          if not provided. Use the{" "}
          <code
            className={`px-1 py-0.5 border rounded text-xs font-mono ${dark ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
          >
            id
          </code>{" "}
          prop for deterministic SSR/testing IDs.
        </div>
      </Section>

      {/* ─── 26. Custom Aria Label ───────────────────────────────────────── */}
      <Section
        title="Custom Aria Label"
        description="Use aria-label to provide a meaningful accessible name for the tablist."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            defaultValue="home"
            aria-label="Main navigation tabs"
            classes={c.tabs.underline}
          >
            {(tab) => (
              <div className={c.content}>
                The tablist has{" "}
                <code
                  className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  aria-label=&quot;Main navigation tabs&quot;
                </code>{" "}
                &mdash; currently on:{" "}
                <strong className={c.contentStrong}>{tab.label}</strong>
              </div>
            )}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 27. Force Mount (All Panels) ────────────────────────────────── */}
      <Section
        title="Force Mount (All Panels)"
        description="With forceMount, every tab panel is rendered into the DOM regardless of whether it is active. Useful when panels contain forms or other stateful content that must persist across tab switches."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            defaultValue="home"
            forceMount
            classes={c.tabs.underline}
          >
            {(tab: Tab) => (
              <div className={c.content}>
                Panel for{" "}
                <strong className={c.contentStrong}>{tab.label}</strong> —
                always mounted in DOM
              </div>
            )}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 28. Keep Mounted (Lazy Persist) ─────────────────────────────── */}
      <Section
        title="Keep Mounted (Lazy Persist)"
        description="With keepMounted, a tab panel stays in the DOM once it has been activated at least once. Panels that have never been visited are not rendered, saving initial mount cost while preserving state after the first visit."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={basicTabs}
            defaultValue="home"
            keepMounted
            classes={c.tabs.pill}
          >
            {(tab: Tab) => (
              <div className={c.content}>
                Panel for{" "}
                <strong className={c.contentStrong}>{tab.label}</strong> — stays
                mounted after first visit
              </div>
            )}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── 29. Data Attributes ─────────────────────────────────────────── */}
      <Section
        title="Data Attributes Demo"
        description="The TabPanel component applies data attributes for CSS-based styling. Use data-[state=active], data-[disabled], etc."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <TabPanel
            tabs={tabsWithDisabled}
            defaultValue="home"
            classes={c.tabs.icon}
          >
            {(tab) => (
              <div className={c.content}>
                Data attributes on tab buttons and panels for{" "}
                <strong className={c.contentStrong}>{tab.label}</strong>
              </div>
            )}
          </TabPanel>
        </DemoWrapper>
      </Section>

      {/* ─── Props Table ─────────────────────────────────────────────────── */}
      <Section title="TabPanel Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="tabs"
              type="Tab[]"
              defaultVal="required"
              description="Array of tab configuration objects"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              defaultVal="auto-generated"
              description="Deterministic ID for SSR/testing"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="string"
              description="Controlled active tab ID"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="string"
              defaultVal="tabs[0].id"
              description="Initial active tab for uncontrolled mode"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(tabId: string) => void"
              description="Callback when active tab changes"
              isDarkMode={dark}
            />
            <PropRow
              name="children"
              type="ReactNode | (tab: Tab) => ReactNode"
              description="Panel content or render function receiving active tab"
              isDarkMode={dark}
            />
            <PropRow
              name="orientation"
              type={'"horizontal" | "vertical"'}
              defaultVal='"horizontal"'
              description="Tab orientation -- affects keyboard navigation axis"
              isDarkMode={dark}
            />
            <PropRow
              name="activationMode"
              type={'"automatic" | "manual"'}
              defaultVal='"automatic"'
              description="Automatic: arrows activate. Manual: Enter/Space activates"
              isDarkMode={dark}
            />
            <PropRow
              name="loop"
              type="boolean"
              defaultVal="true"
              description="Whether keyboard navigation wraps around at ends"
              isDarkMode={dark}
            />
            <PropRow
              name="iconPosition"
              type={'"left" | "right"'}
              defaultVal='"left"'
              description="Position of icon relative to label"
              isDarkMode={dark}
            />
            <PropRow
              name="showZeroCount"
              type="boolean"
              defaultVal="false"
              description="Show count badge even when value is 0"
              isDarkMode={dark}
            />
            <PropRow
              name="alwaysShowLabels"
              type="boolean"
              defaultVal="true"
              description="Show labels on all tabs or only the active one"
              isDarkMode={dark}
            />
            <PropRow
              name="showTooltips"
              type="boolean"
              defaultVal="true"
              description="Enable tooltips on tabs with tooltip content"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltipPosition"
              type={'"top" | "bottom" | "left" | "right"'}
              defaultVal='"bottom"'
              description="Position of tooltip relative to tab"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltipOffset"
              type="number"
              defaultVal="4"
              description="Distance between tooltip and tab (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable all tabs globally"
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
              name="renderTab"
              type="(props: TabRenderProps, defaultElement: ReactElement) => ReactNode"
              description="Custom render function for each tab trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-label"
              type="string"
              defaultVal='"Tabs"'
              description="Accessible label for the tablist element"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="TabPanelClasses"
              description="Record of class names for all internal elements"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="Root element class name (fallback for classes.root)"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Root element inline styles"
              isDarkMode={dark}
            />
            <PropRow
              name="forceMount"
              type="boolean"
              defaultVal="false"
              description="Mount all tab panels eagerly, regardless of active state"
              isDarkMode={dark}
            />
            <PropRow
              name="keepMounted"
              type="boolean"
              defaultVal="false"
              description="Keep a tab panel mounted after it has been activated at least once"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Tab Object Props ────────────────────────────────────────────── */}
      <Section title="Tab Object Properties" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="id"
              type="string"
              defaultVal="required"
              description="Unique identifier for the tab"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              defaultVal="required"
              description="Tab label text"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="ReactNode"
              description="Icon element rendered in the tab (any ReactNode)"
              isDarkMode={dark}
            />
            <PropRow
              name="count"
              type="number"
              description="Count badge value"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              description="Disable this specific tab"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltip"
              type="ReactNode"
              description="Tooltip content (shown on inactive tabs when showTooltips is true)"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── TabPanelClasses Slots ───────────────────────────────────────── */}
      <Section title="TabPanelClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root container"
              isDarkMode={dark}
            />
            <PropRow
              name="tabList"
              type="string"
              description='Tab list container (role="tablist")'
              isDarkMode={dark}
            />
            <PropRow
              name="tab"
              type="string"
              description="Tab button base"
              isDarkMode={dark}
            />
            <PropRow
              name="tabActive"
              type="string"
              description="Tab button active state"
              isDarkMode={dark}
            />
            <PropRow
              name="tabInactive"
              type="string"
              description="Tab button inactive state"
              isDarkMode={dark}
            />
            <PropRow
              name="tabDisabled"
              type="string"
              description="Tab button disabled state"
              isDarkMode={dark}
            />
            <PropRow
              name="tabFocus"
              type="string"
              description="Tab button focus ring"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Label text base"
              isDarkMode={dark}
            />
            <PropRow
              name="labelActive"
              type="string"
              description="Label active state"
              isDarkMode={dark}
            />
            <PropRow
              name="labelInactive"
              type="string"
              description="Label inactive state"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="string"
              description="Icon wrapper base"
              isDarkMode={dark}
            />
            <PropRow
              name="iconActive"
              type="string"
              description="Icon active state"
              isDarkMode={dark}
            />
            <PropRow
              name="iconInactive"
              type="string"
              description="Icon inactive state"
              isDarkMode={dark}
            />
            <PropRow
              name="count"
              type="string"
              description="Count badge base"
              isDarkMode={dark}
            />
            <PropRow
              name="countActive"
              type="string"
              description="Count badge active state"
              isDarkMode={dark}
            />
            <PropRow
              name="countInactive"
              type="string"
              description="Count badge inactive state"
              isDarkMode={dark}
            />
            <PropRow
              name="indicator"
              type="string"
              description="Active tab indicator element"
              isDarkMode={dark}
            />
            <PropRow
              name="panel"
              type="string"
              description="Tab panel content area"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ─────────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-state"
              type="tab button, panel"
              description={'"active" or "inactive"'}
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="root, tab button"
              description="Present when the tab or entire component is disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-orientation"
              type="root, tab button, panel"
              description={'"horizontal" or "vertical"'}
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ───────────────────────────────────────────────── */}
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
              'Implements WAI-ARIA role="tablist", role="tab", and role="tabpanel" semantics',
              "All panels rendered in the DOM (hidden attribute) so aria-controls always references valid DOM elements",
              "RTL-aware keyboard navigation: arrow key direction reverses based on computed CSS direction",
              "Roving tabindex: tabIndex=0 on tabbable tab, tabIndex=-1 on others",
              "aria-selected reflects active state on each tab",
              "aria-controls and aria-labelledby link tabs to their panels",
              "aria-disabled on disabled tabs (preserving roving tabindex; not HTML disabled)",
              "When labels are hidden (alwaysShowLabels=false), inactive tabs receive aria-label for screen reader accessibility",
              "Icons wrapped with aria-hidden=\"true\" as they are decorative",
              "Count badges have aria-label for screen reader announcement",
              "No focus stealing on mount -- focus managed only during keyboard interaction",
              "Automatic fallback to first tab when the active tab is removed from the tabs array",
              "Supports ref forwarding for programmatic focus management",
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
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              ["Tab", "Move focus into/out of the tablist"],
              ["\u2192 / \u2193", "Move to next tab (RTL-aware, orientation-aware)"],
              ["\u2190 / \u2191", "Move to previous tab (RTL-aware, orientation-aware)"],
              ["Home", "Move to first enabled tab"],
              ["End", "Move to last enabled tab"],
              ["Enter / Space", "Activate focused tab (manual mode only)"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` for controlled tabs, or `defaultValue` for uncontrolled. Match `activationMode` to whether focus moves or clicks activate panels."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Removing a tab while it is active requires moving `value` to a valid id.",
          "Dynamic tab counts affect roving tabindex—retest after async loads.",
          "Nested tab sets should have distinct labels and DOM structure.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `aria-label` or `aria-labelledby` on the tab list when needed.",
          "Keep tab ids stable across renders for focus and announcements.",
          "Use manual activation when panels contain heavy content or forms.",
        ]}
        donts={[
          "Do not nest essential page navigation only inside tab panels.",
          "Do not duplicate the same `id` across tabs.",
          "Do not hide focus outlines on tab triggers.",
        ]}
      />
    </div>
  );
};

export default TabPanelDemo;
