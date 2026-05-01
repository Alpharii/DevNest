import { apiClient, tokenCookie } from "~/lib/apiClient";

export const RegisterAction = async (name: string, email: string, password: string, confirmPassword: string) => {
    console.log('register action', { name, email, password, confirmPassword })
  if (typeof email !== "string" || typeof password !== "string") {
    return { success: false, error: "Email dan password wajib diisi", status: 400 };
  }

  if(password !== confirmPassword) {
    return { success: false, error: "Password dan konfirmasi password tidak cocok", status: 400 };
  }

  try {
    await apiClient.post("/auth/register", { name, email, password, confirmPassword });
     return {
        success: true,
        message: "Registrasi berhasil, silakan login dengan email dan password yang telah didaftarkan",
     }
  } catch (error: any) {
    const message = error.response?.data?.error || "Registrasi gagal, periksa kembali data yang dimasukkan";
    return { success: false, error: message, status: 400 };
  }
};