import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChatPanel } from "@/components/admin/ChatPanel";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminChatPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell title="Live chat">
      <ChatPanel />
    </AdminShell>
  );
}
