import { CountryOption, InternationalPhoneInput } from "@chumlab/ui/international-phone-input";

const EUROPEAN_COUNTRIES: CountryOption[] = [
  { value: "GB", label: "United Kingdom (+44)", flag: "gb", dialCode: "+44", name: "United Kingdom" },
  { value: "DE", label: "Germany (+49)", flag: "de", dialCode: "+49", name: "Germany" },
  { value: "FR", label: "France (+33)", flag: "fr", dialCode: "+33", name: "France" },
  { value: "IT", label: "Italy (+39)", flag: "it", dialCode: "+39", name: "Italy" },
  { value: "ES", label: "Spain (+34)", flag: "es", dialCode: "+34", name: "Spain" },
  { value: "NL", label: "Netherlands (+31)", flag: "nl", dialCode: "+31", name: "Netherlands" },
  { value: "SE", label: "Sweden (+46)", flag: "se", dialCode: "+46", name: "Sweden" },
];

export default function InternationalPhoneInputExample() {
  return (
    <div className="w-full sm:max-w-md">
      <InternationalPhoneInput
        label="European Numbers Only"
        countries={EUROPEAN_COUNTRIES}
        preferredCountries={["gb"]}
        defaultCountry="gb"
        placeholder="Enter phone number"
        classes={
          {
            root: "flex flex-col gap-1",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:[color-scheme:dark]",
            countrySelect: {
                     trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-cl-bg-input hover:bg-cl-bg-hover text-cl-text-chrome",
                     content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-text/10",
                     searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-text/10",
                     searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary",
                     list: "max-h-60 overflow-y-auto",
                     item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover text-cl-text-chrome",
                     icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                     itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                     searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                     empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                   }
          }
        }
      />
    </div>
  );
}
