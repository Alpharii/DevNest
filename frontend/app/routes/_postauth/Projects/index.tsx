import { useLoaderData, useSearchParams, type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/lib/apiClient";
import { useState } from "react";
import {
  Search, FolderKanban, SlidersHorizontal, X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDetailModal } from "./components/ProjectDetailModal"

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const visibility = url.searchParams.get("visibility") ?? "all";

  try {
    const res = await apiClient.get("/project");
    const all: any[] = res.data ?? [];
    return { projects: all, search, visibility };
  } catch (error: any) {
    const message = error.response?.data?.error || "Gagal memuat proyek, coba lagi nanti";
    return { success: false, error: message, projects: [], filtered: [], search, visibility };
  }
}

const VISIBILITY_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "Public", value: "1" },
  { label: "Private", value: "0" },
];

export default function Projects() {
  const { projects = [], search, visibility } =
    useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const activeFilterCount = visibility !== "all" ? 1 : 0;
  const [showFilters, setShowFilters] = useState(false);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-violet-400" />
          <h1 className="text-xl font-medium text-foreground">Jelajahi Proyek</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Temukan dan bergabung ke proyek yang tersedia.
        </p>
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

      {/* Filter Panel — visibility */}
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
          <span className="text-foreground font-medium">{projects.length}</span>
          {" "}dari{" "}
          <span className="text-foreground font-medium">{projects.length}</span>
          {" "}proyek
        </p>
        {search && (
          <p className="text-xs text-muted-foreground">
            Hasil untuk &ldquo;<span className="text-violet-400">{search}</span>&rdquo;
          </p>
        )}
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-slate-100 px-5 py-16 flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-1">
            <FolderKanban className="h-5 w-5 text-zinc-600" />
          </div>
          <p className="text-sm text-muted-foreground">Tidak ada proyek yang ditemukan.</p>
          <p className="text-xs text-zinc-600">Coba ubah filter atau kata kunci pencarianmu.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(projects as any[]).map((p: any) => {
            console.log('p', p)
          return(
            <ProjectCard
              key={p.ID}
              project={p}
              onView={() => setSelectedId(p.ID)}
            />
          )})}
        </div>
      )}

      {/* Detail Modal */}
      {selectedId !== null && (
        <ProjectDetailModal
          projectId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
}