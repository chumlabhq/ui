import { Modal } from "../../components/Modal/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof Modal> = [
  { name: "open", props: { open: true, title: "Title", description: "Description" }, children: "Body" },
  { name: "open-no-close", props: { open: true, title: "Title", showCloseButton: false }, children: "Body" },
  { name: "with-icon", props: { open: true, title: "Title", showIcon: true, icon: <span>!</span> }, children: "Body" },
  { name: "full-screen", props: { open: true, fullScreen: true, title: "Title" }, children: "Body" },
  { name: "closed-kept-mounted", props: { open: false, keepMounted: true, title: "Title" }, children: "Body" },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
