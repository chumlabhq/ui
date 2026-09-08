import { Tab, TabPanel } from "@chumlab/ui/tab-panel";

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function TabPanelExample() {
  return (
    <>
      {/* Basic usage — works out-of-the-box with built-in styles */}
      <TabPanel tabs={basicTabs} defaultValue="home" />
    </>
  );
}
