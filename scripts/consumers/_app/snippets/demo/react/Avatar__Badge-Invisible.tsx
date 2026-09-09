import { Avatar, AvatarBadge } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <div className="text-center pt-2 pb-1">
        <div className="relative inline-flex">
          <Avatar
            name="Visible"
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
          />
          <AvatarBadge count={3} />
        </div>
        <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">visible</p>
      </div>
      <div className="text-center pt-2 pb-1">
        <div className="relative inline-flex">
          <Avatar
            name="Hidden"
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
          />
          <AvatarBadge count={3} invisible />
        </div>
        <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">invisible=true</p>
      </div>
    </>
  );
}
