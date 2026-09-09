import { Avatar, AvatarShimmer } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
          name="Animated"
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">default (auto)</p>
      </div>
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
          name="No Motion"
          reduceMotion={true}
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
          reduceMotion=true
        </p>
      </div>
      <div className="text-center">
        <AvatarShimmer reduceMotion={true} />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
          shimmer (no pulse)
        </p>
      </div>
    </>
  );
}
