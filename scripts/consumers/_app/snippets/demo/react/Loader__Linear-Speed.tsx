import { LinearLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md">
                {[
                  { speed: 3, label: "Slow (3s)" },
                  { speed: 1.5, label: "Normal (1.5s)" },
                  { speed: 0.7, label: "Fast (0.7s)" }
                ].map(({ speed, label }) => (
                  <div key={label} className="space-y-1">
                    <span className={"text-xs font-medium text-cl-text-tertiary"}>{label}</span>
                    <LinearLoader
                      speed={speed}
                      className="text-cl-accent"
                      trackColor={false ? "rgba(255,255,255,0.1)" : undefined}
                    />
                  </div>
                ))}
              </div>
  );
}
