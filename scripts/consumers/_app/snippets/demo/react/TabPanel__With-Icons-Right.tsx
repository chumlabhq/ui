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

const tabsWithIcons: Tab[] = [
  { id: "home", label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
  { id: "users", label: "Users", icon: <UsersIcon className="w-5 h-5" /> },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

export default function TabPanelExample() {
  const [iconRightTab, setIconRightTab] = useState("home");
  return (
    <TabPanel
      tabs={tabsWithIcons}
      value={iconRightTab}
      onValueChange={setIconRightTab}
      iconPosition="right"
      classes={
        {
                  ...{
          root: "w-full",
          // Track uses a subtle wash (instead of bg-cl-bg-elevated) so the
          // active pill — which now uses bg-cl-bg-elevated in the dark theme —
          // has a distinct surface to stand out against.
          list: "inline-flex items-center gap-1 p-1 rounded-cl-md bg-cl-bg-hover",
          item: "px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-cl-md outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg data-[state=active]:bg-cl-bg-panel data-[state=active]:text-cl-text data-[state=active]:shadow-sm data-[state=inactive]:text-cl-text-secondary data-[state=inactive]:hover:text-cl-text",
          content: "p-4 mt-2"
        },
                  item: "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-cl-md data-[state=active]:bg-cl-bg-panel data-[state=active]:text-cl-text data-[state=active]:shadow-sm data-[state=inactive]:text-cl-text-secondary data-[state=inactive]:hover:text-cl-text"
                }
      }
    >
      <div className="text-sm leading-relaxed text-cl-text-secondary">
        {
          iconRightTab === "home" &&
          "Overview dashboard with key performance indicators and recent activity."
        }
        {
          iconRightTab === "users" &&
          "Active users, pending invitations, and role assignments."
        }
        {
          iconRightTab === "settings" &&
          "Application configuration, webhooks, and API tokens."
        }
      </div>
    </TabPanel>
  );
}
