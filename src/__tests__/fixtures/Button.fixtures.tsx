import { Button } from "../../components/Button/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

const fixtures: Fixtures<typeof Button> = [
  { name: "default", props: {}, children: "Save" },
  { name: "loading", props: { loading: true }, children: "Save" },
  {
    // Loading ON a filled button, which is the only place the loader's colour
    // can collide: the library paints no background, so `loading` above sits on
    // the page and the accent spinner always read against it. On a consumer's
    // accent button the spinner measured rgb(91,155,255) on rgb(91,155,255) —
    // 1.00:1, the indicator and its surface the same value.
    //
    // `loaderSize: 40` because the visual suite is the only gate that can hold
    // this and at the default 20 it could not. Not a 1.4.11 failure — the state
    // is announced in text by the `role=status` span, which exempts the graphic
    // — so `contrast-painted` is right to pass it, and it does: planted, it
    // reported zero findings. And the picture at the default size moved FEWER
    // THAN 30 pixels, because the visible arc of a 20px spinner is smaller than
    // the suite's own 30-pixel budget. At 40 the same plant moves 205.
    name: "loading-on-accent",
    props: { loading: true, loaderSize: 40, className: "bg-cl-accent text-cl-on-accent" },
    children: "Save",
  },
  { name: "disabled", props: { disabled: true }, children: "Save" },
  // One per size, because `size` paints dimensions now and the smallest of
  // them is the one that has to clear the 24px target floor: sm is 28px tall,
  // and `e2e/target-size.spec.ts` hit-tests all three rather than trusting the
  // arithmetic.
  { name: "size-sm", props: { size: "sm" as const }, children: "Save" },
  { name: "size-md", props: { size: "md" as const }, children: "Save" },
  { name: "size-lg", props: { size: "lg" as const }, children: "Save" },
  {
    name: "with-icons",
    props: { startIcon: <span>L</span>, endIcon: <span>R</span> },
    children: "Save",
  },
  { name: "full-width", props: { fullWidth: true }, children: "Save" },
  {
    name: "as-button",
    props: { as: "button" },
    children: "Save",
    note: "`as` is the escape hatch from the anchor form: it forces the button element.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
