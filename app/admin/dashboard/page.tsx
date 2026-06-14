import type { Metadata } from "next";
import { Users, Store, CalendarCheck, TrendingUp, Clock, ShieldAlert } from "lucide-react";
import { getAuditLog } from "@/lib/admin-audit";

export const metadata: Metadata = { title: "Dashboard — BarbersCloud Admin" };

// TODO: Replace with real API calls to your backend
const STATS = [
  { label: "Total Users",      value: "1,284", change: "+38 this week",  icon: Users,         color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { label: "Active Shops",     value: "342",   change: "+12 this week",  icon: Store,         color: "text-amber-400",  bg: "bg-amber-500/10"  },
  { label: "Bookings Today",   value: "2,107", change: "+8% vs yesterday",icon: CalendarCheck, color: "text-green-400",  bg: "bg-green-500/10"  },
  { label: "MRR (₹)",         value: "₹4.2L", change: "+11% MoM",       icon: TrendingUp,    color: "text-purple-400", bg: "bg-purple-500/10" },
];

const ACTION_LABELS: Record<string, string> = {
  LOGIN:              "Signed in",
  LOGOUT:             "Signed out",
  USER_BANNED:        "Banned user",
  USER_UNBANNED:      "Unbanned user",
  USER_SUSPENDED:     "Suspended user",
  USER_UNSUSPENDED:   "Unsuspended user",
  USER_DELETED:       "Deleted user",
  SHOP_SUSPENDED:     "Suspended shop",
  SHOP_UNSUSPENDED:   "Unsuspended shop",
  SHOP_DELETED:       "Deleted shop",
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN:              "text-green-400 bg-green-500/10",
  LOGOUT:             "text-zinc-400 bg-zinc-500/10",
  USER_BANNED:        "text-red-400 bg-red-500/10",
  USER_UNBANNED:      "text-green-400 bg-green-500/10",
  USER_SUSPENDED:     "text-amber-400 bg-amber-500/10",
  USER_UNSUSPENDED:   "text-green-400 bg-green-500/10",
  USER_DELETED:       "text-red-400 bg-red-500/10",
  SHOP_SUSPENDED:     "text-amber-400 bg-amber-500/10",
  SHOP_UNSUSPENDED:   "text-green-400 bg-green-500/10",
  SHOP_DELETED:       "text-red-400 bg-red-500/10",
};

function formatTime(date: Date): string {
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((date.getTime() - Date.now()) / 60_000),
    "minute"
  );
}

export default function DashboardOverview() {
  const recentActivity = getAuditLog().slice(0, 8);

  return (
    <main className="flex-1 p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">Platform health at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">Recent admin activity</h2>
          </div>
          <a href="/admin/dashboard/activity" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
            View all
          </a>
        </div>

        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <ShieldAlert className="h-8 w-8 mb-2" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {recentActivity.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-zinc-800/40 transition-colors">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${ACTION_COLORS[entry.action] ?? "text-zinc-400 bg-zinc-500/10"}`}>
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </span>
                <span className="flex-1 text-sm text-zinc-300 truncate">{entry.target}</span>
                {entry.details && (
                  <span className="hidden md:block text-xs text-zinc-600 truncate max-w-[200px]">{entry.details}</span>
                )}
                <span className="text-xs text-zinc-600 whitespace-nowrap">{formatTime(entry.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
