import type { CountryOption } from "./utils/types";
import type { InternationalPhoneInputClasses } from "./utils/types";

export const PHONE_FORMATTING_PATTERNS: Record<
  string,
  { pattern: (digits: string) => string; countries: readonly string[] }
> = {
  US_CANADA: {
    pattern: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6)
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    },
    countries: ["us", "ca"],
  },
  UK: {
    pattern: (digits: string) => {
      if (digits.length <= 5) return digits;
      if (digits.length <= 8) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
      return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    },
    countries: ["gb"],
  },
  FRANCE: {
    pattern: (digits: string) => {
      if (digits.length <= 2) return digits;
      const groups = digits.match(/.{1,2}/g) || [];
      return groups.join(" ");
    },
    countries: ["fr"],
  },
  GERMANY: {
    pattern: (digits: string) => {
      if (digits.length <= 4) return digits;
      if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
    },
    countries: ["de"],
  },
  JAPAN: {
    pattern: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    },
    countries: ["jp"],
  },
  INDIA: {
    pattern: (digits: string) => {
      if (digits.length <= 5) return digits;
      return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
    },
    countries: ["in"],
  },
  AUSTRALIA: {
    pattern: (digits: string) => {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    },
    countries: ["au"],
  },
  BRAZIL: {
    pattern: (digits: string) => {
      if (digits.length <= 2) return digits;
      if (digits.length <= 7)
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    },
    countries: ["br"],
  },
  CHINA: {
    pattern: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    },
    countries: ["cn"],
  },
  DEFAULT: {
    pattern: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 9)
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    },
    countries: [],
  },
};

export const DEFAULT_PREFERRED_COUNTRIES = ["us", "gb", "ca", "au"];
export const DEFAULT_COUNTRY = "us";

export const DEFAULT_COUNTRIES: CountryOption[] = [
  { value: "US", label: "United States (+1)", flag: "us", dialCode: "+1", name: "United States" },
  { value: "GB", label: "United Kingdom (+44)", flag: "gb", dialCode: "+44", name: "United Kingdom" },
  { value: "CA", label: "Canada (+1)", flag: "ca", dialCode: "+1", name: "Canada" },
  { value: "AU", label: "Australia (+61)", flag: "au", dialCode: "+61", name: "Australia" },
  { value: "DE", label: "Germany (+49)", flag: "de", dialCode: "+49", name: "Germany" },
  { value: "FR", label: "France (+33)", flag: "fr", dialCode: "+33", name: "France" },
  { value: "IT", label: "Italy (+39)", flag: "it", dialCode: "+39", name: "Italy" },
  { value: "ES", label: "Spain (+34)", flag: "es", dialCode: "+34", name: "Spain" },
  { value: "NL", label: "Netherlands (+31)", flag: "nl", dialCode: "+31", name: "Netherlands" },
  { value: "BE", label: "Belgium (+32)", flag: "be", dialCode: "+32", name: "Belgium" },
  { value: "CH", label: "Switzerland (+41)", flag: "ch", dialCode: "+41", name: "Switzerland" },
  { value: "AT", label: "Austria (+43)", flag: "at", dialCode: "+43", name: "Austria" },
  { value: "SE", label: "Sweden (+46)", flag: "se", dialCode: "+46", name: "Sweden" },
  { value: "NO", label: "Norway (+47)", flag: "no", dialCode: "+47", name: "Norway" },
  { value: "DK", label: "Denmark (+45)", flag: "dk", dialCode: "+45", name: "Denmark" },
  { value: "FI", label: "Finland (+358)", flag: "fi", dialCode: "+358", name: "Finland" },
  { value: "IE", label: "Ireland (+353)", flag: "ie", dialCode: "+353", name: "Ireland" },
  { value: "PT", label: "Portugal (+351)", flag: "pt", dialCode: "+351", name: "Portugal" },
  { value: "PL", label: "Poland (+48)", flag: "pl", dialCode: "+48", name: "Poland" },
  { value: "CZ", label: "Czech Republic (+420)", flag: "cz", dialCode: "+420", name: "Czech Republic" },
  { value: "JP", label: "Japan (+81)", flag: "jp", dialCode: "+81", name: "Japan" },
  { value: "CN", label: "China (+86)", flag: "cn", dialCode: "+86", name: "China" },
  { value: "KR", label: "South Korea (+82)", flag: "kr", dialCode: "+82", name: "South Korea" },
  { value: "IN", label: "India (+91)", flag: "in", dialCode: "+91", name: "India" },
  { value: "SG", label: "Singapore (+65)", flag: "sg", dialCode: "+65", name: "Singapore" },
  { value: "HK", label: "Hong Kong (+852)", flag: "hk", dialCode: "+852", name: "Hong Kong" },
  { value: "NZ", label: "New Zealand (+64)", flag: "nz", dialCode: "+64", name: "New Zealand" },
  { value: "MX", label: "Mexico (+52)", flag: "mx", dialCode: "+52", name: "Mexico" },
  { value: "BR", label: "Brazil (+55)", flag: "br", dialCode: "+55", name: "Brazil" },
  { value: "AR", label: "Argentina (+54)", flag: "ar", dialCode: "+54", name: "Argentina" },
  { value: "ZA", label: "South Africa (+27)", flag: "za", dialCode: "+27", name: "South Africa" },
  { value: "AE", label: "United Arab Emirates (+971)", flag: "ae", dialCode: "+971", name: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia (+966)", flag: "sa", dialCode: "+966", name: "Saudi Arabia" },
  { value: "IL", label: "Israel (+972)", flag: "il", dialCode: "+972", name: "Israel" },
  { value: "RU", label: "Russia (+7)", flag: "ru", dialCode: "+7", name: "Russia" },
  { value: "TR", label: "Turkey (+90)", flag: "tr", dialCode: "+90", name: "Turkey" },
  { value: "TH", label: "Thailand (+66)", flag: "th", dialCode: "+66", name: "Thailand" },
  { value: "MY", label: "Malaysia (+60)", flag: "my", dialCode: "+60", name: "Malaysia" },
  { value: "ID", label: "Indonesia (+62)", flag: "id", dialCode: "+62", name: "Indonesia" },
  { value: "PH", label: "Philippines (+63)", flag: "ph", dialCode: "+63", name: "Philippines" },
  { value: "VN", label: "Vietnam (+84)", flag: "vn", dialCode: "+84", name: "Vietnam" },
];

export const PHONE_LENGTH_RULES: Record<string, { min: number; max: number }> = {
  US: { min: 10, max: 10 },
  CA: { min: 10, max: 10 },
  GB: { min: 10, max: 11 },
  AU: { min: 9, max: 9 },
  DE: { min: 10, max: 11 },
  FR: { min: 9, max: 9 },
  IN: { min: 10, max: 10 },
  JP: { min: 10, max: 11 },
  CN: { min: 11, max: 11 },
  KR: { min: 10, max: 11 },
  SG: { min: 8, max: 8 },
  HK: { min: 8, max: 8 },
  BR: { min: 10, max: 11 },
  MX: { min: 10, max: 10 },
  IT: { min: 9, max: 11 },
  ES: { min: 9, max: 9 },
  NL: { min: 9, max: 9 },
  BE: { min: 9, max: 9 },
  CH: { min: 9, max: 9 },
  AT: { min: 10, max: 13 },
  SE: { min: 9, max: 10 },
  NO: { min: 8, max: 8 },
  DK: { min: 8, max: 8 },
  FI: { min: 9, max: 10 },
  IE: { min: 9, max: 9 },
  PT: { min: 9, max: 9 },
  PL: { min: 9, max: 9 },
  CZ: { min: 9, max: 9 },
  NZ: { min: 9, max: 10 },
  AR: { min: 10, max: 10 },
  ZA: { min: 9, max: 9 },
  AE: { min: 9, max: 9 },
  SA: { min: 9, max: 9 },
  IL: { min: 9, max: 9 },
  RU: { min: 10, max: 10 },
  TR: { min: 10, max: 10 },
  TH: { min: 9, max: 9 },
  MY: { min: 9, max: 10 },
  ID: { min: 10, max: 12 },
  PH: { min: 10, max: 10 },
  VN: { min: 9, max: 10 },
  DEFAULT: { min: 7, max: 15 },
};

export const DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES: Required<InternationalPhoneInputClasses> = {
  root: "",
  label: "",
  description: "",
  wrapper: "",
  input: "",
  error: "",
  success: "",
  countrySelect: "",
  countrySelectTrigger: "",
  countrySelectDropdown: "",
  countrySelectSearchInput: "",
  countrySelectSearchInputElement: "",
  countrySelectOption: "",
  countrySelectOptionSelected: "",
  countrySelectOptionList: "",
  countrySelectChevron: "",
  countrySelectCheckIcon: "",
  countrySelectSearchIcon: "",
  countrySelectNoResults: "",
};

export const UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES: Required<InternationalPhoneInputClasses> = {
  root: "",
  label: "",
  description: "",
  wrapper: "",
  input: "",
  error: "",
  success: "",
  countrySelect: "",
  countrySelectTrigger: "",
  countrySelectDropdown: "",
  countrySelectSearchInput: "",
  countrySelectSearchInputElement: "",
  countrySelectOption: "",
  countrySelectOptionSelected: "",
  countrySelectOptionList: "",
  countrySelectChevron: "",
  countrySelectCheckIcon: "",
  countrySelectSearchIcon: "",
  countrySelectNoResults: "",
};
