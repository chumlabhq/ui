import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      <div className="text-center">
                  <Avatar fallback={<span>?</span>} />
                  <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>text fallback</p>
                </div>
      <div className="text-center">
                  <Avatar
                    fallback={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                  <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>icon fallback</p>
                </div>
      <div className="text-center">
                  <Avatar
                    src="data:image/gif;base64,invalid"
                    fallback={<span>!</span>}
                  />
                  <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>image error fallback</p>
                </div>
    </>
  );
}
