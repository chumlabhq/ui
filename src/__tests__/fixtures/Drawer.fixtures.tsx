import Drawer from "../../components/Drawer/Drawer";
import DrawerCloseButton from "../../components/Drawer/components/DrawerCloseButton";
import DrawerHeader from "../../components/Drawer/components/DrawerHeader";
import { Toggle } from "./_harness";
import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  {
    name: "with-trigger",
    props: {},
    note: "Uncontrolled open/close, so the trigger, Escape, overlay click and the close button all have something to act on.",
    render: () => (
      <Toggle label="Open Drawer">
        {(open, setOpen) => (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerHeader title="Test drawer" />
            <DrawerCloseButton />
            <button type="button">Inside</button>
          </Drawer>
        )}
      </Toggle>
    ),
  },
  {
    name: "with-trigger-non-modal",
    props: {},
    render: () => (
      <Toggle label="Open Drawer">
        {(open, setOpen) => (
          <Drawer open={open} onOpenChange={setOpen} modal={false}>
            <DrawerHeader title="Non-modal drawer" />
            <button type="button">Inside</button>
          </Drawer>
        )}
      </Toggle>
    ),
  },
  { name: "open", props: { open: true }, children: <><DrawerHeader title="Drawer" />Body</> },
  { name: "open-left", props: { open: true, direction: "left" }, children: <><DrawerHeader title="Drawer" />Body</> },
  { name: "closed-kept-mounted", props: { open: false, keepMounted: true }, children: <><DrawerHeader title="Drawer" />Body</> },
];
export default fixtures;
