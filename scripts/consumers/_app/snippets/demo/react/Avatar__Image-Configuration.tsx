import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <div className="text-center">
                  <Avatar
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
                    name="Lazy"
                    imageConfig={{ loading: "lazy" }}
                  />
                  <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>lazy (default)</p>
                </div>
      <div className="text-center">
                  <Avatar
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                    name="Eager"
                    imageConfig={{ loading: "eager", decoding: "sync" }}
                  />
                  <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>eager + sync</p>
                </div>
      <div className="text-center">
                  <Avatar
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
                    name="Priority"
                    imageConfig={{ fetchPriority: "high" }}
                  />
                  <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>high priority</p>
                </div>
    </>
  );
}
