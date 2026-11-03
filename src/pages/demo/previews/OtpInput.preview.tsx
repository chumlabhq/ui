import { OtpInput } from "../../../components/OtpInput/index.js";

export function Phone() {
  return <OtpInput length={6} label="Verification code" description="We sent it to your phone." />;
}
