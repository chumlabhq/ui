import { useEffect, useRef, useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

const JumpToPageEllipsis = ({
  onValueChange,
  variant = "default",
}: {
  onValueChange: (page: number) => void;
  variant?: "default" | "pill" | "ghost";
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const page = parseInt(value, 10);
    if (!isNaN(page) && page > 0) {
      onValueChange(page);
    }
    setIsEditing(false);
    setValue("");
  };

  const buttonStyles = {
    default: "px-2.5 py-1 rounded-cl-md text-sm cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-hover hover:text-cl-text-secondary",
 pill: "w-9 h-9 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all text-cl-text-tertiary border border-cl-border hover:bg-cl-bg-hover hover:text-cl-text-secondary",
    ghost: "px-2 py-1 rounded-cl-md text-sm cursor-pointer transition-colors text-cl-text-tertiary hover:text-cl-text-secondary",
  };

  const inputStyles = {
 default: "w-12 px-1 py-1 text-sm text-center rounded-cl-md outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-cl-bg-panel border border-cl-border-input text-cl-text placeholder:text-cl-text-tertiary focus:border-cl-border-input-focus focus:ring-1 focus:ring-cl-accent-halo",
 pill: "w-9 h-9 text-sm text-center rounded-full outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-cl-bg-panel border border-cl-border-input-focus text-cl-text placeholder:text-cl-text-tertiary ring-1 ring-cl-accent-halo",
    ghost: "w-10 px-1 py-1 text-sm text-center rounded-cl-md border-b-2 border-t-0 border-x-0 outline-none transition-colors bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-cl-border-input-focus text-cl-text placeholder:text-cl-text-tertiary",
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={buttonStyles[variant]}
        aria-label="Jump to page"
      >
        &hellip;
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") {
          setIsEditing(false);
          setValue("");
        }
      }}
      onBlur={() => {
        setIsEditing(false);
        setValue("");
      }}
      className={inputStyles[variant]}
      min={1}
      placeholder={variant === "ghost" ? "Go" : "#"}
    />
  );
};

export default function PaginationExample() {
  const [jumpPage, setJumpPage] = useState(25);
  const [jumpPillPage, setJumpPillPage] = useState(15);
  const [jumpGhostPage, setJumpGhostPage] = useState(10);
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Pagination
          value={jumpPage}
          totalPages={50}
          onValueChange={setJumpPage}
          renderEllipsis={
            ({ onValueChange }) => (
              <JumpToPageEllipsis
                onValueChange={onValueChange}
                variant="default"
              />
            )
          }
          classes={
            {
              root: "flex flex-wrap items-center gap-2",
              navTrigger: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary",
              ellipsis: "px-2 select-none text-cl-text-tertiary",
              rowsPerPage: {
                trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-cl-bg-panel hover:bg-cl-bg-hover text-cl-text",
                content: "rounded-cl-md shadow-lg py-1 min-w-[64px] bg-cl-bg-panel border border-cl-border",
                icon: "w-4 h-4 transition-transform text-cl-text-secondary",
                positioner: "",
                item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[highlighted]:bg-cl-bg-hover text-cl-text"
              },
              label: "text-sm text-cl-text-secondary",
              pageInfo: "flex items-center"
            }
          }
        />
      </div>
      <div className="border-t pt-8 border-cl-border">
        <div className="space-y-3">
          <Pagination
            value={jumpPillPage}
            totalPages={50}
            onValueChange={setJumpPillPage}
            renderEllipsis={
              ({ onValueChange }) => (
                <JumpToPageEllipsis
                  onValueChange={onValueChange}
                  variant="pill"
                />
              )
            }
            classes={
              {
                                 ...({
                 root: "flex flex-wrap items-center gap-2",
                 navTrigger: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary",
                 ellipsis: "px-2 select-none text-cl-text-tertiary",
                 rowsPerPage: {
                   trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-cl-bg-panel hover:bg-cl-bg-hover text-cl-text",
                   content: "rounded-cl-md shadow-lg py-1 min-w-[64px] bg-cl-bg-panel border border-cl-border",
                   icon: "w-4 h-4 transition-transform text-cl-text-secondary",
                   positioner: "",
                   item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[highlighted]:bg-cl-bg-hover text-cl-text"
                 },
                 label: "text-sm text-cl-text-secondary",
                 pageInfo: "flex items-center"
               }),
                                 root: "flex flex-wrap items-center gap-1",
              navTrigger: "p-2 rounded-full shadow-sm transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text-secondary",
              item: "w-9 h-9 rounded-full shadow-sm flex items-center justify-center text-sm transition-shadow cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text data-[active]:bg-cl-accent-bg data-[active]:text-cl-accent-hover data-[active]:border data-[active]:border-cl-accent data-[active]:hover:text-cl-accent-hover",
                                 list: "flex items-center gap-1",
                                 navIcon: "w-4 h-4 text-cl-text-secondary"
                               }
            }
          />
        </div>
      </div>
      <div className="border-t pt-8 border-cl-border">
        <div className="space-y-3">
          <Pagination
            value={jumpGhostPage}
            totalPages={30}
            onValueChange={setJumpGhostPage}
            renderEllipsis={
              ({ onValueChange }) => (
                <JumpToPageEllipsis
                  onValueChange={onValueChange}
                  variant="ghost"
                />
              )
            }
            classes={
              {
                                ...({
                root: "flex flex-wrap items-center gap-2",
                navTrigger: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary",
                ellipsis: "px-2 select-none text-cl-text-tertiary",
                rowsPerPage: {
                  trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-cl-bg-panel hover:bg-cl-bg-hover text-cl-text",
                  content: "rounded-cl-md shadow-lg py-1 min-w-[64px] bg-cl-bg-panel border border-cl-border",
                  icon: "w-4 h-4 transition-transform text-cl-text-secondary",
                  positioner: "",
                  item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[highlighted]:bg-cl-bg-hover text-cl-text"
                },
                label: "text-sm text-cl-text-secondary",
                pageInfo: "flex items-center"
              }),
                                root: "flex items-center",
                                navTrigger: "p-1.5 rounded-cl-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-cl-bg-hover text-cl-text-secondary",
                                item: "min-w-[36px] h-9 rounded-cl-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text data-[active]:bg-cl-accent-bg data-[active]:text-cl-accent-hover data-[active]:border data-[active]:border-cl-accent data-[active]:hover:text-cl-accent-hover",
                                list: "flex items-center gap-0.5",
                                navIcon: "w-4 h-4"
                              }
            }
          />
        </div>
      </div>
    </div>
  );
}
