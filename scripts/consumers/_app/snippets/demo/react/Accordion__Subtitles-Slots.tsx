import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

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

const SettingsIcon = ({ className = "" }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ShieldIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className={className} />
);

const BoltIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" className={className} />
);

export default function AccordionExample() {
  return (
    <Accordion
      selectionMode="single"
      collapsible
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="slot-1">
        <AccordionTrigger
          subtitle="Learn about our performance features"
          leftSlot={<BoltIcon className="w-4 h-4 text-cl-text" />}
        >
          Performance
        </AccordionTrigger>
        <AccordionContent>Optimized for speed and efficiency.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="slot-2">
        <AccordionTrigger
          subtitle="Security features and compliance"
          leftSlot={<ShieldIcon className="w-4 h-4 text-cl-success" />}
          rightSlot={
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-cl-success-bg text-cl-text"
            >
              New
            </span>
          }
        >
          Security
        </AccordionTrigger>
        <AccordionContent>Enterprise-grade security built in.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="slot-3">
        <AccordionTrigger
          subtitle="Customize to your needs"
          leftSlot={<SettingsIcon className="w-4 h-4 text-cl-accent" />}
        >
          Settings
        </AccordionTrigger>
        <AccordionContent>Full customization options available.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
