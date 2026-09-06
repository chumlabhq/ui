import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("c/:name", "routes/component.tsx"),
] satisfies RouteConfig;
