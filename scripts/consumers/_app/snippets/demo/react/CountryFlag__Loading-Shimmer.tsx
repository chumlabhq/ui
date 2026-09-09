import { useState } from "react";
import { CountryFlag, CountryFlagShimmer } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {
        isLoading ? (
          <>
            <CountryFlagShimmer size={32} className="rounded-[3px]" />
            <CountryFlagShimmer size={48} className="rounded-[3px]" />
            <CountryFlagShimmer size={48} className="rounded-[3px]" />
          </>
        ) : (
          <>
            <CountryFlag code="us" size={32} className="rounded-[3px]" />
            <CountryFlag code="gb" size={48} className="rounded-[3px]" />
            <CountryFlag code="jp" size={48} className="rounded-[3px]" />
          </>
        )
      }
    </>
  );
}
