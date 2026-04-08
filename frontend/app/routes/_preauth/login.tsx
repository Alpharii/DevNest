import { useState } from "react";
import { Form, Link, redirect, useActionData, type ActionFunctionArgs } from "react-router";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

import { apiClient, tokenCookie } from "~/lib/apiClient";
import { Card, CardContent } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      success: false,
      error: "Email dan password wajib diisi",
      status: 400,
    };
  }

  try {
    console.log("Attempting login with", { email, password });
    const res = await apiClient.post("/auth/login", { email, password });
    console.log("res", res)
    const token = res.data.token;

    return redirect("/home", {
      headers: {
        "Set-Cookie": await tokenCookie.serialize(token),
      },
    });
  } catch (error: any) {
    console.error("Login error", error);
    const message =
      error.response?.data?.error ||
      "Login gagal, periksa kembali email/password";

    return { success: false, error: message, status: 401 };
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      
      <div
        className="hidden md:block bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80')",
        }}
      />

      <div className="flex items-center justify-center px-6">
        <Card className="w-full max-w-md shadow-2xl rounded-2xl">
          <CardContent className="p-6">
            
            {/* HEADER */}
            <div className="text-center mb-6">
              <LogIn className="mx-auto h-10 w-10 text-blue-500" />
              <h1 className="text-xl font-bold mt-2">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            {actionData?.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {actionData.error}
                </AlertDescription>
              </Alert>
            )}

            <Form method="post" className="space-y-4">

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="pl-9"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="pl-9 pr-9"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button type="submit" className="w-full font-semibold">
                Sign In
              </Button>
            </Form>

            <p className="text-sm text-center text-muted-foreground mt-6">
              Don’t have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}