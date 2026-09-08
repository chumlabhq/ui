import { CountryFlag } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <>
      {[0.5, 0.625, 0.75, 1].map((ratio) => (
                  <div key={ratio} className="text-center">
                    <CountryFlag
                      code="jp"
                      size={48}
                      aspectRatio={ratio}
                      className={"rounded-[3px]"}
                    />
                    <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>{ratio}</p>
                  </div>
                ))}
    </>
  );
}
