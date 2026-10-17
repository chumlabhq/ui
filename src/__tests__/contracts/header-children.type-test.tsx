/**
 * The overlay headers' `children` are required, asserted at the type level.
 *
 * DrawerHeader's were optional while ModalHeader's were not, so
 * `<DrawerHeader title="Settings" />` typechecked: `title` is an HTML attribute
 * on the div, a tooltip, and the header rendered empty — the element the
 * drawer's `aria-labelledby` points at, naming it nothing.
 *
 * `@ts-expect-error` is the assertion: `tsc --build` fails if either line below
 * stops being an error. This file is typechecked, never executed.
 */
import { DrawerHeader } from "../../components/Drawer/index.js";
import { ModalHeader } from "../../components/Modal/index.js";

export const valid = (
  <>
    <DrawerHeader>Settings</DrawerHeader>
    <ModalHeader>Settings</ModalHeader>
  </>
);

export const invalid = (
  <>
    {/* @ts-expect-error -- a header with no children renders empty */}
    <DrawerHeader title="Settings" />
    {/* @ts-expect-error -- the reference: ModalHeader has always required them */}
    <ModalHeader title="Settings" />
  </>
);
