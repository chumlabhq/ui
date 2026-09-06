import { useParams } from "react-router";
import { One } from "../One";

/**
 * Server-rendered per request rather than prerendered, unlike `/`. The
 * request-time handler is the path most React Router consumers run, and it is
 * the one nothing here had exercised.
 */
export default function Component() {
  const { name } = useParams();
  return <One name={String(name)} />;
}
