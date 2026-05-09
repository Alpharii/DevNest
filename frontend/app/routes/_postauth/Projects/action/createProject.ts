import { redirect } from "react-router";
import { apiClient, tokenCookie } from "~/lib/apiClient";

export const CreateProject = async (title: string, description: string, visibility: number) => {
  if (typeof title !== "string" || typeof description !== "string" || typeof visibility !== "number") {
    return { success: false, error: "title dan description wajib diisi", status: 400 };
  }

  try {
    const res = await apiClient.post("/project", { title, description, visibility });
    return {
        success: true,
        actionType: "createProject",
        data: res,
    }
  } catch (error: any) {
    const message = error.response?.data?.error || "gagal membuat project, periksa kembali title/description";
    return { success: false, error: message, status: 401 };
  }
};