// AI Knowledge: See ../INTERNATIONALPHONEINPUT.ai.md for the `validate` prop and
// opt-in validation guide. This subpath (`@chumlab/ui/phone-validators`) pulls in
// libphonenumber-js and is intentionally NOT part of the default component bundle.
// Uses the `/max` metadata for full per-country validation accuracy.
import {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js/max";
import type { PhoneNumberData } from "../utils/types";

// Accepted line types under `mobileOnly`. FIXED_LINE_OR_MOBILE is included so
// regions that cannot disambiguate the two (e.g. US) still pass — only a
// CONFIRMED fixed-line is rejected.
const MOBILE_ACCEPTED_TYPES = new Set(["MOBILE", "FIXED_LINE_OR_MOBILE"]);

export interface LibphonenumberValidatorOptions {
  /**
   * `"isValid"` (default) — the number must be a real, assignable number for its
   * country (any line type). `"isPossible"` — looser: only the length must be
   * plausible.
   */
  mode?: "isValid" | "isPossible";
  /**
   * When true, reject CONFIRMED fixed-line numbers (e.g. `+91 1234567890`) —
   * i.e. require a line type of `MOBILE` or `FIXED_LINE_OR_MOBILE`. Regions that
   * cannot disambiguate the two (e.g. US) report `FIXED_LINE_OR_MOBILE` and so
   * still pass, which is what SMS/OTP flows want. Default `false` (any valid
   * line type).
   */
  mobileOnly?: boolean;
  /** Error message surfaced when the number is invalid. */
  message?: string;
}

/**
 * Builds a `validate` callback for InternationalPhoneInput backed by
 * libphonenumber-js. Validates the E.164 `fullNumber` the component assembles.
 *
 * @example
 * import { createLibphonenumberValidator } from "@chumlab/ui/phone-validators";
 * // Any valid number (default):
 * <InternationalPhoneInput validate={createLibphonenumberValidator()} />
 * // Mobile numbers only:
 * <InternationalPhoneInput validate={createLibphonenumberValidator({ mobileOnly: true })} />
 */
export function createLibphonenumberValidator(
  options: LibphonenumberValidatorOptions = {},
): (data: PhoneNumberData) => { valid: boolean; message?: string } {
  const { mode = "isValid", mobileOnly = false, message } = options;
  return (data) => {
    const e164 = data.fullNumber?.trim();
    let valid = false;
    if (e164) {
      try {
        valid =
          mode === "isPossible"
            ? isPossiblePhoneNumber(e164)
            : isValidPhoneNumber(e164);
        if (valid && mobileOnly) {
          const parsed = parsePhoneNumberFromString(e164);
          valid = !!parsed && MOBILE_ACCEPTED_TYPES.has(parsed.getType() ?? "");
        }
      } catch {
        valid = false;
      }
    }
    return valid ? { valid: true } : { valid: false, message };
  };
}
