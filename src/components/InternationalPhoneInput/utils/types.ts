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
}

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
  /** Fires when the phone number changes, providing full validation data. */
  onValueChange?: (data: PhoneNumberData) => void;
  onCountryChange?: (country: CountryOption) => void;
  defaultCountry?: string;
  countries?: CountryOption[];
  preferredCountries?: string[];
  id?: string;
  name?: string;
  label?: ReactNode;
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
  renderCountryOption?: (props: CountryOptionRenderProps) => ReactNode;
  renderSelectedCountry?: (country: CountryOption) => ReactNode;
  formatPatterns?: Record<string, PhoneFormatPattern>;
  lengthRules?: Record<string, PhoneLengthRule>;
  className?: string;
  style?: CSSProperties;
  classes?: InternationalPhoneInputClasses;
  unstyled?: boolean;
}
