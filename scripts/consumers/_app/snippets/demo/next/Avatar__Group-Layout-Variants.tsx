import { Avatar, AvatarGroup } from "@chumlab/ui/avatar";

const v = "stack";

export default function AvatarExample() {
  return (
    <AvatarGroup variant={v} spacing={v === "stack" ? -8 : 4}>
      <Avatar
        name="Alice"
        autoColor
        colors={
          {
            backgrounds: [
              "#e0e7ff",
              "#dbeafe",
              "#d1fae5",
              "#fef9c3",
              "#fce7f3",
              "#ede9fe",
              "#cffafe",
              "#fef2f2"
            ],
            text: [
              "#4f46e5",
              "#1d4ed8",
              "#047857",
              "#854d0e",
              "#be185d",
              "#7c3aed",
              "#0e7490",
              "#ef4444"
            ]
          }
        }
      />
      <Avatar
        name="Bob"
        autoColor
        colors={
          {
            backgrounds: [
              "#e0e7ff",
              "#dbeafe",
              "#d1fae5",
              "#fef9c3",
              "#fce7f3",
              "#ede9fe",
              "#cffafe",
              "#fef2f2"
            ],
            text: [
              "#4f46e5",
              "#1d4ed8",
              "#047857",
              "#854d0e",
              "#be185d",
              "#7c3aed",
              "#0e7490",
              "#ef4444"
            ]
          }
        }
      />
      <Avatar
        name="Charlie"
        autoColor
        colors={
          {
            backgrounds: [
              "#e0e7ff",
              "#dbeafe",
              "#d1fae5",
              "#fef9c3",
              "#fce7f3",
              "#ede9fe",
              "#cffafe",
              "#fef2f2"
            ],
            text: [
              "#4f46e5",
              "#1d4ed8",
              "#047857",
              "#854d0e",
              "#be185d",
              "#7c3aed",
              "#0e7490",
              "#ef4444"
            ]
          }
        }
      />
    </AvatarGroup>
  );
}
