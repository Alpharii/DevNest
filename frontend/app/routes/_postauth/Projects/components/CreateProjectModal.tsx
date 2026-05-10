import { useEffect } from "react";
import { useFetcher } from "react-router";
import {
  FolderKanban, X, Users, UserPlus,
  Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { VisibilityBadge } from "~/components/VisibilityBadge";

interface CreateProjectProps {
  onClose: () => void;
  onCreateResult: (result: {
    success?: boolean;
    error?: string;
    message?: string;
  }) => void;
}

export function CreateProjectModal({ onClose, onCreateResult }: CreateProjectProps) {
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

        {/* ── Detail content ── */}
        <div>
          Buat Project
        </div>
      </div>
    </div>
  );
}