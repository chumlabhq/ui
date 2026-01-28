import { useState } from "react";
import {
  InternationalPhoneInput,
  type PhoneNumberData,
  type CountryOption,
  type PasteDetectedData,
} from "../../components/InternationalPhoneInput";
import { Section, ComponentHeader } from "./components";

// Custom icon components
const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CircleCheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const DotIcon = ({ className = "" }: { className?: string }) => (
  <span className={`inline-block w-2 h-2 rounded-full bg-current ${className}`} />
);

const containerStyle = "flex flex-col gap-1";
const labelStyle = "text-sm font-medium text-gray-700";
const inputWrapperStyle = "flex gap-2 items-stretch";
const inputStyle =
  "flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
const errorInputStyle =
  "flex-1 h-10 px-3 rounded-lg border border-red-500 bg-white text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-red-500";
const inputFocusStyle = "ring-2 ring-blue-500 border-blue-500";
const errorTextStyle = "text-sm text-red-500";

const countryTriggerStyle =
  "flex items-center justify-between gap-2 h-10 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 outline-none min-w-[130px]";
const countryTriggerFocusStyle = "ring-2 ring-blue-500 border-blue-500";
const countryDropdownStyle =
  "absolute z-50 top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden";
const countrySearchInputStyle =
  "flex items-center gap-2 px-3 py-2 border-b border-gray-200";
const countryOptionListStyle = "max-h-60 overflow-y-auto";
const countryOptionStyle =
  "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 data-[focused]:bg-gray-100";
const countryOptionSelectedStyle = "bg-blue-50";
const countryChevronStyle = "w-4 h-4 shrink-0 transition-transform duration-200";
const countrySelectedIndicatorStyle = "w-4 h-4 shrink-0 text-blue-600";
const countrySearchIconStyle = "w-4 h-4 shrink-0 text-gray-400";
const countryNoResultsStyle = "px-3 py-4 text-sm text-gray-500 text-center";

const InternationalPhoneInputDemo = () => {
  const [basicValue, setBasicValue] = useState<PhoneNumberData | undefined>();
  const [labelValue, setLabelValue] = useState<PhoneNumberData | undefined>();
  const [errorValue, setErrorValue] = useState<PhoneNumberData | undefined>();
  const [customValue, setCustomValue] = useState<PhoneNumberData | undefined>();
  const [copyPasteValue, setCopyPasteValue] = useState<PhoneNumberData | undefined>();
  const [lastPasteData, setLastPasteData] = useState<PasteDetectedData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  
  // Custom styling demo states
  const [customSelectedValue, setCustomSelectedValue] = useState<PhoneNumberData | undefined>();
  const [customIconValue, setCustomIconValue] = useState<PhoneNumberData | undefined>();
  const [noIconValue, setNoIconValue] = useState<PhoneNumberData | undefined>();
  const [purpleFocusValue, setPurpleFocusValue] = useState<PhoneNumberData | undefined>();
  const [greenFocusValue, setGreenFocusValue] = useState<PhoneNumberData | undefined>();
  const [orangeFocusValue, setOrangeFocusValue] = useState<PhoneNumberData | undefined>();

  return (
    <>
      <ComponentHeader
        title="International Phone Input"
        description="A phone number input with country code selection and automatic formatting."
      />

      <Section title="Basic Usage">
        <div className="w-full max-w-md">
          <InternationalPhoneInput
            value={basicValue}
            onChange={setBasicValue}
            placeholder="Enter phone number"
            containerClassName={containerStyle}
            inputWrapperClassName={inputWrapperStyle}
            inputClassName={inputStyle}
            inputFocusClassName={inputFocusStyle}
            countrySelectTriggerClassName={countryTriggerStyle}
            countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
            countrySelectDropdownClassName={countryDropdownStyle}
            countrySelectSearchInputClassName={countrySearchInputStyle}
            countrySelectOptionListClassName={countryOptionListStyle}
            countrySelectOptionClassName={countryOptionStyle}
            countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
            countrySelectChevronClassName={countryChevronStyle}
            countrySelectSelectedIndicatorClassName={countrySelectedIndicatorStyle}
            countrySelectSearchIconClassName={countrySearchIconStyle}
            countrySelectNoResultsClassName={countryNoResultsStyle}
          />
          {basicValue && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p>
                <span className="text-gray-500">Full number:</span>{" "}
                <span className="font-mono">{basicValue.fullNumber || "-"}</span>
              </p>
              <p>
                <span className="text-gray-500">Valid:</span>{" "}
                <span
                  className={basicValue.isValid ? "text-green-600" : "text-red-500"}
                >
                  {basicValue.isValid ? "Yes" : "No"}
                </span>
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="With Label">
        <div className="w-full max-w-md">
          <InternationalPhoneInput
            label="Phone Number"
            required
            value={labelValue}
            onChange={setLabelValue}
            placeholder="(555) 123-4567"
            containerClassName={containerStyle}
            labelClassName={labelStyle}
            inputWrapperClassName={inputWrapperStyle}
            inputClassName={inputStyle}
            inputFocusClassName={inputFocusStyle}
            countrySelectTriggerClassName={countryTriggerStyle}
            countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
            countrySelectDropdownClassName={countryDropdownStyle}
            countrySelectSearchInputClassName={countrySearchInputStyle}
            countrySelectOptionListClassName={countryOptionListStyle}
            countrySelectOptionClassName={countryOptionStyle}
            countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
            countrySelectChevronClassName={countryChevronStyle}
            countrySelectSelectedIndicatorClassName={countrySelectedIndicatorStyle}
            countrySelectSearchIconClassName={countrySearchIconStyle}
            countrySelectNoResultsClassName={countryNoResultsStyle}
          />
        </div>
      </Section>

      <Section title="Error State">
        <div className="w-full max-w-md">
          <InternationalPhoneInput
            label="Phone Number"
            value={errorValue}
            onChange={setErrorValue}
            error
            errorMessage="Please enter a valid phone number"
            placeholder="Enter phone number"
            containerClassName={containerStyle}
            labelClassName={labelStyle}
            inputWrapperClassName={inputWrapperStyle}
            inputClassName={errorInputStyle}
            errorClassName={errorTextStyle}
            countrySelectTriggerClassName={`${countryTriggerStyle} border-red-500`}
            countrySelectTriggerFocusClassName="ring-2 ring-red-500 border-red-500"
            countrySelectDropdownClassName={countryDropdownStyle}
            countrySelectSearchInputClassName={countrySearchInputStyle}
            countrySelectOptionListClassName={countryOptionListStyle}
            countrySelectOptionClassName={countryOptionStyle}
            countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
            countrySelectChevronClassName={countryChevronStyle}
            countrySelectSelectedIndicatorClassName={countrySelectedIndicatorStyle}
            countrySelectSearchIconClassName={countrySearchIconStyle}
            countrySelectNoResultsClassName={countryNoResultsStyle}
          />
        </div>
      </Section>

      <Section title="With Country Change Callback">
        <div className="w-full max-w-md">
          <InternationalPhoneInput
            label="Phone Number"
            value={customValue}
            onChange={setCustomValue}
            onCountryChange={setSelectedCountry}
            placeholder="Enter phone number"
            containerClassName={containerStyle}
            labelClassName={labelStyle}
            inputWrapperClassName={inputWrapperStyle}
            inputClassName={inputStyle}
            inputFocusClassName={inputFocusStyle}
            countrySelectTriggerClassName={countryTriggerStyle}
            countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
            countrySelectDropdownClassName={countryDropdownStyle}
            countrySelectSearchInputClassName={countrySearchInputStyle}
            countrySelectOptionListClassName={countryOptionListStyle}
            countrySelectOptionClassName={countryOptionStyle}
            countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
            countrySelectChevronClassName={countryChevronStyle}
            countrySelectSelectedIndicatorClassName={countrySelectedIndicatorStyle}
            countrySelectSearchIconClassName={countrySearchIconStyle}
            countrySelectNoResultsClassName={countryNoResultsStyle}
          />
          {selectedCountry && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm space-y-1">
              <p>
                <span className="text-gray-600">Country:</span>{" "}
                {selectedCountry.name}
              </p>
              <p>
                <span className="text-gray-600">Dial code:</span>{" "}
                {selectedCountry.dialCode}
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Copy & Paste Detection">
        <div className="w-full max-w-md">
          <InternationalPhoneInput
            label="Phone Number"
            value={copyPasteValue}
            onChange={setCopyPasteValue}
            enablePasteDetection
            copyFormat="e164"
            onPasteDetected={setLastPasteData}
            placeholder="Try pasting +44 20 7123 4567"
            containerClassName={containerStyle}
            labelClassName={labelStyle}
            inputWrapperClassName={inputWrapperStyle}
            inputClassName={inputStyle}
            inputFocusClassName={inputFocusStyle}
            countrySelectTriggerClassName={countryTriggerStyle}
            countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
            countrySelectDropdownClassName={countryDropdownStyle}
            countrySelectSearchInputClassName={countrySearchInputStyle}
            countrySelectOptionListClassName={countryOptionListStyle}
            countrySelectOptionClassName={countryOptionStyle}
            countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
            countrySelectChevronClassName={countryChevronStyle}
            countrySelectSelectedIndicatorClassName={countrySelectedIndicatorStyle}
            countrySelectSearchIconClassName={countrySearchIconStyle}
            countrySelectNoResultsClassName={countryNoResultsStyle}
          />
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-500">
              <strong>Paste:</strong> Try pasting numbers like <code className="bg-gray-100 px-1 rounded">+44 20 7123 4567</code> or <code className="bg-gray-100 px-1 rounded">+1 555 123 4567</code> - country auto-switches.
            </p>
            <p className="text-sm text-gray-500">
              <strong>Copy:</strong> Select the number and press Ctrl+C - copies in E.164 format.
            </p>
          </div>
          {lastPasteData && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm space-y-1">
              <p className="font-medium text-green-700">Paste Detected:</p>
              <p>
                <span className="text-gray-600">Raw:</span>{" "}
                <code className="bg-green-100 px-1 rounded">{lastPasteData.rawValue}</code>
              </p>
              <p>
                <span className="text-gray-600">Country:</span>{" "}
                {lastPasteData.detectedCountry?.name || "Not detected"}
              </p>
              <p>
                <span className="text-gray-600">Phone:</span>{" "}
                {lastPasteData.phoneNumber}
              </p>
            </div>
          )}
          {copyPasteValue && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p>
                <span className="text-gray-500">E.164 (copied):</span>{" "}
                <code className="bg-gray-100 px-1 rounded font-mono">{copyPasteValue.fullNumber}</code>
              </p>
              <p>
                <span className="text-gray-500">Valid:</span>{" "}
                <span className={copyPasteValue.isValid ? "text-green-600" : "text-red-500"}>
                  {copyPasteValue.isValid ? "Yes" : "No"}
                </span>
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Disabled State">
        <div className="w-full max-w-md">
          <InternationalPhoneInput
            label="Phone Number"
            disabled
            placeholder="Enter phone number"
            containerClassName={containerStyle}
            labelClassName={`${labelStyle} text-gray-400`}
            inputWrapperClassName={inputWrapperStyle}
            inputClassName={`${inputStyle} opacity-50 cursor-not-allowed`}
            countrySelectTriggerClassName={`${countryTriggerStyle} opacity-50 cursor-not-allowed`}
            countrySelectDropdownClassName={countryDropdownStyle}
            countrySelectChevronClassName={countryChevronStyle}
          />
        </div>
      </Section>

      <Section title="Custom Preferred Countries">
        <div className="w-full max-w-md">
          <InternationalPhoneInput
            label="Phone Number (UK, DE, FR first)"
            preferredCountries={["gb", "de", "fr"]}
            defaultCountry="gb"
            placeholder="Enter phone number"
            containerClassName={containerStyle}
            labelClassName={labelStyle}
            inputWrapperClassName={inputWrapperStyle}
            inputClassName={inputStyle}
            inputFocusClassName={inputFocusStyle}
            countrySelectTriggerClassName={countryTriggerStyle}
            countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
            countrySelectDropdownClassName={countryDropdownStyle}
            countrySelectSearchInputClassName={countrySearchInputStyle}
            countrySelectOptionListClassName={countryOptionListStyle}
            countrySelectOptionClassName={countryOptionStyle}
            countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
            countrySelectChevronClassName={countryChevronStyle}
            countrySelectSelectedIndicatorClassName={countrySelectedIndicatorStyle}
            countrySelectSearchIconClassName={countrySearchIconStyle}
            countrySelectNoResultsClassName={countryNoResultsStyle}
          />
        </div>
      </Section>

      <Section title="Full Width">
        <InternationalPhoneInput
          label="Phone Number"
          fullWidth
          placeholder="Enter phone number"
          containerClassName={containerStyle}
          labelClassName={labelStyle}
          inputWrapperClassName={inputWrapperStyle}
          inputClassName={inputStyle}
          inputFocusClassName={inputFocusStyle}
          countrySelectTriggerClassName={countryTriggerStyle}
          countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
          countrySelectDropdownClassName={countryDropdownStyle}
          countrySelectSearchInputClassName={countrySearchInputStyle}
          countrySelectOptionListClassName={countryOptionListStyle}
          countrySelectOptionClassName={countryOptionStyle}
          countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
          countrySelectChevronClassName={countryChevronStyle}
          countrySelectSelectedIndicatorClassName={countrySelectedIndicatorStyle}
          countrySelectSearchIconClassName={countrySearchIconStyle}
          countrySelectNoResultsClassName={countryNoResultsStyle}
        />
      </Section>

      <Section title="Custom Selected State Styling">
        <div className="space-y-4">
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-600 mb-2">With green highlight and left border:</p>
            <InternationalPhoneInput
              value={customSelectedValue}
              onChange={setCustomSelectedValue}
              placeholder="Enter phone number"
              containerClassName={containerStyle}
              inputWrapperClassName={inputWrapperStyle}
              inputClassName={inputStyle}
              inputFocusClassName={inputFocusStyle}
              countrySelectTriggerClassName={countryTriggerStyle}
              countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
              countrySelectDropdownClassName={countryDropdownStyle}
              countrySelectSearchInputClassName={countrySearchInputStyle}
              countrySelectOptionListClassName={countryOptionListStyle}
              countrySelectOptionClassName={countryOptionStyle}
              countrySelectOptionSelectedClassName="!bg-green-100 border-l-4 border-green-500"
              countrySelectChevronClassName={countryChevronStyle}
              countrySelectSelectedIndicatorClassName="w-4 h-4 shrink-0 text-green-600"
              countrySelectSearchIconClassName={countrySearchIconStyle}
              countrySelectNoResultsClassName={countryNoResultsStyle}
            />
          </div>
          <p className="text-sm text-gray-500">
            Use <code className="bg-gray-100 px-1 rounded">countrySelectOptionSelectedClassName</code> to add additional styles to the selected country option.
          </p>
        </div>
      </Section>

      <Section title="Custom Selected Icon">
        <div className="flex flex-wrap gap-8">
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-600 mb-2">Star icon:</p>
            <InternationalPhoneInput
              value={customIconValue}
              onChange={setCustomIconValue}
              placeholder="Enter phone number"
              containerClassName={containerStyle}
              inputWrapperClassName={inputWrapperStyle}
              inputClassName={inputStyle}
              inputFocusClassName={inputFocusStyle}
              countrySelectTriggerClassName={countryTriggerStyle}
              countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
              countrySelectDropdownClassName={countryDropdownStyle}
              countrySelectSearchInputClassName={countrySearchInputStyle}
              countrySelectOptionListClassName={countryOptionListStyle}
              countrySelectOptionClassName={countryOptionStyle}
              countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
              countrySelectChevronClassName={countryChevronStyle}
              countrySelectSelectedIndicator={<StarIcon className="w-4 h-4 shrink-0 text-yellow-500" />}
              countrySelectSearchIconClassName={countrySearchIconStyle}
              countrySelectNoResultsClassName={countryNoResultsStyle}
            />
          </div>
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-600 mb-2">Circle check icon:</p>
            <InternationalPhoneInput
              value={customIconValue}
              onChange={setCustomIconValue}
              placeholder="Enter phone number"
              containerClassName={containerStyle}
              inputWrapperClassName={inputWrapperStyle}
              inputClassName={inputStyle}
              inputFocusClassName={inputFocusStyle}
              countrySelectTriggerClassName={countryTriggerStyle}
              countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
              countrySelectDropdownClassName={countryDropdownStyle}
              countrySelectSearchInputClassName={countrySearchInputStyle}
              countrySelectOptionListClassName={countryOptionListStyle}
              countrySelectOptionClassName={countryOptionStyle}
              countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
              countrySelectChevronClassName={countryChevronStyle}
              countrySelectSelectedIndicator={<CircleCheckIcon className="w-4 h-4 shrink-0 text-green-600" />}
              countrySelectSearchIconClassName={countrySearchIconStyle}
              countrySelectNoResultsClassName={countryNoResultsStyle}
            />
          </div>
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-600 mb-2">Dot indicator:</p>
            <InternationalPhoneInput
              value={noIconValue}
              onChange={setNoIconValue}
              placeholder="Enter phone number"
              containerClassName={containerStyle}
              inputWrapperClassName={inputWrapperStyle}
              inputClassName={inputStyle}
              inputFocusClassName={inputFocusStyle}
              countrySelectTriggerClassName={countryTriggerStyle}
              countrySelectTriggerFocusClassName={countryTriggerFocusStyle}
              countrySelectDropdownClassName={countryDropdownStyle}
              countrySelectSearchInputClassName={countrySearchInputStyle}
              countrySelectOptionListClassName={countryOptionListStyle}
              countrySelectOptionClassName={countryOptionStyle}
              countrySelectOptionSelectedClassName={countryOptionSelectedStyle}
              countrySelectChevronClassName={countryChevronStyle}
              countrySelectSelectedIndicator={<DotIcon className="text-blue-600" />}
              countrySelectSearchIconClassName={countrySearchIconStyle}
              countrySelectNoResultsClassName={countryNoResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Use <code className="bg-gray-100 px-1 rounded">countrySelectSelectedIndicator</code> to provide a custom icon element for the selected country.
        </p>
      </Section>

      <Section title="Custom Focus State Styling">
        <p className="text-sm text-gray-600 mb-4">
          Customize the focus ring colors for both the input and country dropdown trigger.
        </p>
        <div className="flex flex-wrap gap-8">
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-600 mb-2">Purple focus ring:</p>
            <InternationalPhoneInput
              value={purpleFocusValue}
              onChange={setPurpleFocusValue}
              placeholder="Enter phone number"
              containerClassName={containerStyle}
              inputWrapperClassName={inputWrapperStyle}
              inputClassName="flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 outline-none"
              inputFocusClassName="ring-2 ring-purple-500 border-purple-500"
              countrySelectTriggerClassName={countryTriggerStyle}
              countrySelectTriggerFocusClassName="ring-2 ring-purple-500 border-purple-500"
              countrySelectDropdownClassName={countryDropdownStyle}
              countrySelectSearchInputClassName={countrySearchInputStyle}
              countrySelectOptionListClassName={countryOptionListStyle}
              countrySelectOptionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-purple-50 data-[focused]:bg-purple-100"
              countrySelectOptionSelectedClassName="bg-purple-50"
              countrySelectChevronClassName={countryChevronStyle}
              countrySelectSelectedIndicatorClassName="w-4 h-4 shrink-0 text-purple-600"
              countrySelectSearchIconClassName={countrySearchIconStyle}
              countrySelectNoResultsClassName={countryNoResultsStyle}
            />
          </div>
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-600 mb-2">Green focus ring:</p>
            <InternationalPhoneInput
              value={greenFocusValue}
              onChange={setGreenFocusValue}
              placeholder="Enter phone number"
              containerClassName={containerStyle}
              inputWrapperClassName={inputWrapperStyle}
              inputClassName="flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 outline-none"
              inputFocusClassName="ring-2 ring-green-500 border-green-500"
              countrySelectTriggerClassName={countryTriggerStyle}
              countrySelectTriggerFocusClassName="ring-2 ring-green-500 border-green-500"
              countrySelectDropdownClassName={countryDropdownStyle}
              countrySelectSearchInputClassName={countrySearchInputStyle}
              countrySelectOptionListClassName={countryOptionListStyle}
              countrySelectOptionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-green-50 data-[focused]:bg-green-100"
              countrySelectOptionSelectedClassName="bg-green-50"
              countrySelectChevronClassName={countryChevronStyle}
              countrySelectSelectedIndicatorClassName="w-4 h-4 shrink-0 text-green-600"
              countrySelectSearchIconClassName={countrySearchIconStyle}
              countrySelectNoResultsClassName={countryNoResultsStyle}
            />
          </div>
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-600 mb-2">Orange focus ring:</p>
            <InternationalPhoneInput
              value={orangeFocusValue}
              onChange={setOrangeFocusValue}
              placeholder="Enter phone number"
              containerClassName={containerStyle}
              inputWrapperClassName={inputWrapperStyle}
              inputClassName="flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 outline-none"
              inputFocusClassName="ring-2 ring-orange-500 border-orange-500"
              countrySelectTriggerClassName={countryTriggerStyle}
              countrySelectTriggerFocusClassName="ring-2 ring-orange-500 border-orange-500"
              countrySelectDropdownClassName={countryDropdownStyle}
              countrySelectSearchInputClassName={countrySearchInputStyle}
              countrySelectOptionListClassName={countryOptionListStyle}
              countrySelectOptionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-orange-50 data-[focused]:bg-orange-100"
              countrySelectOptionSelectedClassName="bg-orange-50"
              countrySelectChevronClassName={countryChevronStyle}
              countrySelectSelectedIndicatorClassName="w-4 h-4 shrink-0 text-orange-600"
              countrySelectSearchIconClassName={countrySearchIconStyle}
              countrySelectNoResultsClassName={countryNoResultsStyle}
            />
          </div>
        </div>
      </Section>

      <Section title="Props Reference">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">ref</td>
                <td className="py-2 pr-4 text-gray-600">
                  Ref&lt;HTMLInputElement&gt;
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Ref forwarded to the phone input element
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">Custom ID for the input</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Name attribute for the input</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">PhoneNumberData</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Current phone number data</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">
                  (data: PhoneNumberData) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when phone data changes
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onCountryChange
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (country: CountryOption) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when country changes
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  defaultCountry
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"us"</td>
                <td className="py-2 text-gray-600">Default country code</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">countries</td>
                <td className="py-2 pr-4 text-gray-600">CountryOption[]</td>
                <td className="py-2 pr-4 text-gray-500">DEFAULT_COUNTRIES</td>
                <td className="py-2 text-gray-600">List of available countries</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  preferredCountries
                </td>
                <td className="py-2 pr-4 text-gray-600">string[]</td>
                <td className="py-2 pr-4 text-gray-500">
                  ["us", "gb", "ca", "au"]
                </td>
                <td className="py-2 text-gray-600">
                  Countries to show at top of list
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Label text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the field is required
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the input is disabled
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether to show error state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorMessage</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Error message to display</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">placeholder</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Enter phone number"</td>
                <td className="py-2 text-gray-600">Input placeholder text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether to take full width</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  validateOnBlur
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Whether to validate on blur</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  enablePasteDetection
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Auto-detect country from pasted international numbers
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">copyFormat</td>
                <td className="py-2 pr-4 text-gray-600">
                  "e164" | "international" | "national"
                </td>
                <td className="py-2 pr-4 text-gray-500">"e164"</td>
                <td className="py-2 text-gray-600">
                  Format used when copying (Ctrl+C)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onPasteDetected
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (data: PasteDetectedData) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when paste is detected
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countryDropdownPlaceholder
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Country"</td>
                <td className="py-2 text-gray-600">
                  Placeholder for country dropdown
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySearchPlaceholder
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Search countries..."</td>
                <td className="py-2 text-gray-600">
                  Placeholder for country search input
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  containerClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Outer container wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Label element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  inputWrapperClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">
                  Wrapper around dropdown and input
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">inputClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Phone number input</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  inputFocusClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">
                  Additional classes applied when input is focused
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Error message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Country dropdown container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectTriggerClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Country dropdown trigger button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectTriggerFocusClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">
                  Additional classes applied when trigger is focused
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectDropdownClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Dropdown menu container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectSearchInputClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Search input wrapper in dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectOptionClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Individual country option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectOptionSelectedClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">
                  Additional classes applied to the selected option
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectOptionListClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Options list container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectChevronClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Chevron icon in trigger</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectSelectedIndicatorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">
                  Selected indicator icon styling (default check icon)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectSelectedIndicator
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">
                  Custom element to show for selected option (replaces check icon)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectSearchIconClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Search icon in search input</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  countrySelectNoResultsClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">No results message</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="PhoneNumberData Type">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">countryCode</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">ISO country code (e.g., "US")</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">phoneNumber</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Digits only phone number</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullNumber</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Full number with dial code</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isValid</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 text-gray-600">
                  Whether the phone number is valid
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">nationalNumber</td>
                <td className="py-2 pr-4 text-gray-600">string?</td>
                <td className="py-2 text-gray-600">National format number</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  internationalNumber
                </td>
                <td className="py-2 pr-4 text-gray-600">string?</td>
                <td className="py-2 text-gray-600">International format number</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default InternationalPhoneInputDemo;
