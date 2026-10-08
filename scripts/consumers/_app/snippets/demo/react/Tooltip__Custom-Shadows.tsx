import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

const shadowSharpDrop = "4px 4px 0px rgba(0, 0, 0, 0.1)";

const shadowSoftElevated = "0 10px 40px -10px rgba(0, 0, 0, 0.2)";

const shadowPurpleGlow = "0 4px 20px rgba(147, 51, 234, 0.5)";

const shadowBlueGlow = "0 4px 20px rgba(59, 130, 246, 0.5)";

export default function TooltipExample() {
  return (
    <div className="flex flex-wrap gap-3 rounded-cl-lg bg-white px-6 pt-14 pb-6">
      <Tooltip content="Custom blue glow shadow" shadow={shadowBlueGlow}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          Blue Glow
        </Button>
      </Tooltip>
      <Tooltip content="Custom purple glow shadow" shadow={shadowPurpleGlow}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          Purple Glow
        </Button>
      </Tooltip>
      <Tooltip content="Soft elevated shadow" shadow={shadowSoftElevated}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          Soft Elevated
        </Button>
      </Tooltip>
      <Tooltip content="Sharp drop shadow" shadow={shadowSharpDrop}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          Sharp Drop
        </Button>
      </Tooltip>
    </div>
  );
}
