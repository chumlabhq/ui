/**
 * The country list the async demos search, filter and group.
 *
 * Static and self-contained on purpose. These demos called the site's own
 * countries API through `import.meta.env.VITE_API_BASE_URL`, so their Show code
 * could not be generated: a reader copying them got code that could not run
 * outside this site. Each page wraps this list in its own fetchers with a
 * simulated delay, and the snippet generator inlines both.
 */
export interface Country {
  name: string;
  /** ISO 3166-1 alpha-2, which CountryFlag takes. */
  code: string;
  capital: string;
  region: string;
}

export const COUNTRIES: Country[] = [
  { name: "Egypt", code: "EG", capital: "Cairo", region: "Africa" },
  { name: "Ghana", code: "GH", capital: "Accra", region: "Africa" },
  { name: "Kenya", code: "KE", capital: "Nairobi", region: "Africa" },
  { name: "Morocco", code: "MA", capital: "Rabat", region: "Africa" },
  { name: "Nigeria", code: "NG", capital: "Abuja", region: "Africa" },
  { name: "South Africa", code: "ZA", capital: "Pretoria", region: "Africa" },
  { name: "Argentina", code: "AR", capital: "Buenos Aires", region: "Americas" },
  { name: "Brazil", code: "BR", capital: "Brasília", region: "Americas" },
  { name: "Canada", code: "CA", capital: "Ottawa", region: "Americas" },
  { name: "Chile", code: "CL", capital: "Santiago", region: "Americas" },
  { name: "Colombia", code: "CO", capital: "Bogotá", region: "Americas" },
  { name: "Mexico", code: "MX", capital: "Mexico City", region: "Americas" },
  { name: "United States", code: "US", capital: "Washington, D.C.", region: "Americas" },
  { name: "China", code: "CN", capital: "Beijing", region: "Asia" },
  { name: "India", code: "IN", capital: "New Delhi", region: "Asia" },
  { name: "Indonesia", code: "ID", capital: "Jakarta", region: "Asia" },
  { name: "Japan", code: "JP", capital: "Tokyo", region: "Asia" },
  { name: "Singapore", code: "SG", capital: "Singapore", region: "Asia" },
  { name: "South Korea", code: "KR", capital: "Seoul", region: "Asia" },
  { name: "Vietnam", code: "VN", capital: "Hanoi", region: "Asia" },
  { name: "France", code: "FR", capital: "Paris", region: "Europe" },
  { name: "Germany", code: "DE", capital: "Berlin", region: "Europe" },
  { name: "Ireland", code: "IE", capital: "Dublin", region: "Europe" },
  { name: "Italy", code: "IT", capital: "Rome", region: "Europe" },
  { name: "Netherlands", code: "NL", capital: "Amsterdam", region: "Europe" },
  { name: "Spain", code: "ES", capital: "Madrid", region: "Europe" },
  { name: "Sweden", code: "SE", capital: "Stockholm", region: "Europe" },
  { name: "United Kingdom", code: "GB", capital: "London", region: "Europe" },
  { name: "Australia", code: "AU", capital: "Canberra", region: "Oceania" },
  { name: "Fiji", code: "FJ", capital: "Suva", region: "Oceania" },
  { name: "New Zealand", code: "NZ", capital: "Wellington", region: "Oceania" },
  { name: "Papua New Guinea", code: "PG", capital: "Port Moresby", region: "Oceania" },
];
