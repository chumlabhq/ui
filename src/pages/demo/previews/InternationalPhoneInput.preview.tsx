import { InternationalPhoneInput } from "../../../components/InternationalPhoneInput/index.js";
import type { Previews } from "./types.js";

function Phone() {
  return <InternationalPhoneInput label="Phone number" />;
}

export default { phone: Phone } satisfies Previews;
