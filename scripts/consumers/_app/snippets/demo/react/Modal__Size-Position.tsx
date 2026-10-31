import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

const ZOOM_MIN = 50;

const ZOOM_STEP = 25;

const ZOOM_MAX = 200;

const DOC_PAGES = 12;

export default function ModalExample() {
  const [customSizeOpen, setCustomSizeOpen] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [docPage, setDocPage] = useState(1);
  const [docZoom, setDocZoom] = useState(100);
  const [docAction, setDocAction] = useState<string | null>(null);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
          onClick={() => setCustomSizeOpen(true)}
        >
          Custom Size
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
          onClick={() => setFullScreenOpen(true)}
        >
          Full Screen
        </Button>
      </div>
      <Modal
        open={customSizeOpen}
        onOpenChange={setCustomSizeOpen}
        title="Custom Size Modal"
        description="This modal has custom width and height constraints."
        maxWidth={700}
        maxHeight={400}
        classes={
          {
            content: "w-full m-4 rounded-cl-lg shadow-2xl overflow-hidden",
            header: "flex items-start gap-3 p-6 pb-4",
            title: "font-semibold text-lg text-cl-text",
            description: "mt-1 text-sm text-cl-text-secondary",
            closeTrigger: "shrink-0 p-1 rounded-cl-md hover:bg-cl-bg-hover transition-colors ms-auto",
            closeIcon: "w-5 h-5 text-cl-text-tertiary",
            body: "px-6 pb-6"
          }
        }
      >
        <div className="space-y-4">
          <p className="text-cl-text-secondary">
            Use maxWidth, maxHeight, minWidth, and minHeight props to control modal dimensions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-cl-bg-hover rounded-cl-md">
              <span className="text-cl-text-tertiary">maxWidth:</span>
              {" "}
              <span className="font-mono">700px</span>
            </div>
            <div className="p-3 bg-cl-bg-hover rounded-cl-md">
              <span className="text-cl-text-tertiary">maxHeight:</span>
              {" "}
              <span className="font-mono">400px</span>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={fullScreenOpen}
        onOpenChange={setFullScreenOpen}
        showHeader={false}
        aria-labelledby="document-preview-title"
        fullScreen
        centered={false}
        classes={
          {
            // bg-cl-bg-elevated for a consistent surface across the panel —
            // matches the header/footer so there's no visual seam between
            // the chrome strips and the body region.
            content: "bg-cl-bg-elevated",
            body: "p-0 h-full"
          }
        }
      >
        <div className="h-full flex flex-col">
          <header
            className="bg-cl-bg-elevated border-b border-cl-border px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3 sm:gap-4 shrink-0"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Button
                size="sm"
                aria-label="Close"
                onClick={() => setFullScreenOpen(false)}
                className="shrink-0 rounded-cl-md hover:bg-cl-bg-hover"
                startIcon={
                  <svg
                    className="w-5 h-5 text-cl-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                }
              />
              <div className="min-w-0">
                <h1 id="document-preview-title" className="font-semibold text-cl-text truncate">
                  Document Preview
                </h1>
                <p className="text-sm text-cl-text-tertiary truncate">Annual Report 2024.pdf</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ms-auto">
              <Button
                className="px-3 py-2 text-sm text-cl-text-secondary hover:bg-cl-bg-hover rounded-cl-md transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => setDocAction("Download started (demo)")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                className="px-3 py-2 text-sm text-cl-text-secondary hover:bg-cl-bg-hover rounded-cl-md transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => setDocAction("Print dialog would open (demo)")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                className="px-3 py-2 text-sm bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 rounded-cl-md transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => setDocAction("Share link copied (demo)")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-8">
            <div
              className="max-w-4xl mx-auto bg-cl-bg-elevated rounded-cl-lg shadow-sm border border-cl-border p-12 origin-top transition-transform"
              style={{ transform: `scale(${docZoom / 100})` }}
            >
              <p className="text-end text-sm text-cl-text-tertiary mb-4">
                Page
                {docPage}
                of
                {DOC_PAGES}
              </p>
              <div className="text-center mb-12">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 bg-cl-accent/10 rounded-full mb-4"
                >
                  <svg
                    className="w-8 h-8 text-cl-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-cl-text mb-2">Annual Report 2024</h2>
                <p className="text-cl-text-tertiary">Acme Corporation • Q4 Financial Summary</p>
              </div>
              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-cl-text mb-4">Executive Summary</h3>
                  <p className="text-cl-text-secondary leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-semibold text-cl-text mb-4">Key Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div
                      className="p-4 bg-cl-success/15 rounded-cl-md border border-cl-success"
                    >
                      <p className="text-sm text-cl-success font-medium">Revenue</p>
                      <p className="text-2xl font-bold text-cl-success">$12.4M</p>
                      <p className="text-sm text-cl-success">+24% YoY</p>
                    </div>
                    <div
                      className="p-4 bg-cl-accent/10 rounded-cl-md border border-cl-border-input-focus"
                    >
                      <p className="text-sm text-cl-accent font-medium">Users</p>
                      <p className="text-2xl font-bold text-cl-accent">847K</p>
                      <p className="text-sm text-cl-accent">+18% YoY</p>
                    </div>
                    <div
                      className="p-4 bg-cl-accent/10 rounded-cl-md border border-cl-border-input-focus"
                    >
                      <p className="text-sm text-cl-accent font-medium">NPS Score</p>
                      <p className="text-2xl font-bold text-cl-accent">72</p>
                      <p className="text-sm text-cl-accent">+8 points</p>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-xl font-semibold text-cl-text mb-4">Looking Ahead</h3>
                  <p className="text-cl-text-secondary leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </section>
              </div>
            </div>
          </div>
          <footer
            className="bg-cl-bg-elevated border-t border-cl-border px-4 sm:px-6 py-3 flex items-center justify-between shrink-0"
          >
            <div className="flex items-center gap-4">
              <Button
                aria-label="Previous page"
                className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={docPage === 1}
                onClick={() => setDocPage((p) => Math.max(1, p - 1))}
              >
                <svg
                  className="w-5 h-5 text-cl-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
              <span className="text-sm text-cl-text-secondary">
                Page
                {docPage}
                of
                {DOC_PAGES}
              </span>
              <Button
                aria-label="Next page"
                className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={docPage === DOC_PAGES}
                onClick={() => setDocPage((p) => Math.min(DOC_PAGES, p + 1))}
              >
                <svg
                  className="w-5 h-5 text-cl-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
            {
              docAction && (
                <p role="status" className="text-sm text-cl-text-secondary">
                  {docAction}
                </p>
              )
            }
            <div className="flex items-center gap-2">
              <Button
                aria-label="Zoom in"
                className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={docZoom === ZOOM_MAX}
                onClick={() => setDocZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              >
                <svg
                  className="w-5 h-5 text-cl-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </Button>
              <Button
                aria-label="Zoom out"
                className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={docZoom === ZOOM_MIN}
                onClick={() => setDocZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
              >
                <svg
                  className="w-5 h-5 text-cl-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                </svg>
              </Button>
              <span className="text-sm text-cl-text-tertiary ms-2">
                {docZoom}
                %
              </span>
            </div>
          </footer>
        </div>
      </Modal>
    </>
  );
}
