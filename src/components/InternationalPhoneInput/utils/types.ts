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
  root?: string;
  label?: string;
  wrapper?: string;
  input?: string;
  error?: string;
  success?: string;
  countrySelect?: string;
  countrySelectTrigger?: string;
  countrySelectDropdown?: string;
  countrySelectSearchInput?: string;
  countrySelectSearchInputElement?: string;
  countrySelectOption?: string;
  countrySelectOptionSelected?: string;
  countrySelectOptionList?: string;
  countrySelectChevron?: string;
  countrySelectCheckIcon?: string;
  countrySelectSearchIcon?: string;
  countrySelectNoResults?: string;
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

  // ─── Dropdown positioning ────────────────────────────────────────
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
