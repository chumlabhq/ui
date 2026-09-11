import { AvatarGroupCount } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      {
        (["solid", "outline", "ghost"] as const).map((v) => (
          <div key={v} className="text-center">
            <AvatarGroupCount count={5} variant={v} />
            <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
              {v}
            </p>
          </div>
        ))
      }
      <div className="text-center">
        <AvatarGroupCount count={12} showPlus />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">+12</p>
      </div>
      <div className="text-center">
        <AvatarGroupCount count={12} showPlus={false} />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">no plus</p>
      </div>
      <div className="text-center">
        <AvatarGroupCount
          count={1234}
          format={
            (n) =>
            n > 999 ? `${(n / 1000).toFixed(1)}k` : `${n}`
          }
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">custom format</p>
      </div>
      <AvatarGroupCount
        count={8}
        tooltip="View all 8 members"
        onClick={() => alert("View all clicked!")}
      />
    </>
  );
}
