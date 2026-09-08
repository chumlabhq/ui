import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  return (
    <div className="flex flex-col gap-4 w-full sm:max-w-md">
                  {}
                  <TextArea label="Message" placeholder="Write your message..." />
                  <TextArea
                    label="Bio"
                    placeholder="Tell us about yourself..."
                    description="Max 200 characters"
                    maxLength={200}
                    showCount
                  />
                </div>
  );
}
