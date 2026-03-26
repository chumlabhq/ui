import type {
  CountryOption,
  PhoneNumberData,
  PhoneFormatPattern,
  PhoneLengthRule,
} from "./utils/types";
import { PHONE_FORMATTING_PATTERNS, PHONE_LENGTH_RULES } from "./constants";

export const findCountryByCode = (
  code: string,
  countries: CountryOption[],
): CountryOption | null => {
  if (!code) return null;
  const normalizedCode = code.toLowerCase();
  return (
    countries.find(
      (country) =>
        country.value.toLowerCase() === normalizedCode ||
        country.flag.toLowerCase() === normalizedCode,
    ) || null
  );
};

export const findCountryByDialCode = (
  dialCode: string,
  countries: CountryOption[],
): CountryOption | null => {
  if (!dialCode) return null;
  return countries.find((country) => country.dialCode === dialCode) || null;
};

export const formatPhoneNumber = (
  phone: string,
  country: CountryOption | null,
  customPatterns?: Record<string, PhoneFormatPattern>,
): string => {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  const patterns = customPatterns
    ? { ...PHONE_FORMATTING_PATTERNS, ...customPatterns }
    : PHONE_FORMATTING_PATTERNS;

  if (!country) {
    const defaultPattern =
      patterns.DEFAULT || PHONE_FORMATTING_PATTERNS.DEFAULT;
    return defaultPattern.pattern(digits);
  }

  const countryFlag = country.flag.toLowerCase();

  for (const pattern of Object.values(patterns)) {
    if (pattern.countries.includes(countryFlag)) {
      return pattern.pattern(digits);
    }
  }

  const defaultPattern = patterns.DEFAULT || PHONE_FORMATTING_PATTERNS.DEFAULT;
  return defaultPattern.pattern(digits);
};

export const validatePhoneNumber = (
  phone: string,
  country: CountryOption | null,
  customRules?: Record<string, PhoneLengthRule>,
  customPatterns?: Record<string, PhoneFormatPattern>,
): PhoneNumberData => {
  const emptyResult: PhoneNumberData = {
    countryCode: country?.value || "",
    phoneNumber: "",
    fullNumber: "",
    isValid: false,
  };

  if (!phone) return emptyResult;

  const digits = phone.replace(/\D/g, "");

  if (!digits) return emptyResult;

  const allRules = customRules
    ? { ...PHONE_LENGTH_RULES, ...customRules }
    : PHONE_LENGTH_RULES;

  if (!country) {
    const defaultRule = allRules.DEFAULT || PHONE_LENGTH_RULES.DEFAULT;
    return {
      countryCode: "",
      phoneNumber: digits,
      fullNumber: digits,
      isValid: digits.length >= defaultRule.min && digits.length <= defaultRule.max,
    };
  }

  const rules = allRules[country.value] || allRules.DEFAULT || PHONE_LENGTH_RULES.DEFAULT;
  const isValidLength =
    digits.length >= rules.min && digits.length <= rules.max;

  const fullNumber = `${country.dialCode}${digits}`;

  return {
    countryCode: country.value,
    phoneNumber: digits,
    fullNumber,
    nationalNumber: digits,
    internationalNumber: `${country.dialCode} ${formatPhoneNumber(digits, country, customPatterns)}`,
    isValid: isValidLength,
  };
};

export const sortCountryOptions = (
  countries: CountryOption[],
  preferredCountries: string[] = [],
): CountryOption[] => {
  if (!preferredCountries.length) {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }

  const preferredSet = new Set(
    preferredCountries.map((c) => c.toLowerCase()),
  );

  return [...countries].sort((a, b) => {
    const aIsPreferred = preferredSet.has(a.flag.toLowerCase());
    const bIsPreferred = preferredSet.has(b.flag.toLowerCase());

    if (aIsPreferred && !bIsPreferred) return -1;
    if (!aIsPreferred && bIsPreferred) return 1;

    return a.name.localeCompare(b.name);
  });
};

export const getDigitsOnly = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const isEmptyPhoneNumber = (
  phone: string | null | undefined,
): boolean => {
  return !phone || phone.trim() === "" || getDigitsOnly(phone) === "";
};

export interface ParsedPhoneNumber {
  dialCode: string | null;
  phoneNumber: string;
  detectedCountry: CountryOption | null;
}

export const parseInternationalNumber = (
  value: string,
  countries: CountryOption[],
  preferredCountries: string[] = [],
): ParsedPhoneNumber => {
  let normalized = value.trim();

  if (normalized.startsWith("00")) {
    normalized = "+" + normalized.slice(2);
  }

  if (!normalized.startsWith("+")) {
    return {
      dialCode: null,
      phoneNumber: getDigitsOnly(normalized),
      detectedCountry: null,
    };
  }

  const digits = getDigitsOnly(normalized);

  const sortedByLength = [...countries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length,
  );

  const matches: CountryOption[] = [];
  let matchedDialDigits = "";

  for (const country of sortedByLength) {
    const dialDigits = getDigitsOnly(country.dialCode);
    if (digits.startsWith(dialDigits)) {
      if (!matchedDialDigits) {
        matchedDialDigits = dialDigits;
      }
      if (dialDigits === matchedDialDigits) {
        matches.push(country);
      }
    }
  }

  if (matches.length === 0) {
    return {
      dialCode: null,
      phoneNumber: digits,
      detectedCountry: null,
    };
  }

  if (matches.length === 1) {
    return {
      dialCode: matches[0].dialCode,
      phoneNumber: digits.slice(matchedDialDigits.length),
      detectedCountry: matches[0],
    };
  }

  const preferredSet = new Set(
    preferredCountries.map((c) => c.toLowerCase()),
  );
  const preferredMatch = matches.find((c) =>
    preferredSet.has(c.flag.toLowerCase()),
  );

  const winner = preferredMatch || matches[0];
  return {
    dialCode: winner.dialCode,
    phoneNumber: digits.slice(matchedDialDigits.length),
    detectedCountry: winner,
  };
};

export const formatForCopy = (
  phoneNumber: string,
  country: CountryOption | null,
  format: "e164" | "international" | "national",
  customPatterns?: Record<string, PhoneFormatPattern>,
): string => {
  const digits = getDigitsOnly(phoneNumber);
  if (!digits) return "";

  if (!country) {
    return digits;
  }

  switch (format) {
    case "e164":
      return `${country.dialCode}${digits}`.replace(/\s/g, "");
    case "international":
      return `${country.dialCode} ${formatPhoneNumber(digits, country, customPatterns)}`;
    case "national":
      return formatPhoneNumber(digits, country, customPatterns);
    default:
      return `${country.dialCode}${digits}`.replace(/\s/g, "");
  }
};

export const computeCursorPosition = (
  oldValue: string,
  newValue: string,
  oldCursorPos: number,
): number => {
  const digitsBeforeCursor = oldValue
    .slice(0, oldCursorPos)
    .replace(/\D/g, "").length;

  if (digitsBeforeCursor === 0) return 0;

  let digitCount = 0;
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      digitCount++;
      if (digitCount === digitsBeforeCursor) {
        return i + 1;
      }
    }
  }
  return newValue.length;
};
