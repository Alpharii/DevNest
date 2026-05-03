import { NavLink, useFetcher } from "react-router";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Settings, LogOut, ChevronLeft, ChevronRight,
  Briefcase, Bell,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const NAV_ITEMS = [
  { label: "Dashboard",    to: "/dashboard",     icon: LayoutDashboard },
  { label: "Projects",     to: "/projects",      icon: FolderKanban },
  { label: "Tasks",        to: "/tasks",         icon: CheckSquare },
  { label: "Teamm",        to: "/members",       icon: Users },
  { label: "Marketplace",  to: "/marketplace",   icon: Briefcase },
  { label: "Notification", to: "/notifications", icon: Bell },
];

const BOTTOM_ITEMS = [
  { label: "Settings", to: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

function NavItem({
  to, icon: Icon, label, collapsed,
}: {
  to: string; icon: React.ElementType; label: string; collapsed: boolean;
}) {
  const item = (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150",
          "h-9",
          collapsed ? "w-9 justify-center px-0" : "px-3",
          isActive
            ? "bg-violet-50 text-violet-700"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left bar indicator */}
          {isActive && !collapsed && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-violet-500" />
          )}
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-violet-600" : "text-zinc-400",
            )}
          />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return item;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const fetcher = useFetcher();

  const logoutButton = (
    <button
      onClick={() => fetcher.submit(null, { method: "POST", action: "/logout" })}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm font-medium text-zinc-400",
        "hover:bg-red-50 hover:text-red-500 transition-colors h-9",
        collapsed ? "w-9 justify-center px-0" : "w-full px-3",
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {!collapsed && <span>Logout</span>}
    </button>
  );

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={cn(
          "h-full shrink-0 flex flex-col border-r border-zinc-200 bg-white",
          "transition-all duration-300 ease-in-out overflow-hidden",
          collapsed ? "w-[56px]" : "w-[216px]",
        )}
      >

        {/* Nav items */}
        <nav className={cn(
          "flex-1 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden",
          collapsed ? "px-[10px]" : "px-3",
        )}>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-3 py-2">
              Menu
            </p>
          )}
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>

        <Separator className="bg-zinc-100 mx-0" />

        {/* Bottom: settings + logout */}
        <div className={cn(
          "py-3 space-y-0.5",
          collapsed ? "px-[10px]" : "px-3",
        )}>
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>{logoutButton}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Logout</TooltipContent>
            </Tooltip>
          ) : (
            logoutButton
          )}
        </div>

        <Separator className="bg-zinc-100" />

        {/* Collapse toggle — clean icon-only button */}
        <div className={cn(
          "py-3",
          collapsed ? "px-[10px]" : "px-3",
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "flex items-center justify-center rounded-lg h-9 text-zinc-400",
                  "hover:bg-zinc-50 hover:text-zinc-600 transition-colors",
                  collapsed ? "w-9" : "w-full gap-3",
                )}
              >
                {collapsed
                  ? <ChevronRight className="h-4 w-4 shrink-0" />
                  : (
                    <>
                      <ChevronLeft className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium flex-1 text-left">Hide</span>
                    </>
                  )
                }
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="text-xs">Show</TooltipContent>
            )}
          </Tooltip>
        </div>

      </aside>
    </TooltipProvider>
  );
}