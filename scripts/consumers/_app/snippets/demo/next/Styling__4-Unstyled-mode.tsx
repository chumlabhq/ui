import { Button } from "@chumlab/ui/button";
import { Checkbox } from "@chumlab/ui/checkbox";
import { Switch } from "@chumlab/ui/switch";

export default function StylingExample() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-6">
        <span className="w-24 text-[12px] text-fg-tertiary">styled</span>
        <Button>Save</Button>
        <Switch defaultChecked aria-label="Styled switch" />
        <Checkbox defaultChecked label="Styled" />
      </div>
      <div className="flex items-center gap-6">
        <span className="w-24 text-[12px] text-fg-tertiary">unstyled</span>
        <Button unstyled>Save</Button>
        <Switch unstyled defaultChecked aria-label="Unstyled switch" />
        <Checkbox unstyled defaultChecked label="Unstyled" />
      </div>
    </div>
  );
}
