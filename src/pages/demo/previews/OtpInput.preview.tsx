import { OtpInput } from "../../../components/OtpInput/index.js";
import type { Previews } from "./types.js";

function Phone() {
  return <OtpInput length={6} label="Verification code" description="We sent it to your phone." />;
}

export default { phone: Phone } satisfies Previews;
