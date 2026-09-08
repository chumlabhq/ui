import { CircularLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <CircularLoader
                    size={32}
                    className="text-cl-accent"
                  />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Default track</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CircularLoader
                    size={32}
                    className="text-cl-accent"
                    />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Indigo track</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CircularLoader
                    size={32}
                    className="text-cl-accent"
                    />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Emerald track</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CircularLoader
                    size={32}
                    className="text-cl-accent"
                    />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Rose track</span>
                </div>
              </div>
  );
}
