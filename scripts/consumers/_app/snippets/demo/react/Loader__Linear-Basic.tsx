import { LinearLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="w-full max-w-xs sm:max-w-md">
                <LinearLoader
                  className="text-cl-accent"
                  trackColor={false ? "rgba(255,255,255,0.1)" : undefined}
                />
              </div>
  );
}
