"use client";

import { useState, useMemo, useTransition } from "react";
import { Search, MoreVertical, ShieldBan, ShieldOff, Trash2, Users, Filter } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { addAuditEntry } from "@/lib/admin-audit";
import { cn } from "@/lib/utils";

// TODO: Replace with API call — GET /api/admin/users
const SEED_USERS = [
  { id: "u1",  name: "Rajesh Kumar",    email: "rajesh@example.com",  plan: "1 Year",   joined: "2024-01-15", status: "active"    as const, bookings: 47 },
  { id: "u2",  name: "Priya Sharma",    email: "priya@example.com",   plan: "6 Months", joined: "2024-03-22", status: "active"    as const, bookings: 23 },
  { id: "u3",  name: "Amit Singh",      email: "amit@example.com",    plan: "3 Months", joined: "2024-06-10", status: "suspended" as const, bookings: 8  },
  { id: "u4",  name: "Sunita Verma",    email: "sunita@example.com",  plan: "1 Year",   joined: "2024-02-28", status: "active"    as const, bookings: 91 },
  { id: "u5",  name: "Karan Mehta",     email: "karan@example.com",   plan: "6 Months", joined: "2024-05-14", status: "banned"    as const, bookings: 2  },
  { id: "u6",  name: "Divya Nair",      email: "divya@example.com",   plan: "1 Year",   joined: "2024-07-01", status: "active"    as const, bookings: 34 },
  { id: "u7",  name: "Rohit Gupta",     email: "rohit@example.com",   plan: "3 Months", joined: "2024-09-11", status: "active"    as const, bookings: 11 },
  { id: "u8",  name: "Meera Krishnan",  email: "meera@example.com",   plan: "6 Months", joined: "2024-04-03", status: "suspended" as const, bookings: 5  },
  { id: "u9",  name: "Arjun Pillai",    email: "arjun@example.com",   plan: "1 Year",   joined: "2024-01-30", status: "active"    as const, bookings: 62 },
  { id: "u10", name: "Kavya Reddy",     email: "kavya@example.com",   plan: "3 Months", joined: "2024-11-05", status: "active"    as const, bookings: 3  },
];

type Status = "active" | "suspended" | "banned";

type User = typeof SEED_USERS[number];

const STATUS_STYLES: Record<Status, string> = {
  active:    "bg-green-500/10 text-green-400 border-green-500/20",
  suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  banned:    "bg-red-500/10   text-red-400   border-red-500/20",
};

const STATUS_FILTERS: { label: string; value: "all" | Status }[] = [
  { label: "All",       value: "all"       },
  { label: "Active",    value: "active"    },
  { label: "Suspended", value: "suspended" },
  { label: "Banned",    value: "banned"    },
];

type DialogAction = "ban" | "unban" | "suspend" | "unsuspend" | "delete";

interface PendingAction {
  type: DialogAction;
  userId: string;
  userName: string;
}

export default function UsersPage() {
  const [users,         setUsers]         = useState<User[]>(SEED_USERS);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState<"all" | Status>("all");
  const [pending,       setPending]       = useState<PendingAction | null>(null);
  const [,              startTransition]  = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const handleAction = (type: DialogAction, user: User) => {
    setPending({ type, userId: user.id, userName: user.name });
  };

  const handleConfirm = (reason?: string) => {
    if (!pending) return;
    const { type, userId, userName } = pending;

    startTransition(() => {
      // TODO: Call real API — e.g. POST /api/admin/users/:id/ban
      setUsers((prev) =>
        type === "delete"
          ? prev.filter((u) => u.id !== userId)
          : prev.map((u) =>
              u.id === userId
                ? { ...u, status: type === "ban" ? "banned" : type === "suspend" ? "suspended" : "active" }
                : u
            )
      );

      const actionMap: Record<DialogAction, Parameters<typeof addAuditEntry>[1]> = {
        ban:       "USER_BANNED",
        unban:     "USER_UNBANNED",
        suspend:   "USER_SUSPENDED",
        unsuspend: "USER_UNSUSPENDED",
        delete:    "USER_DELETED",
      };
      addAuditEntry("admin@barberscloud.in", actionMap[type], userName, reason ?? "");
      setPending(null);
    });
  };

  const dialogProps: Record<DialogAction, { title: string; description: string; label: string; danger: "danger" | "warning" }> = {
    ban:       { title: "Ban user",       description: `Ban ${pending?.userName ?? "this user"} from BarbersCloud. They won't be able to log in until unbanned.`,  label: "Ban user",       danger: "danger"  },
    unban:     { title: "Unban user",     description: `Remove the ban on ${pending?.userName ?? "this user"} and restore their access.`,                          label: "Unban",          danger: "warning" },
    suspend:   { title: "Suspend user",   description: `Temporarily suspend ${pending?.userName ?? "this user"}. Their bookings are paused.`,                      label: "Suspend",        danger: "warning" },
    unsuspend: { title: "Lift suspension",description: `Restore full access for ${pending?.userName ?? "this user"}.`,                                            label: "Lift suspension", danger: "warning" },
    delete:    { title: "Delete account", description: `Permanently delete ${pending?.userName ?? "this user"}'s account and all their data. This cannot be undone.`, label: "Delete permanently", danger: "danger" },
  };

  const dp = pending ? dialogProps[pending.type] : dialogProps.ban;

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" /> Users
          </h1>
          <p className="text-sm text-zinc-500 mt-1">{users.length} total accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500 shrink-0" />
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                statusFilter === value
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Bookings</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-600">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-zinc-300">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">{user.plan}</td>
                    <td className="px-5 py-4 text-zinc-300">{user.bookings}</td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{user.joined}</td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize", STATUS_STYLES[user.status])}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ActionMenu user={user} onAction={(type) => handleAction(type, user)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-zinc-800 px-5 py-3 text-xs text-zinc-600">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={pending !== null}
        title={dp.title}
        description={dp.description}
        dangerLevel={dp.danger}
        requireReason={pending?.type === "ban" || pending?.type === "delete"}
        confirmLabel={dp.label}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </main>
  );
}

function ActionMenu({ user, onAction }: { user: User; onAction: (t: DialogAction) => void }) {
  const [open, setOpen] = useState(false);

  // as const on each action preserves the string literal — prevents widening to `string` after .filter()
  const items = [
    { label: "Suspend",        action: "suspend"   as const, icon: ShieldOff, cls: "text-amber-400", show: user.status === "active"    },
    { label: "Lift suspension",action: "unsuspend" as const, icon: ShieldOff, cls: "text-green-400", show: user.status === "suspended" },
    { label: "Ban",            action: "ban"       as const, icon: ShieldBan, cls: "text-red-400",   show: user.status !== "banned"    },
    { label: "Unban",          action: "unban"     as const, icon: ShieldBan, cls: "text-green-400", show: user.status === "banned"    },
    { label: "Delete account", action: "delete"    as const, icon: Trash2,    cls: "text-red-500",   show: true                        },
  ].filter((i) => i.show);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl py-1 overflow-hidden">
            {items.map(({ label, action, icon: Icon, cls }) => (
              <button
                key={action}
                onClick={() => { setOpen(false); onAction(action); }}
                className={cn("flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-700", cls)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
