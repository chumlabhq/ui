/**
 * Dev-mode entry for the marking JSX runtime. See ./mark.ts for why the marker
 * exists.
 */
import { jsxDEV as reactJsxDEV } from "react/jsx-dev-runtime";
import { mark, type Props } from "./mark";

export { Fragment } from "react/jsx-dev-runtime";
export type { JSX } from "react/jsx-dev-runtime";

export const jsxDEV = (
  type: unknown,
  props: Props,
  key: React.Key | undefined,
  isStatic: boolean,
  source?: unknown,
  self?: unknown,
) =>
  (reactJsxDEV as (...args: unknown[]) => React.ReactElement)(
    type,
    mark(type, props),
    key,
    isStatic,
    source,
    self,
  );
