// In-memory audit log — resets on server restart.
// For production, persist each entry to a database / append-only log.

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "USER_BANNED"
  | "USER_UNBANNED"
  | "USER_SUSPENDED"
  | "USER_UNSUSPENDED"
  | "USER_DELETED"
  | "SHOP_SUSPENDED"
  | "SHOP_UNSUSPENDED"
  | "SHOP_DELETED";

export interface AuditEntry {
  id: string;
  timestamp: Date;
  adminEmail: string;
  action: AuditAction;
  target: string;
  details?: string;
}

const log: AuditEntry[] = [
  // Seed entries so the log is not empty on first start
  {
    id: "seed-1",
    timestamp: new Date(Date.now() - 3_600_000),
    adminEmail: "admin@barberscloud.in",
    action: "USER_BANNED",
    target: "spammer@example.com",
    details: "Repeated spam bookings",
  },
  {
    id: "seed-2",
    timestamp: new Date(Date.now() - 7_200_000),
    adminEmail: "admin@barberscloud.in",
    action: "SHOP_SUSPENDED",
    target: "fakebarber@example.com",
    details: "Fraudulent listings",
  },
  {
    id: "seed-3",
    timestamp: new Date(Date.now() - 86_400_000),
    adminEmail: "admin@barberscloud.in",
    action: "LOGIN",
    target: "admin@barberscloud.in",
    details: "",
  },
];

export function addAuditEntry(
  adminEmail: string,
  action: AuditAction,
  target: string,
  details = ""
): void {
  log.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    adminEmail,
    action,
    target,
    details,
  });
  if (log.length > 1000) log.length = 1000;
}

export function getAuditLog(): AuditEntry[] {
  return log;
}
