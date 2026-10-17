import { TimePicker } from "../../../components/TimePicker/index.js";
import type { Previews } from "./types.js";

function Phone() {
  return <TimePicker label="Pickup time" defaultOpen />;
}

export default { phone: Phone } satisfies Previews;
