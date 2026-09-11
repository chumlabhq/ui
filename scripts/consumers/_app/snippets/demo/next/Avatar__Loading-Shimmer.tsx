"use client";

import { useState } from "react";
import { Avatar, AvatarGroupShimmer, AvatarShimmer } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {
        isLoading ? (
          <>
            <AvatarShimmer size="sm" />
            <AvatarShimmer />
            <AvatarShimmer size="lg" />
            <AvatarShimmer shape="rounded" />
            <AvatarShimmer shape="square" />
            <AvatarShimmer animate={false} />
          </>
        ) : (
          <>
            <Avatar
              name="Alice"
              size="sm"
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
              name="Charlie"
              size="lg"
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
              name="Diana"
              shape="rounded"
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
              name="Edward"
              shape="square"
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
              name="Fiona"
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
          </>
        )
      }
      <div className="text-center">
        <Avatar loading />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">default</p>
      </div>
      <div className="text-center">
        <Avatar loading size="lg" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">large</p>
      </div>
      <div className="text-center">
        <Avatar loading shape="rounded" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">rounded</p>
      </div>
      <div className="text-center">
        <Avatar loading shape="square" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">square</p>
      </div>
      <div className="text-center">
        <AvatarGroupShimmer count={3} showCount />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">showCount</p>
      </div>
      <div className="text-center">
        <AvatarGroupShimmer count={4} size="lg" shape="rounded" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
          large + rounded
        </p>
      </div>
      <div className="text-center">
        <AvatarGroupShimmer count={3} spacing={-16} />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">custom spacing</p>
      </div>
      <div className="text-center">
        <AvatarGroupShimmer count={3} animate={false} />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">no animation</p>
      </div>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[10px] mb-1.5 text-xs font-medium text-cl-text-tertiary">
            Default (page-colored ring)
          </p>
          <div className="p-4 rounded-cl-md bg-[#eceef2]">
            <AvatarGroupShimmer count={3} />
          </div>
        </div>
        <div>
          <p className="text-[10px] mb-1.5 text-xs font-medium text-cl-text-tertiary">
            Matched ring (surface color)
          </p>
          <div className="p-4 rounded-cl-md bg-[#eceef2]">
            <AvatarGroupShimmer count={3} ringColor="#eceef2" />
          </div>
        </div>
      </div>
    </>
  );
}
