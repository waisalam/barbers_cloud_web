"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Scissors,
  LayoutDashboard,
  Users,
  Store,
  ActivitySquare,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/actions/admin-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard",          icon: LayoutDashboard, label: "Overview"   },
  { href: "/admin/dashboard/users",    icon: Users,           label: "Users"      },
  { href: "/admin/dashboard/shops",    icon: Store,           label: "Shops"      },
  { href: "/admin/dashboard/activity", icon: ActivitySquare,  label: "Activity"   },
];

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname  = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => { logoutAction(); });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-zinc-800 bg-zinc-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
          <Scissors className="h-4 w-4 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">BarbersCloud</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 font-medium uppercase tracking-widest">Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — admin identity + logout */}
      <div className="border-t border-zinc-800 p-4">
        <div className="mb-3 px-1">
          <p className="text-xs font-medium text-zinc-300 truncate">{adminEmail}</p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Administrator</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
