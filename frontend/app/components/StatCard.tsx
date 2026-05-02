export function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 ${accent ? "bg-violet-600/10 border-violet-500/25" : "bg-slate-200 border-zinc-800"}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${accent ? "bg-violet-600/20" : "bg-slate-50"}`}>
        <Icon className={`h-4 w-4 ${accent ? "text-violet-400" : "text-zinc-400"}`} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}