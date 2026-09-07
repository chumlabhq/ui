import { TabPanel } from "@chumlab/ui/tab-panel";

const tabs = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function Example() {
  return (
    <TabPanel tabs={tabs} defaultValue="home">
      {(item) => <div style={{ padding: 16 }}>{item.label} content</div>}
    </TabPanel>
  );
}
