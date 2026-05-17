import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";
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

export default function Detail(){
    const loaderData = useLoaderData<typeof loader>()
    console.log(loaderData)
    return (
        <div>
            detail
        </div>
    )
}