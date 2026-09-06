import { One } from "./One";
import Showcase from "./Showcase";

/**
 * The client-rendered templates' router: `?c=Dropdown` for one component, the
 * whole grid otherwise. The same two pages the SSR templates route to, so a
 * failure can be reproduced in a Vite consumer without a framework in the way.
 */
export default function Entry() {
  const name = new URLSearchParams(window.location.search).get("c");
  return name ? <One name={name} /> : <Showcase />;
}
