import { Modal, ModalFooter } from "../../components/Modal/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";
import { TallContent } from "./_tall.js";
import { RtlBoundary } from "./_harness.js";

const fixtures: Fixtures<typeof Modal> = [
  { name: "open", props: { open: true, title: "Title", description: "Description" }, children: "Body" },
  { name: "open-no-close", props: { open: true, title: "Title", showCloseButton: false }, children: "Body" },
  { name: "with-icon", props: { open: true, title: "Title", showIcon: true, icon: <span>!</span> }, children: "Body" },
  { name: "full-screen", props: { open: true, fullScreen: true, title: "Title" }, children: "Body" },
  { name: "closed-kept-mounted", props: { open: false, keepMounted: true, title: "Title" }, children: "Body" },
  { name: "open-no-header", props: { open: true, title: "Title", showHeader: false }, children: "Body" },
  { name: "open-no-overlay", props: { open: true, title: "Title", showOverlay: false }, children: "Body" },
  {
    name: "tall",
    props: { open: true, title: "Title", description: "Description" },
    children: <TallContent />,
    note: "Content taller than the viewport, with a control at the end: the dialog has to scroll for it to be reachable.",
  },
  {
    name: "open-rtl",
    props: { open: true, title: "Title", description: "Description" },
    children: "Body",
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    note: "The close button at the header's inline end, which is the left in right-to-left.",
  },
  { name: "open-with-footer", props: { open: true, title: "Title" }, children: <>Body<ModalFooter>Footer</ModalFooter></> },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
