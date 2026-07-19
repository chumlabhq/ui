import { useState } from "react";
import { Button } from "../../components/ui";
import {
  useListPlaygroundOnboardingsQuery,
  useUpdateOnboardingStatusMutation,
} from "../../redux/api/adminApi";
import type {
  PlaygroundOnboardingRecord,
  PlaygroundOnboardingStatus,
} from "./types";

const STATUS_CLASSES: Record<PlaygroundOnboardingStatus, string> = {
  waiting: "text-fg-tertiary",
  invited: "text-accent",
  onboarded: "text-fg",
  rejected: "text-fg-muted line-through",
};

function OnboardingRow({
  entry,
  onUpdate,
  disabled,
}: {
  entry: PlaygroundOnboardingRecord;
  onUpdate: (id: string, status: PlaygroundOnboardingStatus) => void;
  disabled: boolean;
}) {
  return (
    <li className="rule-b flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
      <span className="w-10 font-mono text-xs text-fg-tertiary">
        #{entry.position}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{entry.user.name}</span>
        <span className="block truncate text-xs text-fg-tertiary">
          {entry.user.email} · {entry.role}
        </span>
      </span>
      <span className={`w-24 text-xs ${STATUS_CLASSES[entry.status]}`}>
        {entry.status}
      </span>
      <span className="flex gap-2">
        {entry.status !== "invited" && entry.status !== "onboarded" && (
          <Button
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={() => onUpdate(entry._id, "invited")}
          >
            Invite
          </Button>
        )}
        {entry.status !== "rejected" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onUpdate(entry._id, "rejected")}
          >
            Reject
          </Button>
        )}
      </span>
    </li>
  );
}

export default function PlaygroundAdmin() {
  const { data, isLoading, error } = useListPlaygroundOnboardingsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOnboardingStatusMutation();
  const [actionError, setActionError] = useState<string | null>(null);

  const forbidden =
    error != null &&
    "status" in error &&
    (error.status === 401 || error.status === 403);

  const handleUpdate = (id: string, status: PlaygroundOnboardingStatus) => {
    setActionError(null);
    updateStatus({ id, status })
      .unwrap()
      .catch(() => setActionError("Could not update status. Try again."));
  };

  return (
    <main className="min-h-screen bg-bg-base text-fg">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-4xl font-medium">
          Playground <span className="serif-accent">waitlist.</span>
        </h1>

        {isLoading && (
          <p className="mt-8 text-sm text-fg-tertiary">Loading waitlist...</p>
        )}

        {forbidden && (
          <p className="mt-8 text-sm text-fg-secondary">
            Admin access required. Sign in with an allowlisted account.
          </p>
        )}

        {error != null && !forbidden && (
          <p className="mt-8 text-sm text-fg-secondary">
            Could not load the waitlist.
          </p>
        )}

        {data && (
          <>
            <p className="mt-4 text-sm text-fg-tertiary">
              {data.total} signups
            </p>
            {actionError && (
              <p className="mt-4 text-sm text-fg-secondary">{actionError}</p>
            )}
            <ul className="rule-t mt-6">
              {data.items.map((entry) => (
                <OnboardingRow
                  key={entry._id}
                  entry={entry}
                  onUpdate={handleUpdate}
                  disabled={isUpdating}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
