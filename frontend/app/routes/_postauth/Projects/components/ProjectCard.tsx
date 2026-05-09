import { FolderKanban, Calendar, ArrowRight } from "lucide-react";
import { VisibilityBadge } from "~/components/VisibilityBadge";
import { formatDate } from "~/lib/formatDate";

export function ProjectCard({
  project: p,
  onView,
}: {
  project: any;
  onView: () => void;
}) {
  const isPublic = p.visibility === 1;

  return (
    <div className="group rounded-xl border border-zinc-800 bg-slate-100 overflow-hidden hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200">
      <div className="px-4 pt-4 pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <FolderKanban className="h-4 w-4 text-violet-400" />
          </div>
          <VisibilityBadge isPublic={isPublic} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
            {p.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {p.description || "Tidak ada deskripsi."}
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-800/60 mx-4" />

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-[9px] font-semibold shrink-0">
              {p.owner?.username?.slice(0, 2).toUpperCase() ?? "??"}
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {p.owner?.username ?? "Unknown"}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <Calendar className="h-3 w-3 text-zinc-600" />
            <span className="text-[11px] text-zinc-600">{formatDate(p.created_at)}</span>
          </div>
        </div>

        <button
          onClick={onView}
          className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-violet-400 transition-colors shrink-0"
        >
          Lihat
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}