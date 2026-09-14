"use client";

import { useState } from "react";
import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  const [avatarButtonClicks, setAvatarButtonClicks] = useState(0);
  const [profileButtonClicks, setProfileButtonClicks] = useState(0);
  return (
    <>
      <button
        onClick={() => setAvatarButtonClicks((n) => n + 1)}
        className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-2 rounded-full"
      >
        <Avatar
          name="Click"
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
          tooltip="Click me!"
        />
      </button>
      <button
        onClick={() => setProfileButtonClicks((n) => n + 1)}
        className="flex items-center gap-3 px-3 py-2 rounded-cl-md transition-colors focus:outline-none focus:ring-2 focus:ring-cl-accent hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated/50 cursor-pointer"
      >
        <Avatar
          name="Jane Doe"
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
          status="online"
        />
        <span className="text-sm font-medium text-cl-text">Jane Doe</span>
      </button>
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        <div>
          avatar onClick:
          {avatarButtonClicks ? `fired ${avatarButtonClicks}×` : "not fired yet"}
        </div>
        <div>
          profile onClick:
          {profileButtonClicks ? `fired ${profileButtonClicks}×` : "not fired yet"}
        </div>
      </div>
    </>
  );
}
