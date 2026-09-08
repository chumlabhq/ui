import { CountryFlag } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <>
      {}
      {["us", "gb", "jp", "de", "fr", "in", "br", "ca"].map((code) => (
                  <CountryFlag key={code} code={code} size={48} />
                ))}
    </>
  );
}
