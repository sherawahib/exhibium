import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormsPanel } from "@/components/admin/FormsPanel";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminFormsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell title="Form submissions">
      <FormsPanel />
    </AdminShell>
  );
}
