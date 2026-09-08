import { CountryFlag } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <>
      <CountryFlag
                  code="us"
                  size={48}
                  classes={{
                    root: "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-cl-lg shadow-lg ring-2 ring-cl-accent"
                  }}
                />
      <CountryFlag
                  code="gb"
                  size={48}
                  classes={{
                    root: "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full shadow-lg"
                  }}
                />
      <CountryFlag
                  code="jp"
                  size={48}
                  classes={{
                    root: "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-none"
                  }}
                />
    </>
  );
}
