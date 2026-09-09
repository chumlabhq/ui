import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <div className="text-center">
        <Avatar
          name="Auto"
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
          bordered
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">bordered=true</p>
      </div>
      <div className="text-center">
        <Avatar
          name="Custom"
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
          bordered="2px solid #a5b4fc"
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">custom string</p>
      </div>
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
          name="Image"
          bordered="2px solid #86efac"
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">with image</p>
      </div>
    </>
  );
}
