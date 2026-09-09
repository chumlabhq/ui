import { LinearLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md">
      <LinearLoader className="text-cl-accent" trackColor="rgba(91,155,255,0.18)" />
      <LinearLoader className="text-cl-accent" trackColor="rgba(91,155,255,0.18)" />
      <LinearLoader className="text-cl-accent" trackColor="rgba(91,155,255,0.18)" />
    </div>
  );
}
