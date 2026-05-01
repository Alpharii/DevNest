import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  ...prefix("", [
    layout("routes/_preauth/layout.tsx", [
      route("login", "routes/_preauth/Login.tsx"),
      route("register", "routes/_preauth/Register.tsx"),
    ]),

    index("routes/index.tsx"),

    layout("routes/_postauth/layout.tsx", [
      route("home", "routes/_postauth/home.tsx"),
    ]),
  ]),
] satisfies RouteConfig;