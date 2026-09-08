import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <Avatar
                  name="Simple"
                  autoColor
                  colors={({
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
        })}
                  tooltip="Simple tooltip"
                />
      <Avatar
                  name="Bottom"
                  autoColor
                  colors={({
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
        })}
                  tooltip={{
                    content: "Bottom tooltip",
                    side: "bottom",
                    sideOffset: 8
                  }}
                />
      <Avatar
                  name="Delayed"
                  autoColor
                  colors={({
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
        })}
                  tooltip={{ content: "Appears after 500ms", delayDuration: 500 }}
                />
      <Avatar
                  name="No Arrow"
                  autoColor
                  colors={({
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
        })}
                  tooltip={{ content: "No arrow", showArrow: false }}
                />
    </>
  );
}
