import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <Checkbox
        label="Email me when someone replies to a discussion I started or mentions me, at most once a day"
      />
      <Checkbox label="Share anonymous usage data, which helps us decide what to build next" />
    </div>
  );
}
