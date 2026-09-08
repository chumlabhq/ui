"use client";

import { useState } from "react";
import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  const [imageError, setImageError] = useState(false);
  return (
    <Avatar
                src={imageError ? "" : "data:image/gif;base64,invalid"}
                name="John Doe"
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
                onError={() => setImageError(true)}
              />
  );
}
