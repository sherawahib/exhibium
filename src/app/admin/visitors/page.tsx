import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { VisitorsPanel } from "@/components/admin/VisitorsPanel";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminVisitorsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell title="Visitors">
      <VisitorsPanel />
    </AdminShell>
  );
}
