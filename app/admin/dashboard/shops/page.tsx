"use client";

import { useState, useMemo } from "react";
import { Search, MoreVertical, ShieldOff, Trash2, Store, Star, Filter } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { addAuditEntry } from "@/lib/admin-audit";
import { cn } from "@/lib/utils";

// TODO: Replace with API call — GET /api/admin/shops
const SEED_SHOPS = [
  { id: "s1",  name: "Style Studio",       owner: "Mohammed Ali",   email: "style@example.com",    location: "Mumbai, Andheri",  plan: "1 Year",   joined: "2024-01-20", status: "active"    as const, bookings: 342, rating: 4.8 },
  { id: "s2",  name: "Fade Factory",       owner: "Harish Nair",    email: "fade@example.com",     location: "Bangalore, Koramangala", plan: "6 Months", joined: "2024-03-10", status: "active" as const, bookings: 218, rating: 4.6 },
  { id: "s3",  name: "Royal Cuts",         owner: "Suresh Patil",   email: "royal@example.com",    location: "Pune, FC Road",    plan: "1 Year",   joined: "2024-02-05", status: "suspended" as const, bookings: 89,  rating: 3.9 },
  { id: "s4",  name: "The Barber Room",    owner: "Vikram Das",     email: "barber@example.com",   location: "Chennai, Anna Nagar", plan: "6 Months", joined: "2024-04-18", status: "active" as const, bookings: 175, rating: 4.7 },
  { id: "s5",  name: "Trim & Style",       owner: "Anand Kumar",    email: "trim@example.com",     location: "Hyderabad, Banjara Hills", plan: "3 Months", joined: "2024-07-22", status: "active" as const, bookings: 43, rating: 4.2 },
  { id: "s6",  name: "Crown Barbershop",   owner: "Ravi Shankar",   email: "crown@example.com",    location: "Delhi, Connaught Place",  plan: "1 Year",   joined: "2024-01-09", status: "active" as const, bookings: 401, rating: 4.9 },
  { id: "s7",  name: "Edge Up Cuts",       owner: "Pavan Reddy",    email: "edge@example.com",     location: "Kolkata, Park Street",    plan: "3 Months", joined: "2024-10-14", status: "suspended" as const, bookings: 12, rating: 3.1 },
];

type Status = "active" | "suspended";
type Shop   = typeof SEED_SHOPS[number];
type DialogAction = "suspend" | "unsuspend" | "delete";

const STATUS_STYLES: Record<Status, string> = {
  active:    "bg-green-500/10 text-green-400 border-green-500/20",
  suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const STATUS_FILTERS: { label: string; value: "all" | Status }[] = [
  { label: "All",       value: "all"       },
  { label: "Active",    value: "active"    },
  { label: "Suspended", value: "suspended" },
];

interface PendingAction {
  type: DialogAction;
  shopId: string;
  shopName: string;
}

export default function ShopsPage() {
  const [shops,        setShops]        = useState<Shop[]>(SEED_SHOPS);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [pending,      setPending]      = useState<PendingAction | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return shops.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [shops, search, statusFilter]);

  const handleConfirm = (reason?: string) => {
    if (!pending) return;
    const { type, shopId, shopName } = pending;

    // TODO: Call real API
    setShops((prev) =>
      type === "delete"
        ? prev.filter((s) => s.id !== shopId)
        : prev.map((s) =>
            s.id === shopId
              ? { ...s, status: (type === "suspend" ? "suspended" : "active") as Status }
              : s
          )
    );

    const actionMap: Record<DialogAction, "SHOP_SUSPENDED" | "SHOP_UNSUSPENDED" | "SHOP_DELETED"> = {
      suspend:   "SHOP_SUSPENDED",
      unsuspend: "SHOP_UNSUSPENDED",
      delete:    "SHOP_DELETED",
    };
    addAuditEntry("admin@barberscloud.in", actionMap[type], shopName, reason ?? "");
    setPending(null);
  };

  const dialogProps: Record<DialogAction, { title: string; description: string; label: string; danger: "danger" | "warning" }> = {
    suspend:   { title: "Suspend shop",    description: `Suspend ${pending?.shopName ?? "this shop"}. Customers won't be able to book it until reactivated.`,  label: "Suspend shop",       danger: "warning" },
    unsuspend: { title: "Reactivate shop", description: `Restore ${pending?.shopName ?? "this shop"} and allow bookings to resume.`,                           label: "Reactivate",          danger: "warning" },
    delete:    { title: "Delete shop",     description: `Permanently delete ${pending?.shopName ?? "this shop"} and all its data. This cannot be undone.`,      label: "Delete permanently",  danger: "danger"  },
  };

  const dp = pending ? dialogProps[pending.type] : dialogProps.suspend;

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="h-6 w-6 text-amber-500" /> Shops
          </h1>
          <p className="text-sm text-zinc-500 mt-1">{shops.length} registered shops</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by shop name, owner, or location…"
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Shop</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Owner</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Rating</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Bookings</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-zinc-600">
                    No shops match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((shop) => (
                  <tr key={shop.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400">
                          {shop.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{shop.name}</p>
                          <p className="text-xs text-zinc-500">{shop.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">{shop.owner}</td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{shop.location}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span className="text-sm font-medium">{shop.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">{shop.bookings}</td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize", STATUS_STYLES[shop.status])}>
                        {shop.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ShopActionMenu shop={shop} onAction={(type) => setPending({ type, shopId: shop.id, shopName: shop.name })} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-800 px-5 py-3 text-xs text-zinc-600">
          Showing {filtered.length} of {shops.length} shops
        </div>
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={dp.title}
        description={dp.description}
        dangerLevel={dp.danger}
        requireReason={pending?.type === "delete"}
        confirmLabel={dp.label}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </main>
  );
}

function ShopActionMenu({ shop, onAction }: { shop: Shop; onAction: (t: DialogAction) => void }) {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Suspend",    action: "suspend"   as DialogAction, icon: ShieldOff, cls: "text-amber-400", show: shop.status === "active"    },
    { label: "Reactivate", action: "unsuspend" as DialogAction, icon: ShieldOff, cls: "text-green-400", show: shop.status === "suspended" },
    { label: "Delete shop",action: "delete"    as DialogAction, icon: Trash2,    cls: "text-red-500",   show: true                        },
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
          <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl py-1">
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
