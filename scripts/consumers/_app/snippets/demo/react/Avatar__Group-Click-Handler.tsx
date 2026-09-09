import { useState } from "react";
import { Avatar, AvatarGroup } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  const [clickLog, setClickLog] = useState<string[]>([]);
  return (
    <>
      <AvatarGroup
        onAvatarClick={
          (info) => {
            setClickLog((prev) => [
              `Clicked: ${info.name ?? "unknown"} (index ${info.index})`,
              ...prev.slice(0, 4)
            ]);
          }
        }
      >
        <Avatar
          name="Alice Brown"
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
        <Avatar
          name="Bob Chen"
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
        <Avatar
          name="Charlie Davis"
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
      </AvatarGroup>
      {
        clickLog.length > 0 && (
          <div className="mt-3 text-xs font-mono space-y-1 text-cl-text-secondary">
            {
              clickLog.map((log, i) => (
                <div key={i}>
                  {log}
                </div>
              ))
            }
          </div>
        )
      }
    </>
  );
}
