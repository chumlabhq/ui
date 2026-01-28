import type { ReactNode } from "react";

export interface CountryOption {
  value: string;
  label: string;
  flag: string;
  dialCode: string;
  name: string;
}

export interface PhoneNumberData {
  countryCode: string;
  phoneNumber: string;
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

export interface InternationalPhoneInputProps {
  value?: PhoneNumberData;
  onChange?: (data: PhoneNumberData) => void;
  onCountryChange?: (country: CountryOption) => void;
  defaultCountry?: string;
  countries?: CountryOption[];
  preferredCountries?: string[];
  id?: string;
  name?: string;
  label?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  validateOnBlur?: boolean;
  enablePasteDetection?: boolean;
  copyFormat?: CopyFormat;
  onPasteDetected?: (data: PasteDetectedData) => void;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  inputClassName?: string;
  inputFocusClassName?: string;
  inputWrapperClassName?: string;
  countrySelectClassName?: string;
  countrySelectTriggerClassName?: string;
  countrySelectTriggerFocusClassName?: string;
  countrySelectDropdownClassName?: string;
  countrySelectSearchInputClassName?: string;
  countrySelectOptionClassName?: string;
  countrySelectOptionSelectedClassName?: string;
  countrySelectOptionListClassName?: string;
  countrySelectChevronClassName?: string;
  countrySelectSelectedIndicatorClassName?: string;
  countrySelectSelectedIndicator?: ReactNode;
  countrySelectSearchIconClassName?: string;
  countrySelectNoResultsClassName?: string;
  countryDropdownPlaceholder?: string;
  countrySearchPlaceholder?: string;
}
