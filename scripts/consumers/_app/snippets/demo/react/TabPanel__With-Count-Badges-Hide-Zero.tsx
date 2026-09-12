import { useState } from "react";
import { Tab, TabPanel } from "@chumlab/ui/tab-panel";

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

export default function TabPanelExample() {
  const [countTab, setCountTab] = useState("inbox");
  return (
    <TabPanel
      tabs={tabsWithCounts}
      value={countTab}
      onValueChange={setCountTab}
      showZeroCount={false}
      classes={
        {
          root: "w-full",
          list: "flex items-center gap-1 border-b border-cl-border",
          item: "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg data-[state=active]:text-cl-accent data-[state=inactive]:text-cl-text-secondary data-[state=inactive]:hover:text-cl-text data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
          itemIcon: "data-[state=active]:text-cl-accent data-[state=inactive]:text-cl-text-secondary",
          /* The inactive fill is a wash, not a surface token: in the dark theme
             `--cl-bg-elevated` and `--cl-bg-hover` are both #0a0d12, the same
             colour as the card these tabs sit on, so either one rendered the
             badge as a bare number. Same idiom as the pill track above. */
          count: "px-2 py-0.5 text-xs font-semibold rounded-full data-[state=active]:bg-cl-accent/10 dark:data-[state=active]:bg-cl-accent/20 data-[state=active]:text-cl-text data-[state=inactive]:bg-black/[0.06] dark:data-[state=inactive]:bg-white/[0.08] data-[state=inactive]:text-cl-text-secondary",
          indicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-cl-accent dark:bg-cl-accent/90",
          content: "p-4"
        }
      }
    >
      <div className="text-sm leading-relaxed text-cl-text-secondary">
        {
          countTab === "inbox" &&
          "12 unread messages — 3 flagged as urgent. Settings badge is hidden since its count is 0."
        }
        {
          countTab === "users" &&
          "5 team members online. Manage roles and permissions."
        }
        {countTab === "settings" && "No pending configuration changes."}
      </div>
    </TabPanel>
  );
}
