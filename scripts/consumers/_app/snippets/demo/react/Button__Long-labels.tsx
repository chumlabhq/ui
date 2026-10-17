import { Button } from "@chumlab/ui/button";

export default function ButtonExample() {
  return (
    <div className="w-full max-w-[16rem] space-y-3">
      <Button className="border border-cl-border bg-cl-bg-elevated text-cl-text">
        Download the full quarterly report as a PDF (12 MB)
      </Button>
    </div>
  );
}
