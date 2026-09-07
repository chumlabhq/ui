import { Avatar, AvatarGroup } from "@chumlab/ui/avatar";

export default function UserList() {
  return (
    <div className="flex items-center gap-4">
      {/* Image avatar */}
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
        alt="John Doe"
        name="John Doe"
      />

      {/* Initials avatar (auto-colored) */}
      <Avatar name="Jane Smith" autoColor />

      {/* Grouped avatars with overflow */}
      <AvatarGroup max={3}>
        <Avatar name="Alice" autoColor />
        <Avatar name="Bob" autoColor />
        <Avatar name="Charlie" autoColor />
        <Avatar name="Diana" autoColor />
        <Avatar name="Edward" autoColor />
      </AvatarGroup>
    </div>
  );
}
