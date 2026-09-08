import { DotLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <DotLoader
                    dotSize={6}
                    gap={3}
                    className="text-cl-accent"
                  />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <DotLoader
                    dotSize={10}
                    className="text-cl-accent"
                  />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <DotLoader
                    dotSize={14}
                    gap={6}
                    className="text-cl-accent"
                  />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Large</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <DotLoader
                    dotSize={8}
                    count={5}
                    className="text-cl-accent"
                  />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>5 dots</span>
                </div>
              </div>
  );
}
