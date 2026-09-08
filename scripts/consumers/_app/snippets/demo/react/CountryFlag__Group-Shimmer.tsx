import { CountryFlagGroupShimmer } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <CountryFlagGroupShimmer
                count={4}
                size={48}
                showCount
                className="rounded-[3px]"
              />
  );
}
