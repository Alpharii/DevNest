import { useLoaderData, useSearchParams, useNavigate, type LoaderFunctionArgs, useActionData, type ActionFunctionArgs } from "react-router";
import { apiClient } from "~/lib/apiClient";
import { useEffect, useState } from "react";
import {
  Search, FolderKanban, SlidersHorizontal, X,
  ChevronLeft, ChevronRight, Plus, BookMarked,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDetailModal } from "./components/ProjectDetailModal"
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { LIMIT_OPTIONS, VISIBILITY_OPTIONS } from "~/lib/paginationOption";
import { CreateProject } from "./action/createProject";

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

    const res = await apiClient.get(`/project?${params.toString()}`);
    return { projects: res.data, search, visibility, page, limit };
  } catch (error: any) {
    const message =
      error.response?.data?.error || "Gagal memuat proyek, coba lagi nanti";
    return { success: false, error: message, projects: [], search, visibility, page, limit };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const title = formData.get("title");
  const description = formData.get("description");
  const visibility = Number(formData.get("visibility"));

  try{
    if (actionType === "createProject") {
      return await CreateProject(title as string, description as string, visibility as number);
    }
  } catch (error: any) {
    const message = error.response?.data?.error || "Login gagal, periksa kembali title/description";
    return { success: false, error: message, status: 401 };
  }
}

const projectSchema = z.object({
  actionType: z.string().min(1),
  title: z.string().min(2, "title minimal 2 karakter"),
  description: z.string().optional(),
  visibility: z.number().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function Projects() {
  const { projects, search, visibility, page, limit } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      actionType: "createProject",
      title: "",
      description: "",
      visibility: 0,
    },
  });

  useEffect(() => {
    if (!actionData) return;

    if (actionData.error) {
      toast.error(actionData.error, { position: "top-right" });
    }
  }, [actionData]);

  // const watchedValues = form.watch();
  // console.log('form', watchedValues);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const totalPages = projects?.total ? Math.ceil(projects.total / limit) : 1;

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      if (key !== "page") next.set("page", "1");
      return next;
    });
  };

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  const setLimit = (newLimit: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("limit", newLimit);
      next.set("page", "1");
      return next;
    });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const activeFilterCount = visibility !== "all" ? 1 : 0;

  const [joinResult, setJoinResult] = useState<{
    success?: boolean;
    error?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (!joinResult) return;
    if (joinResult.success) {
      toast.success(joinResult.message || "Berhasil join project", {
        position: "top-right",
      });
    }
    if (joinResult.error) {
      toast.error(joinResult.error, {
        position: "top-right",
      });
    }
    setJoinResult(null);
  }, [joinResult]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 h-full flex flex-col">

      {/* ── Konten utama tumbuh mengisi ruang yang tersedia ── */}
      <div className="flex-1 space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-violet-400" />
              <h1 className="text-xl font-medium text-foreground">Jelajahi Proyek</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Temukan dan bergabung ke proyek yang tersedia.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/projects/my-projects")}
              className="h-9 px-3 text-xs border-zinc-800 gap-1.5 hover:border-violet-500 hover:text-violet-400 transition-colors"
            >
              <BookMarked className="h-3.5 w-3.5" />
              Proyek Saya
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/projects/create")}
              className="h-9 px-3 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Buat Proyek
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Cari proyek, deskripsi, atau pemilik..."
              defaultValue={search}
              onChange={(e) => setParam("search", e.target.value)}
              className="w-full h-9 pl-9 pr-9 text-sm rounded-lg border border-zinc-800 bg-slate-100 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => setParam("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFilters((v) => !v)}
            className={`h-9 px-3 text-xs border-zinc-800 gap-1.5 transition-colors ${
              showFilters || activeFilterCount > 0
                ? "border-violet-500 text-violet-400"
                : "hover:border-violet-500 hover:text-violet-400"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-0.5 bg-violet-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="rounded-xl border border-zinc-800 bg-slate-100 p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Visibilitas
              </p>
              <div className="flex flex-wrap gap-2">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setParam("visibility", opt.value)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      visibility === opt.value
                        ? "bg-violet-500 border-violet-500 text-white"
                        : "border-zinc-800 text-muted-foreground hover:border-violet-400 hover:text-violet-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setParam("visibility", "all")}
                className="text-xs text-zinc-500 hover:text-foreground transition-colors flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Reset filter
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Menampilkan{" "}
            <span className="text-foreground font-medium">
              {Math.min((page - 1) * limit + 1, projects?.total ?? 0)}–{Math.min(page * limit, projects?.total ?? 0)}
            </span>
            {" "}dari{" "}
            <span className="text-foreground font-medium">{projects?.total ?? 0}</span>
            {" "}proyek
          </p>
          {search && (
            <p className="text-xs text-muted-foreground">
              Hasil untuk &ldquo;<span className="text-violet-400">{search}</span>&rdquo;
            </p>
          )}
        </div>

        {/* Project Grid */}
        {projects?.total === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-slate-100 px-5 py-16 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-1">
              <FolderKanban className="h-5 w-5 text-zinc-600" />
            </div>
            <p className="text-sm text-muted-foreground">Tidak ada proyek yang ditemukan.</p>
            <p className="text-xs text-zinc-600">Coba ubah filter atau kata kunci pencarianmu.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(projects?.projects).map((p: any) => (
              <ProjectCard
                key={p.id}
                project={p}
                onView={() => setSelectedId(p.id)}
              />
            ))}
          </div>
        )}

      </div>
      {/* ── End konten utama ── */}

      {/* ── Pagination — selalu di bawah, sticky saat scroll ── */}
      {projects?.total > 0 && (
        <div className="sticky bottom-17 border-t border-zinc-800 bg-background py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Baris per halaman:</span>
              <div className="flex gap-1">
                {LIMIT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setLimit(opt)}
                    className={`w-8 h-7 rounded-md text-xs border transition-colors ${
                      String(limit) === opt
                        ? "bg-violet-500 border-violet-500 text-white"
                        : "border-zinc-800 text-muted-foreground hover:border-violet-400 hover:text-violet-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Page controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-muted-foreground hover:border-violet-400 hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition-colors ${
                      page === p
                        ? "bg-violet-500 border-violet-500 text-white font-medium"
                        : "border-zinc-800 text-muted-foreground hover:border-violet-400 hover:text-violet-400"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-muted-foreground hover:border-violet-400 hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Page info */}
            <p className="text-xs text-muted-foreground">
              Halaman <span className="text-foreground font-medium">{page}</span> dari{" "}
              <span className="text-foreground font-medium">{totalPages}</span>
            </p>

          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedId !== null && (
        <ProjectDetailModal
          projectId={selectedId}
          onClose={() => setSelectedId(null)}
          onJoinResult={setJoinResult}
        />
      )}

    </main>
  );
}