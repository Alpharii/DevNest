import { redirect } from "react-router";
import { tokenCookie } from "~/lib/apiClient";

export async function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await tokenCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}