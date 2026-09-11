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
        classes={{ fallback: "font-bold tracking-wider" }}
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
        classes={{ fallback: "italic" }}
      />
      <Avatar
        name="Ring"
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
        status="online"
        classes={
          {
            status: "absolute block rounded-full ring-2 ring-white"
          }
        }
      />
      <Avatar
        name="Custom"
        unstyled
        classes={
          {
            root: "inline-flex items-center justify-center rounded-cl-lg bg-linear-to-br from-cl-accent to-cl-accent text-white font-bold",
            control:
              "absolute inset-0 overflow-hidden flex items-center justify-center rounded-cl-lg"
          }
        }
        size="lg"
      />
    </>
  );
}
