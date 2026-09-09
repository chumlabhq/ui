import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
        alt="John Doe"
        name="John Doe"
      />
      <Avatar name="Jane Smith" autoColor />
      <Avatar name="Alex" autoColor />
    </>
  );
}
