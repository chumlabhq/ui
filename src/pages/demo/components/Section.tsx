interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section = ({ title, children }: SectionProps) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="flex flex-wrap items-center gap-4">{children}</div>
  </section>
);

interface ComponentHeaderProps {
  title: string;
  description?: string;
}

export const ComponentHeader = ({ title, description }: ComponentHeaderProps) => (
  <div className="mb-8 pb-4 border-b border-gray-200">
    <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
    {description && <p className="text-gray-600">{description}</p>}
  </div>
);
