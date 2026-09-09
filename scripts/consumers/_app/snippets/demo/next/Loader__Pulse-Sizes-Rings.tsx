import { PulseLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-6 sm:gap-12 flex-wrap">
      <div className="flex flex-col items-center gap-2">
        <PulseLoader size={24} className="text-cl-accent" />
        <span className="text-xs font-medium text-cl-text-tertiary">24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PulseLoader size={40} className="text-cl-accent" />
        <span className="text-xs font-medium text-cl-text-tertiary">40px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PulseLoader size={64} className="text-cl-accent" />
        <span className="text-xs font-medium text-cl-text-tertiary">64px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PulseLoader size={48} rings={3} className="text-cl-accent" />
        <span className="text-xs font-medium text-cl-text-tertiary">3 rings</span>
      </div>
    </div>
  );
}
