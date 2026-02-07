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
  <section className="space-y-4">
    <div>
      <h2
        className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
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
    className={`p-4 rounded-lg text-sm overflow-x-auto ${
      isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-100"
    }`}
  >
    <code>{code}</code>
  </pre>
);

interface DemoWrapperProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  className?: string;
  layout?: "flex-row" | "flex-col" | "block";
}

export const DemoWrapper: React.FC<DemoWrapperProps> = ({
  children,
  isDarkMode = false,
  className = "",
  layout = "flex-row",
}) => {
  const layoutClasses =
    layout === "flex-row"
      ? "flex flex-wrap items-center gap-4"
      : layout === "flex-col"
        ? "flex flex-col gap-4"
        : "";

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      } ${className}`}
    >
      <div className={`p-4 sm:p-6 ${layoutClasses}`}>{children}</div>
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
  <div className="mb-8 pb-4 border-b border-gray-200">
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
    className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
  >
    <td
      className={`px-3 py-2 font-mono text-sm ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
    >
      {name}
    </td>
    <td
      className={`px-3 py-2 font-mono text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
    >
      {type}
    </td>
    <td
      className={`px-3 py-2 font-mono text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
    >
      {defaultVal ?? "-"}
    </td>
    <td
      className={`px-3 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
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
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr
          className={isDarkMode ? "text-gray-400" : "text-gray-500"}
        >
          <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider">
            Prop
          </th>
          <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider">
            Type
          </th>
          <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider">
            Default
          </th>
          <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider">
            Description
          </th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);
