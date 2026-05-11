import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { apiClient, createApiClientWithToken, tokenCookie } from "~/lib/apiClient";
import {
  Zap, FolderKanban, Users, CheckSquare, User,
  MoreHorizontal, Plus, Crown, Mail, ArrowRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { StatCard } from "~/components/StatCard";
import { RoleBadge } from "~/components/RoleBadge";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const cookie = request.headers.get("Cookie");
    const token = await tokenCookie.parse(cookie);
    createApiClientWithToken(token)
    const userData = await apiClient.get("users/me/dashboard");
    console.log('data', userData.data)
    return { userData: userData.data };
  } catch (error: any) {
    const message = error.response?.data?.error || "Gagal memuat dashboard, coba lagi nanti";
    return { success: false, error: message, status: 400 };
  }
}

export default function Home() {
  const { userData } = useLoaderData<typeof loader>();

  const {
    username,
    email,
    profile,
    owned_projects = [],
    member_projects = [],
    assigned_tasks,
  } = userData ?? {};

  console.log('user', userData)

  const avatarInitials = username
    ? username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

      {/* Profile strip */}
      <div className="rounded-xl border border-zinc-800 bg-slate-100 p-5 flex items-center gap-4">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={username} className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-base font-semibold ring-2 ring-zinc-700 shrink-0">
            {avatarInitials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{username}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          {profile?.bio && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{profile.bio}</p>
          )}
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 hover:border-violet-500 hover:text-violet-400 transition-colors shrink-0">
          Edit Profil
        </Button>
      </div>


      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-xl font-medium text-foreground">
          Selamat datang,{" "}
          <span className="text-violet-400">{username}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground">Ini ringkasan aktivitas dan proyek kamu.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Crown} label="Proyek dimiliki" value={owned_projects?.length || 0} accent />
        <StatCard icon={Users} label="Proyek diikuti" value={member_projects?.length} />
        <StatCard icon={CheckSquare} label="Tugas aktif" value={assigned_tasks?.length ?? 0} />
        <StatCard icon={User} label="Role" value="Developer" />
      </div>

      {/* Two-column section */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Owned projects */}
        <section className="rounded-xl border border-zinc-800 bg-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-3.5 w-3.5 text-violet-400" />
              <h2 className="text-sm font-medium text-foreground">Proyek Saya</h2>
              <span className="text-[11px] text-muted-foreground bg-slate-50 px-1.5 py-0.5 rounded-full">
                {owned_projects?.length}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <Plus className="h-3 w-3" />
              Baru
            </Button>
          </div>

          <ul className="divide-y divide-zinc-800/60">
            {!owned_projects ? (
              <li className="px-5 py-8 text-center text-xs text-muted-foreground">
                Belum ada proyek. Buat proyek pertamamu!
              </li>
            ) : (
              <div>                
                {owned_projects.map((p: any) => (
                  <li key={p.id} className="flex items-center justify-between px-5 py-3 group hover:bg-slate-300 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{p.description || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <span className="text-[11px] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        #{p.id}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-violet-400 transition-colors" />
                    </div>
                  </li>
                ))}
              </div>
            )}
          </ul>
        </section>

        {/* Member projects */}
        <section className="rounded-xl border border-zinc-800 bg-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-teal-400" />
              <h2 className="text-sm font-medium text-foreground">Proyek Bergabung</h2>
              <span className="text-[11px] text-muted-foreground bg-slate-50 px-1.5 py-0.5 rounded-full">
                {member_projects?.length}
              </span>
            </div>
          </div>

          <ul className="divide-y divide-zinc-800/60">
            {member_projects?.length === 0 && (
              <li className="px-5 py-8 text-center text-xs text-muted-foreground">
                Kamu belum bergabung ke proyek manapun.
              </li>
            )}
            {member_projects.map((m: any) => (
              <li key={m.id} className="flex items-center justify-between px-5 py-3 group hover:bg-slate-300 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {m.project?.title ?? `Project #${m.id}`}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {m.project?.description || "—"}
                  </p>
                </div>
                <div className="ml-3 shrink-0">
                  <RoleBadge role={m.role} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Assigned tasks — empty state */}
      <section className="rounded-xl border border-zinc-800 bg-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-800">
          <CheckSquare className="h-3.5 w-3.5 text-amber-400" />
          <h2 className="text-sm font-medium text-foreground">Tugas Saya</h2>
        </div>

        {!assigned_tasks || assigned_tasks?.length === 0 ? (
          <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-1">
              <CheckSquare className="h-5 w-5 text-zinc-600" />
            </div>
            <p className="text-sm text-muted-foreground">Tidak ada tugas yang di-assign ke kamu.</p>
            <p className="text-xs text-zinc-600">Tugas yang di-assign akan muncul di sini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-800/60">
            {assigned_tasks.map((t: any) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-300 transition-colors">
                <div className="w-3.5 h-3.5 rounded border border-zinc-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{t.title}</p>
                </div>
                <MoreHorizontal className="h-4 w-4 text-zinc-600 hover:text-zinc-400 cursor-pointer shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}