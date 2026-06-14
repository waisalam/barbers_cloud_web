import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side role re-check on every layout render (belt-and-suspenders alongside middleware)
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar adminEmail={session.email} />

      {/* Main content, offset by sidebar width */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
