import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <div className="text-center">
        <Avatar
          name="John Michael Doe"
          maxInitials={1}
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
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">maxInitials=1</p>
      </div>
      <div className="text-center">
        <Avatar
          name="John Michael Doe"
          maxInitials={2}
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
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">maxInitials=2</p>
      </div>
      <div className="text-center">
        <Avatar
          name="John Michael Doe"
          maxInitials={3}
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
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">maxInitials=3</p>
      </div>
    </>
  );
}
