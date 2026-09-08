import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <RadioGroup
                name="with-desc"
                defaultValue="email"
                size="md"
                classes={({
        root: "",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
              >
                <RadioButton
                  value="email"
                  label="Email notifications"
                  description="Receive updates via email"
                  classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
                />
                <RadioButton
                  value="sms"
                  label="SMS notifications"
                  description="Receive updates via text message"
                  classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
                />
                <RadioButton
                  value="none"
                  label="No notifications"
                  description="Opt out of all notifications"
                  classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
                />
              </RadioGroup>
  );
}
