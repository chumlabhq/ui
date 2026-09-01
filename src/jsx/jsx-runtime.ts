/**
 * The automatic-JSX runtime the library is compiled with. See ./mark.ts for why
 * every rendered element carries a marker class.
 */
import { jsx as reactJsx, jsxs as reactJsxs } from "react/jsx-runtime";
import { mark, type Props } from "./mark";

export { Fragment } from "react/jsx-runtime";
export type { JSX } from "react/jsx-runtime";

export const jsx = (type: unknown, props: Props, key?: React.Key) =>
  reactJsx(type as never, mark(type, props) as never, key);

export const jsxs = (type: unknown, props: Props, key?: React.Key) =>
  reactJsxs(type as never, mark(type, props) as never, key);
