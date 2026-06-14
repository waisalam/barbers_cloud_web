"use client";

import { useState, useMemo } from "react";
import { ActivitySquare, Filter, Search } from "lucide-react";
import { getAuditLog, type AuditAction } from "@/lib/admin-audit";
import { cn } from "@/lib/utils";

const ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN:              "Signed in",
  LOGOUT:             "Signed out",
  USER_BANNED:        "User banned",
  USER_UNBANNED:      "User unbanned",
  USER_SUSPENDED:     "User suspended",
  USER_UNSUSPENDED:   "Suspension lifted",
  USER_DELETED:       "User deleted",
  SHOP_SUSPENDED:     "Shop suspended",
  SHOP_UNSUSPENDED:   "Shop reactivated",
  SHOP_DELETED:       "Shop deleted",
};

const ACTION_STYLES: Record<AuditAction, string> = {
  LOGIN:              "bg-green-500/10 text-green-400 border-green-500/20",
  LOGOUT:             "bg-zinc-500/10  text-zinc-400  border-zinc-500/20",
  USER_BANNED:        "bg-red-500/10   text-red-400   border-red-500/20",
  USER_UNBANNED:      "bg-green-500/10 text-green-400 border-green-500/20",
  USER_SUSPENDED:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
  USER_UNSUSPENDED:   "bg-green-500/10 text-green-400 border-green-500/20",
  USER_DELETED:       "bg-red-500/10   text-red-400   border-red-500/20",
  SHOP_SUSPENDED:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SHOP_UNSUSPENDED:   "bg-green-500/10 text-green-400 border-green-500/20",
  SHOP_DELETED:       "bg-red-500/10   text-red-400   border-red-500/20",
};

const CATEGORY_FILTERS: { label: string; value: "all" | "user" | "shop" | "auth" }[] = [
  { label: "All",       value: "all"  },
  { label: "Users",     value: "user" },
  { label: "Shops",     value: "shop" },
  { label: "Auth",      value: "auth" },
];

function actionCategory(action: AuditAction): "user" | "shop" | "auth" {
  if (action.startsWith("USER_"))  return "user";
  if (action.startsWith("SHOP_"))  return "shop";
  return "auth";
}

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(date);
}

export default function ActivityPage() {
  // Read from in-memory log — updates when actions are taken in this session
  const allEntries = getAuditLog();

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<"all" | "user" | "shop" | "auth">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allEntries.filter((e) => {
      const matchSearch   = !q || e.target.toLowerCase().includes(q) || e.adminEmail.toLowerCase().includes(q) || e.details?.toLowerCase().includes(q);
      const matchCategory = category === "all" || actionCategory(e.action) === category;
      return matchSearch && matchCategory;
    });
  }, [allEntries, search, category]);

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ActivitySquare className="h-6 w-6 text-amber-500" /> Activity Log
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          All admin actions are recorded here. In-memory — resets on server restart.{" "}
          <span className="text-zinc-600">Connect a database to persist permanently.</span>
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by target, admin email, or details…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500 shrink-0" />
          {CATEGORY_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                category === value
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Timestamp</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Action</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Target</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Details</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-600">
                    No activity found.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-zinc-500 whitespace-nowrap">
                      {formatTimestamp(entry.timestamp)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
                        ACTION_STYLES[entry.action]
                      )}>
                        {ACTION_LABELS[entry.action]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300 text-sm font-medium">{entry.target}</td>
                    <td className="px-5 py-3.5 text-zinc-500 text-xs max-w-[220px] truncate">{entry.details || "—"}</td>
                    <td className="px-5 py-3.5 text-zinc-500 text-xs">{entry.adminEmail}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-zinc-800 px-5 py-3 text-xs text-zinc-600">
          Showing {filtered.length} of {allEntries.length} entries
        </div>
      </div>
    </main>
  );
}
