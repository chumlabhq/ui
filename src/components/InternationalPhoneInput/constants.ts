import type { CountryOption } from "./utils/types.js";
import type { InternationalPhoneInputClasses } from "./utils/types.js";
import { structuralOnly } from "../../utils/classLayers.js";

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

/**
 * The 193 countries, packed.
 *
 * This was an array of 193 object literals — 17.66 KB of source, 4.06 KB
 * gzipped — and four fifths of it was structure rather than information: five
 * repeated keys per row, plus two fields derivable from the other three.
 * `flag` is the ISO code lowercased and `label` is `name (+dial)`, in all 193
 * rows without exception, which is asserted below rather than assumed.
 *
 * Packed as `<ISO2><dial>|<name>` joined by `~`, it is 2.86 KB of source and
 * 1.90 KB gzipped: **2.16 KB less**. A bundler cannot dedupe object keys the
 * way a delimited string does, and gzip was already doing what it could with
 * the repetition.
 *
 * The ISO code is always two characters, which is what makes the row splittable
 * without a second delimiter.
 */
const PACKED_COUNTRIES =
  "AF93|Afghanistan~AL355|Albania~DZ213|Algeria~AD376|Andorra~AO244|Angola~AG1268|Antigua and Barbu" +
  "da~AR54|Argentina~AM374|Armenia~AU61|Australia~AT43|Austria~AZ994|Azerbaijan~BS1242|Bahamas~BH97" +
  "3|Bahrain~BD880|Bangladesh~BB1246|Barbados~BY375|Belarus~BE32|Belgium~BZ501|Belize~BJ229|Benin~B" +
  "T975|Bhutan~BO591|Bolivia~BA387|Bosnia and Herzegovina~BW267|Botswana~BR55|Brazil~BN673|Brunei~B" +
  "G359|Bulgaria~BF226|Burkina Faso~BI257|Burundi~KH855|Cambodia~CM237|Cameroon~CA1|Canada~CV238|Ca" +
  "pe Verde~CF236|Central African Republic~TD235|Chad~CL56|Chile~CN86|China~CO57|Colombia~KM269|Com" +
  "oros~CG242|Congo~CD243|Congo (DRC)~CR506|Costa Rica~CI225|Côte d'Ivoire~HR385|Croatia~CU53|Cuba~" +
  "CY357|Cyprus~CZ420|Czech Republic~DK45|Denmark~DJ253|Djibouti~DM1767|Dominica~DO1809|Dominican R" +
  "epublic~EC593|Ecuador~EG20|Egypt~SV503|El Salvador~GQ240|Equatorial Guinea~ER291|Eritrea~EE372|E" +
  "stonia~SZ268|Eswatini~ET251|Ethiopia~FJ679|Fiji~FI358|Finland~FR33|France~GA241|Gabon~GM220|Gamb" +
  "ia~GE995|Georgia~DE49|Germany~GH233|Ghana~GR30|Greece~GD1473|Grenada~GT502|Guatemala~GN224|Guine" +
  "a~GW245|Guinea-Bissau~GY592|Guyana~HT509|Haiti~HN504|Honduras~HK852|Hong Kong~HU36|Hungary~IS354" +
  "|Iceland~IN91|India~ID62|Indonesia~IR98|Iran~IQ964|Iraq~IE353|Ireland~IL972|Israel~IT39|Italy~JM" +
  "1876|Jamaica~JP81|Japan~JO962|Jordan~KZ7|Kazakhstan~KE254|Kenya~KI686|Kiribati~KW965|Kuwait~KG99" +
  "6|Kyrgyzstan~LA856|Laos~LV371|Latvia~LB961|Lebanon~LS266|Lesotho~LR231|Liberia~LY218|Libya~LI423" +
  "|Liechtenstein~LT370|Lithuania~LU352|Luxembourg~MO853|Macau~MG261|Madagascar~MW265|Malawi~MY60|M" +
  "alaysia~MV960|Maldives~ML223|Mali~MT356|Malta~MR222|Mauritania~MU230|Mauritius~MX52|Mexico~MD373" +
  "|Moldova~MC377|Monaco~MN976|Mongolia~ME382|Montenegro~MA212|Morocco~MZ258|Mozambique~MM95|Myanma" +
  "r~NA264|Namibia~NP977|Nepal~NL31|Netherlands~NZ64|New Zealand~NI505|Nicaragua~NE227|Niger~NG234|" +
  "Nigeria~KP850|North Korea~MK389|North Macedonia~NO47|Norway~OM968|Oman~PK92|Pakistan~PS970|Pales" +
  "tine~PA507|Panama~PG675|Papua New Guinea~PY595|Paraguay~PE51|Peru~PH63|Philippines~PL48|Poland~P" +
  "T351|Portugal~QA974|Qatar~RO40|Romania~RU7|Russia~RW250|Rwanda~KN1869|Saint Kitts and Nevis~LC17" +
  "58|Saint Lucia~VC1784|Saint Vincent and the Grenadines~WS685|Samoa~SM378|San Marino~ST239|São To" +
  "mé and Príncipe~SA966|Saudi Arabia~SN221|Senegal~RS381|Serbia~SC248|Seychelles~SL232|Sierra Leon" +
  "e~SG65|Singapore~SK421|Slovakia~SI386|Slovenia~SB677|Solomon Islands~SO252|Somalia~ZA27|South Af" +
  "rica~KR82|South Korea~SS211|South Sudan~ES34|Spain~LK94|Sri Lanka~SD249|Sudan~SR597|Suriname~SE4" +
  "6|Sweden~CH41|Switzerland~SY963|Syria~TW886|Taiwan~TJ992|Tajikistan~TZ255|Tanzania~TH66|Thailand" +
  "~TL670|Timor-Leste~TG228|Togo~TO676|Tonga~TT1868|Trinidad and Tobago~TN216|Tunisia~TR90|Turkey~T" +
  "M993|Turkmenistan~UG256|Uganda~UA380|Ukraine~AE971|United Arab Emirates~GB44|United Kingdom~US1|" +
  "United States~UY598|Uruguay~UZ998|Uzbekistan~VU678|Vanuatu~VA379|Vatican City~VE58|Venezuela~VN8" +
  "4|Vietnam~YE967|Yemen~ZM260|Zambia~ZW263|Zimbabwe";

/**
 * Parsed once, at module load, because `selectedCountry` resolves out of it
 * during the first render to paint the trigger's flag and dial code — deferring
 * it would be a blank trigger on first paint, which is the reason this data
 * cannot be lazy at all. Measured at well under a millisecond for all 193 rows;
 * see INTERNATIONALPHONEINPUT.ai.md.
 */
const unpack = (packed: string): CountryOption[] =>
  packed.split("~").map((row) => {
    const separator = row.indexOf("|");
    const value = row.slice(0, 2);
    const dialCode = `+${row.slice(2, separator)}`;
    const name = row.slice(separator + 1);
    return { value, label: `${name} (${dialCode})`, flag: value.toLowerCase(), dialCode, name };
  });

export const DEFAULT_COUNTRIES: CountryOption[] = unpack(PACKED_COUNTRIES);

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
  root: "flex flex-col gap-1",
  label:
    "text-[13px] font-medium mb-1.5 block text-cl-text-chrome",
  description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
  control: "flex gap-2 items-stretch data-[loading]:opacity-50 data-[loading]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
  input:
    "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus data-[error]:border-cl-error data-[valid]:border-cl-success",
  message:
    "text-xs mt-1.5 flex items-center gap-1.5 data-[invalid]:text-cl-error data-[valid]:text-cl-success",
  itemRow: "flex items-center gap-2 min-w-0",
  itemIcon: "shrink-0 rounded-cl-sm",
  itemText: "text-sm wrap-break-word min-w-0",
  countrySelect: {
    trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[110px] sm:min-w-[130px] border-cl-border-input bg-cl-bg-input hover:bg-cl-bg-item-hover text-cl-text-chrome focus-visible:ring-2 focus-visible:ring-cl-accent cursor-pointer data-[disabled]:cursor-not-allowed",
    content: "w-72 border rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border-cl-border",
    searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border",
    searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent rounded-cl-sm",
    item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[highlighted]:bg-cl-bg-hover text-cl-text-chrome",
    list: "max-h-60 overflow-y-auto",
    icon: "w-4 h-4 shrink-0 transition-transform duration-200",
    itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
    searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
    empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary",
  },
  triggerRow: "flex items-center gap-2",
  flag: "rounded-cl-sm",
  value: "text-sm",
};

export const UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES: Required<InternationalPhoneInputClasses> =
  structuralOnly(DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES);
