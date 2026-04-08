import { cn } from "../../../utils/cn";

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  isDarkMode = false,
}) => (
  <section className="space-y-3">
    <div>
      <h3
        className={`text-[15px] font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
      >
        {title}
      </h3>
      {description && (
        <p
          className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          {description}
        </p>
      )}
    </div>
    {children}
  </section>
);

interface CodeBlockProps {
  code: string;
  isDarkMode?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  isDarkMode = false,
}) => (
  <pre
    className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all ${
      isDarkMode
        ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6"
        : "bg-gray-50 text-gray-700 border border-gray-200"
    }`}
  >
    <code>{code}</code>
  </pre>
);

interface DemoWrapperProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  className?: string;
  layout?: "flex-row" | "flex-col" | "block" | "inline";
}

export const DemoWrapper: React.FC<DemoWrapperProps> = ({
  children,
  isDarkMode = false,
  className = "",
  layout = "flex-row",
}) => {
  const layoutClasses =
    layout === "flex-row"
      ? "flex flex-col sm:flex-row flex-wrap items-stretch sm:items-start gap-4"
      : layout === "flex-col"
        ? "flex flex-col gap-4"
        : layout === "inline"
          ? "flex flex-row flex-wrap items-center gap-4"
          : "";

  return (
    <div
      className={cn(
        "relative border rounded-xl overflow-hidden",
        isDarkMode
          ? "border-white/6 bg-linear-to-br from-gray-800/80 via-gray-900/60 to-gray-800/80"
          : "border-gray-200 bg-white",
        className,
      )}
    >
      <div className={`p-4 sm:p-5 ${layoutClasses}`}>{children}</div>
    </div>
  );
};

interface DemoLabelProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const DemoLabel: React.FC<DemoLabelProps> = ({
  children,
  isDarkMode = false,
}) => (
  <p
    className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
  >
    {children}
  </p>
);

interface ComponentHeaderProps {
  title: string;
  description?: string;
  isDarkMode?: boolean;
}

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  title,
  description,
  isDarkMode = false,
}) => (
  <div className={`mb-8 pb-4 border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}>
    <h1
      className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
    >
      {title}
    </h1>
    {description && (
      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
        {description}
      </p>
    )}
  </div>
);

interface PropRowProps {
  name: string;
  type: string;
  defaultVal?: string;
  description?: string;
  isDarkMode?: boolean;
}

export const PropRow: React.FC<PropRowProps> = ({
  name,
  type,
  defaultVal,
  description,
  isDarkMode = false,
}) => (
  <tr
    className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-100"}`}
  >
    <td
      className={`px-4 py-2 font-mono text-[13px] break-words align-top ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
    >
      {name}
    </td>
    <td
      className={`px-4 py-2 font-mono text-xs break-words align-top ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
    >
      {type}
    </td>
    <td
      className={`px-4 py-2 font-mono text-xs break-words align-top ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
    >
      {defaultVal ?? "-"}
    </td>
    <td
      className={`px-4 py-2 text-[13px] break-words align-top ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
    >
      {description ?? "-"}
    </td>
  </tr>
);

interface PropsTableProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const PropsTable: React.FC<PropsTableProps> = ({
  children,
  isDarkMode = false,
}) => (
  <div className="overflow-x-auto w-full min-w-0 -mx-4 px-4 sm:mx-0 sm:px-0">
    <table className={`w-full table-fixed text-left min-w-[600px]`}>
      <colgroup>
        <col className="w-[22%]" />
        <col className="w-[25%]" />
        <col className="w-[13%]" />
        <col className="w-[40%]" />
      </colgroup>
      <thead>
        <tr
          className={`${isDarkMode ? "text-gray-500 border-gray-700/50" : "text-gray-400 border-gray-100"} border-b`}
        >
          <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider">
            Prop
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider">
            Type
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider">
            Default
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider">
            Description
          </th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);
