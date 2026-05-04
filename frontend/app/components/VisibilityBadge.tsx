import { Globe, Lock } from "lucide-react";

export function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${
        isPublic
          ? "bg-teal-500/10 border-teal-500/30 text-teal-500"
          : "bg-zinc-500/10 border-zinc-700 text-zinc-500"
      }`}
    >
      {isPublic ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
      {isPublic ? "Public" : "Private"}
    </span>
  );
}