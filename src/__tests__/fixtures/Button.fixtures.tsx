import { Button } from "../../components/Button/index.js";
import { BUTTON_SIZE_CLASSES } from "../../components/Button/utils/constants.js";
import type { ButtonSize } from "../../components/Button/utils/types.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

/** A stroke icon that fills its slot, as an icon library's SVG does. */
const Glyph = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 8h10M8 3v10" />
  </svg>
);

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
    // Every size with text alone, a leading icon, a trailing icon, an icon
    // alone and the loader. Each must stand as tall as its size's text-only
    // Button: the content span sat on a text baseline, so an icon whose
    // baseline is its bottom edge added the line's descent below it (+3px at
    // md). `with-icons` above passes text glyphs as icons, which sit on that
    // baseline like text and hid it. `default-state` reads `data-matrix`.
    name: "height-matrix",
    props: {},
    render: () => (
      // In normal flow, not flex rows: a flex item is blockified, and the
      // Button's own display (`inline-block`, the `<button>` default) is the
      // case being measured.
      <div className="space-y-3">
        {(Object.keys(BUTTON_SIZE_CLASSES) as ButtonSize[]).map((size) => (
          <div key={size}>
            <Button size={size} data-matrix={`${size}|text`}>Save</Button>{" "}
            <Button size={size} data-matrix={`${size}|startIcon`} startIcon={<Glyph />}>Save</Button>{" "}
            <Button size={size} data-matrix={`${size}|endIcon`} endIcon={<Glyph />}>Save</Button>{" "}
            <Button size={size} data-matrix={`${size}|iconOnly`} startIcon={<Glyph />} aria-label="Add" />{" "}
            <Button size={size} data-matrix={`${size}|loading`} loading>Save</Button>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "as-button",
    props: { as: "button" },
    children: "Save",
    note: "`as` is the escape hatch from the anchor form: it forces the button element.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
