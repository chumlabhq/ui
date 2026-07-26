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
  { value: "AF", label: "Afghanistan (+93)", flag: "af", dialCode: "+93", name: "Afghanistan" },
  { value: "AL", label: "Albania (+355)", flag: "al", dialCode: "+355", name: "Albania" },
  { value: "DZ", label: "Algeria (+213)", flag: "dz", dialCode: "+213", name: "Algeria" },
  { value: "AD", label: "Andorra (+376)", flag: "ad", dialCode: "+376", name: "Andorra" },
  { value: "AO", label: "Angola (+244)", flag: "ao", dialCode: "+244", name: "Angola" },
  { value: "AG", label: "Antigua and Barbuda (+1268)", flag: "ag", dialCode: "+1268", name: "Antigua and Barbuda" },
  { value: "AR", label: "Argentina (+54)", flag: "ar", dialCode: "+54", name: "Argentina" },
  { value: "AM", label: "Armenia (+374)", flag: "am", dialCode: "+374", name: "Armenia" },
  { value: "AU", label: "Australia (+61)", flag: "au", dialCode: "+61", name: "Australia" },
  { value: "AT", label: "Austria (+43)", flag: "at", dialCode: "+43", name: "Austria" },
  { value: "AZ", label: "Azerbaijan (+994)", flag: "az", dialCode: "+994", name: "Azerbaijan" },
  { value: "BS", label: "Bahamas (+1242)", flag: "bs", dialCode: "+1242", name: "Bahamas" },
  { value: "BH", label: "Bahrain (+973)", flag: "bh", dialCode: "+973", name: "Bahrain" },
  { value: "BD", label: "Bangladesh (+880)", flag: "bd", dialCode: "+880", name: "Bangladesh" },
  { value: "BB", label: "Barbados (+1246)", flag: "bb", dialCode: "+1246", name: "Barbados" },
  { value: "BY", label: "Belarus (+375)", flag: "by", dialCode: "+375", name: "Belarus" },
  { value: "BE", label: "Belgium (+32)", flag: "be", dialCode: "+32", name: "Belgium" },
  { value: "BZ", label: "Belize (+501)", flag: "bz", dialCode: "+501", name: "Belize" },
  { value: "BJ", label: "Benin (+229)", flag: "bj", dialCode: "+229", name: "Benin" },
  { value: "BT", label: "Bhutan (+975)", flag: "bt", dialCode: "+975", name: "Bhutan" },
  { value: "BO", label: "Bolivia (+591)", flag: "bo", dialCode: "+591", name: "Bolivia" },
  { value: "BA", label: "Bosnia and Herzegovina (+387)", flag: "ba", dialCode: "+387", name: "Bosnia and Herzegovina" },
  { value: "BW", label: "Botswana (+267)", flag: "bw", dialCode: "+267", name: "Botswana" },
  { value: "BR", label: "Brazil (+55)", flag: "br", dialCode: "+55", name: "Brazil" },
  { value: "BN", label: "Brunei (+673)", flag: "bn", dialCode: "+673", name: "Brunei" },
  { value: "BG", label: "Bulgaria (+359)", flag: "bg", dialCode: "+359", name: "Bulgaria" },
  { value: "BF", label: "Burkina Faso (+226)", flag: "bf", dialCode: "+226", name: "Burkina Faso" },
  { value: "BI", label: "Burundi (+257)", flag: "bi", dialCode: "+257", name: "Burundi" },
  { value: "KH", label: "Cambodia (+855)", flag: "kh", dialCode: "+855", name: "Cambodia" },
  { value: "CM", label: "Cameroon (+237)", flag: "cm", dialCode: "+237", name: "Cameroon" },
  { value: "CA", label: "Canada (+1)", flag: "ca", dialCode: "+1", name: "Canada" },
  { value: "CV", label: "Cape Verde (+238)", flag: "cv", dialCode: "+238", name: "Cape Verde" },
  { value: "CF", label: "Central African Republic (+236)", flag: "cf", dialCode: "+236", name: "Central African Republic" },
  { value: "TD", label: "Chad (+235)", flag: "td", dialCode: "+235", name: "Chad" },
  { value: "CL", label: "Chile (+56)", flag: "cl", dialCode: "+56", name: "Chile" },
  { value: "CN", label: "China (+86)", flag: "cn", dialCode: "+86", name: "China" },
  { value: "CO", label: "Colombia (+57)", flag: "co", dialCode: "+57", name: "Colombia" },
  { value: "KM", label: "Comoros (+269)", flag: "km", dialCode: "+269", name: "Comoros" },
  { value: "CG", label: "Congo (+242)", flag: "cg", dialCode: "+242", name: "Congo" },
  { value: "CD", label: "Congo (DRC) (+243)", flag: "cd", dialCode: "+243", name: "Congo (DRC)" },
  { value: "CR", label: "Costa Rica (+506)", flag: "cr", dialCode: "+506", name: "Costa Rica" },
  { value: "CI", label: "Côte d'Ivoire (+225)", flag: "ci", dialCode: "+225", name: "Côte d'Ivoire" },
  { value: "HR", label: "Croatia (+385)", flag: "hr", dialCode: "+385", name: "Croatia" },
  { value: "CU", label: "Cuba (+53)", flag: "cu", dialCode: "+53", name: "Cuba" },
  { value: "CY", label: "Cyprus (+357)", flag: "cy", dialCode: "+357", name: "Cyprus" },
  { value: "CZ", label: "Czech Republic (+420)", flag: "cz", dialCode: "+420", name: "Czech Republic" },
  { value: "DK", label: "Denmark (+45)", flag: "dk", dialCode: "+45", name: "Denmark" },
  { value: "DJ", label: "Djibouti (+253)", flag: "dj", dialCode: "+253", name: "Djibouti" },
  { value: "DM", label: "Dominica (+1767)", flag: "dm", dialCode: "+1767", name: "Dominica" },
  { value: "DO", label: "Dominican Republic (+1809)", flag: "do", dialCode: "+1809", name: "Dominican Republic" },
  { value: "EC", label: "Ecuador (+593)", flag: "ec", dialCode: "+593", name: "Ecuador" },
  { value: "EG", label: "Egypt (+20)", flag: "eg", dialCode: "+20", name: "Egypt" },
  { value: "SV", label: "El Salvador (+503)", flag: "sv", dialCode: "+503", name: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea (+240)", flag: "gq", dialCode: "+240", name: "Equatorial Guinea" },
  { value: "ER", label: "Eritrea (+291)", flag: "er", dialCode: "+291", name: "Eritrea" },
  { value: "EE", label: "Estonia (+372)", flag: "ee", dialCode: "+372", name: "Estonia" },
  { value: "SZ", label: "Eswatini (+268)", flag: "sz", dialCode: "+268", name: "Eswatini" },
  { value: "ET", label: "Ethiopia (+251)", flag: "et", dialCode: "+251", name: "Ethiopia" },
  { value: "FJ", label: "Fiji (+679)", flag: "fj", dialCode: "+679", name: "Fiji" },
  { value: "FI", label: "Finland (+358)", flag: "fi", dialCode: "+358", name: "Finland" },
  { value: "FR", label: "France (+33)", flag: "fr", dialCode: "+33", name: "France" },
  { value: "GA", label: "Gabon (+241)", flag: "ga", dialCode: "+241", name: "Gabon" },
  { value: "GM", label: "Gambia (+220)", flag: "gm", dialCode: "+220", name: "Gambia" },
  { value: "GE", label: "Georgia (+995)", flag: "ge", dialCode: "+995", name: "Georgia" },
  { value: "DE", label: "Germany (+49)", flag: "de", dialCode: "+49", name: "Germany" },
  { value: "GH", label: "Ghana (+233)", flag: "gh", dialCode: "+233", name: "Ghana" },
  { value: "GR", label: "Greece (+30)", flag: "gr", dialCode: "+30", name: "Greece" },
  { value: "GD", label: "Grenada (+1473)", flag: "gd", dialCode: "+1473", name: "Grenada" },
  { value: "GT", label: "Guatemala (+502)", flag: "gt", dialCode: "+502", name: "Guatemala" },
  { value: "GN", label: "Guinea (+224)", flag: "gn", dialCode: "+224", name: "Guinea" },
  { value: "GW", label: "Guinea-Bissau (+245)", flag: "gw", dialCode: "+245", name: "Guinea-Bissau" },
  { value: "GY", label: "Guyana (+592)", flag: "gy", dialCode: "+592", name: "Guyana" },
  { value: "HT", label: "Haiti (+509)", flag: "ht", dialCode: "+509", name: "Haiti" },
  { value: "HN", label: "Honduras (+504)", flag: "hn", dialCode: "+504", name: "Honduras" },
  { value: "HK", label: "Hong Kong (+852)", flag: "hk", dialCode: "+852", name: "Hong Kong" },
  { value: "HU", label: "Hungary (+36)", flag: "hu", dialCode: "+36", name: "Hungary" },
  { value: "IS", label: "Iceland (+354)", flag: "is", dialCode: "+354", name: "Iceland" },
  { value: "IN", label: "India (+91)", flag: "in", dialCode: "+91", name: "India" },
  { value: "ID", label: "Indonesia (+62)", flag: "id", dialCode: "+62", name: "Indonesia" },
  { value: "IR", label: "Iran (+98)", flag: "ir", dialCode: "+98", name: "Iran" },
  { value: "IQ", label: "Iraq (+964)", flag: "iq", dialCode: "+964", name: "Iraq" },
  { value: "IE", label: "Ireland (+353)", flag: "ie", dialCode: "+353", name: "Ireland" },
  { value: "IL", label: "Israel (+972)", flag: "il", dialCode: "+972", name: "Israel" },
  { value: "IT", label: "Italy (+39)", flag: "it", dialCode: "+39", name: "Italy" },
  { value: "JM", label: "Jamaica (+1876)", flag: "jm", dialCode: "+1876", name: "Jamaica" },
  { value: "JP", label: "Japan (+81)", flag: "jp", dialCode: "+81", name: "Japan" },
  { value: "JO", label: "Jordan (+962)", flag: "jo", dialCode: "+962", name: "Jordan" },
  { value: "KZ", label: "Kazakhstan (+7)", flag: "kz", dialCode: "+7", name: "Kazakhstan" },
  { value: "KE", label: "Kenya (+254)", flag: "ke", dialCode: "+254", name: "Kenya" },
  { value: "KI", label: "Kiribati (+686)", flag: "ki", dialCode: "+686", name: "Kiribati" },
  { value: "KW", label: "Kuwait (+965)", flag: "kw", dialCode: "+965", name: "Kuwait" },
  { value: "KG", label: "Kyrgyzstan (+996)", flag: "kg", dialCode: "+996", name: "Kyrgyzstan" },
  { value: "LA", label: "Laos (+856)", flag: "la", dialCode: "+856", name: "Laos" },
  { value: "LV", label: "Latvia (+371)", flag: "lv", dialCode: "+371", name: "Latvia" },
  { value: "LB", label: "Lebanon (+961)", flag: "lb", dialCode: "+961", name: "Lebanon" },
  { value: "LS", label: "Lesotho (+266)", flag: "ls", dialCode: "+266", name: "Lesotho" },
  { value: "LR", label: "Liberia (+231)", flag: "lr", dialCode: "+231", name: "Liberia" },
  { value: "LY", label: "Libya (+218)", flag: "ly", dialCode: "+218", name: "Libya" },
  { value: "LI", label: "Liechtenstein (+423)", flag: "li", dialCode: "+423", name: "Liechtenstein" },
  { value: "LT", label: "Lithuania (+370)", flag: "lt", dialCode: "+370", name: "Lithuania" },
  { value: "LU", label: "Luxembourg (+352)", flag: "lu", dialCode: "+352", name: "Luxembourg" },
  { value: "MO", label: "Macau (+853)", flag: "mo", dialCode: "+853", name: "Macau" },
  { value: "MG", label: "Madagascar (+261)", flag: "mg", dialCode: "+261", name: "Madagascar" },
  { value: "MW", label: "Malawi (+265)", flag: "mw", dialCode: "+265", name: "Malawi" },
  { value: "MY", label: "Malaysia (+60)", flag: "my", dialCode: "+60", name: "Malaysia" },
  { value: "MV", label: "Maldives (+960)", flag: "mv", dialCode: "+960", name: "Maldives" },
  { value: "ML", label: "Mali (+223)", flag: "ml", dialCode: "+223", name: "Mali" },
  { value: "MT", label: "Malta (+356)", flag: "mt", dialCode: "+356", name: "Malta" },
  { value: "MR", label: "Mauritania (+222)", flag: "mr", dialCode: "+222", name: "Mauritania" },
  { value: "MU", label: "Mauritius (+230)", flag: "mu", dialCode: "+230", name: "Mauritius" },
  { value: "MX", label: "Mexico (+52)", flag: "mx", dialCode: "+52", name: "Mexico" },
  { value: "MD", label: "Moldova (+373)", flag: "md", dialCode: "+373", name: "Moldova" },
  { value: "MC", label: "Monaco (+377)", flag: "mc", dialCode: "+377", name: "Monaco" },
  { value: "MN", label: "Mongolia (+976)", flag: "mn", dialCode: "+976", name: "Mongolia" },
  { value: "ME", label: "Montenegro (+382)", flag: "me", dialCode: "+382", name: "Montenegro" },
  { value: "MA", label: "Morocco (+212)", flag: "ma", dialCode: "+212", name: "Morocco" },
  { value: "MZ", label: "Mozambique (+258)", flag: "mz", dialCode: "+258", name: "Mozambique" },
  { value: "MM", label: "Myanmar (+95)", flag: "mm", dialCode: "+95", name: "Myanmar" },
  { value: "NA", label: "Namibia (+264)", flag: "na", dialCode: "+264", name: "Namibia" },
  { value: "NP", label: "Nepal (+977)", flag: "np", dialCode: "+977", name: "Nepal" },
  { value: "NL", label: "Netherlands (+31)", flag: "nl", dialCode: "+31", name: "Netherlands" },
  { value: "NZ", label: "New Zealand (+64)", flag: "nz", dialCode: "+64", name: "New Zealand" },
  { value: "NI", label: "Nicaragua (+505)", flag: "ni", dialCode: "+505", name: "Nicaragua" },
  { value: "NE", label: "Niger (+227)", flag: "ne", dialCode: "+227", name: "Niger" },
  { value: "NG", label: "Nigeria (+234)", flag: "ng", dialCode: "+234", name: "Nigeria" },
  { value: "KP", label: "North Korea (+850)", flag: "kp", dialCode: "+850", name: "North Korea" },
  { value: "MK", label: "North Macedonia (+389)", flag: "mk", dialCode: "+389", name: "North Macedonia" },
  { value: "NO", label: "Norway (+47)", flag: "no", dialCode: "+47", name: "Norway" },
  { value: "OM", label: "Oman (+968)", flag: "om", dialCode: "+968", name: "Oman" },
  { value: "PK", label: "Pakistan (+92)", flag: "pk", dialCode: "+92", name: "Pakistan" },
  { value: "PS", label: "Palestine (+970)", flag: "ps", dialCode: "+970", name: "Palestine" },
  { value: "PA", label: "Panama (+507)", flag: "pa", dialCode: "+507", name: "Panama" },
  { value: "PG", label: "Papua New Guinea (+675)", flag: "pg", dialCode: "+675", name: "Papua New Guinea" },
  { value: "PY", label: "Paraguay (+595)", flag: "py", dialCode: "+595", name: "Paraguay" },
  { value: "PE", label: "Peru (+51)", flag: "pe", dialCode: "+51", name: "Peru" },
  { value: "PH", label: "Philippines (+63)", flag: "ph", dialCode: "+63", name: "Philippines" },
  { value: "PL", label: "Poland (+48)", flag: "pl", dialCode: "+48", name: "Poland" },
  { value: "PT", label: "Portugal (+351)", flag: "pt", dialCode: "+351", name: "Portugal" },
  { value: "QA", label: "Qatar (+974)", flag: "qa", dialCode: "+974", name: "Qatar" },
  { value: "RO", label: "Romania (+40)", flag: "ro", dialCode: "+40", name: "Romania" },
  { value: "RU", label: "Russia (+7)", flag: "ru", dialCode: "+7", name: "Russia" },
  { value: "RW", label: "Rwanda (+250)", flag: "rw", dialCode: "+250", name: "Rwanda" },
  { value: "KN", label: "Saint Kitts and Nevis (+1869)", flag: "kn", dialCode: "+1869", name: "Saint Kitts and Nevis" },
  { value: "LC", label: "Saint Lucia (+1758)", flag: "lc", dialCode: "+1758", name: "Saint Lucia" },
  { value: "VC", label: "Saint Vincent and the Grenadines (+1784)", flag: "vc", dialCode: "+1784", name: "Saint Vincent and the Grenadines" },
  { value: "WS", label: "Samoa (+685)", flag: "ws", dialCode: "+685", name: "Samoa" },
  { value: "SM", label: "San Marino (+378)", flag: "sm", dialCode: "+378", name: "San Marino" },
  { value: "ST", label: "São Tomé and Príncipe (+239)", flag: "st", dialCode: "+239", name: "São Tomé and Príncipe" },
  { value: "SA", label: "Saudi Arabia (+966)", flag: "sa", dialCode: "+966", name: "Saudi Arabia" },
  { value: "SN", label: "Senegal (+221)", flag: "sn", dialCode: "+221", name: "Senegal" },
  { value: "RS", label: "Serbia (+381)", flag: "rs", dialCode: "+381", name: "Serbia" },
  { value: "SC", label: "Seychelles (+248)", flag: "sc", dialCode: "+248", name: "Seychelles" },
  { value: "SL", label: "Sierra Leone (+232)", flag: "sl", dialCode: "+232", name: "Sierra Leone" },
  { value: "SG", label: "Singapore (+65)", flag: "sg", dialCode: "+65", name: "Singapore" },
  { value: "SK", label: "Slovakia (+421)", flag: "sk", dialCode: "+421", name: "Slovakia" },
  { value: "SI", label: "Slovenia (+386)", flag: "si", dialCode: "+386", name: "Slovenia" },
  { value: "SB", label: "Solomon Islands (+677)", flag: "sb", dialCode: "+677", name: "Solomon Islands" },
  { value: "SO", label: "Somalia (+252)", flag: "so", dialCode: "+252", name: "Somalia" },
  { value: "ZA", label: "South Africa (+27)", flag: "za", dialCode: "+27", name: "South Africa" },
  { value: "KR", label: "South Korea (+82)", flag: "kr", dialCode: "+82", name: "South Korea" },
  { value: "SS", label: "South Sudan (+211)", flag: "ss", dialCode: "+211", name: "South Sudan" },
  { value: "ES", label: "Spain (+34)", flag: "es", dialCode: "+34", name: "Spain" },
  { value: "LK", label: "Sri Lanka (+94)", flag: "lk", dialCode: "+94", name: "Sri Lanka" },
  { value: "SD", label: "Sudan (+249)", flag: "sd", dialCode: "+249", name: "Sudan" },
  { value: "SR", label: "Suriname (+597)", flag: "sr", dialCode: "+597", name: "Suriname" },
  { value: "SE", label: "Sweden (+46)", flag: "se", dialCode: "+46", name: "Sweden" },
  { value: "CH", label: "Switzerland (+41)", flag: "ch", dialCode: "+41", name: "Switzerland" },
  { value: "SY", label: "Syria (+963)", flag: "sy", dialCode: "+963", name: "Syria" },
  { value: "TW", label: "Taiwan (+886)", flag: "tw", dialCode: "+886", name: "Taiwan" },
  { value: "TJ", label: "Tajikistan (+992)", flag: "tj", dialCode: "+992", name: "Tajikistan" },
  { value: "TZ", label: "Tanzania (+255)", flag: "tz", dialCode: "+255", name: "Tanzania" },
  { value: "TH", label: "Thailand (+66)", flag: "th", dialCode: "+66", name: "Thailand" },
  { value: "TL", label: "Timor-Leste (+670)", flag: "tl", dialCode: "+670", name: "Timor-Leste" },
  { value: "TG", label: "Togo (+228)", flag: "tg", dialCode: "+228", name: "Togo" },
  { value: "TO", label: "Tonga (+676)", flag: "to", dialCode: "+676", name: "Tonga" },
  { value: "TT", label: "Trinidad and Tobago (+1868)", flag: "tt", dialCode: "+1868", name: "Trinidad and Tobago" },
  { value: "TN", label: "Tunisia (+216)", flag: "tn", dialCode: "+216", name: "Tunisia" },
  { value: "TR", label: "Turkey (+90)", flag: "tr", dialCode: "+90", name: "Turkey" },
  { value: "TM", label: "Turkmenistan (+993)", flag: "tm", dialCode: "+993", name: "Turkmenistan" },
  { value: "UG", label: "Uganda (+256)", flag: "ug", dialCode: "+256", name: "Uganda" },
  { value: "UA", label: "Ukraine (+380)", flag: "ua", dialCode: "+380", name: "Ukraine" },
  { value: "AE", label: "United Arab Emirates (+971)", flag: "ae", dialCode: "+971", name: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom (+44)", flag: "gb", dialCode: "+44", name: "United Kingdom" },
  { value: "US", label: "United States (+1)", flag: "us", dialCode: "+1", name: "United States" },
  { value: "UY", label: "Uruguay (+598)", flag: "uy", dialCode: "+598", name: "Uruguay" },
  { value: "UZ", label: "Uzbekistan (+998)", flag: "uz", dialCode: "+998", name: "Uzbekistan" },
  { value: "VU", label: "Vanuatu (+678)", flag: "vu", dialCode: "+678", name: "Vanuatu" },
  { value: "VA", label: "Vatican City (+379)", flag: "va", dialCode: "+379", name: "Vatican City" },
  { value: "VE", label: "Venezuela (+58)", flag: "ve", dialCode: "+58", name: "Venezuela" },
  { value: "VN", label: "Vietnam (+84)", flag: "vn", dialCode: "+84", name: "Vietnam" },
  { value: "YE", label: "Yemen (+967)", flag: "ye", dialCode: "+967", name: "Yemen" },
  { value: "ZM", label: "Zambia (+260)", flag: "zm", dialCode: "+260", name: "Zambia" },
  { value: "ZW", label: "Zimbabwe (+263)", flag: "zw", dialCode: "+263", name: "Zimbabwe" },
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
  root: "flex flex-col gap-1",
  label:
    "text-[13px] font-medium mb-1.5 block text-cl-text dark:text-cl-text-secondary",
  description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary dark:text-cl-text-tertiary",
  wrapper: "flex gap-2 items-stretch",
  input:
    "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text dark:text-white placeholder:text-cl-text-tertiary dark:placeholder:text-cl-text-tertiary border-cl-border-input dark:border-cl-text/10 bg-white dark:bg-cl-text/4 focus:ring-2 focus:ring-cl-accent dark:focus:ring-cl-accent/30 focus:border-cl-border-input-focus dark:focus:border-cl-border-input-focus/50",
  error:
    "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error",
  success:
    "text-xs mt-1.5 flex items-center gap-1.5 text-cl-success",
  countrySelect: "",
  countrySelectTrigger:
    "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[110px] sm:min-w-[130px] border-cl-border-input dark:border-cl-text/10 bg-white dark:bg-cl-text/4 hover:bg-cl-bg-hover dark:hover:bg-white/6 text-cl-text dark:text-cl-text-secondary",
  countrySelectDropdown:
    "w-72 border rounded-cl-md shadow-lg overflow-hidden bg-white dark:bg-cl-bg-elevated border-cl-border dark:border-cl-text/10",
  countrySelectSearchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border-cl-text/10",
  countrySelectSearchInputElement:
    "flex-1 bg-transparent focus:outline-none text-sm text-cl-text dark:text-white placeholder:text-cl-text-tertiary",
  countrySelectOption:
    "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover dark:hover:bg-white/6 data-[focused]:bg-cl-bg-hover dark:data-[focused]:bg-white/10 text-cl-text dark:text-cl-text-secondary",
  countrySelectOptionSelected:
    "bg-cl-accent/15 dark:bg-cl-accent/10",
  countrySelectOptionList: "max-h-60 overflow-y-auto",
  countrySelectChevron:
    "w-4 h-4 shrink-0 transition-transform duration-200",
  countrySelectCheckIcon:
    "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
  countrySelectSearchIcon:
    "w-4 h-4 shrink-0 text-cl-text-tertiary dark:text-cl-text-tertiary",
  countrySelectNoResults:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
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
