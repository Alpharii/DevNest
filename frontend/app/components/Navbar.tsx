import { Zap, UserCircle, LogOut } from "lucide-react";
import { Link, useFetcher } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function Navbar({ user }: any) {
  const fetcher = useFetcher();

  const avatarInitials = user?.Username
    ? user.Username.slice(0, 2).toUpperCase()
    : "??";

  const AvatarButton = (
    <button className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-zinc-100 transition-colors cursor-pointer">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs font-medium text-foreground leading-none">{user?.Username}</span>
        <span className="text-[11px] text-muted-foreground mt-0.5">{user?.Email}</span>
      </div>

      {user?.Profile?.avatar_url ? (
        <img
          src={user.Profile.avatar_url}
          alt={user.Username}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-200"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-zinc-200">
          {avatarInitials}
        </div>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-slate-100 border-zinc-800 backdrop-blur-sm">
      <div className="px-10 mx-auto h-14 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-black font-medium text-[14px]">DevNest</span>
        </div>

        {/* Right side — dropdown trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {AvatarButton}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium leading-none">{user?.Username}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.Email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span>Profil Saya</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
              onSelect={() => {
                fetcher.submit(null, { method: "POST", action: "/logout" });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}