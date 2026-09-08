import { CircularLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                {[
                  { speed: 2, label: "Slow (2s)" },
                  { speed: 0.75, label: "Normal (0.75s)" },
                  { speed: 0.35, label: "Fast (0.35s)" }
                ].map(({ speed, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <CircularLoader
                      size={32}
                      speed={speed}
                      className="text-cl-accent"
                    />
                    <span className={"text-xs font-medium text-cl-text-tertiary"}>{label}</span>
                  </div>
                ))}
              </div>
  );
}
