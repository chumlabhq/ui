import { CircularLoader, DotLoader, PulseLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <CircularLoader size={20} className="text-cl-accent" />
        <span className="text-sm text-cl-text-secondary">Loading...</span>
      </div>
      <div className="flex items-center gap-3">
        <DotLoader dotSize={6} className="text-cl-accent" />
        <span className="text-xs text-cl-text-secondary">Typing</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <PulseLoader size={48} className="text-cl-accent" />
        <span className="text-sm font-medium text-cl-text-secondary">Please wait...</span>
      </div>
    </div>
  );
}
