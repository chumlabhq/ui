import Drawer from "../../components/Drawer/Drawer.js";
import DrawerCloseButton from "../../components/Drawer/components/DrawerCloseButton.js";
import DrawerHeader from "../../components/Drawer/components/DrawerHeader.js";
import { IndexPicker, Toggle } from "./_harness.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { motionOverrides } from "./_motion.js";

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
            side="bottom"
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
            side="bottom"
            modal={false}
            swipeable
            snapPoints={[0.3, 0.6, 0.9]}
            snapPointIndex={index}
            aria-label="Snapping sheet"
          >
            <DrawerHeader title="Sheet" />
            Body
          </Drawer>
        )}
      </IndexPicker>
    ),
  },
  {
    name: "open",
    props: { open: true },
    // The close button is here because it is the only Drawer part rendered in
    // an OPEN drawer that a gate can measure, and it shipped with no default
    // classes at all — not even `cursor-pointer`. Every other fixture that
    // carries one starts closed, so `an enabled control affords a pointer` had
    // nothing to look at and could not fail for the defect it was written for.
    children: <><DrawerHeader title="Drawer" /><DrawerCloseButton />Body</>,
  },
  /**
   * Props-only, so the contract tier can reach it.
   *
   * `swipeable-bottom` is the visual subject for the grab handle, but it needs
   * `render` for its Toggle and children — and `fixtures.contract` instantiates
   * from the `props` bag, so `classes.handle` was documented and rendered by no
   * fixture the contract could see. This is the one that renders it.
   */
  {
    name: "open-swipeable",
    props: { open: true, swipeable: true },
    children: <><DrawerHeader title="Drawer" /><DrawerCloseButton />Body</>,
  },
  { name: "open-left", props: { open: true, side: "left" }, children: <><DrawerHeader title="Drawer" />Body</> },
  { name: "closed-kept-mounted", props: { open: false, keepMounted: true }, children: <><DrawerHeader title="Drawer" />Body</> },
  {
    name: "open-rtl",
    props: { open: true, side: "left" },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    children: <><DrawerHeader title="Drawer" />Body</>,
    note: "`side` is physical (left/right), not logical (start/end), so nothing here mirrors — which is the finding."
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
