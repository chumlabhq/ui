import type { SearchableDropdownClasses } from "../../SearchableDropdown/utils/types.js";
import type { ReactNode, InputHTMLAttributes, CSSProperties } from "react";

export interface CountryOption {
  value: string;
  label: string;
  flag: string;
  dialCode: string;
  name: string;
}

export interface PhoneNumberValue {
  countryCode: string;
  phoneNumber: string;
}

export interface PhoneNumberData extends PhoneNumberValue {
  fullNumber: string;
  isValid: boolean;
  nationalNumber?: string;
  internationalNumber?: string;
}

export type CopyFormat = "e164" | "international" | "national";

export interface PasteDetectedData {
  rawValue: string;
  detectedCountry: CountryOption | null;
  phoneNumber: string;
}

export interface CountryOptionRenderProps {
  country: CountryOption;
  isSelected: boolean;
}

export interface PhoneLengthRule {
  min: number;
  max: number;
}

export interface PhoneFormatPattern {
  pattern: (digits: string) => string;
  countries: readonly string[];
}

export interface InternationalPhoneInputClasses {
  /** Outer container div */
  root?: string;
  /** Label element */
  label?: string;
  control?: string;
  /** Phone number input element */
  input?: string;
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
  itemIcon?: string;
  itemText?: string;
  /** A row inside the country list: flag + name + dial code. */
  /** The selected country shown on the trigger. */
  triggerRow?: string;
  flag?: string;
  value?: string;
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
