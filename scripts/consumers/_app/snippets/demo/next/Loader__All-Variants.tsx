import { CircularLoader, DotLoader, LinearLoader, PulseLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-6 sm:gap-12 flex-wrap">
      <div className="flex flex-col items-center gap-3">
        <CircularLoader size={32} className="text-cl-accent" />
        <span className="text-xs font-medium text-cl-text-tertiary">Circular</span>
      </div>
      <div className="flex flex-col items-center gap-3 w-32 sm:w-40">
        <LinearLoader trackColor="var(--cl-bg-track)" className="text-cl-accent" width="100%" />
        <span className="text-xs font-medium text-cl-text-tertiary">Linear</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <DotLoader size={10} className="text-cl-accent" />
        <span className="text-xs font-medium text-cl-text-tertiary">Dot</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <PulseLoader size={40} className="text-cl-accent" />
        <span className="text-xs font-medium text-cl-text-tertiary">Pulse</span>
      </div>
    </div>
  );
}
