import { DatePicker } from "../../../components/DatePicker/index.js";
import type { Previews } from "./types.js";

function Phone() {
  return <DatePicker label="Check-in" defaultOpen />;
}

export default { phone: Phone } satisfies Previews;
