import type { SearchableDropdownClasses } from "../../SearchableDropdown/utils/types.js";
import type { ReactNode, InputHTMLAttributes, CSSProperties } from "react";

/**
 * One country in the picker, and what the component reports when it is selected.
 */
export interface CountryOption {
  /** ISO 3166-1 alpha-2 code, which is what `value.countryCode` carries. */
  value: string;
  /** The country's display name in the list. */
  label: string;
  /** The flag emoji or asset for this country. */
  flag: string;
  /** International dialling prefix, with its leading plus. */
  dialCode: string;
  /** The searchable name, which may differ from `label` where the list shows a short form. */
  name: string;
}

/**
 * The controlled value: which country, and the national number typed under it.
 */
export interface PhoneNumberValue {
  /** ISO code of the selected country. */
  countryCode: string;
  /** The national number as typed, without the dial code. */
  phoneNumber: string;
}

/**
 * The parsed number in every form a caller is likely to need, so none has to be derived twice.
 */
export interface PhoneNumberData extends PhoneNumberValue {
  /** Dial code and national number joined, which is what most APIs want. */
  fullNumber: string;
  /** Whether the number satisfies its country's length rule. */
  isValid: boolean;
  /** Digits without the dial code. */
  nationalNumber?: string;
  /** E.164-style form, grouped for reading. */
  internationalNumber?: string;
}

export type CopyFormat = "e164" | "international" | "national";

/**
 * What a paste was understood to be, handed to `onPasteDetected` so a caller can accept or override the inference.
 */
export interface PasteDetectedData {
  /** Exactly what was pasted, before any parsing. */
  rawValue: string;
  /** The country inferred from the pasted prefix, or null when nothing matched. */
  detectedCountry: CountryOption | null;
  /** The national part left after the detected prefix was removed. */
  phoneNumber: string;
}

export interface CountryOptionRenderProps {
  country: CountryOption;
  isSelected: boolean;
}

/**
 * The national-digit count a country accepts, which is what validity is judged against.
 */
export interface PhoneLengthRule {
  /** Fewest national digits a valid number may have. */
  min: number;
  /** Most it may have. */
  max: number;
}

/**
 * A grouping rule for one set of countries, so a bare digit string prints the way that country writes it.
 */
export interface PhoneFormatPattern {
  /** Formats a bare digit string into the country's grouping. */
  pattern: (digits: string) => string;
  /** The ISO codes this pattern applies to. */
  countries: readonly string[];
}

export interface InternationalPhoneInputClasses {
  /** Outer container div */
  root?: string;
  /** Label element */
  label?: string;
  /** The bordered box holding the country trigger and the number field. */
  control?: string;
  /** Phone number input element */
  input?: string;
  /** The error or hint line under the control. */
  message?: string;
  /**
   * The country picker is a `SearchableDropdown`, so this takes that
   * component's own classes object rather than a class string.
   */
  countrySelect?: SearchableDropdownClasses;
  /**
   * The option row IPI renders into the child's `item` slot. These are IPI's
   * own parts, not the dropdown's: SearchableDropdown has no itemRow/itemIcon/
   * itemText, and adding them would grow that component's API for one caller.
   */
  itemRow?: string;
  /** The flag inside one row of the country list. */
  itemIcon?: string;
  /** Country name and dial code inside one row. */
  itemText?: string;
  /** A row inside the country list: flag + name + dial code. */
  /** The selected country shown on the trigger. */
  triggerRow?: string;
  /** The flag shown in the control itself, for the selected country. */
  flag?: string;
  /** The typed number inside the control. */
  value?: string;
  /** The helper line under the label, above the control. */
  description?: string;
}

/**
 * Props for the InternationalPhoneInput component.
 *
 * @example
 * ```tsx
 * <InternationalPhoneInput
 *   value={{ countryCode: "US", phoneNumber: "5551234567" }}
 *   onValueChange={(data) => setPhone(data)}
 *   defaultCountry="US"
 * />
 * ```
 */
export interface InternationalPhoneInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "value"
    | "defaultValue"
    | "onChange"
    | "type"
    | "prefix"
    | "size"
    | "className"
    | "style"
  > {
  /** Controlled phone value (countryCode + phoneNumber). */
  value?: PhoneNumberValue;
  /** Default phone value for uncontrolled usage. */
  defaultValue?: PhoneNumberValue;
  /** Fires when the phone number changes, providing full validation data. Not `onChange`. */
  onValueChange?: (data: PhoneNumberData) => void;
  onCountryChange?: (country: CountryOption) => void;
  defaultCountry?: string;
  countries?: CountryOption[];
  preferredCountries?: string[];
  id?: string;
  name?: string;
  label?: ReactNode;
  /** Helper text displayed below the label. */
  description?: ReactNode;
  /** When true, the input is in a loading state. */
  loading?: boolean;
  /** When true, shows a clear button to reset the phone number. */
  clearable?: boolean;
  /** Called when the clear button is clicked. */
  onClear?: () => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  validateOnBlur?: boolean;
  validationMessage?: ReactNode;
  /**
   * Custom validation. Receives the full PhoneNumberData (including the built-in
   * `isValid` and the E.164 `fullNumber`) and is authoritative: its verdict
   * overrides the built-in length check for both the emitted `isValid` and the
   * blur error. Return a boolean, or `{ valid, message }` to also override the
   * error text. Compose with the built-in via `data.isValid && myCheck(data)`.
   * When omitted, the built-in length validation is used unchanged.
   */
  validate?: (
    data: PhoneNumberData,
  ) => boolean | { valid: boolean; message?: string };
  enablePasteDetection?: boolean;
  copyFormat?: CopyFormat;
  onPasteDetected?: (data: PasteDetectedData) => void;
  countryDropdownPlaceholder?: string;
  countrySearchPlaceholder?: string;
  countryDropdownAriaLabel?: string;
  selectedIcon?: ReactNode;
  flagSize?: number;
  renderCountryOption?: (props: CountryOptionRenderProps) => ReactNode;
  renderSelectedCountry?: (country: CountryOption) => ReactNode;
  formatPatterns?: Record<string, PhoneFormatPattern>;
  lengthRules?: Record<string, PhoneLengthRule>;
  className?: string;
  style?: CSSProperties;
  classes?: InternationalPhoneInputClasses;
  unstyled?: boolean;

  /** Vertical placement of the country dropdown relative to the trigger. */
  dropdownPosition?: "top" | "bottom";
  /** When true, locks the country dropdown to the specified dropdownPosition without auto-flipping. */
  forceDropdownPosition?: boolean;
  /** Z-index of the country dropdown popup. */
  dropdownZIndex?: number;
  /** Gap in pixels between trigger and country dropdown popup. */
  dropdownGap?: number;
  /** Portal target for the country dropdown. */
  portalContainer?: HTMLElement | null;
  /** When true, locks body scroll while the country dropdown is open. */
  lockScroll?: boolean;
}
