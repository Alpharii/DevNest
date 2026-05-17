import { useEffect } from "react";
import { Link, useFetcher } from "react-router";
import {
  FolderKanban, X, Users, UserPlus,
  Loader2, AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { VisibilityBadge } from "~/components/VisibilityBadge";

interface ProjectDetailModalProps {
  projectId: number;
  onClose: () => void;
  onJoinResult: (result: {
    success?: boolean;
    error?: string;
    message?: string;
  }) => void;
}

export function ProjectDetailModal({ projectId, onClose, onJoinResult }: ProjectDetailModalProps) {
  const detailFetcher = useFetcher<{ project?: any; error?: string }>();
  const joinFetcher = useFetcher<{ success: boolean; error?: string }>();

  const isLoading = detailFetcher.state === "loading";
  const detail = detailFetcher.data?.project ?? null;
  const loadError = detailFetcher.data?.error ?? null;

  const isJoining = joinFetcher.state === "submitting";
  const joinSuccess = joinFetcher.data?.success === true;
  const joinError = joinFetcher.data?.error ?? null;

  useEffect(() => {
    detailFetcher.load(`/projects/detail/${projectId}`);
  }, [projectId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleJoin = () => {
    joinFetcher.submit(
      { intent: "join" },
      { method: "POST", action: `/projects/join/${projectId}` }
    );
  };

  const isPublic = detail?.visibility === 1;
  const isJoined = detail?.isJoined

  useEffect(() => {
    if (!joinFetcher.data) return;

    onJoinResult(joinFetcher.data);
  }, [joinFetcher.data]);

  console.log(detailFetcher, isJoined)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-violet-500 via-indigo-500 to-violet-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
            <p className="text-sm text-muted-foreground">Memuat detail proyek…</p>
          </div>
        )}

        {/* ── Load error (detail gagal) ── */}
        {!isLoading && loadError && !detail && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 px-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <p className="text-sm font-medium text-foreground">Terjadi kesalahan</p>
            <p className="text-xs text-muted-foreground">{loadError}</p>
            <Button size="sm" variant="outline" onClick={onClose} className="mt-2 h-8 text-xs">
              Tutup
            </Button>
          </div>
        )}

        {/* ── Detail content ── */}
        {!isLoading && detail && (
          <>
            <div className="px-6 pt-5 pb-2 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Title block */}
              <div className="flex items-start gap-3 pr-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <FolderKanban className="h-5 w-5 text-violet-500" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-foreground leading-tight">
                      {detail.title}
                    </h2>
                    <VisibilityBadge isPublic={isPublic} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Proyek #{detail.id}</p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl bg-slate-50 border border-zinc-200 px-4 py-3">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
                  Deskripsi
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {detail.description || "Tidak ada deskripsi."}
                </p>
              </div>

              {/* Owner + member count */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-zinc-200 px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2 font-medium">
                    Pemilik
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                      {detail.owner?.username?.slice(0, 2).toUpperCase() ?? "??"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {detail.owner?.username}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {detail.owner?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-zinc-200 px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2 font-medium">
                    Anggota
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-violet-400 shrink-0" />
                    <span className="text-sm font-semibold text-foreground">
                      {detail.members?.length ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">orang</span>
                  </div>
                </div>
              </div>

              {/* Members list */}
              {detail.members && detail.members.length > 0 && (
                <div className="rounded-xl bg-slate-50 border border-zinc-200 px-4 py-3 space-y-2">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
                    Daftar Anggota
                  </p>
                  <ul className="space-y-2 pt-1">
                    {detail.members.map((m: any) => (
                      <li key={m.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-linear-to-br from-zinc-400 to-zinc-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                            {m.user?.username?.slice(0, 2).toUpperCase() ?? "??"}
                          </div>
                          <span className="text-xs text-foreground">{m.user?.username ?? "User"}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground bg-white border border-zinc-200 px-2 py-0.5 rounded-full">
                          {m?.role.length > 2 ? m?.role : "Member"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Join success banner */}
              {joinSuccess && (
                <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs text-teal-700 font-medium">
                    Berhasil bergabung ke proyek ini!
                  </p>
                </div>
              )}

              {/* Join error banner */}
              {joinError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-600">{joinError}</p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            {!isJoined ? (
              <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClose}
                  className="h-9 px-4 text-xs border-zinc-300 text-zinc-600 hover:text-foreground hover:border-zinc-400"
                >
                  Batal
                </Button>

                {!joinSuccess && (
                  <Button
                    size="sm"
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="h-9 px-4 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1.5 disabled:opacity-60"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Bergabung…
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        Bergabung
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClose}
                  className="h-9 px-4 text-xs border-zinc-300 text-zinc-600 hover:text-foreground hover:border-zinc-400"
                >
                  Batal
                </Button>

                <Link to={`detail/${detail.id}`}>                
                  <Button
                    size="sm"
                    className="h-9 px-4 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1.5 disabled:opacity-60"
                  >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Lihat Detail
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}