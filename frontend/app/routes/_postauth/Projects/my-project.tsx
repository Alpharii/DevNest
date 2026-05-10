import { useLoaderData, useActionData, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { apiClient } from "~/lib/apiClient";
import { BookMarked, FolderKanban } from "lucide-react";
import { CreateProject } from "./action/createProject";
import { ProjectsPage, type ProjectsPageConfig } from "./components/ProjectPage";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const visibility = url.searchParams.get("visibility") ?? "all";
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? "10");

  try {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (visibility !== "all") params.set("visibility", visibility);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await apiClient.get(`/project/my-projects?${params.toString()}`);
    return { projects: res.data, search, visibility, page, limit };
  } catch (error: any) {
    const message = error.response?.data?.error || "Gagal memuat proyek, coba lagi nanti";
    return { success: false, error: message, projects: [], search, visibility, page, limit };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  try {
    if (actionType === "createProject") {
      return await CreateProject(
        formData.get("title") as string,
        formData.get("description") as string,
        Number(formData.get("visibility")),
      );
    }
  } catch (error: any) {
    const message = error.response?.data?.error || "Gagal membuat proyek";
    return { success: false, error: message, status: 401 };
  }
}

const PAGE_CONFIG: ProjectsPageConfig = {
  headerIcon: BookMarked,
  title: "Proyek Saya",
  description: "Proyek yang kamu ikuti.",
  navButtonLabel: "Jelajahi Proyek Lain",
  navButtonIcon: FolderKanban,
  navButtonTo: "/projects/",
};

export default function MyProject() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return <ProjectsPage config={PAGE_CONFIG} loaderData={loaderData} actionData={actionData} />;
}