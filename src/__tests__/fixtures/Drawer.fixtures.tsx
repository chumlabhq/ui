import Drawer from "../../components/Drawer/Drawer.js";
import DrawerCloseButton from "../../components/Drawer/components/DrawerCloseButton.js";
import DrawerFooter from "../../components/Drawer/components/DrawerFooter.js";
import DrawerHeader from "../../components/Drawer/components/DrawerHeader.js";
import { IndexPicker, Toggle } from "./_harness.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { motionOverrides } from "./_motion.js";
import { TallDrawer } from "./_tall.js";

const fixtures: Fixtures<typeof Drawer> = [
  {
    name: "with-trigger",
    props: {},
    note: "Uncontrolled open/close, so the trigger, Escape, overlay click and the close button all have something to act on.",
    render: () => (
      <Toggle label="Open Drawer">
        {(open, setOpen) => (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerHeader>Test drawer</DrawerHeader>
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
            <DrawerHeader>Non-modal drawer</DrawerHeader>
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
            <DrawerHeader>Sheet</DrawerHeader>
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
            <DrawerHeader>Sheet</DrawerHeader>
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
    children: <><DrawerHeader>Drawer</DrawerHeader><DrawerCloseButton />Body</>,
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
    children: <><DrawerHeader>Drawer</DrawerHeader><DrawerCloseButton />Body</>,
  },
  { name: "open-left", props: { open: true, side: "start" }, children: <><DrawerHeader>Drawer</DrawerHeader>Body</> },
  { name: "open-end", props: { open: true, side: "end" }, children: <><DrawerHeader>Drawer</DrawerHeader>Body</> },
  {
    name: "open-end-rtl",
    props: { open: true, side: "end" },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    children: <><DrawerHeader>Drawer</DrawerHeader>Body</>,
    note: "`side=\"end\"` in a right-to-left page: the panel enters from the left.",
  },
  {
    name: "tall-left",
    props: {},
    note: "Content taller than the viewport, with a control at the end: the panel has to scroll for it to be reachable.",
    render: () => <TallDrawer side="start" />,
  },
  { name: "tall-right", props: {}, render: () => <TallDrawer side="end" /> },
  { name: "tall-top", props: {}, render: () => <TallDrawer side="top" /> },
  { name: "tall-bottom", props: {}, render: () => <TallDrawer side="bottom" /> },
  {
    name: "tall-swipeable-top",
    props: {},
    note: "A swipeable sheet whose content scrolls along the axis it dismisses on: the drag has to start on the handle or the header.",
    render: () => <TallDrawer side="top" swipeable />,
  },
  { name: "tall-swipeable-bottom", props: {}, render: () => <TallDrawer side="bottom" swipeable /> },
  {
    name: "tall-initial-focus",
    props: {},
    note: "initialFocus aims at the last control, below the fold of a tall panel.",
    render: () => <TallDrawer side="end" initialFocusLast />,
  },
  {
    name: "tall-autofocus",
    props: {},
    note: "data-autofocus on the last control, below the fold of a tall panel.",
    render: () => <TallDrawer side="end" autoFocusLast />,
  },
  { name: "closed-kept-mounted", props: { open: false, keepMounted: true }, children: <><DrawerHeader>Drawer</DrawerHeader>Body</> },
  {
    name: "open-rtl",
    props: { open: true, side: "start" },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    children: <><DrawerHeader>Drawer</DrawerHeader>Body</>,
    note: "`side=\"start\"` in a right-to-left page: the panel enters from the right."
  },
  { name: "open-with-footer", props: { open: true }, children: <><DrawerHeader>Drawer</DrawerHeader>Body<DrawerFooter>Footer</DrawerFooter></> },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
