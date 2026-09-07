import { TextArea } from "@chumlab/ui/textarea";

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
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
