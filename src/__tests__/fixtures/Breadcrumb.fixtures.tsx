import { Breadcrumb } from "../../components/Breadcrumb";
import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";
import { CRUMBS } from "./_data";

const fixtures: Fixtures<typeof Breadcrumb> = [
  { name: "default", props: { items: CRUMBS } },
  { name: "collapsed", props: { items: [...CRUMBS, ...CRUMBS], maxVisibleItems: 3 }, note: "Drives the ellipsis and its menu." },
  {
    name: "collapsed-open",
    props: { items: [...CRUMBS, ...CRUMBS], maxVisibleItems: 3 },
    act: (c) => {
      const btn = c.querySelector("button");
      if (btn) fireEvent.click(btn);
    },
  },
  { name: "with-icons", props: { items: CRUMBS.map((i) => ({ ...i, icon: "•" })) } },
  { name: "with-tooltips", props: { items: CRUMBS.map((i) => ({ ...i, tooltip: "Tip" })), showTooltips: true } },
];
export default fixtures;
