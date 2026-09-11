"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

const EmptyHeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function CheckboxExample() {
  const [customHeart, setCustomHeart] = useState(false);
  const [customStar, setCustomStar] = useState(true);
  const [customBookmark, setCustomBookmark] = useState(false);
  return (
    <>
      <Checkbox
        label="Add to favorites"
        checked={customHeart}
        onValueChange={setCustomHeart}
        checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
        size="md"
        shape="rounded"
        classes={
          {
                      ...({
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          })
                    }
        }
      />
      <Checkbox
        label="Star this item"
        checked={customStar}
        onValueChange={setCustomStar}
        checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
        size="md"
        shape="rounded"
        classes={
          {
                      ...({
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          })
                    }
        }
      />
      <Checkbox
        label="Bookmark (outline when off)"
        checked={customBookmark}
        onValueChange={setCustomBookmark}
        checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
        uncheckedIcon={<EmptyHeartIcon className="w-3 h-3 text-cl-text-tertiary" />}
        size="md"
        shape="rounded"
        classes={
          {
                      ...({
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          })
                    }
        }
      />
    </>
  );
}
