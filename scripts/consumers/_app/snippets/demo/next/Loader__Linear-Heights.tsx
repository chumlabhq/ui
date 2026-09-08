import { LinearLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xs sm:max-w-md">
                {[2, 4, 8].map((h) => (
                  <div key={h} className="space-y-1">
                    <span className={"text-xs font-medium text-cl-text-tertiary"}>{h}px</span>
                    <LinearLoader
                      height={h}
                      className="text-cl-accent"
                      trackColor={false ? "rgba(255,255,255,0.1)" : undefined}
                    />
                  </div>
                ))}
              </div>
  );
}
