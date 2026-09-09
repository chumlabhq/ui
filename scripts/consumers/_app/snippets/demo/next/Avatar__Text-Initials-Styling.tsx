import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <Avatar
        name="Bold"
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
              "#2563eb",
              "#059669",
              "#ca8a04",
              "#db2777",
              "#7c3aed",
              "#0891b2",
              "#ef4444"
            ]
          }
        }
        classes={{ fallback: "font-bold" }}
      />
      <Avatar
        name="Light"
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
              "#2563eb",
              "#059669",
              "#ca8a04",
              "#db2777",
              "#7c3aed",
              "#0891b2",
              "#ef4444"
            ]
          }
        }
        classes={{ fallback: "font-light" }}
      />
      <Avatar
        name="Italic"
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
              "#2563eb",
              "#059669",
              "#ca8a04",
              "#db2777",
              "#7c3aed",
              "#0891b2",
              "#ef4444"
            ]
          }
        }
        textStyle={{ fontStyle: "italic" }}
      />
      <Avatar
        name="Custom"
        className="bg-cl-bg-hover"
        textStyle={{ color: "#6366f1", fontWeight: 600 }}
      />
    </>
  );
}
