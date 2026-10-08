import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <div className="flex flex-wrap gap-3 rounded-cl-lg bg-white px-6 pt-14 pb-6">
      <Tooltip content="No shadow" shadow="none">
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          None
        </Button>
      </Tooltip>
      <Tooltip content="Small shadow" shadow="sm">
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          Small
        </Button>
      </Tooltip>
      <Tooltip content="Medium shadow" shadow="md">
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          Medium
        </Button>
      </Tooltip>
      <Tooltip content="Large shadow (default)" shadow="lg">
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          Large
        </Button>
      </Tooltip>
      <Tooltip content="Extra large shadow" shadow="xl">
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          XL
        </Button>
      </Tooltip>
      <Tooltip content="2XL shadow" shadow="2xl">
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]"
        >
          2XL
        </Button>
      </Tooltip>
    </div>
  );
}
