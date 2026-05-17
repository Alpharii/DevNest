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
      route("dashboard", "routes/_postauth/Dashboard/index.tsx"),
      route("projects", "routes/_postauth/Projects/index.tsx"),
      route("projects/detail/:id", "routes/_postauth/Projects/detail/$id.tsx"),
      route("projects/join/:id", "routes/_postauth/Projects/fetcher/$id.tsx"),
      route("projects/my-projects", "routes/_postauth/Projects/my-project.tsx"),
      route("tasks", "routes/_postauth/Tasks.tsx"),
    ]),
  ]),
] satisfies RouteConfig;