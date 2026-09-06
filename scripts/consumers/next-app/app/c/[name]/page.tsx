import { One } from "../../../One";
import { NAMES } from "../../../registry";

/**
 * One route per component, prerendered at build time.
 *
 * `generateStaticParams` is what makes the build itself the server-render
 * assertion: thirty-one server renders, and a component that throws without a
 * DOM fails `next build` rather than someone's request.
 */
export function generateStaticParams() {
  return NAMES.map((name) => ({ name }));
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return <One name={name} />;
}
