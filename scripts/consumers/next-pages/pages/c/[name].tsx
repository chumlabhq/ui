import type { GetStaticPaths, GetStaticProps } from "next";
import { One } from "../../One";
import { NAMES } from "../../registry";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: NAMES.map((name) => ({ params: { name } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ name: string }> = ({ params }) => ({
  props: { name: String(params?.name) },
});

export default function ComponentPage({ name }: { name: string }) {
  return <One name={name} />;
}
