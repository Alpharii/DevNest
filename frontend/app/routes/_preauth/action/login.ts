import { redirect } from "react-router";
import { apiClient, tokenCookie } from "~/lib/apiClient";

export const LoginAction = async (email: string, password: string, remember: boolean) => {
  if (typeof email !== "string" || typeof password !== "string") {
    return { success: false, error: "Email dan password wajib diisi", status: 400 };
  }

  try {
    const res = await apiClient.post("/auth/login", { email, password });
    const token = res.data.token;

    return redirect("/home", {
      headers: {
        "Set-Cookie": await tokenCookie.serialize(token, {
          maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
        }),
      },
    });
  } catch (error: any) {
    const message = error.response?.data?.error || "Login gagal, periksa kembali email/password";
    return { success: false, error: message, status: 401 };
  }
};