const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Shape returned by /api/countries, already normalized server-side from the
// REST Countries v5 payload. Flags are not included - the demos build those
// from our own S3 bucket off the alpha-2 code.
export interface Country {
  name: string;
  code: string;
  capital?: string;
  region: string;
  subregion?: string;
}

async function get(path: string): Promise<Country[]> {
  const response = await fetch(`${API_BASE_URL}/countries${path}`);
  if (!response.ok) throw new Error("Failed to fetch countries");
  const { countries }: { countries: Country[] } = await response.json();
  return countries;
}

export const fetchCountries = (): Promise<Country[]> => get("");

export const fetchCountriesByRegion = (region: string): Promise<Country[]> =>
  get(`/region/${encodeURIComponent(region.toLowerCase())}`);

export const searchCountries = (query: string): Promise<Country[]> =>
  query.trim() ? get(`/search?q=${encodeURIComponent(query)}`) : Promise.resolve([]);
