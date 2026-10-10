import { CountryFlag, CountryFlagGroup } from "@chumlab/ui/country-flag";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <CountryFlag code="us" size="lg" />
      <CountryFlagGroup maxVisible={3} size="lg">
        <CountryFlag code="gb" />
        <CountryFlag code="jp" />
        <CountryFlag code="de" />
        <CountryFlag code="fr" />
      </CountryFlagGroup>
    </div>
  );
}
