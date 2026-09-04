import Drawer from "../../components/Drawer/Drawer";
import DrawerCloseButton from "../../components/Drawer/components/DrawerCloseButton";
import DrawerHeader from "../../components/Drawer/components/DrawerHeader";
import { IndexPicker, Toggle } from "./_harness";
import type { Fixtures } from "./types";
import { motionOverrides } from "./_motion";

const fixtures: Fixtures<typeof Drawer> = [
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
  {
    name: "swipeable-bottom",
    props: {},
    note: "Starts open so a downward drag has something to dismiss.",
    render: () => (
      <Toggle label="Open Sheet" defaultOpen>
        {(open, setOpen) => (
          <Drawer
            open={open}
            onOpenChange={setOpen}
            direction="bottom"
            swipeable
            aria-label="Swipeable sheet"
          >
            <DrawerHeader title="Sheet" />
            Body
          </Drawer>
        )}
      </Toggle>
    ),
  },
  {
    name: "snap-points",
    props: {},
    note: "A snap point's effect is a panel height, so the index has to change under test. Non-modal so the overlay does not sit over the harness buttons.",
    render: () => (
      <IndexPicker count={3}>
        {(index) => (
          <Drawer
            open
            onOpenChange={() => {}}
            direction="bottom"
            modal={false}
            swipeable
            snapPoints={[0.3, 0.6, 0.9]}
            activeSnapPointIndex={index}
            aria-label="Snapping sheet"
          >
            <DrawerHeader title="Sheet" />
            Body
          </Drawer>
        )}
      </IndexPicker>
    ),
  },
  { name: "open", props: { open: true }, children: <><DrawerHeader title="Drawer" />Body</> },
  { name: "open-left", props: { open: true, direction: "left" }, children: <><DrawerHeader title="Drawer" />Body</> },
  { name: "closed-kept-mounted", props: { open: false, keepMounted: true }, children: <><DrawerHeader title="Drawer" />Body</> },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
