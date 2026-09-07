import { CountryFlag } from "@chumlab/ui/country-flag";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <CountryFlag code="us" size="lg" />
      <CountryFlag code="gb" size="lg" />
      <CountryFlag code="jp" size="lg" />
      <CountryFlag code="de" size="lg" />
    </div>
  );
}
