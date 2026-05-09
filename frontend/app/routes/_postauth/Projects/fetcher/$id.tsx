import { data, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/lib/apiClient";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const res = await apiClient.get(`/project/${params.id}/`);
    return data({ project: res.data });
  } catch (error: any) {
    const message = error.response?.data?.error || "Gagal memuat detail proyek.";
    return { success: false, error: message, status: 400 };
  }
}

export async function action({ params }: ActionFunctionArgs) {
  try {
    await apiClient.post(`/project/${params.id}/join`);
    console.log('success')
    return {
      success: true,
      message: "Berhasil bergabung ke project"
    }
  } catch (error: any) {
    console.log('error')
    const message = error.response?.data?.error || "Gagal bergabung ke proyek.";
    return { success: false, error: message, status: 400 };
  }
}