"use client";

import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <button
                  onClick={() => alert("Avatar clicked!")}
                  className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-2 rounded-full"
                >
                  <Avatar
                    name="Click"
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
                    tooltip="Click me!"
                  />
                </button>
      <button
                  onClick={() => alert("Profile opened!")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-cl-md transition-colors focus:outline-none focus:ring-2 focus:ring-cl-accent hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated/50`}
                >
                  <Avatar
                    name="Jane Doe"
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
                    status="online"
                  />
                  <span
                    className={`text-sm font-medium text-cl-text`}
                  >
                    Jane Doe
                  </span>
                </button>
    </>
  );
}
