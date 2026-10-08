"use client";

import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
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

export default function TabPanelExample() {
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
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={addDynamicTab}
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" />
            Add Tab
          </span>
        </Button>
        <span className="text-sm text-cl-text-secondary">
          {dynamicTabs.length}
          tab
          {dynamicTabs.length !== 1 && "s"}
        </span>
      </div>
      {
        dynamicTabs.length > 0 ? (
          <TabPanel
            tabs={dynamicTabs}
            value={dynamicTab}
            onValueChange={setDynamicTab}
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
                count: "px-2 py-0.5 text-xs font-semibold rounded-full data-[state=active]:bg-cl-accent-surface data-[state=active]:text-cl-text data-[state=inactive]:bg-cl-bg-hover data-[state=inactive]:text-cl-text-secondary",
                indicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-cl-accent",
                content: "p-4"
              }
            }
          >
            {
              (tab) => (
                <div className="flex items-center justify-between">
                  <span className={"text-sm leading-relaxed text-cl-text-secondary"}>
                    Active:{" "}
                    <strong className={"font-medium text-cl-text"}>{tab.label}</strong>
                  </span>
                  <Button
                    size="md"
                    onClick={() => removeDynamicTab(tab.id)}
                    startIcon={<TrashIcon className="w-4 h-4" />}
                    className="rounded-cl-md bg-cl-error/15 hover:bg-cl-error/25 text-cl-text border border-cl-error/30"
                  >
                    Remove this tab
                  </Button>
                </div>
              )
            }
          </TabPanel>
        ) : (
          <div
            className="p-8 text-center rounded-cl-md border-2 border-dashed border-cl-border text-cl-text-secondary"
          >
            No tabs. Click &quot;Add Tab&quot; to create one.
          </div>
        )
      }
    </div>
  );
}
