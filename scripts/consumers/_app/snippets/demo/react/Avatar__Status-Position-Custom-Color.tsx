import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      {
        (
          ["top-right", "top-left", "bottom-right", "bottom-left"] as const
        ).map((pos) => (
          <div key={pos} className="text-center">
            <Avatar
              name={pos.slice(0, 2).toUpperCase()}
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
              status={{ type: "online", position: pos }}
            />
            <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
              {pos}
            </p>
          </div>
        ))
      }
      <Avatar
        name="Purple"
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
        status={{ type: "online", color: "#8b5cf6" }}
      />
      <Avatar
        name="Pink"
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
        status={{ type: "online", color: "#ec4899" }}
      />
      <Avatar
        name="Cyan"
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
        status={{ type: "online", color: "#06b6d4" }}
      />
    </>
  );
}
