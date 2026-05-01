import { useEffect, useState } from "react";
import { Link, useActionData, useNavigate, type ActionFunctionArgs } from "react-router";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProviderWrapper } from "~/components/FormWrapper";
import { toast } from "sonner";
import { RegisterAction } from "./action/register";

const registerSchema = z
  .object({
    flag: z.string().min(1),
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
    agree: z
      .boolean()
      .refine((val) => val === true, "Kamu harus menyetujui syarat & ketentuan"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const flag = formData.get("flag");
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  try {
    if (flag === "register") {
      return await RegisterAction(
        name as string,
        email as string,
        password as string,
        confirmPassword as string
      );
    }
  } catch (error: any) {
    const message =
      error.response?.data?.error || "Registrasi gagal, coba lagi nanti";
    return { success: false, error: message, status: 400 };
  }
}
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      flag: "register",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  useEffect(() => {
    if (!actionData) return;
    if (actionData.error) {
      toast.error(actionData.error, { position: "top-right" });
    }
    if (actionData.success) {
      toast.success("Akun berhasil dibuat! Silakan masuk.", {
        position: "top-right",
      });
      form.reset();
      navigate("/login");
    }
  }, [actionData]);

  /* Password strength indicator */
  const passwordValue = form.watch("password");
  const strength = (() => {
    if (!passwordValue) return 0;
    let score = 0;
    if (passwordValue.length >= 6) score++;
    if (passwordValue.length >= 10) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    return score;
  })();

  const strengthLabel = ["", "Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"][strength];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
    "bg-emerald-600",
  ][strength];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">

      {/* === LEFT PANEL === */}
      <div className="relative hidden lg:flex flex-col justify-between bg-zinc-950 p-10 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium text-[15px]">DevNest</span>
        </div>

        {/* Feature list */}
        <div className="z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-white text-2xl font-medium leading-snug">
              Bergabung dan mulai membangun bersama developer lainnya.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Daftarkan akun kamu secara gratis dan dapatkan akses ke marketplace
              proyek, manajemen tim, dan banyak lagi.
            </p>
          </div>

          {/* Perks */}
          <ul className="space-y-3">
            {[
              "Temukan proyek & kolaborator sesuai keahlianmu",
              "Kelola proyek dengan Kanban & timeline bawaan",
              "Komunikasi tim langsung di dalam platform",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <span className="text-zinc-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>

          {/* Pagination dots */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="w-5 h-1.5 rounded-full bg-violet-500" />
          </div>
        </div>

        <p className="text-zinc-600 text-xs z-10">© 2026 DevNest.</p>
      </div>

      {/* === RIGHT PANEL === */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-xl font-medium text-foreground">Buat akun baru</h1>
            <p className="text-sm text-muted-foreground">
              Daftar gratis dan mulai perjalananmu
            </p>
          </div>

          {/* Form */}
          <FormProviderWrapper form={form} className="space-y-4">
            <input type="hidden" name="flag" value={form.watch("flag") || "register"} />

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Nama lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nama kamu"
                  required
                  onChange={(e) => form.setValue("name", e.target.value)}
                  className="pl-9 h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-violet-500/30 focus-visible:border-violet-500"
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

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
                  onChange={(e) => form.setValue("email", e.target.value)}
                  className="pl-9 h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-violet-500/30 focus-visible:border-violet-500"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
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
                  onChange={(e) => form.setValue("password", e.target.value)}
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

              {/* Strength bar */}
              {passwordValue && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{strengthLabel}</p>
                </div>
              )}

              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Konfirmasi password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  onChange={(e) => form.setValue("confirmPassword", e.target.value)}
                  className="pl-9 pr-10 h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-violet-500/30 focus-visible:border-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <Checkbox
                required
                id="agree"
                className="mt-0.5 h-3.5 w-3.5 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                onCheckedChange={(checked) => form.setValue("agree", !!checked)}
              />
              <input type="hidden" name="agree" value={form.watch("agree") ? "true" : "false"} />
              <Label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                Saya menyetujui{" "} Syarat & Ketentuan dan Kebijakan Privasi DevNest
              </Label>
            </div>
            {form.formState.errors.agree && (
              <p className="text-xs text-red-500 -mt-2">{form.formState.errors.agree.message}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white gap-2"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Daftar sekarang
            </Button>
          </FormProviderWrapper>

          {/* SSO divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">atau daftar dengan</span>
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
            Sudah punya akun?{" "}
            <Link to="/login" className="text-violet-600 hover:text-violet-500 font-medium transition-colors">
              Masuk di sini
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}