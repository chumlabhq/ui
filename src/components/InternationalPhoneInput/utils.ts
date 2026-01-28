import type { CountryOption, PhoneNumberData } from "./types";
import { PHONE_FORMATTING_PATTERNS, PHONE_LENGTH_RULES } from "./constants";

export const findCountryByCode = (
  code: string,
  countries: CountryOption[]
): CountryOption | null => {
  if (!code) return null;
  const normalizedCode = code.toLowerCase();
  return (
    countries.find(
      (country) =>
        country.value.toLowerCase() === normalizedCode ||
        country.flag.toLowerCase() === normalizedCode
    ) || null
  );
};

export const findCountryByDialCode = (
  dialCode: string,
  countries: CountryOption[]
): CountryOption | null => {
  if (!dialCode) return null;
  return (
    countries.find(
      (country) => country.dialCode === dialCode
    ) || null
  );
};

export const formatPhoneNumber = (
  phone: string,
  country: CountryOption | null
): string => {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  if (!country) {
    return PHONE_FORMATTING_PATTERNS.DEFAULT.pattern(digits);
  }

  const countryFlag = country.flag.toLowerCase();

  for (const pattern of Object.values(PHONE_FORMATTING_PATTERNS)) {
    if (pattern.countries.includes(countryFlag)) {
      return pattern.pattern(digits);
    }
  }

  return PHONE_FORMATTING_PATTERNS.DEFAULT.pattern(digits);
};

export const validatePhoneNumber = (
  phone: string,
  country: CountryOption | null
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

  if (!country) {
    return {
      countryCode: "",
      phoneNumber: digits,
      fullNumber: digits,
      isValid: digits.length >= 7 && digits.length <= 15,
    };
  }

  const rules = PHONE_LENGTH_RULES[country.value] || PHONE_LENGTH_RULES.DEFAULT;
  const isValidLength = digits.length >= rules.min && digits.length <= rules.max;

  const fullNumber = `${country.dialCode}${digits}`;

  return {
    countryCode: country.value,
    phoneNumber: digits,
    fullNumber,
    nationalNumber: digits,
    internationalNumber: `${country.dialCode} ${formatPhoneNumber(digits, country)}`,
    isValid: isValidLength,
  };
};

export const sortCountryOptions = (
  countries: CountryOption[],
  preferredCountries: string[] = []
): CountryOption[] => {
  if (!preferredCountries.length) {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }

  const preferredSet = new Set(preferredCountries.map((c) => c.toLowerCase()));

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

export const isEmptyPhoneNumber = (phone: string | null | undefined): boolean => {
  return !phone || phone.trim() === "" || getDigitsOnly(phone) === "";
};

export interface ParsedPhoneNumber {
  dialCode: string | null;
  phoneNumber: string;
  detectedCountry: CountryOption | null;
}

export const parseInternationalNumber = (
  value: string,
  countries: CountryOption[]
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
    (a, b) => b.dialCode.length - a.dialCode.length
  );
  
  for (const country of sortedByLength) {
    const dialDigits = getDigitsOnly(country.dialCode);
    if (digits.startsWith(dialDigits)) {
      return {
        dialCode: country.dialCode,
        phoneNumber: digits.slice(dialDigits.length),
        detectedCountry: country,
      };
    }
  }
  
  return {
    dialCode: null,
    phoneNumber: digits,
    detectedCountry: null,
  };
};

export const formatForCopy = (
  phoneNumber: string,
  country: CountryOption | null,
  format: "e164" | "international" | "national"
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
      return `${country.dialCode} ${formatPhoneNumber(digits, country)}`;
    case "national":
      return formatPhoneNumber(digits, country);
    default:
      return `${country.dialCode}${digits}`.replace(/\s/g, "");
  }
};
