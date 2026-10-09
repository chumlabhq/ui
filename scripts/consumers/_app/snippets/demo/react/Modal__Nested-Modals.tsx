import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";
import { Switch } from "@chumlab/ui/switch";

export default function ModalExample() {
  const [inviteNote, setInviteNote] = useState<string | null>(null);
  const [nestedLevel1Open, setNestedLevel1Open] = useState(false);
  const [nestedLevel2Open, setNestedLevel2Open] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setNestedLevel1Open(true)}
      >
        Open Nested Modal
      </Button>
      <Modal
        open={nestedLevel1Open}
        onOpenChange={setNestedLevel1Open}
        title="Project Settings"
        description="Configure your project preferences and team access."
        classes={{ content: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-elevated border border-cl-border" }}
      >
        <div className="space-y-4">
          <div
            className="p-4 rounded-cl-md border bg-cl-accent-surface border-cl-border-input-focus"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-cl-accent">Team Members</p>
                <p className="text-sm text-cl-accent">5 members with access</p>
              </div>
              <Button
                className="px-3 py-1.5 text-cl-on-accent text-sm rounded-cl-md transition-colors bg-cl-accent hover:bg-cl-accent/90 cursor-pointer"
                onClick={() => setNestedLevel2Open(true)}
              >
                Manage
              </Button>
            </div>
          </div>
          <div
            className="flex items-center justify-between p-4 border rounded-cl-md border-cl-border"
          >
            <div>
              <p className="font-medium text-cl-text">Notifications</p>
              <p className="text-sm text-cl-text-secondary">Email & push notifications</p>
            </div>
            <Switch defaultChecked aria-label="Notifications" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-cl-border">
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
            onClick={() => setNestedLevel1Open(false)}
          >
            Cancel
          </Button>
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
            onClick={() => setNestedLevel1Open(false)}
          >
            Save Changes
          </Button>
        </div>
        <Modal
          open={nestedLevel2Open}
          onOpenChange={setNestedLevel2Open}
          title="Team Members"
          description="Manage project access and roles."
          nestingLevel={1}
        >
          <div className="space-y-3">
            {
              [
                { name: "Sarah Chen", role: "Owner", initials: "SC" },
                { name: "Mike Johnson", role: "Editor", initials: "MJ" },
                { name: "Emily Davis", role: "Viewer", initials: "ED" }
              ].map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-cl-md bg-cl-bg-hover"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cl-accent/40 to-cl-accent text-white text-sm font-medium"
                    >
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-medium text-cl-text">
                        {member.name}
                      </p>
                      <p className="text-sm text-cl-text-secondary">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <Button
            className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-cl-md transition-colors border-cl-border text-cl-text-tertiary hover:border-cl-border-input-focus hover:text-cl-accent cursor-pointer"
            onClick={() => setInviteNote("Invitation sent to new.member@example.com (demo)")}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Invite Member
          </Button>
          {
            inviteNote && (
              <p role="status" className="mt-2 text-sm text-cl-text-secondary">
                {inviteNote}
              </p>
            )
          }
          <div className="flex justify-end mt-6 pt-4 border-t border-cl-border">
            <Button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
              onClick={() => setNestedLevel2Open(false)}
            >
              Done
            </Button>
          </div>
        </Modal>
      </Modal>
    </>
  );
}
