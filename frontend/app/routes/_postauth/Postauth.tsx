import { useState } from "react";
import { Outlet, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { Sidebar } from "~/components/Sidebar";
import { apiClient, createApiClientWithToken, setApiToken, tokenCookie } from "~/lib/apiClient";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const token = await tokenCookie.parse(cookie);
  if (!token) return redirect("/login");

  setApiToken(token);
  try {
    const api = createApiClientWithToken(token)
    const user = await api.get("users/me");
    return { user: user.data, token };
  } catch (error) {
    return redirect("/login");
  }
}

export default function PostAuthLayout() {
  const { user, token } = useLoaderData<typeof loader>();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Navbar user={user} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto min-h-full">
          <Outlet context={token} />
          <Footer />
        </main>
      </div>
    </div>
  );
}