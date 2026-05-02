import { Minus, ShieldCheck } from "lucide-react";

export function RoleBadge({ role }: { role: string }) {
  if (role === "admin")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
        <ShieldCheck className="h-2.5 w-2.5" />
        Admin
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-400 border border-zinc-700">
      <Minus className="h-2.5 w-2.5" />
      Member
    </span>
  );
}