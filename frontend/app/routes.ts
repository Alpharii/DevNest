import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  ...prefix("", [
    layout("routes/_preauth/Preauth.tsx", [
      route("login", "routes/_preauth/Login.tsx"),
      route("register", "routes/_preauth/Register.tsx"),
    ]),

    index("routes/index.tsx"),
    route("logout", "routes/Logout.tsx"),

    layout("routes/_postauth/Postauth.tsx", [
      route("home", "routes/_postauth/Home.tsx"),
      route("dashboard", "routes/_postauth/Dashboard.tsx"),
    ]),
  ]),
] satisfies RouteConfig;