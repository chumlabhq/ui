import { CountryFlag } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <>
      <CountryFlag
                  code="us"
                  size={48}
                  tooltip="United States"
                  className={"rounded-[3px]"}
                />
      <CountryFlag
                  code="gb"
                  size={48}
                  tooltip="United Kingdom"
                  className={"rounded-[3px]"}
                />
      <CountryFlag
                  code="jp"
                  size={48}
                  tooltip={{ content: "Japan", side: "bottom" }}
                  className={"rounded-[3px]"}
                />
      <CountryFlag
                  code="de"
                  size={48}
                  tooltip={{ content: "Germany", showArrow: false }}
                  className={"rounded-[3px]"}
                />
    </>
  );
}
