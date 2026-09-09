"use client";

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
  const [gradientTab, setGradientTab] = useState("home");
  return (
    <TabPanel
      tabs={tabsWithIcons}
      value={gradientTab}
      onValueChange={setGradientTab}
      classes={
        {
          root: "w-full rounded-cl-lg p-3 bg-linear-to-r from-cl-accent/10 to-cl-accent/10 dark:bg-linear-to-r dark:from-cl-accent/20 dark:to-cl-accent/20",
          list: "inline-flex items-center gap-2 p-1.5 backdrop-blur rounded-cl-lg bg-cl-text/60 dark:bg-cl-bg-elevated/60",
          item: "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-cl-md",
          content: "p-4 mt-3 rounded-cl-lg shadow-sm bg-cl-bg-elevated"
        }
      }
    >
      <div className="text-sm leading-relaxed text-cl-text-secondary">
        Custom styled tabs with gradient background (notice the purple focus ring)
      </div>
    </TabPanel>
  );
}
