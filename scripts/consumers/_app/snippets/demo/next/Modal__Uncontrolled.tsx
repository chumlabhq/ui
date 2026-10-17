"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [noticeMounts, setNoticeMounts] = useState(0);
  return (
    <>
      <Button
        className="border border-cl-border bg-cl-bg-elevated text-cl-text"
        onClick={() => setNoticeMounts((n) => n + 1)}
      >
        Show it
      </Button>
      {
        noticeMounts > 0 && (
          <Modal
            key={noticeMounts}
            defaultOpen
            title="Scheduled maintenance"
            description="The dashboard is read-only on Sunday from 02:00 to 04:00 UTC."
          >
            <p className="text-sm text-cl-text-secondary">Edits made before then are kept.</p>
          </Modal>
        )
      }
    </>
  );
}
