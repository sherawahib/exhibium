import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export default async function AdminOverviewPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <AdminOverviewClient />;
}
