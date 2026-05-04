import { data, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/lib/apiClient";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    console.log('params', params)
    console.log("hit")
    const res = await apiClient.get(`/project/${params.id}/`);
    return data({ project: res.data });
  } catch (error: any) {
    const message = error.response?.data?.error || "Gagal memuat detail proyek.";
    return data({ error: message }, { status: error.response?.status ?? 500 });
  }
}

export async function action({ params }: ActionFunctionArgs) {
  try {
    await apiClient.post(`/project/${params.id}/join`);
    return data({ success: true });
  } catch (error: any) {
    const message = error.response?.data?.error || "Gagal bergabung ke proyek.";
    return data({ success: false, error: message }, { status: error.response?.status ?? 500 });
  }
}