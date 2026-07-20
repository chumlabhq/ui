import { describe, it, expect } from "vitest";
import { createLibphonenumberValidator } from "../validators";
import type { PhoneNumberData } from "../utils/types";

const data = (fullNumber: string, extra: Partial<PhoneNumberData> = {}): PhoneNumberData => ({
  countryCode: "US",
  phoneNumber: "",
  fullNumber,
  isValid: true,
  ...extra,
});

// +1 213 373 4253 — a real, assignable US number (libphonenumber valid example).
const VALID_US = "+12133734253";
// +1 111 111 1111 — right length for the US but not an assignable number.
const RIGHT_LENGTH_INVALID_US = "+11111111111";
// India: mobile numbers start 6–9; +91 1234567890 is a valid FIXED_LINE, not mobile.
const IN_FIXED_LINE = "+911234567890";
const IN_MOBILE = "+919876543210";

describe("createLibphonenumberValidator", () => {
  it("default mode is strict (isValid): rejects a right-length-but-invalid number", () => {
    const validate = createLibphonenumberValidator();
    expect(validate(data(RIGHT_LENGTH_INVALID_US)).valid).toBe(false);
  });

  it("default mode accepts a real valid number", () => {
    const validate = createLibphonenumberValidator();
    expect(validate(data(VALID_US)).valid).toBe(true);
  });

  it("isPossible mode is looser: accepts the right-length-but-invalid number", () => {
    const strict = createLibphonenumberValidator();
    const possible = createLibphonenumberValidator({ mode: "isPossible" });
    expect(strict(data(RIGHT_LENGTH_INVALID_US)).valid).toBe(false);
    expect(possible(data(RIGHT_LENGTH_INVALID_US)).valid).toBe(true);
  });

  it("isPossible mode still rejects a too-short number", () => {
    const possible = createLibphonenumberValidator({ mode: "isPossible" });
    expect(possible(data("+1234")).valid).toBe(false);
  });

  it("validates the E.164 fullNumber, not the national parts", () => {
    const validate = createLibphonenumberValidator();
    // Valid E.164 but junk national fields → valid (reads fullNumber).
    expect(
      validate(data(VALID_US, { countryCode: "ZZ", phoneNumber: "junk" })).valid,
    ).toBe(true);
    // Good national parts but malformed fullNumber → invalid.
    expect(
      validate(data("not-a-number", { phoneNumber: "2133734253" })).valid,
    ).toBe(false);
  });

  it("passes through a custom message on failure", () => {
    const validate = createLibphonenumberValidator({ message: "Enter a real number" });
    expect(validate(data(RIGHT_LENGTH_INVALID_US))).toEqual({
      valid: false,
      message: "Enter a real number",
    });
  });

  it("returns invalid (no throw) for empty fullNumber", () => {
    const validate = createLibphonenumberValidator();
    expect(validate(data("")).valid).toBe(false);
  });

  it("default (mobileOnly false) accepts both a valid fixed-line and a valid mobile", () => {
    const validate = createLibphonenumberValidator();
    expect(validate(data(IN_FIXED_LINE)).valid).toBe(true);
    expect(validate(data(IN_MOBILE)).valid).toBe(true);
  });

  it("mobileOnly: true rejects a valid fixed-line and accepts a valid mobile", () => {
    const mobileOnly = createLibphonenumberValidator({ mobileOnly: true });
    expect(mobileOnly(data(IN_FIXED_LINE)).valid).toBe(false);
    expect(mobileOnly(data(IN_MOBILE)).valid).toBe(true);
  });

  it("mobileOnly: true accepts a US number (FIXED_LINE_OR_MOBILE is allowed)", () => {
    const mobileOnly = createLibphonenumberValidator({ mobileOnly: true });
    // US cannot be disambiguated (FIXED_LINE_OR_MOBILE), so it passes — only a
    // CONFIRMED fixed-line is rejected.
    expect(mobileOnly(data(VALID_US)).valid).toBe(true);
  });

  it("mobileOnly: true still rejects an invalid number", () => {
    const mobileOnly = createLibphonenumberValidator({ mobileOnly: true });
    expect(mobileOnly(data(RIGHT_LENGTH_INVALID_US)).valid).toBe(false);
  });
});
