import Showcase from "../Showcase";

/**
 * A server component, with no dynamic API, so the route is prerendered at build
 * time. That is the assertion: the HTML on disk afterwards is proof the library
 * rendered on the server, and a chunk missing "use client" fails the build here
 * rather than in someone's application.
 */
export default function Page() {
  return <Showcase />;
}
