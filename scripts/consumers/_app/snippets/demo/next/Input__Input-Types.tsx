import { Input } from "@chumlab/ui/input";

const Icon = ({
  d,
  size = 16,
  className = "",
}: {
  d: string;
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {d.split("|").map((path, i) => (
      <path key={i} d={path} />
    ))}
  </svg>
);

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const LinkIcon = ({ className = "" }: { className?: string }) => (
  <Icon
    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71|M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    className={className}
  />
);

const PhoneIcon = ({ className = "" }: { className?: string }) => (
  <Icon
    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
    className={className}
  />
);

const HashIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M4 9h16|M4 15h16|M10 3L8 21|M16 3l-2 18" className={className} />
);

const LockIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function InputExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {
        (
          [
            ["Text", "text", "Enter text", undefined],
            [
              "Email",
              "email",
              "you@example.com",
              <MailIcon className={"text-cl-text-tertiary"} />
            ],
            [
              "Password",
              "password",
              "Enter password",
              <LockIcon className={"text-cl-text-tertiary"} />
            ],
            ["Number", "number", "0", <HashIcon className={"text-cl-text-tertiary"} />],
            [
              "Phone",
              "tel",
              "+1 (555) 000-0000",
              <PhoneIcon className={"text-cl-text-tertiary"} />
            ],
            [
              "URL",
              "url",
              "https://example.com",
              <LinkIcon className={"text-cl-text-tertiary"} />
            ],
            [
              "Date",
              "date",
              undefined,
              <CalendarIcon className={"text-cl-text-tertiary"} />
            ],
            ["Time", "time", undefined, undefined],
            [
              "Search",
              "search",
              "Search...",
              <SearchIcon className={"text-cl-text-tertiary"} />
            ]
          ] as const
        ).map(([label, type, ph, icon]) => (
          <Input
            key={String(label)}
            label={String(label)}
            type={type as string}
            placeholder={ph as string | undefined}
            startIcon={icon}
            classes={
              {
                root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
                input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:[color-scheme:dark]",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
                prefix: "text-sm select-none text-cl-text-tertiary",
                suffix: "text-sm select-none text-cl-text-tertiary",
                count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
              }
            }
          />
        ))
      }
    </div>
  );
}
