import { useState } from "react";
import { Form, Link, redirect, useActionData, type ActionFunctionArgs } from "react-router";
import { Eye, EyeOff, Lock, Mail, LogIn, Zap } from "lucide-react";

import { apiClient, tokenCookie } from "~/lib/apiClient";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProviderWrapper } from "~/components/FormWrapper";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export async function action({ request }: ActionFunctionArgs) {
  console.log("Server received login request");
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { success: false, error: "Email dan password wajib diisi", status: 400 };
  }

  try {
    const res = await apiClient.post("/auth/login", { email, password });
    const token = res.data.token;
    return redirect("/home", {
      headers: { "Set-Cookie": await tokenCookie.serialize(token) },
    });
  } catch (error: any) {
    const message = error.response?.data?.error || "Login gagal, periksa kembali email/password";
    return { success: false, error: message, status: 401 };
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<typeof action>();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Client Data:", data);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">

      {/* === LEFT PANEL === */}
      <div className="relative hidden lg:flex flex-col justify-between bg-zinc-950 p-10 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium text-[15px]">DevNest</span>
        </div>

        {/* Body copy */}
        <div className="z-10 space-y-3">
          <h2 className="text-white text-2xl font-medium leading-snug">
            A platform for developers to find teammates, build projects, and manage them in one place.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            DevNest is a web app that combines a project marketplace (like Upwork/Fiverr) with project management (like Trello/Notion), purpose-built for developers and builders.
          </p>
          {/* Pagination dots */}
          <div className="flex items-center gap-1.5 pt-4">
            <span className="w-5 h-1.5 rounded-full bg-violet-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          </div>
        </div>

        <p className="text-zinc-600 text-xs z-10">© 2026 DevNest.</p>
      </div>

      {/* === RIGHT PANEL === */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-xl font-medium text-foreground">Selamat datang kembali</h1>
            <p className="text-sm text-muted-foreground">Masuk ke akun kamu untuk melanjutkan</p>
          </div>

          {/* Error */}
          {actionData?.error && (
            <Alert variant="destructive" className="py-2.5">
              <AlertDescription className="text-sm">{actionData.error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <FormProviderWrapper
            form={form}
            onSubmit={onSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  className="pl-9 h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-violet-500/30 focus-visible:border-violet-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pl-9 pr-10 h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-violet-500/30 focus-visible:border-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="h-3.5 w-3.5 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600" />
                <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
                  Ingat saya
                </Label>
              </div>
              <Link to="/forgot-password" className="text-xs text-violet-600 hover:text-violet-500 transition-colors">
                Lupa password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white gap-2"
            >
              <LogIn className="h-3.5 w-3.5" />
              Masuk
            </Button>
          </FormProviderWrapper>

          {/* SSO divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">atau lanjutkan dengan</span>
            <Separator className="flex-1" />
          </div>

          {/* Google SSO */}
          <Button variant="outline" className="w-full h-10 text-sm font-normal gap-2 border-border/60">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register" className="text-violet-600 hover:text-violet-500 font-medium transition-colors">
              Daftar sekarang
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}