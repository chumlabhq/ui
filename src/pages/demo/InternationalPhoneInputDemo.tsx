import { useState, useRef } from "react";
import {
  InternationalPhoneInput,
  type PhoneNumberData,
  type CountryOption,
  type PasteDetectedData,
  type PhoneFormatPattern,
  type PhoneLengthRule,
} from "../../components/InternationalPhoneInput";
import { CountryFlag } from "../../components/CountryFlag";
import { useTheme } from "./ThemeContext";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DemoLabel,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CircleCheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const DotIcon = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-block w-2 h-2 rounded-full bg-current ${className}`}
  />
);

const CheckSmallIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const getClasses = (dark: boolean) => ({
  phone: {
    root: "flex flex-col gap-1",
    label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
    wrapper: "flex gap-2 items-stretch",
    input: `flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]`,
    error: `text-xs mt-1.5 flex items-center gap-1.5 text-cl-error`,
    success: `text-xs mt-1.5 flex items-center gap-1.5 text-cl-success`,
    countrySelectTrigger: `flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-white hover:bg-cl-bg-hover text-cl-text dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:hover:bg-cl-text/6 dark:text-cl-text-secondary`,
 countrySelectDropdown: `w-72 rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-text/10`,
    countrySelectSearchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-text/10`,
    countrySelectSearchInputElement: `flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary`,
    countrySelectOptionList: "max-h-60 overflow-y-auto",
    countrySelectOption: `flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/6 dark:data-[focused]:bg-cl-text/10 dark:text-cl-text-secondary`,
    countrySelectOptionSelected: dark ? "bg-cl-accent/10" : "bg-cl-accent/10",
    countrySelectChevron:
      "w-4 h-4 shrink-0 transition-transform duration-200",
    countrySelectCheckIcon: `w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent`,
    countrySelectSearchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
    countrySelectNoResults: `px-3 py-4 text-sm text-center text-cl-text-tertiary`,
  },
  phoneError: {
    input: `flex-1 h-10 px-3 rounded-cl-md border bg-cl-error/[0.04] outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-error focus:ring-2 focus:ring-cl-error/30 dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-error/50 dark:bg-cl-error/[0.08] dark:focus:ring-2 dark:focus:ring-cl-error/30`,
    countrySelectTrigger: `flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-error bg-cl-error/[0.04] hover:bg-cl-error/[0.08] text-cl-text dark:border dark:border-cl-error/50 dark:bg-cl-error/[0.08] dark:hover:bg-cl-error/[0.14] dark:text-cl-text-secondary`,
  },
  phoneSuccess: {
    input: `flex-1 h-10 px-3 rounded-cl-md border bg-cl-success/[0.06] outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-success focus:ring-2 focus:ring-cl-success/30 dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-success/50 dark:bg-cl-success/[0.10] dark:focus:ring-2 dark:focus:ring-cl-success/30`,
    countrySelectTrigger: `flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-success bg-cl-success/[0.06] text-cl-text dark:border dark:border-cl-success/50 dark:bg-cl-success/[0.10] dark:text-cl-text-secondary`,
  },
  phoneDisabled: {
    input: `flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm opacity-50 cursor-not-allowed text-cl-text-tertiary placeholder:text-cl-text-secondary border-cl-border bg-cl-bg-hover dark:text-cl-text-tertiary dark:placeholder:text-cl-text-secondary dark:border dark:border-cl-text/5 dark:bg-cl-text/[0.02]`,
    countrySelectTrigger: `flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] opacity-50 cursor-not-allowed border-cl-border bg-cl-bg-hover text-cl-text-tertiary dark:border dark:border-cl-text/5 dark:bg-cl-text/[0.02] dark:text-cl-text-tertiary`,
    label: `text-[13px] font-medium mb-1.5 block text-cl-text-tertiary`,
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  code: `px-1.5 py-0.5 rounded-cl-md text-[11px] font-mono font-medium bg-cl-bg-elevated text-cl-text-secondary`,
  sectionLabel: `text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90`,
  resultBox: `rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const EUROPEAN_COUNTRIES: CountryOption[] = [
  { value: "GB", label: "United Kingdom (+44)", flag: "gb", dialCode: "+44", name: "United Kingdom" },
  { value: "DE", label: "Germany (+49)", flag: "de", dialCode: "+49", name: "Germany" },
  { value: "FR", label: "France (+33)", flag: "fr", dialCode: "+33", name: "France" },
  { value: "IT", label: "Italy (+39)", flag: "it", dialCode: "+39", name: "Italy" },
  { value: "ES", label: "Spain (+34)", flag: "es", dialCode: "+34", name: "Spain" },
  { value: "NL", label: "Netherlands (+31)", flag: "nl", dialCode: "+31", name: "Netherlands" },
  { value: "SE", label: "Sweden (+46)", flag: "se", dialCode: "+46", name: "Sweden" },
];

const CUSTOM_FORMAT_PATTERNS: Record<string, PhoneFormatPattern> = {
  CUSTOM_SG: {
    pattern: (digits: string) => {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
    },
    countries: ["sg"],
  },
};

const CUSTOM_LENGTH_RULES: Record<string, PhoneLengthRule> = {
  SG: { min: 8, max: 8 },
};

const InternationalPhoneInputDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const inputRef = useRef<HTMLInputElement>(null);

  const [basicValue, setBasicValue] = useState<PhoneNumberData | undefined>();
  const [labelValue, setLabelValue] = useState<PhoneNumberData | undefined>();
  const [errorValue, setErrorValue] = useState<PhoneNumberData | undefined>();
  const [successValue, setSuccessValue] = useState<PhoneNumberData | undefined>();
  const [customValue, setCustomValue] = useState<PhoneNumberData | undefined>();
  const [copyPasteValue, setCopyPasteValue] = useState<PhoneNumberData | undefined>();
  const [lastPasteData, setLastPasteData] = useState<PasteDetectedData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [formValue, setFormValue] = useState<PhoneNumberData | undefined>();
  const [refValue, setRefValue] = useState<PhoneNumberData | undefined>();

  const [customSelectedValue, setCustomSelectedValue] = useState<PhoneNumberData | undefined>();
  const [customIconValue, setCustomIconValue] = useState<PhoneNumberData | undefined>();
  const [circleCheckIconValue, setCircleCheckIconValue] = useState<PhoneNumberData | undefined>();
  const [noIconValue, setNoIconValue] = useState<PhoneNumberData | undefined>();
  const [purpleFocusValue, setPurpleFocusValue] = useState<PhoneNumberData | undefined>();
  const [greenFocusValue, setGreenFocusValue] = useState<PhoneNumberData | undefined>();
  const [orangeFocusValue, setOrangeFocusValue] = useState<PhoneNumberData | undefined>();

  const [i18nValue, setI18nValue] = useState<PhoneNumberData | undefined>();
  const [noBlurValidationValue, setNoBlurValidationValue] = useState<PhoneNumberData | undefined>();
  const [copyFormatE164, setCopyFormatE164] = useState<PhoneNumberData | undefined>();
  const [copyFormatIntl, setCopyFormatIntl] = useState<PhoneNumberData | undefined>();
  const [copyFormatNational, setCopyFormatNational] = useState<PhoneNumberData | undefined>();
  const [focusBlurValue, setFocusBlurValue] = useState<PhoneNumberData | undefined>();
  const [focusBlurLog, setFocusBlurLog] = useState<string[]>([]);
  const [renderCustomValue, setRenderCustomValue] = useState<PhoneNumberData | undefined>();
  const [customPatternValue, setCustomPatternValue] = useState<PhoneNumberData | undefined>();
  const [controlledResetValue, setControlledResetValue] = useState<PhoneNumberData | undefined>();
  const [checkoutPhone, setCheckoutPhone] = useState<PhoneNumberData | undefined>();
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [combinedValue, setCombinedValue] = useState<PhoneNumberData | undefined>();
  const [combinedCountry, setCombinedCountry] = useState<CountryOption | null>(null);
  const [combinedPaste, setCombinedPaste] = useState<PasteDetectedData | null>(null);
  const [descriptionValue, setDescriptionValue] = useState<PhoneNumberData | undefined>();
  const [loadingValue, setLoadingValue] = useState<PhoneNumberData | undefined>();
  const [posBotValue, setPosBotValue] = useState<PhoneNumberData | undefined>();
  const [posTopValue, setPosTopValue] = useState<PhoneNumberData | undefined>();
  const [forceBottomValue, setForceBottomValue] = useState<PhoneNumberData | undefined>();
  const [forceTopValue, setForceTopValue] = useState<PhoneNumberData | undefined>();
  const [forceLockScrollValue, setForceLockScrollValue] = useState<PhoneNumberData | undefined>();
  const [scrollLockValue, setScrollLockValue] = useState<PhoneNumberData | undefined>();

  const successOk = successValue?.isValid === true;

  return (
    <div className="space-y-10">
      <DocsHero
        title="International Phone Input"
        description="A phone number input with country code selection, automatic formatting, paste detection, copy formats, custom rendering, extensible validation, and complete styling control through the classes prop."
        code={`import { InternationalPhoneInput } from "@chumlab/ui/international-phone-input";`}
      />

      <div className="space-y-8">
        <Section
          title="Basic Usage"
          description="Minimal usage with just an onValueChange handler."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              {/* Basic usage — works out-of-the-box with built-in styles */}
              <InternationalPhoneInput
                aria-label="Phone number"
                value={basicValue}
                onValueChange={setBasicValue}
                placeholder="Enter phone number"
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Uncontrolled Mode"
          description="Use defaultValue for uncontrolled mode — no state management needed."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                defaultValue={{
                  countryCode: "GB",
                  phoneNumber: "2071234567",
                }}
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Label"
          description="Semantic label auto-associated via htmlFor."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                required
                value={labelValue}
                onValueChange={setLabelValue}
                placeholder="(555) 123-4567"
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Validation States"
          description="Error and success feedback with proper ARIA attributes."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div>
                <span className={c.sectionLabel}>Error</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    label="Phone Number"
                    value={errorValue}
                    onValueChange={setErrorValue}
                    error
                    errorMessage="Please enter a valid phone number"
                    placeholder="Enter phone number"
                    classes={{
                      ...c.phone,
                      input: c.phoneError.input,
                      countrySelectTrigger: c.phoneError.countrySelectTrigger,
                    }}
                  />
                </div>
              </div>
              <div>
                <span className={c.sectionLabel}>Success</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    label="Phone Number"
                    value={successValue}
                    onValueChange={setSuccessValue}
                    success={successOk}
                    successMessage={
                      successOk ? (
                        <>
                          <CheckSmallIcon /> Phone number is valid
                        </>
                      ) : undefined
                    }
                    placeholder="Enter a valid number"
                    classes={{
                      ...c.phone,
                      ...(successOk
                        ? {
                            input: c.phoneSuccess.input,
                            countrySelectTrigger:
                              c.phoneSuccess.countrySelectTrigger,
                          }
                        : {}),
                    }}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Validation Message (i18n)"
          description="Override the built-in validation message for internationalization or custom text."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div>
                <span className={c.sectionLabel}>Spanish</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    label="Teléfono"
                    value={i18nValue}
                    onValueChange={setI18nValue}
                    validationMessage="Por favor ingrese un número válido"
                    placeholder="Ingrese número de teléfono"
                    classes={c.phone}
                  />
                </div>
              </div>
              <div>
                <span className={c.sectionLabel}>ReactNode message</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    label="Phone Number"
                    validationMessage={
                      <span className="flex items-center gap-1">
                        <span>⚠️</span> Invalid number — check length
                      </span>
                    }
                    placeholder="Enter phone number"
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Validate On Blur Disabled"
          description="Set validateOnBlur={false} to disable automatic validation on blur."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                validateOnBlur={false}
                value={noBlurValidationValue}
                onValueChange={setNoBlurValidationValue}
                placeholder="No validation on blur"
                classes={c.phone}
              />
              {noBlurValidationValue && (
                <div className={`mt-3 ${c.resultBox}`}>
                  Valid: {noBlurValidationValue.isValid ? "Yes" : "No"} (check
                  onValueChange only)
                </div>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Country Change Callback"
          description="Track country changes via onCountryChange."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                value={customValue}
                onValueChange={setCustomValue}
                onCountryChange={setSelectedCountry}
                placeholder="Enter phone number"
                classes={c.phone}
              />
              {selectedCountry && (
                <div className={`mt-3 ${c.resultBox}`}>
                  Country: {selectedCountry.name} | Dial:{" "}
                  {selectedCountry.dialCode}
                </div>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Copy & Paste Detection"
          description="Auto-detect country from pasted international numbers. Copy in E.164 format."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                value={copyPasteValue}
                onValueChange={setCopyPasteValue}
                enablePasteDetection
                copyFormat="e164"
                onPasteDetected={setLastPasteData}
                placeholder="Try pasting +44 20 7123 4567"
                classes={c.phone}
              />
              <div className="mt-3 space-y-2">
                <p
                  className={`text-sm text-cl-text-secondary`}
                >
                  <strong>Paste:</strong> Try{" "}
                  <code className={c.code}>+44 20 7123 4567</code> or{" "}
                  <code className={c.code}>+1 555 123 4567</code>
                </p>
                <p
                  className={`text-sm text-cl-text-secondary`}
                >
                  <strong>Copy:</strong> Select and Ctrl+C — copies in E.164
                  format.
                </p>
              </div>
              {lastPasteData && (
                <div className={`mt-3 ${c.resultBox}`}>
                  <p>
                    Pasted: {lastPasteData.rawValue} | Country:{" "}
                    {lastPasteData.detectedCountry?.name || "Not detected"} |
                    Phone: {lastPasteData.phoneNumber}
                  </p>
                </div>
              )}
              {copyPasteValue && (
                <div className={`mt-2 ${c.resultBox}`}>
                  E.164: {copyPasteValue.fullNumber} | Valid:{" "}
                  {copyPasteValue.isValid ? "Yes" : "No"}
                </div>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Copy Format Variants"
          description="Control the format used when the user copies the phone number."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-6 w-full sm:max-w-md">
              <div>
                <span className={c.sectionLabel}>E.164</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="E164 format"
                    value={copyFormatE164}
                    onValueChange={setCopyFormatE164}
                    copyFormat="e164"
                    placeholder="+15551234567"
                    classes={c.phone}
                  />
                </div>
              </div>
              <div>
                <span className={c.sectionLabel}>International</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="International format"
                    value={copyFormatIntl}
                    onValueChange={setCopyFormatIntl}
                    copyFormat="international"
                    placeholder="+1 (555) 123-4567"
                    classes={c.phone}
                  />
                </div>
              </div>
              <div>
                <span className={c.sectionLabel}>National</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="National format"
                    value={copyFormatNational}
                    onValueChange={setCopyFormatNational}
                    copyFormat="national"
                    placeholder="(555) 123-4567"
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled State"
          description="Disable the entire component."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                disabled
                placeholder="Enter phone number"
                classes={{
                  ...c.phone,
                  ...c.phoneDisabled,
                }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Read-Only State"
          description="Read-only allows selection and copy but prevents editing."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                readOnly
                defaultValue={{
                  countryCode: "US",
                  phoneNumber: "5551234567",
                }}
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Preferred Countries"
          description="Control which countries appear at the top of the list."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number (UK, DE, FR first)"
                preferredCountries={["gb", "de", "fr"]}
                defaultCountry="gb"
                placeholder="Enter phone number"
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Countries List"
          description="Pass a subset of countries via the countries prop."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="European Numbers Only"
                countries={EUROPEAN_COUNTRIES}
                preferredCountries={["gb"]}
                defaultCountry="gb"
                placeholder="Enter phone number"
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Default Country"
          description="Set the initially selected country without preferredCountries."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div>
                <span className={c.sectionLabel}>Japan</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Japan default"
                    defaultCountry="jp"
                    preferredCountries={[]}
                    placeholder="Enter phone number"
                    classes={c.phone}
                  />
                </div>
              </div>
              <div>
                <span className={c.sectionLabel}>India</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="India default"
                    defaultCountry="in"
                    preferredCountries={[]}
                    placeholder="Enter phone number"
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Full Width"
          description="Spans the full container width."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <InternationalPhoneInput
              label="Phone Number"
              fullWidth
              placeholder="Enter phone number"
              classes={c.phone}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Form Semantics"
          description="Use the name prop for HTML form integration. Hidden inputs are rendered for country code and full number."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <form
              className="w-full sm:max-w-md space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                alert(
                  `phone=${formData.get("phone")}\nphone_country=${formData.get("phone_country")}`,
                );
              }}
            >
              <InternationalPhoneInput
                name="phone"
                label="Phone Number"
                required
                value={formValue}
                onValueChange={setFormValue}
                classes={c.phone}
              />
              <button type="submit" className={c.btnPrimary}>
                Submit Form
              </button>
            </form>
          </DemoWrapper>
        </Section>

        <Section
          title="Ref Forwarding"
          description="Access the native input for programmatic focus, selection, or value reads."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-4 w-full sm:max-w-md">
              <InternationalPhoneInput
                ref={inputRef}
                label="Phone Number"
                value={refValue}
                onValueChange={setRefValue}
                classes={c.phone}
              />
              <div className="flex gap-2 flex-wrap">
                {(["Focus", "Select All", "Get Value"] as const).map(
                  (lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => {
                        if (lbl === "Focus") inputRef.current?.focus();
                        else if (lbl === "Select All") {
                          inputRef.current?.focus();
                          inputRef.current?.select();
                        } else if (lbl === "Get Value")
                          alert(`"${inputRef.current?.value}"`);
                      }}
                      className={c.btn}
                    >
                      {lbl}
                    </button>
                  ),
                )}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Focus & Blur Events"
          description="Track focus and blur events on the phone input."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md space-y-3">
              <InternationalPhoneInput
                label="Phone Number"
                value={focusBlurValue}
                onValueChange={setFocusBlurValue}
                onFocus={() =>
                  setFocusBlurLog((prev) => [
                    ...prev.slice(-4),
                    `focus @ ${new Date().toLocaleTimeString()}`,
                  ])
                }
                onBlur={() =>
                  setFocusBlurLog((prev) => [
                    ...prev.slice(-4),
                    `blur @ ${new Date().toLocaleTimeString()}`,
                  ])
                }
                classes={c.phone}
              />
              {focusBlurLog.length > 0 && (
                <div className={c.resultBox}>
                  {focusBlurLog.map((entry, i) => (
                    <div key={i}>{entry}</div>
                  ))}
                </div>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Selected State Styling"
          description="Override selected option styles via the classes prop."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                aria-label="Phone with green highlight"
                value={customSelectedValue}
                onValueChange={setCustomSelectedValue}
                placeholder="Enter phone number"
                classes={{
                  ...c.phone,
                  countrySelectOptionSelected: dark
                    ? "!bg-cl-success/30 border-l-4 border-cl-success"
                    : "!bg-cl-success/15 border-l-4 border-cl-success",
                  countrySelectCheckIcon: `w-4 h-4 shrink-0 text-cl-success`,
                }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Selected Icon"
          description="Provide a custom icon element for the selected country via selectedIcon."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="flex flex-wrap gap-8">
              <div className="w-full sm:max-w-md">
                <span className={c.sectionLabel}>Star icon</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Star icon demo"
                    value={customIconValue}
                    onValueChange={setCustomIconValue}
                    placeholder="Enter phone number"
                    selectedIcon={
                      <StarIcon className="w-4 h-4 shrink-0 text-cl-warning" />
                    }
                    classes={c.phone}
                  />
                </div>
              </div>
              <div className="w-full sm:max-w-md">
                <span className={c.sectionLabel}>Circle check icon</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Circle check demo"
                    value={circleCheckIconValue}
                    onValueChange={setCircleCheckIconValue}
                    placeholder="Enter phone number"
                    selectedIcon={
                      <CircleCheckIcon className="w-4 h-4 shrink-0 text-cl-success" />
                    }
                    classes={c.phone}
                  />
                </div>
              </div>
              <div className="w-full sm:max-w-md">
                <span className={c.sectionLabel}>Dot indicator</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Dot indicator demo"
                    value={noIconValue}
                    onValueChange={setNoIconValue}
                    placeholder="Enter phone number"
                    selectedIcon={
                      <DotIcon
                        className={dark ? "text-cl-accent" : "text-cl-accent"}
                      />
                    }
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Color Themes"
          description="Full visual control through the classes prop."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="flex flex-wrap gap-8">
              <div className="w-full sm:max-w-md">
                <span className={c.sectionLabel}>Purple theme</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Purple theme"
                    value={purpleFocusValue}
                    onValueChange={setPurpleFocusValue}
                    placeholder="Enter phone number"
                    classes={{
                      ...c.phone,
                      input: `flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50`,
                      countrySelectOption: `flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-accent/10 data-[focused]:bg-cl-accent/10 text-cl-text dark:hover:bg-cl-accent/10 dark:data-[focused]:bg-cl-accent/15 dark:text-cl-text-secondary`,
                      countrySelectOptionSelected: dark
                        ? "bg-cl-accent/10"
                        : "bg-cl-accent/10",
                      countrySelectCheckIcon: `w-4 h-4 shrink-0 text-cl-accent`,
                    }}
                  />
                </div>
              </div>
              <div className="w-full sm:max-w-md">
                <span className={c.sectionLabel}>Green theme</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Green theme"
                    value={greenFocusValue}
                    onValueChange={setGreenFocusValue}
                    placeholder="Enter phone number"
                    classes={{
                      ...c.phone,
                      input: `flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-success focus:border-cl-success dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-success/30 dark:focus:border-cl-success/50`,
                      countrySelectOption: `flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-success/15 data-[focused]:bg-cl-success/15 text-cl-text dark:hover:bg-cl-success/10 dark:data-[focused]:bg-cl-success/15 dark:text-cl-text-secondary`,
                      countrySelectOptionSelected: dark
                        ? "bg-cl-success/10"
                        : "bg-cl-success/15",
                      countrySelectCheckIcon: `w-4 h-4 shrink-0 text-cl-success`,
                    }}
                  />
                </div>
              </div>
              <div className="w-full sm:max-w-md">
                <span className={c.sectionLabel}>Orange theme</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Orange theme"
                    value={orangeFocusValue}
                    onValueChange={setOrangeFocusValue}
                    placeholder="Enter phone number"
                    classes={{
                      ...c.phone,
                      input: `flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-warning focus:border-cl-warning dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-warning/30 dark:focus:border-cl-warning/50`,
                      countrySelectOption: `flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-warning/15 data-[focused]:bg-cl-warning/15 text-cl-text dark:hover:bg-cl-warning/10 dark:data-[focused]:bg-cl-warning/15 dark:text-cl-text-secondary`,
                      countrySelectOptionSelected: dark
                        ? "bg-cl-warning/10"
                        : "bg-cl-warning/15",
                      countrySelectCheckIcon: `w-4 h-4 shrink-0 text-cl-warning dark:text-cl-warning`,
                    }}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Country Rendering"
          description="Use renderCountryOption and renderSelectedCountry for full control over country rendering in the dropdown."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                value={renderCustomValue}
                onValueChange={setRenderCustomValue}
                placeholder="Enter phone number"
                renderCountryOption={({ country, isSelected }) => (
                  <div className="flex items-center gap-3 min-w-0">
                    <CountryFlag
                      code={country.flag}
                      size={22}
                      className="shrink-0 rounded-cl-sm"
                      style={{ height: 17 }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-medium ${isSelected ? (dark ? "text-cl-accent" : "text-cl-accent") : ""}`}>
                        {country.name}
                      </div>
                      <div className={`text-[11px] text-cl-text-tertiary`}>
                        {country.value} · {country.dialCode}
                      </div>
                    </div>
                  </div>
                )}
                renderSelectedCountry={(country) => (
                  <div className="flex items-center gap-2">
                    <CountryFlag
                      code={country.flag}
                      size={22}
                      className="rounded-cl-sm"
                      style={{ height: 17 }}
                    />
                    <span className="text-xs font-medium">{country.value}</span>
                    <span className={`text-xs text-cl-text-tertiary`}>
                      {country.dialCode}
                    </span>
                  </div>
                )}
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Flag Size"
          description="Use the flagSize prop to control the flag width (in pixels). Height auto-scales at the standard 22:17 aspect ratio. Defaults to 22."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Small (16px)</span>
                <InternationalPhoneInput
                  aria-label="Small flag"
                  placeholder="Enter phone number"
                  flagSize={16}
                  classes={c.phone}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Default (22px)</span>
                <InternationalPhoneInput
                  aria-label="Default flag"
                  placeholder="Enter phone number"
                  classes={c.phone}
                />
              </div>
              <div className="space-y-1.5">
                <span className={c.sectionLabel}>Large (32px)</span>
                <InternationalPhoneInput
                  aria-label="Large flag"
                  placeholder="Enter phone number"
                  flagSize={32}
                  classes={c.phone}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Format Patterns & Length Rules"
          description="Extend or override formatting and validation rules via formatPatterns and lengthRules."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Singapore (custom format: XXXX-XXXX)"
                defaultCountry="sg"
                preferredCountries={["sg"]}
                value={customPatternValue}
                onValueChange={setCustomPatternValue}
                formatPatterns={CUSTOM_FORMAT_PATTERNS}
                lengthRules={CUSTOM_LENGTH_RULES}
                placeholder="1234-5678"
                classes={c.phone}
              />
              {customPatternValue && (
                <div className={`mt-3 ${c.resultBox}`}>
                  Full: {customPatternValue.fullNumber} | Valid:{" "}
                  {customPatternValue.isValid ? "Yes" : "No"} | National:{" "}
                  {customPatternValue.nationalNumber}
                </div>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Controlled Mode Reset"
          description="Programmatically clear or reset the phone input value."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md space-y-4">
              <InternationalPhoneInput
                label="Phone Number"
                value={controlledResetValue}
                onValueChange={setControlledResetValue}
                classes={c.phone}
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className={c.btn}
                  onClick={() => setControlledResetValue(undefined)}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className={c.btn}
                  onClick={() =>
                    setControlledResetValue({
                      countryCode: "US",
                      phoneNumber: "5551234567",
                      fullNumber: "+15551234567",
                      isValid: true,
                    })
                  }
                >
                  Set US Number
                </button>
                <button
                  type="button"
                  className={c.btn}
                  onClick={() =>
                    setControlledResetValue({
                      countryCode: "GB",
                      phoneNumber: "2071234567",
                      fullNumber: "+442071234567",
                      isValid: true,
                    })
                  }
                >
                  Set UK Number
                </button>
              </div>
              {controlledResetValue && (
                <div className={c.resultBox}>
                  {controlledResetValue.fullNumber} |{" "}
                  {controlledResetValue.isValid ? "Valid" : "Invalid"}
                </div>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="aria-label & aria-labelledby"
          description="Use aria-label or aria-labelledby when a visible label is not provided."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="space-y-6 w-full sm:max-w-md">
              <div>
                <span className={c.sectionLabel}>aria-label</span>
                <div className="mt-2">
                  <InternationalPhoneInput
                    aria-label="Mobile phone number"
                    placeholder="No visible label"
                    classes={c.phone}
                  />
                </div>
              </div>
              <div>
                <span className={c.sectionLabel}>aria-labelledby</span>
                <div className="mt-2">
                  <p
                    id="custom-label-id"
                    className={`text-sm mb-2 font-medium text-cl-text-secondary`}
                  >
                    External label element
                  </p>
                  <InternationalPhoneInput
                    aria-labelledby="custom-label-id"
                    placeholder="Labeled via aria-labelledby"
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Country Dropdown Customization"
          description="Customize placeholder, search placeholder, and accessible label for the country dropdown."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                countryDropdownPlaceholder="Select region"
                countrySearchPlaceholder="Type to filter..."
                countryDropdownAriaLabel="Choose your country or region"
                placeholder="Enter phone number"
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Checkout Form"
          description="Realistic checkout form with phone input alongside other fields."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <form
              className="w-full sm:max-w-md space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  `Name: ${checkoutName}\nEmail: ${checkoutEmail}\nPhone: ${checkoutPhone?.fullNumber || "—"}\nValid: ${checkoutPhone?.isValid ? "Yes" : "No"}`,
                );
              }}
            >
              <div>
                <label
                  htmlFor="checkout-name"
                  className={`text-[13px] font-medium mb-1.5 block text-cl-text-secondary`}
                >
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  placeholder="John Doe"
                  className={c.phone.input}
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-email"
                  className={`text-[13px] font-medium mb-1.5 block text-cl-text-secondary`}
                >
                  Email
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={c.phone.input}
                />
              </div>
              <InternationalPhoneInput
                name="checkout_phone"
                label="Phone Number"
                required
                value={checkoutPhone}
                onValueChange={setCheckoutPhone}
                enablePasteDetection
                classes={c.phone}
              />
              <button type="submit" className={`w-full py-2.5 ${c.btnPrimary}`}>
                Complete Checkout
              </button>
            </form>
          </DemoWrapper>
        </Section>

        <Section
          title="Combined: All Features"
          description="Kitchen-sink example combining controlled state, callbacks, paste detection, copy format, custom validation, and styling."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md space-y-3">
              <InternationalPhoneInput
                label="Phone Number"
                required
                value={combinedValue}
                onValueChange={setCombinedValue}
                onCountryChange={setCombinedCountry}
                enablePasteDetection
                onPasteDetected={setCombinedPaste}
                copyFormat="international"
                validateOnBlur
                validationMessage="The phone number you entered is not valid"
                countryDropdownAriaLabel="Select your country"
                preferredCountries={["us", "gb", "ca", "in"]}
                placeholder="Enter your phone number"
                classes={c.phone}
              />
              <div className={c.resultBox}>
                <div>
                  Country: {combinedCountry?.name || combinedValue?.countryCode || "US"}{" "}
                  {combinedCountry?.dialCode || ""}
                </div>
                <div>
                  Number: {combinedValue?.fullNumber || "—"} |{" "}
                  Valid: {combinedValue?.isValid ? "Yes" : "No"}
                </div>
                {combinedPaste && (
                  <div>
                    Last paste: {combinedPaste.rawValue} →{" "}
                    {combinedPaste.detectedCountry?.name || "no country"}
                  </div>
                )}
              </div>
            </div>
          </DemoWrapper>
        </Section>

        {/* ─── With Description ─────────────────────────────────────── */}
        <Section
          title="With Description"
          description="Use the description prop to display helper text below the label."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                description="We'll use this number for two-factor authentication."
                value={descriptionValue}
                onValueChange={setDescriptionValue}
                placeholder="Enter phone number"
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ─── Scroll Lock ────────────────────────────────────────── */}
        <Section
          title="Scroll Lock"
          description="By default, the page remains scrollable when the country dropdown is open. Set lockScroll to lock body scroll while open."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                aria-label="Default scrollable"
                placeholder="Default (scrollable)"
                classes={c.phone}
              />
            </div>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                aria-label="Scroll lock enabled"
                value={scrollLockValue}
                onValueChange={setScrollLockValue}
                lockScroll
                placeholder="lockScroll enabled"
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>

        {/* ─── Dropdown Position ──────────────────────────────────── */}
        <Section
          title="Dropdown Position"
          description="Control whether the country dropdown opens above or below the trigger. Auto-flips when there isn't enough space."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <DemoLabel isDarkMode={dark}>
                  dropdownPosition=&quot;bottom&quot; (default)
                </DemoLabel>
                <div className="w-full sm:max-w-md">
                  <InternationalPhoneInput
                    aria-label="Position bottom"
                    value={posBotValue}
                    onValueChange={setPosBotValue}
                    dropdownPosition="bottom"
                    placeholder="Opens below..."
                    classes={c.phone}
                  />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={dark}>
                  dropdownPosition=&quot;top&quot;
                </DemoLabel>
                <div className="w-full sm:max-w-md">
                  <InternationalPhoneInput
                    aria-label="Position top"
                    value={posTopValue}
                    onValueChange={setPosTopValue}
                    dropdownPosition="top"
                    placeholder="Opens above..."
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
          <div className={c.note}>
            The country dropdown renders via a React Portal into document.body (or a
            custom container via portalContainer), so it is never clipped by
            overflow: hidden ancestors. Position updates react to window resize,
            scroll, and iOS Safari virtual keyboard changes (via visualViewport).
          </div>
          <DemoWrapper isDarkMode={dark} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <DemoLabel isDarkMode={dark}>
                  forceDropdownPosition (forced bottom)
                </DemoLabel>
                <div className="w-full sm:max-w-md">
                  <InternationalPhoneInput
                    aria-label="Force bottom"
                    value={forceBottomValue}
                    onValueChange={setForceBottomValue}
                    dropdownPosition="bottom"
                    forceDropdownPosition
                    placeholder="Always opens below..."
                    classes={c.phone}
                  />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={dark}>
                  forceDropdownPosition (forced top)
                </DemoLabel>
                <div className="w-full sm:max-w-md">
                  <InternationalPhoneInput
                    aria-label="Force top"
                    value={forceTopValue}
                    onValueChange={setForceTopValue}
                    dropdownPosition="top"
                    forceDropdownPosition
                    placeholder="Always opens above..."
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
          <div className={c.note}>
            When forceDropdownPosition is true, the country dropdown will always open in
            the specified direction regardless of available viewport space.
          </div>
          <DemoWrapper isDarkMode={dark} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <DemoLabel isDarkMode={dark}>
                  forceDropdownPosition + lockScroll
                </DemoLabel>
                <div className="w-full sm:max-w-md">
                  <InternationalPhoneInput
                    aria-label="Force bottom with scroll lock"
                    value={forceLockScrollValue}
                    onValueChange={setForceLockScrollValue}
                    dropdownPosition="bottom"
                    forceDropdownPosition
                    lockScroll
                    placeholder="Forced bottom + scroll locked"
                    classes={c.phone}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
          <div className={c.note}>
            Combining forceDropdownPosition with lockScroll prevents the page from
            scrolling while the country dropdown is open, ensuring the menu stays anchored
            in place.
          </div>
        </Section>

        {/* ─── Loading State ────────────────────────────────────────── */}
        <Section
          title="Loading State"
          description="Use the loading prop to indicate an in-progress operation."
          isDarkMode={dark}
        >
          <DemoWrapper isDarkMode={dark}>
            <div className="w-full sm:max-w-md">
              <InternationalPhoneInput
                label="Phone Number"
                loading
                value={loadingValue}
                onValueChange={setLoadingValue}
                placeholder="Enter phone number"
                classes={c.phone}
              />
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <Section title="InternationalPhoneInput Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="value"
              type="PhoneNumberValue"
              description="Controlled phone value ({ countryCode, phoneNumber })"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="PhoneNumberValue"
              description="Initial phone value (uncontrolled)"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(data: PhoneNumberData) => void"
              description="Callback when phone data changes"
              isDarkMode={dark}
            />
            <PropRow
              name="onCountryChange"
              type="(country: CountryOption) => void"
              description="Callback when country changes"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultCountry"
              type="string"
              defaultVal='"us"'
              description="Default country code"
              isDarkMode={dark}
            />
            <PropRow
              name="countries"
              type="CountryOption[]"
              defaultVal="DEFAULT_COUNTRIES"
              description="List of available countries"
              isDarkMode={dark}
            />
            <PropRow
              name="preferredCountries"
              type="string[]"
              defaultVal='["us","gb","ca","au"]'
              description="Countries to show at top of list"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="ReactNode"
              description="Label text (auto-associated via htmlFor)"
              isDarkMode={dark}
            />
            <PropRow
              name="required"
              type="boolean"
              defaultVal="false"
              description="Whether the field is required"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Whether the input is disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="readOnly"
              type="boolean"
              defaultVal="false"
              description="Whether the input is read-only"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="boolean"
              defaultVal="false"
              description="Whether to show error state"
              isDarkMode={dark}
            />
            <PropRow
              name="errorMessage"
              type="ReactNode"
              description='Error message (role="alert")'
              isDarkMode={dark}
            />
            <PropRow
              name="success"
              type="boolean"
              defaultVal="false"
              description="Whether to show success state"
              isDarkMode={dark}
            />
            <PropRow
              name="successMessage"
              type="ReactNode"
              description='Success message (role="status")'
              isDarkMode={dark}
            />
            <PropRow
              name="placeholder"
              type="string"
              defaultVal='"Enter phone number"'
              description="Input placeholder text"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Whether to take full width"
              isDarkMode={dark}
            />
            <PropRow
              name="validateOnBlur"
              type="boolean"
              defaultVal="true"
              description="Whether to validate on blur"
              isDarkMode={dark}
            />
            <PropRow
              name="validationMessage"
              type="ReactNode"
              description="Custom validation error message (i18n support)"
              isDarkMode={dark}
            />
            <PropRow
              name="enablePasteDetection"
              type="boolean"
              defaultVal="false"
              description="Auto-detect country from pasted numbers"
              isDarkMode={dark}
            />
            <PropRow
              name="copyFormat"
              type='"e164"|"international"|"national"'
              defaultVal='"e164"'
              description="Format used when copying (Ctrl+C)"
              isDarkMode={dark}
            />
            <PropRow
              name="onPasteDetected"
              type="(data: PasteDetectedData) => void"
              description="Callback when paste is detected"
              isDarkMode={dark}
            />
            <PropRow
              name="name"
              type="string"
              description="Form field name (renders hidden inputs)"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              description="Custom ID (auto-generated if omitted)"
              isDarkMode={dark}
            />
            <PropRow
              name="countryDropdownPlaceholder"
              type="string"
              defaultVal='"Country"'
              description="Placeholder for country dropdown trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySearchPlaceholder"
              type="string"
              defaultVal='"Search countries..."'
              description="Placeholder for country search input"
              isDarkMode={dark}
            />
            <PropRow
              name="countryDropdownAriaLabel"
              type="string"
              defaultVal='"Select country"'
              description="Accessible label for the country dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="selectedIcon"
              type="ReactNode"
              description="Custom icon for selected country option"
              isDarkMode={dark}
            />
            <PropRow
              name="flagSize"
              type="number"
              defaultVal="22"
              description="Pixel width of the flag in the trigger and dropdown options. Height auto-scales at the 22:17 aspect ratio."
              isDarkMode={dark}
            />
            <PropRow
              name="renderCountryOption"
              type="(props: CountryOptionRenderProps) => ReactNode"
              description="Custom renderer for country options in dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="renderSelectedCountry"
              type="(country: CountryOption) => ReactNode"
              description="Custom renderer for selected country in trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="formatPatterns"
              type="Record<string, PhoneFormatPattern>"
              description="Custom formatting patterns (extends defaults)"
              isDarkMode={dark}
            />
            <PropRow
              name="lengthRules"
              type="Record<string, PhoneLengthRule>"
              description="Custom validation length rules (extends defaults)"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class for the root container"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles for the root container"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="InternationalPhoneInputClasses"
              description="Slot-based class overrides for internal elements"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default classes"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownPosition"
              type='"top" | "bottom"'
              defaultVal='"bottom"'
              description="Vertical placement of the country dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="forceDropdownPosition"
              type="boolean"
              defaultVal="false"
              description="Lock to dropdownPosition, no auto-flip"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownZIndex"
              type="number"
              defaultVal="50"
              description="Z-index of the country dropdown popup"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownGap"
              type="number"
              defaultVal="4"
              description="Gap (px) between trigger and dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Portal target for the country dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="lockScroll"
              type="boolean"
              defaultVal="false"
              description="Lock body scroll while country dropdown is open"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="InternationalPhoneInputClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Outer container div"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Label element"
              isDarkMode={dark}
            />
            <PropRow
              name="wrapper"
              type="string"
              description="Wrapper around dropdown and input"
              isDarkMode={dark}
            />
            <PropRow
              name="input"
              type="string"
              description="Phone number input element"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="string"
              description="Error message div"
              isDarkMode={dark}
            />
            <PropRow
              name="success"
              type="string"
              description="Success message div"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelect"
              type="string"
              description="Country dropdown root"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectTrigger"
              type="string"
              description="Country dropdown trigger button"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectDropdown"
              type="string"
              description="Dropdown menu container"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectSearchInput"
              type="string"
              description="Search input wrapper in dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectSearchInputElement"
              type="string"
              description="Search input element inside wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectOption"
              type="string"
              description="Individual country option"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectOptionSelected"
              type="string"
              description="Additional classes for selected option"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectOptionList"
              type="string"
              description="Options list container"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectChevron"
              type="string"
              description="Chevron icon in trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectCheckIcon"
              type="string"
              description="Selected indicator icon"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectSearchIcon"
              type="string"
              description="Search icon in search input"
              isDarkMode={dark}
            />
            <PropRow
              name="countrySelectNoResults"
              type="string"
              description="No results message"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="PhoneNumberValue Type" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="countryCode"
              type="string"
              description='ISO country code (e.g., "US")'
              isDarkMode={dark}
            />
            <PropRow
              name="phoneNumber"
              type="string"
              description="Digits-only phone number"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="PhoneNumberData Type" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="countryCode"
              type="string"
              description='ISO country code (e.g., "US")'
              isDarkMode={dark}
            />
            <PropRow
              name="phoneNumber"
              type="string"
              description="Digits only phone number"
              isDarkMode={dark}
            />
            <PropRow
              name="fullNumber"
              type="string"
              description="Full number with dial code"
              isDarkMode={dark}
            />
            <PropRow
              name="isValid"
              type="boolean"
              description="Whether the phone number is valid"
              isDarkMode={dark}
            />
            <PropRow
              name="nationalNumber"
              type="string?"
              description="National format number"
              isDarkMode={dark}
            />
            <PropRow
              name="internationalNumber"
              type="string?"
              description="International format number"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="CountryOptionRenderProps Type" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="country"
              type="CountryOption"
              description="The country option being rendered"
              isDarkMode={dark}
            />
            <PropRow
              name="isSelected"
              type="boolean"
              description="Whether this option is currently selected"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-slot"
              type="root, label, wrapper, input, error, success"
              description="Always present — identifies structural parts"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="root, input"
              description="Present when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="root, input"
              description="Present when error = true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-success"
              type="root, input"
              description="Present when success = true (without error)"
              isDarkMode={dark}
            />
            <PropRow
              name="data-readonly"
              type="root, input"
              description="Present when readOnly = true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-full-width"
              type="root"
              description="Present when fullWidth = true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-loading"
              type="root"
              description="Present when loading = true"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              "Label auto-associated via htmlFor",
              'Required inputs set aria-required="true"',
              "Error state sets aria-invalid",
              "Error connected via aria-describedby",
              'Error messages use role="alert"',
              'Success messages use role="status"',
              'Country dropdown and input grouped via role="group"',
              "Country dropdown has configurable aria-label",
              "Country change announced via aria-live region",
              "Provide `label` or `aria-label` / `aria-labelledby` for the field",
              "Supports both controlled and uncontrolled modes",
              "Hidden inputs for form submission when name prop is provided",
              "Ref forwarding for programmatic focus management",
              "Cursor position preserved during formatting",
              "All native input attributes forwarded via rest spread",
              "data-slot on every sub-element for CSS targeting",
              "Clear button includes aria-label for screen reader identification",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 text-cl-success`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 text-cl-text-secondary`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              ["Tab", "Move focus between country dropdown and phone input"],
              ["Enter", "Open/select in country dropdown"],
              ["Space", "Open country dropdown"],
              ["Arrow keys", "Navigate country options"],
              ["Esc", "Close country dropdown"],
              ["Ctrl+C", "Copy phone number in configured format"],
              ["Ctrl+V", "Paste with auto-detection (when enabled)"],
              ["Type", "Search countries by name in the dropdown"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` for full E.164-style data, or `defaultValue` for uncontrolled. Country and national number should stay in sync with your validation library."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Porting and country rules change—validate on the server, not only in the client.",
          "Paste detection may need normalization for different locales.",
          "VOIP and short codes may not fit generic length rules—allow overrides.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide a visible `label` or `aria-label` / `aria-labelledby`.",
          "Mirror server validation errors with `error` and `errorMessage`.",
          "Test autofill and SMS OTP flows on mobile.",
        ]}
        donts={[
          "Do not store raw phone numbers in untrusted logs.",
          "Do not block paste unless required by policy.",
          "Do not assume one mask fits all countries.",
        ]}
      />
    </div>
  );
};

export default InternationalPhoneInputDemo;
