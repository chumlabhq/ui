import { describe, it, expect } from "vitest";
import {
  findCountryByCode,
  findCountryByDialCode,
  formatPhoneNumber,
  validatePhoneNumber,
  sortCountryOptions,
  getDigitsOnly,
  isEmptyPhoneNumber,
  parseInternationalNumber,
  formatForCopy,
  computeCursorPosition,
} from "../utils";
import type { CountryOption } from "../utils/types";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const US: CountryOption = {
  value: "us",
  label: "United States",
  flag: "us",
  dialCode: "+1",
  name: "United States",
};

const GB: CountryOption = {
  value: "gb",
  label: "United Kingdom",
  flag: "gb",
  dialCode: "+44",
  name: "United Kingdom",
};

const CA: CountryOption = {
  value: "ca",
  label: "Canada",
  flag: "ca",
  dialCode: "+1",
  name: "Canada",
};

const FR: CountryOption = {
  value: "fr",
  label: "France",
  flag: "fr",
  dialCode: "+33",
  name: "France",
};

// A country that has no dedicated formatting pattern, so falls back to DEFAULT.
const ZA: CountryOption = {
  value: "za",
  label: "South Africa",
  flag: "za",
  dialCode: "+27",
  name: "South Africa",
};

const COUNTRIES = [US, GB, CA, FR, ZA];

// ─── findCountryByCode ────────────────────────────────────────────────────────

describe("findCountryByCode", () => {
  it("returns null for an empty string", () => {
    expect(findCountryByCode("", COUNTRIES)).toBeNull();
  });

  it("finds a country by exact value (lowercase)", () => {
    expect(findCountryByCode("us", COUNTRIES)).toBe(US);
  });

  it("finds a country by value regardless of case (uppercase input)", () => {
    expect(findCountryByCode("US", COUNTRIES)).toBe(US);
  });

  it("finds a country by value regardless of case (mixed case input)", () => {
    expect(findCountryByCode("Gb", COUNTRIES)).toBe(GB);
  });

  it("finds a country by flag (lowercase)", () => {
    expect(findCountryByCode("fr", COUNTRIES)).toBe(FR);
  });

  it("finds a country by flag regardless of case", () => {
    expect(findCountryByCode("CA", COUNTRIES)).toBe(CA);
  });

  it("returns null when no country matches", () => {
    expect(findCountryByCode("xx", COUNTRIES)).toBeNull();
  });

  it("returns null when country list is empty", () => {
    expect(findCountryByCode("us", [])).toBeNull();
  });

  it("prefers value match over flag when both would match the same code", () => {
    // Both value and flag are "us" for the US fixture, so result is the same.
    const result = findCountryByCode("us", COUNTRIES);
    expect(result).toBe(US);
  });
});

// ─── findCountryByDialCode ────────────────────────────────────────────────────

describe("findCountryByDialCode", () => {
  it("returns null for an empty string", () => {
    expect(findCountryByDialCode("", COUNTRIES)).toBeNull();
  });

  it("finds the first country matching a unique dial code", () => {
    expect(findCountryByDialCode("+44", COUNTRIES)).toBe(GB);
  });

  it("finds the first country when multiple share the same dial code (+1)", () => {
    // US comes before CA in COUNTRIES, so US is the expected result.
    const result = findCountryByDialCode("+1", COUNTRIES);
    expect(result).toBe(US);
  });

  it("returns null when the dial code is not found", () => {
    expect(findCountryByDialCode("+999", COUNTRIES)).toBeNull();
  });

  it("is case-sensitive (dial codes include '+')", () => {
    // The stored dialCode is "+44" — passing "44" without the plus should not match.
    expect(findCountryByDialCode("44", COUNTRIES)).toBeNull();
  });
});

// ─── getDigitsOnly ────────────────────────────────────────────────────────────

describe("getDigitsOnly", () => {
  it("returns the same string when it already contains only digits", () => {
    expect(getDigitsOnly("1234567890")).toBe("1234567890");
  });

  it("strips all non-digit characters", () => {
    expect(getDigitsOnly("+1 (202) 555-1234")).toBe("12025551234");
  });

  it("strips letters", () => {
    expect(getDigitsOnly("abc123def")).toBe("123");
  });

  it("strips spaces and punctuation", () => {
    expect(getDigitsOnly("  - . () ")).toBe("");
  });

  it("returns an empty string for an empty input", () => {
    expect(getDigitsOnly("")).toBe("");
  });

  it("handles strings with no digits at all", () => {
    expect(getDigitsOnly("no digits here!")).toBe("");
  });

  it("preserves digit order", () => {
    expect(getDigitsOnly("a1b2c3")).toBe("123");
  });
});

// ─── isEmptyPhoneNumber ───────────────────────────────────────────────────────

describe("isEmptyPhoneNumber", () => {
  it("returns true for null", () => {
    expect(isEmptyPhoneNumber(null)).toBe(true);
  });

  it("returns true for undefined", () => {
    expect(isEmptyPhoneNumber(undefined)).toBe(true);
  });

  it("returns true for an empty string", () => {
    expect(isEmptyPhoneNumber("")).toBe(true);
  });

  it("returns true for a whitespace-only string", () => {
    expect(isEmptyPhoneNumber("   ")).toBe(true);
  });

  it("returns true for a string containing only non-digit characters", () => {
    expect(isEmptyPhoneNumber("(+) -")).toBe(true);
  });

  it("returns false for a string that contains at least one digit", () => {
    expect(isEmptyPhoneNumber("1")).toBe(false);
  });

  it("returns false for a fully formatted phone number", () => {
    expect(isEmptyPhoneNumber("(202) 555-1234")).toBe(false);
  });

  it("returns false for a string with digits embedded in whitespace", () => {
    expect(isEmptyPhoneNumber("  5  ")).toBe(false);
  });
});

// ─── formatPhoneNumber ────────────────────────────────────────────────────────

describe("formatPhoneNumber", () => {
  it("returns empty string for an empty phone string", () => {
    expect(formatPhoneNumber("", US, undefined)).toBe("");
  });

  it("returns empty string when the input contains no digits", () => {
    expect(formatPhoneNumber("---", US, undefined)).toBe("");
  });

  it("returns empty string when phone is falsy (null-like empty)", () => {
    // Passing a zero-length string exercises the !phone guard.
    expect(formatPhoneNumber("", null, undefined)).toBe("");
  });

  it("uses DEFAULT pattern when country is null", () => {
    // DEFAULT: <=3 → raw, <=6 → 'XXX XXX', <=9 → 'XXX XXX XXX', >9 → 'XXX XXX XXX XXXX...'
    expect(formatPhoneNumber("1234567", null, undefined)).toBe("123 456 7");
    expect(formatPhoneNumber("1234567890", null, undefined)).toBe("123 456 789 0");
  });

  it("formats a 10-digit US number correctly", () => {
    expect(formatPhoneNumber("2025551234", US, undefined)).toBe(
      "(202) 555-1234"
    );
  });

  it("formats a 3-digit US partial correctly", () => {
    expect(formatPhoneNumber("202", US, undefined)).toBe("202");
  });

  it("formats a 6-digit US partial correctly", () => {
    expect(formatPhoneNumber("202555", US, undefined)).toBe("(202) 555");
  });

  it("uses the same US_CANADA pattern for Canada", () => {
    expect(formatPhoneNumber("4165551234", CA, undefined)).toBe(
      "(416) 555-1234"
    );
  });

  it("formats a UK number with 5-digit prefix correctly", () => {
    // 5 digits → raw; 8 digits → 'XXXXX XXX'; 11 digits → 'XXXXX XXX XX'
    expect(formatPhoneNumber("02071234567", GB, undefined)).toBe(
      "02071 234 567"
    );
  });

  it("formats a short UK partial (<=5 digits) without spaces", () => {
    expect(formatPhoneNumber("02071", GB, undefined)).toBe("02071");
  });

  it("formats a medium UK partial (6-8 digits) with one space", () => {
    expect(formatPhoneNumber("020712", GB, undefined)).toBe("02071 2");
  });

  it("formats a France 9-digit number in two-digit groups", () => {
    // FRANCE pattern: split digits into groups of 2.
    expect(formatPhoneNumber("612345678", FR, undefined)).toBe("61 23 45 67 8");
  });

  it("falls back to DEFAULT pattern for an unknown country", () => {
    // ZA has no dedicated pattern in PHONE_FORMATTING_PATTERNS.
    expect(formatPhoneNumber("1234567890", ZA, undefined)).toBe(
      "123 456 789 0"
    );
  });

  it("strips non-digit characters from the input before formatting", () => {
    // The function calls replace(/\D/g,'') internally.
    expect(formatPhoneNumber("(202) 555-1234", US, undefined)).toBe(
      "(202) 555-1234"
    );
  });

  it("merges custom patterns over built-in patterns for a country not covered by any built-in", () => {
    // The loop iterates Object.values() in insertion order. Built-in patterns are
    // checked first, so a CUSTOM entry for a country already covered by a built-in
    // (e.g. "us" is handled by US_CANADA) will never be reached.
    // Use a country flag that has no built-in pattern to prove the merge works.
    const customPatterns = {
      CUSTOM: {
        pattern: () => "CUSTOM_RESULT",
        countries: ["zz"] as const,
      },
    };
    const ZZ: CountryOption = {
      value: "zz",
      label: "Ztest",
      flag: "zz",
      dialCode: "+999",
      name: "Ztest",
    };
    expect(formatPhoneNumber("2025551234", ZZ, customPatterns)).toBe(
      "CUSTOM_RESULT"
    );
  });

  it("does not override a built-in pattern with a custom one of a different key (built-in wins)", () => {
    // Adding a CUSTOM key with countries:["us"] does not override US_CANADA because
    // Object.values() reaches US_CANADA first and it already matches "us".
    const customPatterns = {
      CUSTOM: {
        pattern: () => "CUSTOM_RESULT",
        countries: ["us"] as const,
      },
    };
    expect(formatPhoneNumber("2025551234", US, customPatterns)).toBe(
      "(202) 555-1234"
    );
  });

  it("custom DEFAULT pattern overrides the built-in DEFAULT", () => {
    const customPatterns = {
      DEFAULT: {
        pattern: (d: string) => `custom-${d}`,
        countries: [] as const,
      },
    };
    // ZA has no built-in pattern → falls through to DEFAULT.
    expect(formatPhoneNumber("123", ZA, customPatterns)).toBe("custom-123");
  });
});

// ─── validatePhoneNumber ──────────────────────────────────────────────────────

describe("validatePhoneNumber", () => {
  it("returns an invalid empty result for an empty phone string", () => {
    const result = validatePhoneNumber("", US, undefined, undefined);
    expect(result).toEqual({
      countryCode: "us",
      phoneNumber: "",
      fullNumber: "",
      isValid: false,
    });
  });

  it("returns an invalid empty result when phone has no digits", () => {
    const result = validatePhoneNumber("---", US, undefined, undefined);
    expect(result).toEqual({
      countryCode: "us",
      phoneNumber: "",
      fullNumber: "",
      isValid: false,
    });
  });

  it("returns countryCode from the provided country even when phone is empty", () => {
    const result = validatePhoneNumber("", GB, undefined, undefined);
    expect(result.countryCode).toBe("gb");
  });

  it("returns empty countryCode when country is null and phone is empty", () => {
    const result = validatePhoneNumber("", null, undefined, undefined);
    expect(result.countryCode).toBe("");
  });

  it("validates against DEFAULT rule when country is null", () => {
    // DEFAULT rule: min 7, max 15.
    const valid = validatePhoneNumber("1234567", null, undefined, undefined);
    expect(valid.isValid).toBe(true);
    expect(valid.countryCode).toBe("");
    expect(valid.phoneNumber).toBe("1234567");
    expect(valid.fullNumber).toBe("1234567");
  });

  it("marks as invalid when digit count is below DEFAULT min when country is null", () => {
    const result = validatePhoneNumber("123456", null, undefined, undefined);
    expect(result.isValid).toBe(false);
  });

  it("validates a valid 10-digit US number", () => {
    const result = validatePhoneNumber("2025551234", US, undefined, undefined);
    expect(result.isValid).toBe(true);
    expect(result.countryCode).toBe("us");
    expect(result.phoneNumber).toBe("2025551234");
    expect(result.fullNumber).toBe("+12025551234");
    expect(result.nationalNumber).toBe("2025551234");
    expect(result.internationalNumber).toBe("+1 (202) 555-1234");
  });

  it("marks as invalid when digit count is below US minimum", () => {
    const result = validatePhoneNumber("202555", US, undefined, undefined);
    expect(result.isValid).toBe(false);
  });

  it("marks as invalid when digit count exceeds US maximum (using uppercase country value to match rule key)", () => {
    // PHONE_LENGTH_RULES keys are uppercase ("US"). Our lowercase fixture value "us"
    // does not match, so it falls back to DEFAULT (min:7, max:15). To exercise the
    // real US rule we must use a country whose value exactly matches the key.
    const US_UPPER: CountryOption = {
      value: "US",
      label: "United States",
      flag: "us",
      dialCode: "+1",
      name: "United States",
    };
    // US max is 10; 11 digits should be invalid.
    const result = validatePhoneNumber("20255512345", US_UPPER, undefined, undefined);
    expect(result.isValid).toBe(false);
  });

  it("lowercase country value falls through to DEFAULT rule (11 digits is valid under DEFAULT max:15)", () => {
    // PHONE_LENGTH_RULES has no "us" (lowercase) entry → DEFAULT min:7, max:15.
    const result = validatePhoneNumber("20255512345", US, undefined, undefined);
    expect(result.isValid).toBe(true);
  });

  it("validates a valid UK number (10 digits)", () => {
    const result = validatePhoneNumber("2071234567", GB, undefined, undefined);
    expect(result.isValid).toBe(true);
  });

  it("validates a valid UK number (11 digits)", () => {
    const result = validatePhoneNumber("02071234567", GB, undefined, undefined);
    expect(result.isValid).toBe(true);
  });

  it("marks a 9-digit UK number as invalid when rule key matches (uppercase value)", () => {
    // PHONE_LENGTH_RULES key is "GB" (uppercase). Must use matching country value.
    const GB_UPPER: CountryOption = {
      value: "GB",
      label: "United Kingdom",
      flag: "gb",
      dialCode: "+44",
      name: "United Kingdom",
    };
    const result = validatePhoneNumber("207123456", GB_UPPER, undefined, undefined);
    expect(result.isValid).toBe(false);
  });

  it("lowercase country value falls through to DEFAULT rule (9-digit UK is valid under DEFAULT min:7)", () => {
    // PHONE_LENGTH_RULES has no "gb" (lowercase) → DEFAULT min:7, max:15.
    const result = validatePhoneNumber("207123456", GB, undefined, undefined);
    expect(result.isValid).toBe(true);
  });

  it("strips non-digit characters before validating", () => {
    // "(202) 555-1234" → digits "2025551234" → valid US number.
    const result = validatePhoneNumber(
      "(202) 555-1234",
      US,
      undefined,
      undefined
    );
    expect(result.isValid).toBe(true);
    expect(result.phoneNumber).toBe("2025551234");
  });

  it("uses custom length rules when provided", () => {
    const customRules = { us: { min: 5, max: 5 } };
    const fiveDigits = validatePhoneNumber("12345", US, customRules, undefined);
    expect(fiveDigits.isValid).toBe(true);

    const tenDigits = validatePhoneNumber(
      "2025551234",
      US,
      customRules,
      undefined
    );
    expect(tenDigits.isValid).toBe(false);
  });

  it("falls back to DEFAULT rule for a country with no specific rule entry", () => {
    // ZA exists in PHONE_LENGTH_RULES with min:9, max:9.
    // Use a fake country not in the rules table.
    const XX: CountryOption = {
      value: "xx",
      label: "Unknown",
      flag: "xx",
      dialCode: "+999",
      name: "Unknown",
    };
    const result = validatePhoneNumber("1234567", XX, undefined, undefined);
    // DEFAULT min:7 max:15 → 7 digits is valid.
    expect(result.isValid).toBe(true);
  });

  it("internationalNumber is formatted using country pattern", () => {
    const result = validatePhoneNumber("2025551234", US, undefined, undefined);
    expect(result.internationalNumber).toBe("+1 (202) 555-1234");
  });

  it("fullNumber concatenates dialCode with digits (no space)", () => {
    const result = validatePhoneNumber("2025551234", US, undefined, undefined);
    expect(result.fullNumber).toBe("+12025551234");
  });
});

// ─── sortCountryOptions ───────────────────────────────────────────────────────

describe("sortCountryOptions", () => {
  const unsorted = [FR, ZA, GB, US, CA];

  it("sorts alphabetically by name when no preferred countries provided", () => {
    const sorted = sortCountryOptions(unsorted);
    const names = sorted.map((c) => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("does not mutate the original array", () => {
    const original = [...unsorted];
    sortCountryOptions(unsorted);
    expect(unsorted).toEqual(original);
  });

  it("places preferred countries first", () => {
    const sorted = sortCountryOptions(unsorted, ["gb", "fr"]);
    const names = sorted.map((c) => c.name);
    // GB and FR must appear before US, CA, ZA.
    const gbIdx = names.indexOf("United Kingdom");
    const frIdx = names.indexOf("France");
    const usIdx = names.indexOf("United States");
    const caIdx = names.indexOf("Canada");
    const zaIdx = names.indexOf("South Africa");
    expect(gbIdx).toBeLessThan(usIdx);
    expect(gbIdx).toBeLessThan(caIdx);
    expect(gbIdx).toBeLessThan(zaIdx);
    expect(frIdx).toBeLessThan(usIdx);
  });

  it("sorts preferred countries alphabetically among themselves", () => {
    const sorted = sortCountryOptions(unsorted, ["fr", "gb"]);
    const names = sorted.map((c) => c.name);
    const frIdx = names.indexOf("France");
    const gbIdx = names.indexOf("United Kingdom");
    // France before United Kingdom alphabetically.
    expect(frIdx).toBeLessThan(gbIdx);
  });

  it("sorts non-preferred countries alphabetically among themselves", () => {
    const sorted = sortCountryOptions(unsorted, ["fr"]);
    const names = sorted.map((c) => c.name);
    const caIdx = names.indexOf("Canada");
    const usIdx = names.indexOf("United States");
    const zaIdx = names.indexOf("South Africa");
    // Among non-preferred: Canada < South Africa < United States
    expect(caIdx).toBeLessThan(zaIdx);
    expect(zaIdx).toBeLessThan(usIdx);
  });

  it("handles an empty preferred list the same as omitting it", () => {
    const sortedDefault = sortCountryOptions(unsorted);
    const sortedEmpty = sortCountryOptions(unsorted, []);
    expect(sortedEmpty.map((c) => c.value)).toEqual(
      sortedDefault.map((c) => c.value)
    );
  });

  it("handles preferred countries that are not in the list (no crash)", () => {
    expect(() => sortCountryOptions(unsorted, ["xx", "yy"])).not.toThrow();
  });

  it("returns an empty array when given an empty countries array", () => {
    expect(sortCountryOptions([], ["us"])).toEqual([]);
  });

  it("matches preferred countries case-insensitively against flag", () => {
    const sorted = sortCountryOptions(unsorted, ["US", "GB"]);
    const names = sorted.map((c) => c.name);
    const usIdx = names.indexOf("United States");
    const frIdx = names.indexOf("France");
    expect(usIdx).toBeLessThan(frIdx);
  });
});

// ─── parseInternationalNumber ─────────────────────────────────────────────────

describe("parseInternationalNumber", () => {
  it("returns no country and raw digits when value has no leading +", () => {
    const result = parseInternationalNumber("2025551234", COUNTRIES);
    expect(result.dialCode).toBeNull();
    expect(result.detectedCountry).toBeNull();
    expect(result.phoneNumber).toBe("2025551234");
  });

  it("converts leading 00 to + before parsing", () => {
    // "0012025551234" → "+12025551234" → detects US (+1).
    const result = parseInternationalNumber("0012025551234", COUNTRIES);
    expect(result.detectedCountry).not.toBeNull();
    expect(result.dialCode).toBe("+1");
  });

  it("detects a unique dial code (UK +44)", () => {
    const result = parseInternationalNumber("+442071234567", COUNTRIES);
    expect(result.detectedCountry).toBe(GB);
    expect(result.dialCode).toBe("+44");
    expect(result.phoneNumber).toBe("2071234567");
  });

  it("detects a unique dial code (France +33)", () => {
    const result = parseInternationalNumber("+33612345678", COUNTRIES);
    expect(result.detectedCountry).toBe(FR);
    expect(result.dialCode).toBe("+33");
    expect(result.phoneNumber).toBe("612345678");
  });

  it("returns first match when multiple countries share a dial code and no preferred set", () => {
    // +1 matches both US and CA. Without a preferred list the first match in
    // the sorted-by-dial-code-length order is returned (which is US, appearing
    // before CA in COUNTRIES).
    const result = parseInternationalNumber("+12025551234", [US, CA]);
    expect(result.dialCode).toBe("+1");
    expect(result.phoneNumber).toBe("2025551234");
    expect(result.detectedCountry).not.toBeNull();
  });

  it("prefers the preferred country when multiple countries share a dial code", () => {
    const result = parseInternationalNumber(
      "+14165551234",
      [US, CA],
      ["ca"]
    );
    expect(result.detectedCountry).toBe(CA);
    expect(result.dialCode).toBe("+1");
    expect(result.phoneNumber).toBe("4165551234");
  });

  it("falls back to first match when preferred country is not among the dial-code matches", () => {
    // +1 matches US and CA; preferred is FR (not a +1 country).
    const result = parseInternationalNumber("+12025551234", [US, CA], ["fr"]);
    expect(result.detectedCountry).not.toBeNull();
    expect(result.dialCode).toBe("+1");
  });

  it("returns no country when dial code is not recognised", () => {
    const result = parseInternationalNumber("+9991234567", COUNTRIES);
    expect(result.dialCode).toBeNull();
    expect(result.detectedCountry).toBeNull();
    // phoneNumber should still be all digits.
    expect(result.phoneNumber).toBe("9991234567");
  });

  it("returns empty phoneNumber when input is just '+'", () => {
    const result = parseInternationalNumber("+", COUNTRIES);
    expect(result.phoneNumber).toBe("");
  });

  it("trims leading and trailing whitespace before processing", () => {
    const result = parseInternationalNumber("  +442071234567  ", COUNTRIES);
    expect(result.detectedCountry).toBe(GB);
  });

  it("handles empty string gracefully", () => {
    const result = parseInternationalNumber("", COUNTRIES);
    expect(result.dialCode).toBeNull();
    expect(result.detectedCountry).toBeNull();
    expect(result.phoneNumber).toBe("");
  });
});

// ─── formatForCopy ────────────────────────────────────────────────────────────

describe("formatForCopy", () => {
  it("returns empty string when phone has no digits", () => {
    expect(formatForCopy("---", US, "e164")).toBe("");
  });

  it("returns empty string when phone is empty", () => {
    expect(formatForCopy("", US, "e164")).toBe("");
  });

  it("returns raw digits when country is null", () => {
    expect(formatForCopy("2025551234", null, "e164")).toBe("2025551234");
    expect(formatForCopy("2025551234", null, "international")).toBe(
      "2025551234"
    );
    expect(formatForCopy("2025551234", null, "national")).toBe("2025551234");
  });

  it("formats as E.164 (no spaces)", () => {
    const result = formatForCopy("2025551234", US, "e164");
    expect(result).toBe("+12025551234");
    // Must not contain spaces.
    expect(result).not.toContain(" ");
  });

  it("E.164 strips spaces that might appear in a dial code", () => {
    // Ensure the replace(/\s/g,'') in e164 branch is exercised.
    const result = formatForCopy("2025551234", US, "e164");
    expect(/\s/.test(result)).toBe(false);
  });

  it("formats as international (dialCode + space + national format)", () => {
    const result = formatForCopy("2025551234", US, "international");
    expect(result).toBe("+1 (202) 555-1234");
  });

  it("formats as national (national format only, no dial code)", () => {
    const result = formatForCopy("2025551234", US, "national");
    expect(result).toBe("(202) 555-1234");
  });

  it("formats UK e164 correctly", () => {
    expect(formatForCopy("02071234567", GB, "e164")).toBe("+4402071234567");
  });

  it("formats UK international correctly", () => {
    expect(formatForCopy("02071234567", GB, "international")).toBe(
      "+44 02071 234 567"
    );
  });

  it("formats UK national correctly", () => {
    expect(formatForCopy("02071234567", GB, "national")).toBe("02071 234 567");
  });

  it("strips non-digit characters from phone before formatting", () => {
    // Passing a pre-formatted national string; digits are the same.
    expect(formatForCopy("(202) 555-1234", US, "e164")).toBe("+12025551234");
  });

  it("applies custom patterns when provided (for a country not already covered by a built-in pattern)", () => {
    // Same constraint as formatPhoneNumber: built-in patterns are iterated first,
    // so a custom entry must use a flag not already matched by a built-in pattern.
    const ZZ: CountryOption = {
      value: "zz",
      label: "Ztest",
      flag: "zz",
      dialCode: "+999",
      name: "Ztest",
    };
    const customPatterns = {
      CUSTOM: {
        pattern: () => "FORMATTED",
        countries: ["zz"] as const,
      },
    };
    expect(formatForCopy("2025551234", ZZ, "national", customPatterns)).toBe(
      "FORMATTED"
    );
  });
});

// ─── computeCursorPosition ────────────────────────────────────────────────────

describe("computeCursorPosition", () => {
  it("returns 0 when cursor is at position 0 (no digits before cursor)", () => {
    expect(computeCursorPosition("(202) 555-1234", "(202) 555-1234", 0)).toBe(
      0
    );
  });

  it("returns 0 when there are no digits before the old cursor position", () => {
    // oldValue starts with '(' and cursor is at 1 — no digits yet.
    expect(computeCursorPosition("(202)", "(202)", 1)).toBe(0);
  });

  it("returns new string length when all digits precede the cursor (cursor at end)", () => {
    const oldValue = "202";
    const newValue = "202";
    // Cursor after all 3 digits.
    const pos = computeCursorPosition(oldValue, newValue, 3);
    expect(pos).toBe(3);
  });

  it("correctly maps cursor after first digit through formatting", () => {
    // oldValue: "2", cursor at 1 (after '2') → 1 digit before cursor.
    // newValue: "2" → first digit is at index 0 → return 0+1 = 1.
    expect(computeCursorPosition("2", "2", 1)).toBe(1);
  });

  it("tracks digits before cursor through a format change", () => {
    // oldValue: "2025551234" (10 raw digits, cursor at end = 10)
    // newValue: "(202) 555-1234" (formatted)
    // Digits before cursor in old: 10.
    // In newValue the 10th digit '4' is at index 13 → return 14.
    const pos = computeCursorPosition("2025551234", "(202) 555-1234", 10);
    expect(pos).toBe(14);
  });

  it("handles cursor in the middle of oldValue", () => {
    // oldValue: "(202) 555-1234", cursor at index 6
    // oldValue.slice(0,6) = "(202) " → digits: '2','0','2' → 3 digits before cursor.
    // newValue: "(202) 555-1234"
    // Loop: i=0 '(' skip; i=1 '2' count=1; i=2 '0' count=2; i=3 '2' count=3 → return 3+1=4.
    const pos = computeCursorPosition("(202) 555-1234", "(202) 555-1234", 6);
    expect(pos).toBe(4);
  });

  it("returns newValue.length when there are more digits before cursor than digits in newValue", () => {
    // oldValue: "1234567890" cursor at 10 (10 digits), newValue has only 5 digits.
    const pos = computeCursorPosition("1234567890", "12345", 10);
    expect(pos).toBe(5);
  });

  it("handles empty oldValue and newValue", () => {
    expect(computeCursorPosition("", "", 0)).toBe(0);
  });

  it("handles cursor at the very start of a formatted string (position 1, non-digit first char)", () => {
    // oldValue: "(202)", cursor at 0. No digits before.
    expect(computeCursorPosition("(202)", "(202)", 0)).toBe(0);
  });

  it("correctly positions after exactly 3 digits in a formatted US number", () => {
    // "(202) 555-1234", cursor after "(202)" = index 5.
    // oldValue.slice(0,5) = "(202)" → digits '2','0','2' → 3 digits before cursor.
    // newValue "(202) 555-1234":
    //   i=0 '(' skip; i=1 '2' count=1; i=2 '0' count=2; i=3 '2' count=3 → return 3+1=4.
    const pos = computeCursorPosition(
      "(202) 555-1234",
      "(202) 555-1234",
      5
    );
    expect(pos).toBe(4);
  });
});
